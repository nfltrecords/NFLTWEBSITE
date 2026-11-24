import { getShopAsset, getShopOrder, shopEnv } from "@/lib/shop-db.server";
import { releases } from "@/lib/catalogue";

type OrderItem = { upc: string; quantity: number };
function orderItems(value: string): OrderItem[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item): item is OrderItem =>
      !!item && typeof item === "object" && typeof item.upc === "string" &&
      Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20
    );
  } catch { /* Legacy single-release order */ }
  return [{ upc: value, quantity: 1 }];
}
export async function servePaidOrderDownload(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("order") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Commande invalide", { status: 404 });
  const order = await getShopOrder(id);
  if (!order || order.status !== "paid") return new Response("Paiement non confirmé", { status: 403 });
  const items = orderItems(order.release_upc);
  const index = Number(url.searchParams.get("item") ?? "0");
  if (!Number.isInteger(index) || index < 0 || index >= items.length) return new Response("Article invalide", { status: 404 });
  const item = items[index];
  const asset = await getShopAsset(item.upc);
  if (!asset) return new Response("Fichier indisponible", { status: 503 });
  if (!asset.file_name.toLowerCase().endsWith(".wav")) return new Response("Master WAV indisponible pour cette sortie", { status: 503 });
  const title = releases.find((release) => release.upc === item.upc)?.title ?? "NFLT-audio";
  const safeTitle = title.normalize("NFKD").replace(/[^A-Za-z0-9._-]+/g, "-");
  if (asset.asset_key.startsWith("r2:")) {
    const object = await shopEnv.AUDIO_R2.get(asset.asset_key.slice(3));
    if (!object) return new Response("Fichier indisponible", { status: 503 });
    const extension = asset.file_name.toLowerCase().endsWith(".m4a") ? ".m4a" : ".wav";
    return new Response(object.body, { headers: {
      "Content-Type": extension === ".m4a" ? "audio/mp4" : "audio/wav",
      "Content-Disposition": `attachment; filename="${safeTitle}${extension}"`,
      "Content-Length": String(object.size), "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    }});
  }
  let i = 0, total = 0;
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (i >= asset.chunk_count) { controller.close(); return; }
      const data = await shopEnv.AUDIO_KV.get(`${asset.asset_key}:${i}`, "arrayBuffer");
      if (!data) { controller.error(new Error("Missing audio chunk")); return; }
      const chunk = new Uint8Array(data); total += chunk.byteLength; i++; controller.enqueue(chunk);
      if (i === asset.chunk_count && total !== asset.file_size) controller.error(new Error("Invalid audio length"));
    },
  });
  return new Response(stream, { headers: {
    "Content-Type": "audio/wav",
    "Content-Disposition": `attachment; filename="${safeTitle}.wav"`,
    "Content-Length": String(asset.file_size), "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  }});
}
