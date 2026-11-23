import { createFileRoute } from "@tanstack/react-router";
import { sendPaidOrderDelivery } from "@/lib/delivery.server";

type Order = { id: string; amount_cents: number; currency: string; status: string; paypal_transaction_id: string | null };

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
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Order storage failed (HTTP ${response.status}).`);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

async function handleIpn(request: Request): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/x-www-form-urlencoded")) return new Response("Unsupported media type", { status: 415 });
  const raw = await request.text();
  if (!raw || new TextEncoder().encode(raw).byteLength > 64_000) return new Response("Invalid IPN payload", { status: 413 });

  // Verify the exact original form payload with PayPal before trusting any field.
  const verification = await fetch("https://ipnpb.paypal.com/cgi-bin/webscr", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "NFLT-RECORDS-IPN/1.0" },
    body: `cmd=_notify-validate&${raw}`,
  });
  if (!verification.ok) return new Response("PayPal verification unavailable", { status: 503 });
  if ((await verification.text()).trim() !== "VERIFIED") return new Response("Invalid PayPal notification", { status: 400 });

  const data = new URLSearchParams(raw);
  const orderId = data.get("custom") ?? "";
  const transactionId = data.get("txn_id") ?? "";
  const receiver = (data.get("receiver_email") ?? data.get("business") ?? "").trim().toLowerCase();
  const status = data.get("payment_status");
  const amount = Number(data.get("mc_gross"));
  const currency = data.get("mc_currency");
  if (!/^[0-9a-f-]{36}$/i.test(orderId) || !transactionId || transactionId.length > 128) return new Response("Missing order or transaction reference", { status: 400 });
  if (receiver !== "encoresarbakane@gmail.com" || status !== "Completed" || currency !== "EUR" || !Number.isFinite(amount)) return new Response("Payment does not meet fulfillment requirements", { status: 400 });

  const rows = await db<Order[]>(`shop_orders?id=eq.${encodeURIComponent(orderId)}&select=id,amount_cents,currency,status,paypal_transaction_id&limit=1`);
  const order = rows[0];
  if (!order) return new Response("Order not found; PayPal may retry", { status: 503 });
  if (Math.round(amount * 100) !== order.amount_cents || order.currency !== "EUR") return new Response("Payment amount mismatch", { status: 400 });
  if (order.status === "paid") {
    if (order.paypal_transaction_id !== transactionId) return new Response("Conflicting payment transaction", { status: 409 });
  } else if (order.status === "pending") {
    const updated = await db<Array<{ id: string }>>(`shop_orders?id=eq.${encodeURIComponent(orderId)}&status=eq.pending`, {
      method: "PATCH", headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: "paid", paypal_transaction_id: transactionId, paid_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
    });
    if (!updated.length) return new Response("Order state conflict; retry", { status: 503 });
  } else {
    return new Response("Order is not payable", { status: 409 });
  }

  // Only verified, completed, exact-amount EUR payments reach the automatic WAV delivery.
  await sendPaidOrderDelivery(orderId);
  return new Response("OK", { status: 200, headers: { "Cache-Control": "no-store" } });
}

export const Route = createFileRoute("/api/paypal/ipn")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try { return await handleIpn(request); }
        catch (error) {
          console.error("PayPal IPN processing failed", error);
          return new Response("IPN processing failed; retry", { status: 503 });
        }
      },
    },
  },
});
