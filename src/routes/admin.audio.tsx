import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { releases } from "@/lib/catalogue";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/audio")({ component: AudioUploadPage });

function AudioUploadPage() {
  const [adminCode, setAdminCode] = useState("");
  const [upc, setUpc] = useState(releases[0].upc);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function upload() {
    if (!file || busy) return;
    setBusy(true);
    setProgress(0);
    setMessage("Préparation de l’envoi…");
    const headers = { "x-nflt-admin-code": adminCode };
    try {
      const start = await fetch("/api/admin/audio?action=start", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ upc, fileName: file.name, fileSize: file.size }),
      });
      const session = await start.json() as { ok?: boolean; assetKey?: string; chunkSize?: number; chunkCount?: number; error?: string };
      if (!start.ok || !session.ok || !session.assetKey || !session.chunkSize || !session.chunkCount) throw new Error(session.error ?? "Impossible de démarrer l’envoi.");
      for (let index = 0; index < session.chunkCount; index++) {
        const part = file.slice(index * session.chunkSize, Math.min(file.size, (index + 1) * session.chunkSize));
        const response = await fetch("/api/admin/audio?action=chunk", {
          method: "POST",
          headers: { ...headers, "x-nflt-asset-key": session.assetKey, "x-nflt-chunk-index": String(index), "Content-Type": "application/octet-stream" },
          body: part,
        });
        if (!response.ok) {
          const result = await response.json().catch(() => ({})) as { error?: string };
          throw new Error(result.error ?? `Échec du bloc ${index + 1}.`);
        }
        setProgress(Math.round(((index + 1) / session.chunkCount) * 100));
        setMessage(`Envoi du WAV : bloc ${index + 1}/${session.chunkCount}`);
      }
      const finish = await fetch("/api/admin/audio?action=finish", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ assetKey: session.assetKey }),
      });
      const result = await finish.json() as { ok?: boolean; error?: string };
      if (!finish.ok || !result.ok) throw new Error(result.error ?? "Vérification finale impossible.");
      setProgress(100);
      setMessage("Master WAV enregistré dans Cloudflare KV et associé au catalogue.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur pendant l’envoi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout>
      <section className="editorial-section min-h-[65vh] max-w-3xl">
        <p className="eyebrow">NFLT RECORDS / ADMINISTRATION</p>
        <h1>Transfert des masters WAV</h1>
        <p className="body-copy mt-4">Envoi sécurisé par blocs de 20 Mo vers Cloudflare KV. Les fichiers ne sont pas chargés en entier en mémoire et chaque master est vérifié avant son association au catalogue.</p>
        <div className="mt-8 grid gap-5">
          <label className="grid gap-2">Code administrateur
            <input type="password" autoComplete="current-password" value={adminCode} onChange={(event) => setAdminCode(event.target.value)} className="w-full rounded border p-3" />
          </label>
          <label className="grid gap-2">Sortie du catalogue
            <select value={upc} onChange={(event) => setUpc(event.target.value)} className="w-full rounded border p-3">
              {releases.map((release) => <option key={release.upc} value={release.upc}>{release.title} — {release.upc}</option>)}
            </select>
          </label>
          <label className="grid gap-2">Fichier master WAV
            <input type="file" accept=".wav,audio/wav" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="w-full rounded border p-3" />
          </label>
          {file ? <p className="body-copy">{file.name} — {(file.size / (1024 * 1024)).toFixed(1)} Mo</p> : null}
          <Button type="button" className="editorial-action" onClick={upload} disabled={busy || !file || adminCode.length < 1}>
            {busy ? "Transfert en cours…" : "Envoyer le master WAV"}
          </Button>
          {busy || progress > 0 ? <div className="grid gap-2"><progress value={progress} max={100} className="w-full" /><span className="body-copy">{progress}%</span></div> : null}
          {message ? <p role="status" className="body-copy">{message}</p> : null}
        </div>
      </section>
    </SiteLayout>
  );
}
