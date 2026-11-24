import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

type Confirmation = { ok: boolean; downloadUrl?: string; paid?: boolean };
export const Route = createFileRoute("/commande/confirmation")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search.order === "string" ? search.order : "",
  }),
  component: ConfirmationPage,
});
function ConfirmationPage() {
  const { order } = Route.useSearch();
  const [state, setState] = useState<"loading" | "ready" | "waiting" | "error">("loading");
  const [downloadUrl, setDownloadUrl] = useState("");
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    if (!/^[0-9a-f-]{36}$/i.test(order)) {
      setState("error");
      return;
    }
    const check = async () => {
      try {
        const response = await fetch(`/api/order-status?order=${encodeURIComponent(order)}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Status unavailable");
        const result = (await response.json()) as Confirmation;
        if (!active) return;
        if (result.ok && result.downloadUrl) {
          setDownloadUrl(result.downloadUrl);
          setState("ready");
          return;
        }
        setState("waiting");
      } catch {
        if (active) setState("waiting");
      }
      attempts++;
      if (active && attempts < 40) timer = setTimeout(check, 3000);
    };
    void check();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [order]);
  return (
    <SiteLayout>
      <section className="editorial-section min-h-[55vh]">
        <p className="eyebrow">NFLT RECORDS / COMMANDE</p>
        {state === "loading" ? (
          <>
            <h1>Confirmation du paiement…</h1>
            <p className="body-copy mt-4">Nous vérifions votre paiement PayPal.</p>
          </>
        ) : state === "ready" ? (
          <>
            <h1>Paiement confirmé.</h1>
            <p className="body-copy mt-4">
              Votre fichier audio est prêt. Utilisez le bouton ci-dessous pour le télécharger.
            </p>
            <Button asChild className="editorial-action mt-8">
              <a href={downloadUrl}>Télécharger mon fichier audio</a>
            </Button>
          </>
        ) : state === "waiting" ? (
          <>
            <h1>Paiement en cours de confirmation.</h1>
            <p className="body-copy mt-4">
              PayPal doit encore transmettre sa confirmation sécurisée. Cette page vérifie
              automatiquement le statut. Ne payez pas une seconde fois. Si la confirmation n’arrive
              pas, revenez consulter cette page dans quelques minutes.
            </p>
          </>
        ) : (
          <>
            <h1>Confirmation en attente.</h1>
            <p className="body-copy mt-4">
              Nous ne pouvons pas vérifier cette référence de commande. Ne procédez pas à un nouveau
              paiement. Contactez NFLT RECORDS avec votre référence PayPal.
            </p>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
