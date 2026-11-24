import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/telechargement")({ component: DownloadPage });
function DownloadPage() {
  const downloadHref = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const order = params.get("order") ?? "";
    return /^[0-9a-f-]{36}$/i.test(order) ? `/api/download?order=${encodeURIComponent(order)}` : "";
  }, []);
  return (
    <SiteLayout>
      <section className="editorial-section min-h-[55vh]">
        <p className="eyebrow">NFLT RECORDS / TÉLÉCHARGEMENT</p>
        <h1>Votre musique est prête.</h1>
        <p className="body-copy mt-4">Le téléchargement est disponible après confirmation du paiement PayPal.</p>
        {downloadHref ? (
          <Button asChild className="editorial-action mt-8"><a href={downloadHref}>Télécharger mon fichier audio WAV</a></Button>
        ) : (
          <p role="alert" className="body-copy mt-4 text-destructive">Référence de commande invalide. Ouvrez le lien de confirmation reçu après votre paiement.</p>
        )}
      </section>
    </SiteLayout>
  );
}
