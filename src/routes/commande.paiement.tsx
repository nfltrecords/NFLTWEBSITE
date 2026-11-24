import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
export const Route = createFileRoute("/commande/paiement")({ component: Page });
function Page() {
  return (
    <SiteLayout>
      <PageHeader kicker="NFLT RECORDS / PAIEMENT" title="Paiement PayPal" />
      <section className="editorial-section">
        <p className="body-copy">
          Le paiement a été annulé ou n'a pas été finalisé. Votre commande n'a pas été débitée par
          cette page.
        </p>
      </section>
    </SiteLayout>
  );
}
