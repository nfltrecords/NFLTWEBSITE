import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/telechargement")({ component: DownloadPage });
function DownloadPage() {
  const [state, setState] = useState<"ready" | "loading" | "error">("ready");
  async function download() {
    if (state === "loading") return;
    setState("loading");
    try {
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const order = params.get("order") ?? "";
      const token = params.get("token") ?? "";
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order, token }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Download unavailable");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = "NFLT-RECORDS-audio.mp3";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
      setState("ready");
    } catch {
      setState("error");
    }
  }
  return (
    <SiteLayout>
      <section className="editorial-section min-h-[55vh]">
        <p className="eyebrow">NFLT RECORDS / TÉLÉCHARGEMENT</p>
        <h1>Votre musique est prête.</h1>
        <p className="body-copy mt-4">
          Le lien est privé et valable pendant 7 jours. Appuyez sur le bouton pour récupérer votre
          fichier audio.
        </p>
        <Button
          type="button"
          className="editorial-action mt-8"
          onClick={download}
          disabled={state === "loading"}
        >
          {state === "loading" ? "Préparation du fichier…" : "Télécharger mon fichier audio"}
        </Button>
        {state === "error" ? (
          <p role="alert" className="body-copy mt-4 text-destructive">
            Lien invalide, expiré ou fichier momentanément indisponible. Contactez NFLT RECORDS si
            le problème persiste.
          </p>
        ) : null}
      </section>
    </SiteLayout>
  );
}
