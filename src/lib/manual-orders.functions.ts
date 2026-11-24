import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { releases } from "@/lib/catalogue";
import { releasePriceCents } from "@/lib/commerce";
import { downloadUrl, getShopOrder, shopEnv } from "@/lib/shop-db.server";

async function adminAuthorized(code: string): Promise<boolean> {
  const expected = process.env["ADMIN_ORDERS_CODE"];
  if (!expected || expected.trim().length < 32 || code.length > 256) return false;
  const digest = async (value: string) =>
    new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value.normalize("NFC").trim())));
  const [a, b] = await Promise.all([digest(code), digest(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export const createManualPayPalOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ upc: z.string().regex(/^\\d{12,14}$/), email: z.string().trim().email().max(255) }).strict().parse(input),
  )
  .handler(async ({ data }) => {
    const release = releases.find((item) => item.upc === data.upc);
    const amountCents = releasePriceCents(data.upc);
    if (!release || amountCents === null) return { ok: false as const, reason: "release_unavailable" as const };
    const id = crypto.randomUUID();
    await shopEnv.DB.prepare(
      "INSERT INTO shop_orders (id, release_upc, buyer_email, amount_cents, currency, status) VALUES (?, ?, ?, ?, 'EUR', 'pending')",
    ).bind(id, data.upc, data.email, amountCents).run();
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
    const result = await shopEnv.DB.prepare(
      "SELECT id, release_upc, buyer_email, amount_cents, currency, status, created_at FROM shop_orders ORDER BY created_at DESC LIMIT 100",
    ).all<Record<string, unknown>>();
    return {
      ok: true as const,
      orders: (result.results ?? []).map((order) => ({
        ...order,
        title: releases.find((r) => r.upc === order.release_upc)?.title ?? order.release_upc,
      })),
    };
  });

export const approveManualPayPalOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ code: z.string().min(1).max(256), orderId: z.string().uuid() }).strict().parse(input))
  .handler(async ({ data }) => {
    if (!(await adminAuthorized(data.code))) return { ok: false as const, reason: "unauthorized" as const };
    const order = await getShopOrder(data.orderId);
    if (!order || order.status !== "paid") return { ok: false as const, reason: "payment_not_confirmed" as const };
    return { ok: true as const, downloadUrl: downloadUrl(order.id) };
  });
