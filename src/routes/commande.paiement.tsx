import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";

export const Route = createFileRoute("/commande/paiement")({
  component: PaymentDisabled,
});

function PaymentDisabled() {
  return (
    <SiteLayout>
      <PageHeader kicker="NFLT RECORDS / PAIEMENT" title="Paiement indisponible" />
      <section className="mx-auto max-w-2xl px-5 pb-20">
        <p role="status">
          Le checkout PayPal est désactivé. Aucun paiement ni aucune commande ne peut être effectué depuis cette page.
        </p>
      </section>
    </SiteLayout>
  );
}
