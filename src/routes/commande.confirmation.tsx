import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { confirmPayPalCheckout } from "@/lib/paypal.functions";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

type Confirmation = { ok: boolean; downloadUrl?: string; reason?: string };
export const Route = createFileRoute("/commande/confirmation")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search.order === "string" ? search.order : "",
    token: typeof search.token === "string" ? search.token : "",
  }),
  component: ConfirmationPage,
});
function ConfirmationPage() {
  const { order, token } = Route.useSearch();
  const confirm = useServerFn(confirmPayPalCheckout);
  const [state, setState] = useState<"loading" | "ready" | "waiting" | "error">("loading");
  const [downloadUrl, setDownloadUrl] = useState("");
  useEffect(() => {
    let active = true;
    if (!order) { setState("error"); return; }
    if (!token) { setState("waiting"); return; }
    confirm({ data: { orderId: order, paypalOrderId: token } })
      .then((result: Confirmation) => {
        if (!active) return;
        if (result.ok && result.downloadUrl) {
          setDownloadUrl(result.downloadUrl);
          setState("ready");
        } else {
          setState("error");
        }
      })
      .catch(() => { if (active) setState("error"); });
    return () => { active = false; };
  }, [confirm, order, token]);
  return (
    <SiteLayout>
      <section className="editorial-section min-h-[55vh]">
        <p className="eyebrow">NFLT RECORDS / COMMANDE</p>
        {state === "loading" ? (
          <>
            <h1>Confirmation du paiement…</h1>
            <p className="body-copy mt-4">Nous vérifions votre paiement PayPal et préparons votre téléchargement.</p>
          </>
        ) : state === "ready" ? (
          <>
            <h1>Paiement confirmé.</h1>
            <p className="body-copy mt-4">Votre fichier audio est prêt. Utilisez le bouton ci-dessous pour le télécharger.</p>
            <Button asChild className="editorial-action mt-8">
              <a href={downloadUrl}>Télécharger mon fichier audio</a>
            </Button>
          </>
        ) : state === "waiting" ? (
          <>
            <h1>Paiement en cours de confirmation.</h1>
            <p className="body-copy mt-4">PayPal nous transmet la confirmation sécurisée. Dès que le paiement est confirmé, le lien de téléchargement WAV est envoyé automatiquement à l’adresse e-mail indiquée lors de la commande. Ne payez pas une seconde fois.</p>
          </>
        ) : (
          <>
            <h1>Confirmation en attente.</h1>
            <p className="body-copy mt-4">Nous n'avons pas pu confirmer le paiement ou préparer le fichier. Ne procédez pas à un nouveau paiement. Contactez NFLT RECORDS avec votre référence PayPal.</p>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
