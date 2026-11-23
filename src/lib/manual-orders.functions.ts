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
  .handler(async () => {
    return { ok: false as const, reason: "checkout_disabled" as const };
  });;

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
    if (!order || order.status !== "paid") return { ok: false as const, reason: "payment_not_confirmed" as const };
    const downloadUrl = await sendPaidOrderDelivery(data.orderId);
    return { ok: true as const, downloadUrl };
  });
