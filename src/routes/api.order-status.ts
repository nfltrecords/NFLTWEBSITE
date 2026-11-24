import { createFileRoute } from "@tanstack/react-router";
import { getShopAsset, getShopOrder } from "@/lib/shop-db.server";
import { sendPaidOrderDelivery } from "@/lib/delivery.server";

export const Route = createFileRoute("/api/order-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const orderId = new URL(request.url).searchParams.get("order") ?? "";
          if (!/^[0-9a-f-]{36}$/i.test(orderId)) return Response.json({ ok: false }, { status: 400 });
          const order = await getShopOrder(orderId);
          if (!order || order.status !== "paid") return Response.json({ ok: true, paid: false }, { headers: { "Cache-Control": "no-store" } });
          const asset = await getShopAsset(order.release_upc);
          if (!asset) return Response.json({ ok: true, paid: true, ready: false }, { headers: { "Cache-Control": "no-store" } });
          return Response.json({ ok: true, paid: true, ready: true, downloadUrl: `/api/download?order=${encodeURIComponent(orderId)}` }, { headers: { "Cache-Control": "no-store" } });
        } catch (error) {
          console.error("Order status check failed", error);
          return Response.json({ ok: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
        }
      },
    },
  },
});
