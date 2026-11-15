import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { releases } from "@/lib/catalogue";
import { releasePriceCents } from "@/lib/commerce";
import { createPayPalOrder, capturePayPalOrder } from "@/lib/paypal.server";

const startCheckoutSchema = z.object({
  upc: z.string().regex(/^\\d{12,14}$/),
  email: z.string().trim().email().max(255),
}).strict();

const captureCheckoutSchema = z.object({
  orderId: z.string().uuid(),
  paypalOrderId: z.string().regex(/^[A-Z0-9]{8,40}$/),
}).strict();

type StoredOrder = {
  id: string;
  release_upc: string;
  buyer_email: string;
  amount_cents: number;
  currency: string;
  status: string;
  paypal_order_id: string | null;
};

function databaseConfig() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) throw new Error("Private order storage is not configured.");
  return { url: url.replace(/\\/$/, ""), key };
}

async function databaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
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
  if (!response.ok) {
    throw new Error(`Private order storage failed (HTTP ${response.status}).`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const startPayPalCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => startCheckoutSchema.parse(input))
  .handler(async ({ data }) => {
    const release = releases.find((item) => item.upc === data.upc);
    if (!release) return { ok: false as const, reason: "release_unavailable" as const };

    // Never accept an amount from the browser. Until UPC-specific track counts are verified,
    // this returns null and checkout remains closed for that release.
    const amountCents = releasePriceCents(data.upc);
    if (amountCents === null) {
      return { ok: false as const, reason: "price_not_verified" as const };
    }

    const siteUrl = process.env["SITE_URL"] ?? "https://nflt-records.com";
    const base = new URL(siteUrl);
    if (base.protocol !== "https:" || (base.hostname !== "nflt-records.com" && !base.hostname.endsWith(".nflt-records.com"))) {
      throw new Error("SITE_URL must be the official NFLT RECORDS HTTPS domain.");
    }

    const orderId = crypto.randomUUID();
    const rows = await databaseRequest<StoredOrder[]>("shop_orders", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        id: orderId,
        release_upc: release.upc,
        buyer_email: data.email,
        amount_cents: amountCents,
        currency: "EUR",
        status: "pending",
      }),
    });
    if (!rows[0]?.id) throw new Error("The pending order could not be persisted.");

    try {
      const paypal = await createPayPalOrder({
        amountCents,
        currency: "EUR",
        reference: orderId,
        returnUrl: new URL(`/commande/confirmation?order=${orderId}`, base).toString(),
        cancelUrl: new URL(`/commande/annulee?order=${orderId}`, base).toString(),
      });
      const approvalUrl = paypal.links?.find((link) => link.rel === "approve" || link.rel === "payer-action")?.href;
      if (!paypal.id || !approvalUrl) throw new Error("PayPal did not return a valid approval link.");

      await databaseRequest<unknown>(`shop_orders?id=eq.${orderId}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ paypal_order_id: paypal.id, updated_at: new Date().toISOString() }),
      });
      return { ok: true as const, orderId, approvalUrl };
    } catch (error) {
      await databaseRequest<unknown>(`shop_orders?id=eq.${orderId}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ status: "cancelled", updated_at: new Date().toISOString() }),
      }).catch(() => undefined);
      throw error;
    }
  });

export const confirmPayPalCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => captureCheckoutSchema.parse(input))
  .handler(async ({ data }) => {
    const rows = await databaseRequest<StoredOrder[]>(
      `shop_orders?id=eq.${data.orderId}&select=id,release_upc,buyer_email,amount_cents,currency,status,paypal_order_id&limit=1`,
    );
    const order = rows[0];
    if (!order || order.paypal_order_id !== data.paypalOrderId) {
      return { ok: false as const, reason: "order_not_found" as const };
    }
    if (order.status === "paid") return { ok: true as const, alreadyPaid: true as const };
    if (order.status !== "pending" || order.currency !== "EUR") {
      return { ok: false as const, reason: "order_not_payable" as const };
    }

    const result = await capturePayPalOrder(data.paypalOrderId);
    const capture = result.purchase_units?.[0]?.payments?.captures?.[0];
    const paidAmount = Number(capture?.amount?.value);
    const expectedAmount = (order.amount_cents / 100).toFixed(2);
    if (
      result.status !== "COMPLETED" ||
      capture?.status !== "COMPLETED" ||
      capture.amount?.currency_code !== "EUR" ||
      !Number.isFinite(paidAmount) ||
      paidAmount.toFixed(2) !== expectedAmount ||
      !capture.id
    ) {
      return { ok: false as const, reason: "payment_not_confirmed" as const };
    }

    await databaseRequest<unknown>(
      `shop_orders?id=eq.${data.orderId}&status=eq.pending&paypal_order_id=eq.${data.paypalOrderId}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          status: "paid",
          paypal_capture_id: capture.id,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      },
    );
    return { ok: true as const, alreadyPaid: false as const };
  });
