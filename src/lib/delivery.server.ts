import { getShopAssets, getShopOrder, shopEnv } from "@/lib/shop-db.server";
import { releases } from "@/lib/catalogue";
import { hasCompleteWavMasterSet, isWavMasterFileName, safeWavDownloadName } from "@/lib/audio-assets";
import { releasePreviews } from "@/lib/previews";

type OrderItem = { upc: string; quantity: number };
function orderItems(value: string): OrderItem[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed))
      return parsed.filter(
        (item): item is OrderItem =>
          !!item &&
          typeof item === "object" &&
          typeof item.upc === "string" &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          item.quantity <= 20,
      );
  } catch {
    /* Legacy single-release order */
  }
  return [{ upc: value, quantity: 1 }];
}
export async function servePaidOrderDownload(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("order") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Commande invalide", { status: 404 });
  const order = await getShopOrder(id);
  if (!order || order.status !== "paid")
    return new Response("Paiement non confirmé", { status: 403 });
  const items = orderItems(order.release_upc);
  const itemIndex = Number(url.searchParams.get("item") ?? "0");
  if (!Number.isInteger(itemIndex) || itemIndex < 0 || itemIndex >= items.length)
    return new Response("Article invalide", { status: 404 });
  const item = items[itemIndex];
  const tracks = (await getShopAssets(item.upc)).filter((asset) =>
    isWavMasterFileName(asset.file_name),
  );
  const expectedTrackCount = releasePreviews[item.upc]?.length ?? 0;
  if (!hasCompleteWavMasterSet(tracks.map((asset) => asset.file_name), expectedTrackCount)) {
    return new Response("Masters incomplets", { status: 503 });
  }
  const trackIndex = Number(url.searchParams.get("track") ?? "0");
  if (!Number.isInteger(trackIndex) || trackIndex < 0 || trackIndex >= tracks.length)
    return new Response("Piste indisponible", { status: 404 });
  const asset = tracks[trackIndex];
  const title = releases.find((release) => release.upc === item.upc)?.title ?? "NFLT-audio";
  const safeTitle = title.normalize("NFKD").replace(/[^A-Za-z0-9._-]+/g, "-");
  const safeTrack = safeWavDownloadName(asset.file_name);
  if (asset.asset_key.startsWith("r2:")) {
    const object = await shopEnv.AUDIO_R2.get(asset.asset_key.slice(3));
    if (!object) return new Response("Fichier indisponible", { status: 503 });
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
  let i = 0,
    total = 0;
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (i >= asset.chunk_count) {
        controller.close();
        return;
      }
      const data = await shopEnv.AUDIO_KV.get(`${asset.asset_key}:${i}`, "arrayBuffer");
      if (!data) {
        controller.error(new Error("Missing audio chunk"));
        return;
      }
      const chunk = new Uint8Array(data);
      total += chunk.byteLength;
      i++;
      controller.enqueue(chunk);
      if (i === asset.chunk_count && total !== asset.file_size)
        controller.error(new Error("Invalid audio length"));
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "audio/wav",
      "Content-Disposition": `attachment; filename="${safeTrack || safeTitle + ".wav"}"`,
      "Content-Length": String(asset.file_size),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
