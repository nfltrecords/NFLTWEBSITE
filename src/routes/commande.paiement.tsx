import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/commande/paiement")({
  validateSearch: (search: Record<string, unknown>) => ({
    order:
      typeof search.order === "string" && /^[0-9a-f-]{36}$/i.test(search.order) ? search.order : "",
    amount:
      typeof search.amount === "string" && /^\d{1,4}\.\d{2}$/.test(search.amount)
        ? search.amount
        : "",
    title: typeof search.title === "string" ? search.title.slice(0, 120) : "",
    cancel: search.cancel === "1",
  }),
  component: PaymentInstructions,
});
function PaymentInstructions() {
  const { order, amount, title } = Route.useSearch();
  const paymentUrl = `https://www.paypal.me/mohamedjarry/${amount}EUR`;
  const note = `NFLT:${order}`;
  return (
    <SiteLayout>
      <PageHeader kicker="NFLT RECORDS / PAIEMENT" title="Payer avec PayPal" />
      <section className="mx-auto max-w-2xl px-5 pb-20 space-y-6">
        {!order || !amount ? (
          <p role="alert">Référence de commande invalide. Revenez à la boutique et recommencez.</p>
        ) : (
          <>
            <p className="body-copy">
              Votre commande est enregistrée. Le paiement utilise ton compte PayPal personnel.
            </p>
            <div className="border p-5 space-y-3">
              <p className="font-semibold">{title || "Sortie NFLT RECORDS"}</p>
              <p className="text-3xl text-primary">{amount.replace(".", ",")} €</p>
              <p className="text-sm text-muted-foreground">
                IMPORTANT : dans PayPal.Me, ajoutez exactement cette référence dans le champ «
                Ajouter une note » :
              </p>
              <p className="break-all font-mono text-lg font-semibold">{note}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void navigator.clipboard?.writeText(note)}
              >
                Copier la référence
              </Button>
            </div>
            <p className="body-copy">
              La référence dans la note permet au système de retrouver automatiquement votre
              commande. Après réception de la notification PayPal vérifiée et confirmation du
              montant exact, le fichier WAV sera envoyé à l’adresse e-mail saisie lors de la
              commande. N'envoyez pas le paiement sans cette référence.
            </p>
            <Button asChild className="editorial-action">
              <a href={paymentUrl} target="_blank" rel="noreferrer">
                Ouvrir PayPal.Me — {amount.replace(".", ",")} €
              </a>
            </Button>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
