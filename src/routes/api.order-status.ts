import { createFileRoute } from "@tanstack/react-router";
import { getShopOrder, getShopAssets } from "@/lib/shop-db.server";
import { releases } from "@/lib/catalogue";
import { isWavMasterFileName, safeWavDownloadName } from "@/lib/audio-assets";

function parseItems(value: string): { upc: string; quantity: number }[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is { upc: string; quantity: number } =>
          !!item &&
          typeof item === "object" &&
          typeof item.upc === "string" &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          item.quantity <= 20,
      );
    }
  } catch {
    // Legacy single-release order.
  }
  return [{ upc: value, quantity: 1 }];
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
          const downloads = (
            await Promise.all(
              items.map(async (item, index) => {
                const assets = (await getShopAssets(item.upc)).filter((asset) =>
                  isWavMasterFileName(asset.file_name),
                );
                const title =
                  releases.find((release) => release.upc === item.upc)?.title ?? "NFLT audio";

                return assets.map((asset, track) => ({
                  title,
                  track: safeWavDownloadName(asset.file_name).replace(/\\.wav$/i, ""),
                  quantity: item.quantity,
                  url: `/api/download?order=${encodeURIComponent(id)}&item=${index}&track=${track}`,
                }));
              }),
            )
          ).flat();

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
