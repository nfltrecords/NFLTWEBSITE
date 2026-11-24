import { getShopAssets, getShopOrder, shopEnv, type ShopAsset } from "@/lib/shop-db.server";
import { releases } from "@/lib/catalogue";
import {
  hasCompleteWavMasterSet,
  isWavMasterFileName,
  safeWavDownloadName,
} from "@/lib/audio-assets";
import { releasePreviews } from "@/lib/previews";
import { verifiedReleaseTrackCounts } from "@/lib/commerce";

type OrderItem = { upc: string; quantity: number };

function orderItems(value: string): OrderItem[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const items = parsed.filter(
        (item): item is OrderItem =>
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

export async function getCompleteWavTracks(upc: string): Promise<ShopAsset[] | null> {
  const expectedTrackCount = verifiedReleaseTrackCounts[upc] ?? 0;
  const previewCount = releasePreviews[upc]?.length ?? 0;
  if (expectedTrackCount < 1 || previewCount !== expectedTrackCount) return null;

  const tracks = (await getShopAssets(upc)).filter((asset) => isWavMasterFileName(asset.file_name));
  if (
    !hasCompleteWavMasterSet(
      tracks.map((asset) => asset.file_name),
      expectedTrackCount,
    )
  ) {
    return null;
  }

  const available = await Promise.all(
    tracks.map(async (asset) => {
      if (asset.asset_key.startsWith("r2:")) {
        const object = await shopEnv.AUDIO_R2.head(asset.asset_key.slice(3));
        return Boolean(object && object.size === asset.file_size);
      }
      if (!Number.isInteger(asset.chunk_count) || asset.chunk_count < 1 || asset.chunk_count > 10) {
        return false;
      }
      const listed = await shopEnv.AUDIO_KV.list({ prefix: `${asset.asset_key}:`, limit: 1000 });
      const chunkNames = new Set(listed.keys.map((entry) => entry.name));
      return Array.from({ length: asset.chunk_count }, (_, index) =>
        chunkNames.has(`${asset.asset_key}:${index}`),
      ).every(Boolean);
    }),
  );

  return available.every(Boolean) ? tracks : null;
}

export async function servePaidOrderDownload(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("order") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Commande invalide", { status: 404 });

  const order = await getShopOrder(id);
  if (!order || order.status !== "paid") {
    return new Response("Paiement non confirmé", { status: 403 });
  }

  const items = orderItems(order.release_upc);
  if (!items.length) return new Response("Commande invalide", { status: 404 });

  const itemIndex = Number(url.searchParams.get("item") ?? "0");
  if (!Number.isInteger(itemIndex) || itemIndex < 0 || itemIndex >= items.length) {
    return new Response("Article invalide", { status: 404 });
  }

  const allTracks = await Promise.all(items.map((item) => getCompleteWavTracks(item.upc)));
  if (allTracks.some((tracks) => tracks === null)) {
    return new Response("Masters incomplets", { status: 503 });
  }

  const tracks = allTracks[itemIndex]!;
  const trackIndex = Number(url.searchParams.get("track") ?? "0");
  if (!Number.isInteger(trackIndex) || trackIndex < 0 || trackIndex >= tracks.length) {
    return new Response("Piste indisponible", { status: 404 });
  }

  const asset = tracks[trackIndex]!;
  const safeTrack = safeWavDownloadName(asset.file_name);
  if (asset.asset_key.startsWith("r2:")) {
    const object = await shopEnv.AUDIO_R2.get(asset.asset_key.slice(3));
    if (!object || object.size !== asset.file_size) {
      return new Response("Fichier indisponible", { status: 503 });
    }
    return new Response(object.body, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": `attachment; filename="${safeTrack}"`,
        "Content-Length": String(object.size),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  let index = 0;
  let total = 0;
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (index >= asset.chunk_count) {
        if (total !== asset.file_size) {
          controller.error(new Error("Invalid audio length"));
          return;
        }
        controller.close();
        return;
      }
      const data = await shopEnv.AUDIO_KV.get(`${asset.asset_key}:${index}`, "arrayBuffer");
      if (!data) {
        controller.error(new Error("Missing audio chunk"));
        return;
      }
      const chunk = new Uint8Array(data);
      total += chunk.byteLength;
      index++;
      controller.enqueue(chunk);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "audio/wav",
      "Content-Disposition": `attachment; filename="${safeTrack}"`,
      "Content-Length": String(asset.file_size),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
