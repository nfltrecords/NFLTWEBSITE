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

type InventoryItem = {
  upc: string;
  title: string;
  expected: number | null;
  uploaded: number;
  missing: number | null;
  complete: boolean;
  over: boolean;
};

function Page() {
  const [code, setCode] = useState(""),
    [upc, setUpc] = useState<string>(releases[0]?.upc ?? ""),
    [files, setFiles] = useState<File[]>([]),
    [progress, setProgress] = useState(0),
    [msg, setMsg] = useState(""),
    [busy, setBusy] = useState(false),
    [inventory, setInventory] = useState<InventoryItem[]>([]),
    [inventoryBusy, setInventoryBusy] = useState(false);

  async function refreshInventory() {
    if (!code || inventoryBusy) return;
    setInventoryBusy(true);
    try {
      const response = await fetch("/api/admin/audio?action=inventory", {
        method: "POST",
        headers: {
          "x-nflt-admin-code": code,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const result = (await response.json()) as {
        error?: string;
        inventory?: InventoryItem[];
      };
      if (!response.ok) throw Error(result.error ?? "Inventaire indisponible");
      setInventory(result.inventory ?? []);
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "Impossible de charger l'inventaire");
    } finally {
      setInventoryBusy(false);
    }
  }

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
    if (!done.ok)
      throw Error(`${file.name}: ${result.error ?? "Impossible de finaliser le transfert"}`);
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
      void refreshInventory();
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
      <section className="editorial-section min-h-[60vh] max-w-4xl">
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

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl">Inventaire des 18 sorties</h2>
          <Button
            type="button"
            variant="outline"
            disabled={!code || inventoryBusy}
            onClick={refreshInventory}
          >
            {inventoryBusy ? "Actualisation…" : "Actualiser l’inventaire"}
          </Button>
        </div>
        {inventory.length > 0 ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pr-3">Sortie / UPC</th>
                  <th className="px-2 py-2 text-right">Pistes attendues</th>
                  <th className="px-2 py-2 text-right">WAV associés</th>
                  <th className="px-2 py-2 text-right">Manquants</th>
                  <th className="py-2 pl-3">État</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.upc} className="border-b border-border/60">
                    <td className="py-3 pr-3">
                      <span className="block font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.upc}</span>
                    </td>
                    <td className="px-2 py-3 text-right tabular-nums">
                      {item.expected ?? "À confirmer"}
                    </td>
                    <td className="px-2 py-3 text-right tabular-nums">{item.uploaded}</td>
                    <td className="px-2 py-3 text-right tabular-nums">
                      {item.missing ?? "—"}
                    </td>
                    <td className="py-3 pl-3">
                      {item.over
                        ? "Trop de fichiers"
                        : item.expected === null
                          ? "Nombre à confirmer"
                          : item.complete
                            ? "Complet"
                            : "À compléter"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="body-copy mt-3">
            L’inventaire est protégé. Saisissez le code administrateur puis actualisez-le.
          </p>
        )}

        <label className="mt-8 grid gap-2">
          Sortie à compléter
          <select
            value={upc}
            onChange={(e) => setUpc(e.target.value)}
            className="rounded border p-3"
          >
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
