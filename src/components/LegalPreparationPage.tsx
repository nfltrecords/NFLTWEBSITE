import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { type LegalPage, type Locale } from "@/lib/seo";
import { lazy, Suspense } from "react";

// Vite eliminates this DEV-only branch and import from production bundles.
// noindex is not privacy: full drafts are authorized for this preview only.
const DraftPreview = import.meta.env.DEV
  ? lazy(() => import("@/components/LegalDraftPreview"))
  : undefined;
export function LegalPreparationPage({ page, locale }: { page: LegalPage; locale: Locale }) {
  const fr = locale === "fr";
  const title =
    page === "terms"
      ? fr
        ? "Conditions générales\nde vente"
        : "Terms of Sale"
      : fr
        ? "Politique de\nconfidentialité"
        : "Privacy Policy";
  return (
    <SiteLayout>
      <PageHeader kicker="NFLT RECORDS" title={title} />
      <section className="editorial-section pt-0">
        {DraftPreview ? (
          <Suspense fallback={<p className="body-copy">{fr ? "Chargement…" : "Loading…"}</p>}>
            <DraftPreview page={page} locale={locale} />
          </Suspense>
        ) : (
          <div className="max-w-3xl space-y-6">
            <h2 className="text-3xl">
              {fr ? "Document en préparation" : "Document in preparation"}
            </h2>
            <p className="body-copy">
              {fr ? "Version de travail non publiée." : "Unpublished working version."}
            </p>
            {page === "terms" && (
              <p className="body-copy">
                {fr
                  ? "La boutique présente le catalogue NFLT et permet d’adresser une demande de disponibilité ou de licence. Aucune commande ni aucun paiement ne peut être effectué sur le site."
                  : "The shop presents the NFLT catalogue and allows availability or licensing inquiries. No order or payment can be made on the site."}
              </p>
            )}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
