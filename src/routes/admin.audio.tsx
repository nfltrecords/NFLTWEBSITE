import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { releases } from "@/lib/catalogue";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/audio")({
  component: Page,
  head: () => ({ meta: [{ name: "robots", content: "noindex,nofollow" }] }),
});

type UploadStartResult = {
  assetKey: string;
  chunkCount: number;
  chunkSize: number;
  error?: string;
};

function Page() {
  const [code, setCode] = useState(""),
    [upc, setUpc] = useState<string>(releases[0]?.upc ?? ""),
    [files, setFiles] = useState<File[]>([]),
    [progress, setProgress] = useState(0),
    [msg, setMsg] = useState(""),
    [busy, setBusy] = useState(false);

  async function uploadOne(file: File, headers: { "x-nflt-admin-code": string }) {
    const r = await fetch("/api/admin/audio?action=start", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ upc, fileName: file.name, fileSize: file.size }),
    });
    const m = (await r.json()) as UploadStartResult;
    if (!r.ok) throw Error(`${file.name}: ${m.error ?? "Impossible de démarrer le transfert"}`);
    for (let i = 0; i < m.chunkCount; i++) {
      const p = file.slice(i * m.chunkSize, Math.min(file.size, (i + 1) * m.chunkSize));
      const c = await fetch("/api/admin/audio?action=chunk", {
        method: "POST",
        headers: { ...headers, "x-nflt-asset-key": m.assetKey, "x-nflt-chunk-index": String(i) },
        body: p,
      });
      if (!c.ok) {
        const chunkResult = (await c.json()) as { error?: string };
        throw Error(`${file.name}: ${chunkResult.error ?? "Échec du transfert du bloc"}`);
      }
    }
    const done = await fetch("/api/admin/audio?action=finish", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ assetKey: m.assetKey }),
    });
    const result = (await done.json()) as { error?: string; fileName?: string; fileSize?: number };
    if (!done.ok) throw Error(`${file.name}: ${result.error ?? "Impossible de finaliser le transfert"}`);
    return result;
  }

  async function upload() {
    if (!files.length || busy) return;
    setBusy(true);
    setProgress(0);
    setMsg("");
    const headers = { "x-nflt-admin-code": code };
    let completed = 0;
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    let sentBytes = 0;
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const result = await uploadOne(file, headers);
        uploaded.push(result.fileName ?? file.name);
        completed++;
        sentBytes += file.size;
        setProgress(Math.round((sentBytes / totalBytes) * 100));
        setMsg(`Transfert validé : ${completed}/${files.length} masters`);
      }
      setMsg(
        `Terminé : ${completed} master(s) WAV envoyé(s) et associé(s) à ${upc}. ${uploaded.join(", ")}`,
      );
      setFiles([]);
    } catch (e) {
      setMsg(
        `Arrêt après ${completed}/${files.length} fichier(s). ${e instanceof Error ? e.message : "Erreur inconnue"}`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout>
      <section className="editorial-section min-h-[60vh] max-w-3xl">
        <p className="eyebrow">NFLT RECORDS / ADMIN</p>
        <h1>Transfert des masters WAV</h1>
        <label className="mt-6 grid gap-2">
          Code administrateur
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="rounded border p-3"
          />
        </label>
        <label className="mt-4 grid gap-2">
          Sortie
          <select value={upc} onChange={(e) => setUpc(e.target.value)} className="rounded border p-3">
            {releases.map((r) => (
              <option key={r.upc} value={r.upc}>
                {r.title} — {r.upc}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 grid gap-2">
          Masters WAV (sélection multiple — même sortie / UPC)
          <input
            type="file"
            accept=".wav,audio/wav"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
        </label>
        <p className="body-copy mt-2">{files.length} fichier(s) sélectionné(s)</p>
        <Button
          className="editorial-action mt-5"
          disabled={!files.length || !code || busy}
          onClick={upload}
        >
          {busy ? "Transfert en cours…" : `Envoyer ${files.length || ""} master(s)`}
        </Button>
        <progress className="mt-4 w-full" value={progress} max={100} />
        <p role="status" className="body-copy mt-3">
          {msg}
        </p>
        <p className="body-copy mt-6">
          <a className="underline" href="/admin/orders">
            Gestion des commandes
          </a>
        </p>
      </section>
    </SiteLayout>
  );
}
