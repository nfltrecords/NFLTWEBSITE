import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, AudioLines, ShoppingBag } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "NFLT RECORDS — Administration" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <PageHeader kicker="NFLT RECORDS / ADMIN" title="Tableau de bord" />
      <section className="editorial-section pt-0">
        <p className="body-copy mb-10">
          Accès aux outils de gestion du catalogue audio et des commandes. Chaque espace demande
          le code administrateur avant d’afficher ou de modifier les données.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            to="/admin/audio"
            className="group flex min-h-48 flex-col justify-between border border-border p-6 transition-colors hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <AudioLines size={26} aria-hidden="true" />
              <ArrowUpRight className="transition-transform group-hover:translate-x-1" />
            </div>
            <div>
              <h2 className="text-2xl">Masters WAV</h2>
              <p className="body-copy mt-2">
                Inventaire, contrôle d’intégrité et transfert multiple des masters du catalogue.
              </p>
            </div>
          </Link>
          <Link
            to="/admin/orders"
            className="group flex min-h-48 flex-col justify-between border border-border p-6 transition-colors hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <ShoppingBag size={26} aria-hidden="true" />
              <ArrowUpRight className="transition-transform group-hover:translate-x-1" />
            </div>
            <div>
              <h2 className="text-2xl">Commandes & e-mails</h2>
              <p className="body-copy mt-2">
                Suivi des paiements confirmés, des livraisons e-mail et des tentatives d’envoi.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
