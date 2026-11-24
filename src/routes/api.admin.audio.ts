import { createFileRoute } from "@tanstack/react-router";
import { releases } from "@/lib/catalogue";
import { shopEnv } from "@/lib/shop-db.server";

const CHUNK_LIMIT = 20 * 1024 * 1024;
type Manifest = {
  upc: string;
  assetKey: string;
  fileName: string;
  fileSize: number;
  chunkCount: number;
};

async function authorized(request: Request): Promise<boolean> {
  const expected = process.env["ADMIN_ORDERS_CODE"] ?? "";
  const supplied = request.headers.get("x-nflt-admin-code") ?? "";
  if (expected.trim().length < 32 || supplied.length > 256 || !supplied) return false;
  const digest = async (value: string) =>
    new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(value.trim().normalize("NFC")),
      ),
    );
  const [a, b] = await Promise.all([digest(expected), digest(supplied)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export const Route = createFileRoute("/api/admin/audio")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          if (!(await authorized(request)))
            return Response.json({ error: "Accès refusé." }, { status: 401 });
          const action = new URL(request.url).searchParams.get("action");
          if (action === "start") {
            const body = (await request.json()) as {
              upc?: string;
              fileName?: string;
              fileSize?: number;
            };
            if (
              !releases.some((r) => r.upc === body.upc) ||
              typeof body.fileName !== "string" ||
              !/^[A-Za-z0-9À-ÿ ._()'-]{1,180}\.wav$/i.test(body.fileName) ||
              !Number.isSafeInteger(body.fileSize) ||
              (body.fileSize ?? 0) <= 0 ||
              (body.fileSize ?? 0) > 110 * 1024 * 1024
            )
              return Response.json({ error: "Métadonnées audio invalides." }, { status: 400 });
            const manifest: Manifest = {
              upc: body.upc!,
              assetKey: `master-${body.upc}-${crypto.randomUUID()}`,
              fileName: body.fileName,
              fileSize: body.fileSize!,
              chunkCount: Math.ceil(body.fileSize! / CHUNK_LIMIT),
            };
            await shopEnv.AUDIO_KV.put(`upload:${manifest.assetKey}`, JSON.stringify(manifest), {
              expirationTtl: 3600,
            });
            return Response.json({
              ok: true,
              assetKey: manifest.assetKey,
              chunkSize: CHUNK_LIMIT,
              chunkCount: manifest.chunkCount,
            });
          }
          if (action === "chunk") {
            const assetKey = request.headers.get("x-nflt-asset-key") ?? "";
            const index = Number(request.headers.get("x-nflt-chunk-index"));
            if (
              !/^master-\d{12,14}-[0-9a-f-]{36}$/i.test(assetKey) ||
              !Number.isInteger(index) ||
              index < 0
            )
              return Response.json({ error: "Bloc invalide." }, { status: 400 });
            const raw = await shopEnv.AUDIO_KV.get(`upload:${assetKey}`);
            if (!raw) return Response.json({ error: "Session d'envoi expirée." }, { status: 410 });
            const manifest = JSON.parse(raw) as Manifest;
            if (index >= manifest.chunkCount)
              return Response.json({ error: "Index invalide." }, { status: 400 });
            const bytes = await request.arrayBuffer();
            const expectedSize =
              index === manifest.chunkCount - 1
                ? manifest.fileSize - index * CHUNK_LIMIT
                : CHUNK_LIMIT;
            if (bytes.byteLength !== expectedSize)
              return Response.json({ error: "Taille du bloc incorrecte." }, { status: 400 });
            await shopEnv.AUDIO_KV.put(`${assetKey}:${index}`, bytes);
            return Response.json({ ok: true, index });
          }
          if (action === "finish") {
            const body = (await request.json()) as { assetKey?: string };
            const assetKey = body.assetKey ?? "";
            const raw = await shopEnv.AUDIO_KV.get(`upload:${assetKey}`);
            if (!raw) return Response.json({ error: "Session d'envoi expirée." }, { status: 410 });
            const manifest = JSON.parse(raw) as Manifest;
            for (let i = 0; i < manifest.chunkCount; i++) {
              if (!(await shopEnv.AUDIO_KV.head(`${assetKey}:${i}`)))
                return Response.json(
                  { error: `Bloc ${i + 1}/${manifest.chunkCount} manquant.` },
                  { status: 409 },
                );
            }
            await shopEnv.DB.prepare(
              "INSERT INTO shop_release_assets (release_upc, asset_key, file_name, file_size, chunk_count) VALUES (?, ?, ?, ?, ?) ON CONFLICT(release_upc) DO UPDATE SET asset_key=excluded.asset_key, file_name=excluded.file_name, file_size=excluded.file_size, chunk_count=excluded.chunk_count",
            )
              .bind(
                manifest.upc,
                manifest.assetKey,
                manifest.fileName,
                manifest.fileSize,
                manifest.chunkCount,
              )
              .run();
            await shopEnv.AUDIO_KV.delete(`upload:${assetKey}`);
            return Response.json({
              ok: true,
              upc: manifest.upc,
              fileName: manifest.fileName,
              fileSize: manifest.fileSize,
            });
          }
          return Response.json({ error: "Action inconnue." }, { status: 400 });
        } catch (error) {
          console.error("Audio master upload failed", error);
          return Response.json({ error: "Envoi audio impossible." }, { status: 503 });
        }
      },
    },
  },
});
