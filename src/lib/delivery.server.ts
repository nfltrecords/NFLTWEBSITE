import { getShopAsset, getShopOrder, shopEnv } from "@/lib/shop-db.server";
import { releases } from "@/lib/catalogue";

export async function sendPaidOrderDelivery(orderId: string): Promise<string> {
  const order = await getShopOrder(orderId);
  if (!order || order.status !== "paid") throw new Error("Only a paid order can receive a download.");
  const asset = await getShopAsset(order.release_upc);
  if (!asset) throw new Error("The master audio file is not available for this release yet.");
  return `https://nflt-records.com/telechargement#order=${encodeURIComponent(order.id)}`;
}

export async function servePaidOrderDownload(request: Request): Promise<Response> {
  let orderId = new URL(request.url).searchParams.get("order") ?? "";
  if (request.method === "POST") {
    try {
      const payload = (await request.json()) as { order?: unknown };
      if (typeof payload.order === "string") orderId = payload.order;
    } catch { return new Response("Requête invalide.", { status: 400 }); }
  }
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) return new Response("Commande invalide.", { status: 404 });

  const order = await getShopOrder(orderId);
  if (!order || order.status !== "paid") return new Response("Paiement non confirmé.", { status: 403 });
  const asset = await getShopAsset(order.release_upc);
  if (!asset || asset.file_size <= 0 || asset.chunk_count <= 0)
    return new Response("Fichier indisponible.", { status: 503 });

  let index = 0;
  let bytesSent = 0;
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (index >= asset.chunk_count) {
        controller.close();
        return;
      }
      try {
        const chunk = await shopEnv.AUDIO_KV.get(`${asset.asset_key}:${index}`, "arrayBuffer");
        if (!chunk) {
          controller.error(new Error(`Audio chunk ${index} missing`));
          return;
        }
        const bytes = new Uint8Array(chunk);
        bytesSent += bytes.byteLength;
        index++;
        controller.enqueue(bytes);
        if (index === asset.chunk_count) {
          if (bytesSent !== asset.file_size) {
            controller.error(new Error("Audio asset size mismatch"));
            return;
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() { index = asset.chunk_count; },
  });

  const title = releases.find((item) => item.upc === order.release_upc)?.title ?? "NFLT-RECORDS-audio";
  const filename = title.normalize("NFKD").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-|-$/g, "") + ".wav";
  return new Response(stream, {
    headers: {
      "Content-Type": "audio/wav",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(asset.file_size),
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
