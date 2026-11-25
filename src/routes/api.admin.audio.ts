import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { releases } from "@/lib/catalogue";
import { verifiedReleaseTrackCounts } from "@/lib/commerce";
import { shopEnv } from "@/lib/shop-db.server";
import { hasValidWavHeader } from "@/lib/audio-assets";

const CHUNK = 20 * 1024 * 1024;
const MAX_FILE_SIZE = 110 * 1024 * 1024;

type UploadSession = {
  upc: string;
  objectKey: string;
  uploadId: string;
  fileName: string;
  fileSize: number;
  chunkCount: number;
};

async function authorized(req: Request) {
  const expected = (env as unknown as { ADMIN_ORDERS_CODE?: string }).ADMIN_ORDERS_CODE ?? "";
  const given = req.headers.get("x-nflt-admin-code") ?? "";
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

function isValidSessionId(value: string): boolean {
  return /^[0-9a-f-]{36}$/i.test(value);
}

export const Route = createFileRoute("/api/admin/audio")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          if (!(await authorized(request))) {
            return Response.json({ error: "Accès refusé" }, { status: 401 });
          }

          const action = new URL(request.url).searchParams.get("action");

          if (action === "inventory") {
            const [result, assetsResult] = await Promise.all([
              shopEnv.DB.prepare(
                "SELECT release_upc, COUNT(*) AS wav_count FROM shop_release_assets GROUP BY release_upc",
              ).all<{ release_upc: string; wav_count: number }>(),
              shopEnv.DB.prepare(
                "SELECT release_upc, asset_key, file_name, file_size FROM shop_release_assets ORDER BY release_upc, file_name",
              ).all<{
                release_upc: string;
                asset_key: string;
                file_name: string;
                file_size: number;
              }>(),
            ]);
            const linkedCounts = new Map(
              (result.results ?? []).map((row) => [row.release_upc, row.wav_count]),
            );
            const checkedAssets = await Promise.all(
              (assetsResult.results ?? []).map(async (asset) => {
                if (!asset.asset_key.startsWith("r2:")) {
                  return { ...asset, valid: false, issue: "Stockage historique non vérifié" };
                }
                const key = asset.asset_key.slice(3);
                const [object, header] = await Promise.all([
                  shopEnv.AUDIO_R2.head(key),
                  shopEnv.AUDIO_R2.get(key, { range: { offset: 0, length: 12 } }),
                ]);
                if (!object || object.size !== asset.file_size || !header) {
                  return { ...asset, valid: false, issue: "Fichier absent ou taille incorrecte" };
                }
                const valid = hasValidWavHeader(await header.arrayBuffer());
                return {
                  ...asset,
                  valid,
                  issue: valid ? null : "Signature RIFF/RF64-WAVE invalide",
                };
              }),
            );
            const inventory = releases.map((release) => {
              const expected = verifiedReleaseTrackCounts[release.upc] ?? null;
              const uploaded = linkedCounts.get(release.upc) ?? 0;
              const invalidFiles = checkedAssets
                .filter((asset) => asset.release_upc === release.upc && !asset.valid)
                .map((asset) => ({ name: asset.file_name, issue: asset.issue }));
              const validUploaded = uploaded - invalidFiles.length;
              return {
                upc: release.upc,
                title: release.title,
                expected,
                uploaded,
                validUploaded,
                invalidFiles,
                missing: expected === null ? null : Math.max(expected - validUploaded, 0),
                complete: expected !== null && expected === validUploaded,
                over: expected !== null && uploaded > expected,
              };
            });
            return Response.json({ ok: true, inventory });
          }

          if (action === "start") {
            const body = (await request.json()) as {
              upc?: string;
              fileName?: string;
              fileSize?: number;
            };
            if (
              !releases.some((release) => release.upc === body.upc) ||
              typeof body.fileName !== "string" ||
              !/^[A-Za-z0-9À-ÿ ._()'-]{1,180}\.wav$/i.test(body.fileName) ||
              typeof body.fileSize !== "number" ||
              !Number.isSafeInteger(body.fileSize) ||
              body.fileSize < 12 ||
              body.fileSize > MAX_FILE_SIZE
            ) {
              return Response.json({ error: "Métadonnées WAV invalides" }, { status: 400 });
            }

            const upc = body.upc!;
            const fileName = body.fileName.normalize("NFC");
            const duplicateName = await shopEnv.DB.prepare(
              "SELECT 1 AS found FROM shop_release_assets WHERE release_upc = ? AND lower(file_name) = lower(?) LIMIT 1",
            )
              .bind(upc, fileName)
              .first<{ found: number }>();
            if (duplicateName) {
              return Response.json(
                { error: "Un fichier WAV portant ce nom est déjà associé à cette sortie" },
                { status: 409 },
              );
            }
            const expectedTrackCount = verifiedReleaseTrackCounts[upc];
            if (expectedTrackCount !== undefined) {
              const current = await shopEnv.DB.prepare(
                "SELECT COUNT(*) AS wav_count FROM shop_release_assets WHERE release_upc = ?",
              )
                .bind(upc)
                .first<{ wav_count: number }>();
              if ((current?.wav_count ?? 0) >= expectedTrackCount) {
                return Response.json(
                  { error: "Le nombre de masters WAV attendu pour cette sortie est déjà atteint" },
                  { status: 409 },
                );
              }
            }

            const fileSize = body.fileSize!;
            const chunkCount = Math.ceil(fileSize / CHUNK);
            const sessionId = crypto.randomUUID();
            const objectKey = `18 master/${upc}/${crypto.randomUUID()}-${fileName}`;
            const multipart = await shopEnv.AUDIO_R2.createMultipartUpload(objectKey, {
              httpMetadata: { contentType: "audio/wav" },
              customMetadata: { releaseUpc: upc, originalFileName: fileName },
            });
            const session: UploadSession = {
              upc,
              objectKey,
              uploadId: multipart.uploadId,
              fileName,
              fileSize,
              chunkCount,
            };

            try {
              await shopEnv.AUDIO_KV.put(`upload:${sessionId}`, JSON.stringify(session), {
                expirationTtl: 3600,
              });
            } catch (error) {
              await multipart.abort().catch(() => undefined);
              throw error;
            }

            return Response.json({
              ok: true,
              assetKey: sessionId,
              objectKey,
              fileName,
              chunkCount,
              chunkSize: CHUNK,
            });
          }

          if (action === "chunk") {
            const sessionId = request.headers.get("x-nflt-asset-key") ?? "";
            const partIndex = Number(request.headers.get("x-nflt-chunk-index"));
            if (!isValidSessionId(sessionId)) {
              return Response.json({ error: "Session invalide" }, { status: 400 });
            }

            const raw = await shopEnv.AUDIO_KV.get(`upload:${sessionId}`);
            if (!raw) return Response.json({ error: "Session expirée" }, { status: 410 });
            const session = JSON.parse(raw) as UploadSession;
            if (!Number.isInteger(partIndex) || partIndex < 0 || partIndex >= session.chunkCount) {
              return Response.json({ error: "Bloc invalide" }, { status: 400 });
            }

            const bytes = await request.arrayBuffer();
            const expectedSize =
              partIndex === session.chunkCount - 1 ? session.fileSize - partIndex * CHUNK : CHUNK;
            if (bytes.byteLength !== expectedSize) {
              return Response.json({ error: "Taille invalide" }, { status: 400 });
            }
            if (partIndex === 0 && !hasValidWavHeader(bytes)) {
              return Response.json(
                { error: "Le fichier ne contient pas une signature WAV RIFF/RF64 valide" },
                { status: 415 },
              );
            }

            const multipart = shopEnv.AUDIO_R2.resumeMultipartUpload(
              session.objectKey,
              session.uploadId,
            );
            const uploadedPart = await multipart.uploadPart(partIndex + 1, bytes);
            await shopEnv.AUDIO_KV.put(
              `upload:${sessionId}:part:${partIndex}`,
              JSON.stringify({
                partNumber: uploadedPart.partNumber,
                etag: uploadedPart.etag,
              }),
              { expirationTtl: 3600 },
            );
            return Response.json({ ok: true });
          }

          if (action === "finish") {
            const body = (await request.json()) as { assetKey?: string };
            const sessionId = body.assetKey ?? "";
            if (!isValidSessionId(sessionId)) {
              return Response.json({ error: "Session invalide" }, { status: 400 });
            }
            const completedRaw = await shopEnv.AUDIO_KV.get(`upload:${sessionId}:complete`);
            if (completedRaw) return Response.json(JSON.parse(completedRaw));

            const raw = await shopEnv.AUDIO_KV.get(`upload:${sessionId}`);
            if (!raw) return Response.json({ error: "Session expirée" }, { status: 410 });
            const session = JSON.parse(raw) as UploadSession;
            const parts: { partNumber: number; etag: string }[] = [];

            for (let index = 0; index < session.chunkCount; index++) {
              const partRaw = await shopEnv.AUDIO_KV.get(`upload:${sessionId}:part:${index}`);
              if (!partRaw) {
                return Response.json({ error: `Bloc manquant : ${index}` }, { status: 409 });
              }
              const part = JSON.parse(partRaw) as { partNumber: number; etag: string };
              if (part.partNumber !== index + 1 || typeof part.etag !== "string" || !part.etag) {
                return Response.json({ error: `Bloc invalide : ${index}` }, { status: 409 });
              }
              parts.push(part);
            }

            const assetKey = `r2:${session.objectKey}`;
            const existingAssociation = await shopEnv.DB.prepare(
              "SELECT release_upc, file_name, file_size FROM shop_release_assets WHERE asset_key = ?",
            )
              .bind(assetKey)
              .first<{ release_upc: string; file_name: string; file_size: number }>();
            if (!existingAssociation) {
              const duplicateName = await shopEnv.DB.prepare(
                "SELECT 1 AS found FROM shop_release_assets WHERE release_upc = ? AND lower(file_name) = lower(?) LIMIT 1",
              )
                .bind(session.upc, session.fileName)
                .first<{ found: number }>();
              if (duplicateName) {
                const multipart = shopEnv.AUDIO_R2.resumeMultipartUpload(
                  session.objectKey,
                  session.uploadId,
                );
                await multipart.abort().catch(() => undefined);
                await shopEnv.AUDIO_KV.delete(`upload:${sessionId}`);
                await Promise.all(
                  Array.from({ length: session.chunkCount }, (_, index) =>
                    shopEnv.AUDIO_KV.delete(`upload:${sessionId}:part:${index}`),
                  ),
                );
                return Response.json(
                  { error: "Un fichier WAV portant ce nom est déjà associé à cette sortie" },
                  { status: 409 },
                );
              }
            }

            let object = await shopEnv.AUDIO_R2.head(session.objectKey);
            if (!object) {
              const multipart = shopEnv.AUDIO_R2.resumeMultipartUpload(
                session.objectKey,
                session.uploadId,
              );
              await multipart.complete(parts);
              object = await shopEnv.AUDIO_R2.head(session.objectKey);
            }
            if (!object || object.size !== session.fileSize) {
              return Response.json(
                { error: "Vérification du master WAV échouée" },
                { status: 503 },
              );
            }

            const expectedTrackCount = verifiedReleaseTrackCounts[session.upc];
            const insertResult =
              expectedTrackCount === undefined
                ? await shopEnv.DB.prepare(
                    "INSERT OR IGNORE INTO shop_release_assets (release_upc, asset_key, file_name, file_size, chunk_count) VALUES (?, ?, ?, ?, ?)",
                  )
                    .bind(
                      session.upc,
                      assetKey,
                      session.fileName,
                      session.fileSize,
                      session.chunkCount,
                    )
                    .run()
                : await shopEnv.DB.prepare(
                    "INSERT OR IGNORE INTO shop_release_assets (release_upc, asset_key, file_name, file_size, chunk_count) SELECT ?, ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM shop_release_assets WHERE release_upc = ?) < ?",
                  )
                    .bind(
                      session.upc,
                      assetKey,
                      session.fileName,
                      session.fileSize,
                      session.chunkCount,
                      session.upc,
                      expectedTrackCount,
                    )
                    .run();

            if ((insertResult.meta.changes ?? 0) === 0 && !existingAssociation) {
              const latest = await shopEnv.DB.prepare(
                "SELECT COUNT(*) AS wav_count FROM shop_release_assets WHERE release_upc = ?",
              )
                .bind(session.upc)
                .first<{ wav_count: number }>();
              const trackLimitReached =
                expectedTrackCount !== undefined && (latest?.wav_count ?? 0) >= expectedTrackCount;
              await shopEnv.AUDIO_R2.delete(session.objectKey);
              await shopEnv.AUDIO_KV.delete(`upload:${sessionId}`);
              await Promise.all(
                Array.from({ length: session.chunkCount }, (_, index) =>
                  shopEnv.AUDIO_KV.delete(`upload:${sessionId}:part:${index}`),
                ),
              );
              return Response.json(
                {
                  error: trackLimitReached
                    ? "Le nombre de masters WAV attendu pour cette sortie est déjà atteint"
                    : "Un fichier WAV portant ce nom est déjà associé à cette sortie",
                },
                { status: 409 },
              );
            }

            const association = await shopEnv.DB.prepare(
              "SELECT release_upc, file_name, file_size FROM shop_release_assets WHERE asset_key = ?",
            )
              .bind(assetKey)
              .first<{ release_upc: string; file_name: string; file_size: number }>();
            if (
              !association ||
              association.release_upc !== session.upc ||
              association.file_name !== session.fileName ||
              association.file_size !== session.fileSize
            ) {
              return Response.json(
                { error: "Association D1 du master WAV échouée" },
                { status: 503 },
              );
            }

            const completed = {
              ok: true,
              upc: session.upc,
              objectKey: session.objectKey,
              fileName: session.fileName,
              fileSize: session.fileSize,
            };
            await shopEnv.AUDIO_KV.put(`upload:${sessionId}:complete`, JSON.stringify(completed), {
              expirationTtl: 3600,
            });
            await shopEnv.AUDIO_KV.delete(`upload:${sessionId}`);
            await Promise.all(
              Array.from({ length: session.chunkCount }, (_, index) =>
                shopEnv.AUDIO_KV.delete(`upload:${sessionId}:part:${index}`),
              ),
            );

            return Response.json(completed);
          }

          return Response.json({ error: "Action inconnue" }, { status: 400 });
        } catch (error) {
          console.error("WAV R2 upload failed", error);
          return Response.json({ error: "Erreur transfert WAV vers R2" }, { status: 503 });
        }
      },
    },
  },
});
