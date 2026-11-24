import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { releases } from "@/lib/catalogue";
import { shopEnv, type ShopOrder } from "@/lib/shop-db.server";

type OrderItem = { upc: string; quantity: number; title: string };

function parseOrderItems(value: string): OrderItem[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const items = parsed.filter(
        (item): item is { upc: string; quantity: number } =>
          !!item &&
          typeof item === "object" &&
          typeof item.upc === "string" &&
          /^\d{12,14}$/.test(item.upc) &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          item.quantity <= 20,
      );
      if (items.length !== parsed.length) return [];
      return items.map((item) => ({
        ...item,
        title: releases.find((release) => release.upc === item.upc)?.title ?? item.upc,
      }));
    }
  } catch {
    // Legacy orders stored a single UPC as plain text.
  }
  if (!/^\d{12,14}$/.test(value)) return [];
  return [
    {
      upc: value,
      quantity: 1,
      title: releases.find((release) => release.upc === value)?.title ?? value,
    },
  ];
}

async function authorized(request: Request): Promise<boolean> {
  const expected = (env as unknown as { ADMIN_ORDERS_CODE?: string }).ADMIN_ORDERS_CODE ?? "";
  const given = request.headers.get("x-nflt-admin-code") ?? "";
  if (expected.trim().length < 32 || !given || given.length > 256) return false;
  const hash = async (value: string) =>
    new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(value.trim().normalize("NFC")),
      ),
    );
  const [a, b] = await Promise.all([hash(expected), hash(given)]);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return difference === 0;
}

export const Route = createFileRoute("/api/admin/orders")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          if (!(await authorized(request))) {
            return Response.json({ ok: false, error: "Accès refusé" }, { status: 401 });
          }

          const url = new URL(request.url);
          const requestedStatus = url.searchParams.get("status");
          const allowedStatuses = ["pending", "paid", "cancelled", "refunded"] as const;
          const status = allowedStatuses.find((value) => value === requestedStatus);
          const requestedLimit = Number(url.searchParams.get("limit") ?? "50");
          const limit = Number.isSafeInteger(requestedLimit)
            ? Math.min(100, Math.max(1, requestedLimit))
            : 50;

          const statement = status
            ? shopEnv.DB.prepare(
                "SELECT id, release_upc, buyer_email, amount_cents, currency, status, paypal_transaction_id, created_at, paid_at FROM shop_orders WHERE status = ? ORDER BY created_at DESC LIMIT ?",
              ).bind(status, limit)
            : shopEnv.DB.prepare(
                "SELECT id, release_upc, buyer_email, amount_cents, currency, status, paypal_transaction_id, created_at, paid_at FROM shop_orders ORDER BY created_at DESC LIMIT ?",
              ).bind(limit);

          const result = await statement.all<ShopOrder>();
          const orders = (result.results ?? []).map((order) => ({
            id: order.id,
            buyer_email: order.buyer_email,
            amount_cents: order.amount_cents,
            currency: order.currency,
            status: order.status,
            paypal_transaction_id: order.paypal_transaction_id,
            created_at: order.created_at,
            paid_at: order.paid_at,
            items: parseOrderItems(order.release_upc),
          }));

          return Response.json(
            { ok: true, orders },
            { headers: { "Cache-Control": "private, no-store" } },
          );
        } catch (error) {
          console.error("Admin order listing failed", error);
          return Response.json({ ok: false, error: "Impossible de charger les commandes" }, { status: 503 });
        }
      },
    },
  },
});
