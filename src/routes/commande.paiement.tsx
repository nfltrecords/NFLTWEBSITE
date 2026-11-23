import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/commande/paiement")({
  validateSearch: (search: Record<string, unknown>) => ({
    cancel: search.cancel === "1",
    order: typeof search.order === "string" && /^[0-9a-f-]{36}$/i.test(search.order) ? search.order : "",
    amount: typeof search.amount === "string" && /^\d{1,4}\.\d{2}$/.test(search.amount) ? search.amount : "",
    title: typeof search.title === "string" ? search.title.slice(0, 120) : "",
  }),
  component: PaymentInstructions,
});
function PaymentInstructions() {
  const { order, amount, title } = Route.useSearch();
  const note = `NFLT RECORDS — ${title} — Réf. ${order}`;
  return <SiteLayout><PageHeader kicker="NFLT RECORDS / PAIEMENT" title="Finaliser le paiement PayPal" /><section className="mx-auto max-w-2xl px-5 pb-20 space-y-6">
    {!order || !amount ? <p role="alert">Référence de commande invalide. Revenez à la boutique et recommencez.</p> : <>
      <p className="body-copy">Votre commande est enregistrée. Le paiement sécurisé PayPal confirme automatiquement la transaction au site.</p>
      <div className="border p-5 space-y-3">
        <p className="font-semibold">{title || "Sortie NFLT RECORDS"}</p>
        <p className="text-3xl text-primary">{amount.replace(".", ",")} €</p>
        <p className="text-sm text-muted-foreground">Référence de commande à indiquer dans le motif PayPal :</p>
        <p className="break-all font-mono text-sm">{order}</p>
        <Button type="button" variant="outline" onClick={() => void navigator.clipboard?.writeText(note)}>Copier le motif de paiement</Button>
      </div>
      <p className="body-copy">PayPal envoie au site une notification sécurisée. Après confirmation du paiement intégral, le master WAV est envoyé automatiquement à l’adresse e-mail fournie.</p>
      <form method="get" action="https://www.paypal.com/cgi-bin/webscr">
        <input type="hidden" name="cmd" value="_xclick" />
        <input type="hidden" name="business" value="Encoresarbakane@gmail.com" />
        <input type="hidden" name="item_name" value={`NFLT RECORDS — ${title}`} />
        <input type="hidden" name="amount" value={amount} />
        <input type="hidden" name="currency_code" value="EUR" />
        <input type="hidden" name="custom" value={order} />
        <input type="hidden" name="invoice" value={order} />
        <input type="hidden" name="notify_url" value="https://nflt-records.com/api/paypal/ipn" />
        <input type="hidden" name="return" value={`https://nflt-records.com/commande/confirmation?order=${order}`} />
        <input type="hidden" name="cancel_return" value={`https://nflt-records.com/commande/paiement?order=${order}&amount=${amount}&title=${encodeURIComponent(title)}&cancel=1`} />
        <input type="hidden" name="no_shipping" value="1" />
        <Button type="submit" className="editorial-action">Payer {amount.replace(".", ",")} € avec PayPal</Button>
      </form>
    </>}
  </section></SiteLayout>;
}
