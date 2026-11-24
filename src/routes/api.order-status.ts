import { createFileRoute } from "@tanstack/react-router";
import { getShopOrder } from "@/lib/shop-db.server";
import { releases } from "@/lib/catalogue";
import { getCompleteWavTracks } from "@/lib/delivery.server";
import { safeWavDownloadName } from "@/lib/audio-assets";

function parseItems(value: string): { upc: string; quantity: number }[] {
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
      return items.length === parsed.length ? items : [];
    }
  } catch {
    // Legacy single-release order.
  }
  return /^\d{12,14}$/.test(value) ? [{ upc: value, quantity: 1 }] : [];
}

export const Route = createFileRoute("/api/order-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const id = new URL(request.url).searchParams.get("order") ?? "";
          if (!/^[0-9a-f-]{36}$/i.test(id)) {
            return Response.json({ ok: false }, { status: 400 });
          }

          const order = await getShopOrder(id);
          if (!order || order.status !== "paid") {
            return Response.json(
              { ok: true, paid: false },
              { headers: { "Cache-Control": "no-store" } },
            );
          }

          const items = parseItems(order.release_upc);
          if (!items.length) {
            return Response.json(
              { ok: true, paid: true, ready: false, downloads: [] },
              { headers: { "Cache-Control": "no-store" } },
            );
          }

          const allTracks = await Promise.all(items.map((item) => getCompleteWavTracks(item.upc)));
          if (allTracks.some((tracks) => tracks === null)) {
            return Response.json(
              { ok: true, paid: true, ready: false, downloads: [] },
              { headers: { "Cache-Control": "no-store" } },
            );
          }

          const downloads = allTracks.flatMap((tracks, index) =>
            tracks!.map((asset, track) => ({
              title: releases.find((release) => release.upc === items[index].upc)?.title ?? "NFLT audio",
              track: safeWavDownloadName(asset.file_name).replace(/\.wav$/i, ""),
              quantity: items[index].quantity,
              url: `/api/download?order=${encodeURIComponent(id)}&item=${index}&track=${track}`,
            })),
          );

          return Response.json(
            { ok: true, paid: true, ready: downloads.length > 0, downloads },
            { headers: { "Cache-Control": "no-store" } },
          );
        } catch {
          return Response.json({ ok: false }, { status: 503 });
        }
      },
    },
  },
});
