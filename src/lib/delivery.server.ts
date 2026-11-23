import { env } from "cloudflare:workers";
import { releases } from "@/lib/catalogue";

type R2Object = { body: ReadableStream; httpMetadata?: { contentType?: string }; size: number };
type RuntimeBindings = {
  NFLT_AUDIO?: { get(key: string): Promise<R2Object | null> };
  DELIVERY_TOKEN_SECRET?: string;
  RESEND_API_KEY?: string;
  DELIVERY_FROM_EMAIL?: string;
};
type Order = {
  id: string;
  release_upc: string;
  buyer_email: string;
  status: string;
  download_expires_at: string | null;
  delivery_email_sent_at: string | null;
};
const bindings = env as unknown as RuntimeBindings;
function databaseConfig() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) throw new Error("Private order storage is not configured.");
  return { url: url.replace(/\/$/, ""), key };
}
async function db<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = databaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Order delivery database error (HTTP ${response.status}).`);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
async function tokenFor(orderId: string, expiry: string): Promise<string> {
  const secret = bindings.DELIVERY_TOKEN_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("DELIVERY_TOKEN_SECRET must contain at least 32 characters.");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${orderId}:${expiry}`),
  );
  return base64url(new Uint8Array(signature));
}
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
export async function sendPaidOrderDelivery(orderId: string): Promise<string> {
  const rows = await db<Order[]>(
    `shop_orders?id=eq.${encodeURIComponent(orderId)}&select=id,release_upc,buyer_email,status,download_expires_at,delivery_email_sent_at&limit=1`,
  );
  const order = rows[0];
  if (!order || order.status !== "paid")
    throw new Error("Only a paid order can receive a download.");
  const assets = await db<Array<{ r2_object_key: string }>>(
    `shop_release_assets?release_upc=eq.${encodeURIComponent(order.release_upc)}&select=r2_object_key&limit=1`,
  );
  if (!assets[0]?.r2_object_key)
    throw new Error("No verified master audio file is mapped to this release.");
  if (!bindings.NFLT_AUDIO) throw new Error("The private NFLT audio bucket is not connected.");
  let expiry = order.download_expires_at;
  if (!expiry) {
    const candidate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const updated = await db<Array<{ download_expires_at: string }>>(
      `shop_orders?id=eq.${encodeURIComponent(order.id)}&status=eq.paid&download_expires_at=is.null`,
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          download_expires_at: candidate,
          updated_at: new Date().toISOString(),
        }),
      },
    );
    expiry = updated[0]?.download_expires_at;
    if (!expiry) {
      const latest = await db<Array<{ download_expires_at: string | null }>>(
        `shop_orders?id=eq.${encodeURIComponent(order.id)}&select=download_expires_at&limit=1`,
      );
      expiry = latest[0]?.download_expires_at ?? null;
    }
  }
  if (!expiry || new Date(expiry).getTime() <= Date.now())
    throw new Error("The download window is unavailable.");
  const token = await tokenFor(order.id, expiry);
  const link = `https://nflt-records.com/telechargement#order=${encodeURIComponent(order.id)}&token=${encodeURIComponent(token)}`;
  if (!order.delivery_email_sent_at) {
    const apiKey = bindings.RESEND_API_KEY,
      from = bindings.DELIVERY_FROM_EMAIL;
    if (!apiKey || !from)
      throw new Error(
        "Automatic delivery email is not configured (RESEND_API_KEY / DELIVERY_FROM_EMAIL).",
      );
    const title =
      releases.find((item) => item.upc === order.release_upc)?.title ??
      "Votre musique NFLT RECORDS";
    const safeTitle = title.replace(/[&<>"]/g, "");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `nflt-paid-order-${order.id}`,
      },
      body: JSON.stringify({
        from,
        to: [order.buyer_email],
        subject: "Votre téléchargement NFLT RECORDS est prêt",
        text: `Merci pour votre achat de ${title}. Téléchargez votre fichier audio (lien valable 7 jours) : ${link}`,
        html: `<p>Merci pour votre achat de <strong>${safeTitle}</strong>.</p><p><a href="${link}">Télécharger votre fichier audio</a></p><p>Ce lien sécurisé est valable 7 jours.</p>`,
      }),
    });
    if (!response.ok) throw new Error(`Resend HTTP ${response.status}`);
    await db<unknown>(
      `shop_orders?id=eq.${encodeURIComponent(order.id)}&delivery_email_sent_at=is.null`,
      {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          delivery_email_sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      },
    );
  }
  return link;
}
export async function servePaidOrderDownload(request: Request): Promise<Response> {
  let payload: { order?: unknown; token?: unknown };
  try {
    payload = (await request.json()) as { order?: unknown; token?: unknown };
  } catch {
    return new Response("Requête invalide.", { status: 400 });
  }
  const orderId = typeof payload.order === "string" ? payload.order : "";
  const supplied = typeof payload.token === "string" ? payload.token : "";
  if (!/^[0-9a-f-]{36}$/i.test(orderId) || !/^[A-Za-z0-9_-]{40,64}$/.test(supplied))
    return new Response("Lien invalide ou expiré.", { status: 404 });
  const rows = await db<Order[]>(
    `shop_orders?id=eq.${encodeURIComponent(orderId)}&select=id,release_upc,buyer_email,status,download_expires_at,delivery_email_sent_at&limit=1`,
  );
  const order = rows[0];
  if (
    !order ||
    order.status !== "paid" ||
    !order.download_expires_at ||
    new Date(order.download_expires_at).getTime() <= Date.now()
  )
    return new Response("Lien invalide ou expiré.", { status: 404 });
  if (!safeEqual(await tokenFor(order.id, order.download_expires_at), supplied))
    return new Response("Lien invalide ou expiré.", { status: 404 });
  const assets = await db<Array<{ r2_object_key: string }>>(
    `shop_release_assets?release_upc=eq.${encodeURIComponent(order.release_upc)}&select=r2_object_key&limit=1`,
  );
  const key = assets[0]?.r2_object_key;
  if (!key || !bindings.NFLT_AUDIO) return new Response("Fichier indisponible.", { status: 503 });
  const object = await bindings.NFLT_AUDIO.get(key);
  if (!object) return new Response("Fichier indisponible.", { status: 503 });
  const title =
    releases.find((item) => item.upc === order.release_upc)?.title ?? "NFLT-RECORDS-audio";
  const filename =
    title
      .normalize("NFKD")
      .replace(/[^A-Za-z0-9._-]+/g, "-")
      .replace(/^-|-$/g, "") + ".wav";
  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType ?? "audio/wav",
      "Content-Length": String(object.size),
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
