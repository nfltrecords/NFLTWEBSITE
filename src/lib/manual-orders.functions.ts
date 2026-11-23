import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { releases } from "@/lib/catalogue";
import { releasePriceCents } from "@/lib/commerce";
import { sendPaidOrderDelivery } from "@/lib/delivery.server";

type Order = {
  id: string;
  release_upc: string;
  buyer_email: string;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
};

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

async function adminAuthorized(code: string): Promise<boolean> {
  const expected = process.env["ADMIN_ORDERS_CODE"];
  if (!expected || expected.trim().length < 32 || code.length > 256) return false;
  const digest = async (value: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value.normalize("NFC").trim())));
  const [a, b] = await Promise.all([digest(code), digest(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export const createManualPayPalOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ upc: z.string().regex(/^\d{12,14}$/), email: z.string().trim().email().max(255) }).strict().parse(input))
  .handler(async ({ data }) => {
    const release = releases.find((item) => item.upc === data.upc);
    const amountCents = releasePriceCents(data.upc);
    if (!release || amountCents === null) return { ok: false as const, reason: "release_unavailable" as const };
    const id = crypto.randomUUID();
    const rows = await db<Array<{ id: string }>>("shop_orders", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ id, release_upc: data.upc, buyer_email: data.email, amount_cents: amountCents, currency: "EUR", status: "pending" }),
    });
    if (!rows[0]?.id) throw new Error("Could not save the order.");
    const amount = (amountCents / 100).toFixed(2);
    const payment = new URLSearchParams({
      cmd: "_xclick",
      business: "Encoresarbakane@gmail.com",
      item_name: `NFLT RECORDS — ${release.title}`,
      item_number: data.upc,
      amount,
      currency_code: "EUR",
      custom: id,
      invoice: id,
      notify_url: "https://nflt-records.com/api/paypal/ipn",
      return: `https://nflt-records.com/commande/confirmation?order=${encodeURIComponent(id)}`,
      cancel_return: `https://nflt-records.com/commande/paiement?order=${encodeURIComponent(id)}&amount=${encodeURIComponent(amount)}&title=${encodeURIComponent(release.title)}&cancel=1`,
      no_shipping: "1",
      charset: "utf-8",
    });
    return { ok: true as const, orderId: id, paymentUrl: `https://www.paypal.com/cgi-bin/webscr?${payment.toString()}`, amount, releaseTitle: release.title };
  });

export const listManualPayPalOrders = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ code: z.string().min(1).max(256) }).strict().parse(input))
  .handler(async ({ data }) => {
    if (!(await adminAuthorized(data.code))) return { ok: false as const, reason: "unauthorized" as const };
    const rows = await db<Order[]>("shop_orders?or=(status.eq.pending,and(status.eq.paid,delivery_email_sent_at.is.null))&select=id,release_upc,buyer_email,amount_cents,currency,status,created_at&order=created_at.desc&limit=100");
    return { ok: true as const, orders: rows.map((order) => ({ ...order, title: releases.find((r) => r.upc === order.release_upc)?.title ?? order.release_upc })) };
  });

export const approveManualPayPalOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ code: z.string().min(1).max(256), orderId: z.string().uuid() }).strict().parse(input))
  .handler(async ({ data }) => {
    if (!(await adminAuthorized(data.code))) return { ok: false as const, reason: "unauthorized" as const };
    const rows = await db<Order[]>(`shop_orders?id=eq.${data.orderId}&select=id,status&limit=1`);
    const order = rows[0];
    if (!order || (order.status !== "pending" && order.status !== "paid")) return { ok: false as const, reason: "not_pending" as const };
    if (order.status === "pending") {
      const updated = await db<Array<{ id: string }>>(`shop_orders?id=eq.${data.orderId}&status=eq.pending`, {
        method: "PATCH", headers: { Prefer: "return=representation" },
        body: JSON.stringify({ status: "paid", paid_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
      });
      if (!updated.length) return { ok: false as const, reason: "already_processed" as const };
    }
    const downloadUrl = await sendPaidOrderDelivery(data.orderId);
    return { ok: true as const, downloadUrl };
  });
