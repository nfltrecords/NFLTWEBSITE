import { createFileRoute } from "@tanstack/react-router";
import { shopEnv } from "@/lib/shop-db.server";
import { releases } from "@/lib/catalogue";

type ShopifyPaidOrder = {
  id?: number | string;
  email?: string | null;
  contact_email?: string | null;
  financial_status?: string;
  currency?: string;
  total_price?: string;
  line_items?: Array<{ sku?: string | null; quantity?: number }>;
};

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function validShopifyHmac(rawBody: string, supplied: string, secret: string): Promise<boolean> {
  if (!supplied || !secret) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)),
  );
  const expected = bytesToHex(signature);
  if (expected.length !== supplied.length) return false;
  let difference = 0;
  for (let i = 0; i < expected.length; i++) difference |= expected.charCodeAt(i) ^ supplied.toLowerCase().charCodeAt(i);
  return difference === 0;
}

export const Route = createFileRoute("/api/shopify-paid-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = (shopEnv as typeof shopEnv & { SHOPIFY_WEBHOOK_SECRET?: string }).SHOPIFY_WEBHOOK_SECRET;
        const rawBody = await request.text();
        const signature = request.headers.get("X-Shopify-Hmac-Sha256") ?? "";
        if (!secret || !(await validShopifyHmac(rawBody, signature, secret))) {
          return new Response("Unauthorized", { status: 401 });
        }
        if (request.headers.get("X-Shopify-Topic")?.toLowerCase() !== "orders/paid") {
          return new Response("Unsupported topic", { status: 400 });
        }

        let order: ShopifyPaidOrder;
        try {
          order = JSON.parse(rawBody) as ShopifyPaidOrder;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const shopifyOrderId = String(order.id ?? "");
        const email = (order.email ?? order.contact_email ?? "").trim().toLowerCase();
        const currency = (order.currency ?? "").toUpperCase();
        const total = Number(order.total_price);
        if (
          !/^\d+$/.test(shopifyOrderId) ||
          !email ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          order.financial_status !== "paid" ||
          !Number.isFinite(total) ||
          total < 0 ||
          !/^[A-Z]{3}$/.test(currency) ||
          !Array.isArray(order.line_items) ||
          order.line_items.length < 1
        ) {
          return new Response("Invalid paid order", { status: 422 });
        }

        const items: Array<{ upc: string; quantity: number }> = [];
        for (const line of order.line_items) {
          const upc = (line.sku ?? "").trim();
          const quantity = line.quantity;
          if (
            !/^\d{12,14}$/.test(upc) ||
            !releases.some((release) => release.upc === upc) ||
            !Number.isInteger(quantity) ||
            !quantity ||
            quantity < 1 ||
            quantity > 20
          ) {
            return new Response("Unknown release SKU or invalid quantity", { status: 422 });
          }
          items.push({ upc, quantity });
        }

        const orderId = crypto.randomUUID();
        const manifest = JSON.stringify(items);
        await shopEnv.DB.batch([
          shopEnv.DB.prepare(
            "INSERT OR IGNORE INTO shopify_order_map (shopify_order_id, order_id) VALUES (?, ?)",
          ).bind(shopifyOrderId, orderId),
          shopEnv.DB.prepare(
            "INSERT INTO shop_orders (id, release_upc, buyer_email, amount_cents, currency, status, created_at, updated_at, paid_at) SELECT ?, ?, ?, ?, ?, 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP WHERE EXISTS (SELECT 1 FROM shopify_order_map WHERE shopify_order_id = ? AND order_id = ?)",
          ).bind(orderId, manifest, email, Math.round(total * 100), currency, shopifyOrderId, orderId),
        ]);

        return Response.json({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
