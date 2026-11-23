import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/commande/paiement")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search.order === "string" && /^[0-9a-f-]{36}$/i.test(search.order) ? search.order : "",
    amount: typeof search.amount === "string" && /^\d{1,4}\.\d{2}$/.test(search.amount) ? search.amount : "",
    title: typeof search.title === "string" ? search.title.slice(0, 120) : "",
  }),
  component: PaymentInstructions,
});
function PaymentInstructions() {
  const { order, amount, title } = Route.useSearch();
  const paymentUrl = `https://www.paypal.me/mohamedjarry/${amount}EUR`;
  const note = `NFLT RECORDS — ${title} — Réf. ${order}`;
  return <SiteLayout><PageHeader kicker="NFLT RECORDS / PAIEMENT" title="Finaliser le paiement PayPal" /><section className="mx-auto max-w-2xl px-5 pb-20 space-y-6">
    {!order || !amount ? <p role="alert">Référence de commande invalide. Revenez à la boutique et recommencez.</p> : <>
      <p className="body-copy">Votre commande est enregistrée. Vous allez payer le montant exact sur PayPal.Me.</p>
      <div className="border p-5 space-y-3">
        <p className="font-semibold">{title || "Sortie NFLT RECORDS"}</p>
        <p className="text-3xl text-primary">{amount.replace(".", ",")} €</p>
        <p className="text-sm text-muted-foreground">Référence de commande à indiquer dans le motif PayPal :</p>
        <p className="break-all font-mono text-sm">{order}</p>
        <Button type="button" variant="outline" onClick={() => void navigator.clipboard?.writeText(note)}>Copier le motif de paiement</Button>
      </div>
      <p className="body-copy">Sur PayPal, vérifiez le bénéficiaire et le montant. Collez le motif ci-dessus dans le message au destinataire, puis validez le paiement. La livraison du WAV sera déclenchée automatiquement après vérification du paiement dans l’espace commandes NFLT RECORDS.</p>
      <Button asChild className="editorial-action"><a href={paymentUrl} target="_blank" rel="noreferrer">Ouvrir PayPal.Me — {amount.replace(".", ",")} €</a></Button>
    </>}
  </section></SiteLayout>;
}
