import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
export const Route = createFileRoute("/commande/confirmation")({
  validateSearch: (s: Record<string, unknown>) => ({
    order: typeof s["order"] === "string" ? s["order"] : "",
  }),
  component: Page,
});
type Download = { title: string; track: string; quantity: number; url: string };
function Page() {
  const { order } = Route.useSearch();
  const [status, setStatus] = useState("Vérification du paiement…");
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [paid, setPaid] = useState(false);
  useEffect(() => {
    let active = true,
      timer: ReturnType<typeof setTimeout>,
      attempts = 0;
    const check = async () => {
      try {
        const response = await fetch("/api/order-status?order=" + encodeURIComponent(order), {
          cache: "no-store",
        });
        const data = (await response.json()) as { paid?: boolean; downloads?: unknown };
        if (!active) return;
        if (data.paid) {
          setPaid(true);
          const available = Array.isArray(data.downloads) ? (data.downloads as Download[]) : [];
          setDownloads(available);
          setStatus(
            available.length
              ? "Paiement confirmé. Vos téléchargements sont disponibles."
              : "Paiement confirmé. Contactez NFLT RECORDS pour obtenir vos fichiers.",
          );
          return;
        }
        setStatus("En attente de la confirmation du paiement…");
      } catch {
        setStatus("Vérification en cours…");
      }
      if (active && attempts++ < 100) timer = setTimeout(check, 3000);
    };
    if (order) void check();
    else setStatus("Référence de commande manquante.");
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [order]);
  return (
    <SiteLayout>
      <section className="editorial-section min-h-[55vh]">
        <p className="eyebrow">NFLT RECORDS / COMMANDE</p>
        <h1>Confirmation de commande</h1>
        <p className="body-copy mt-4">{status}</p>
        {downloads.map((download) => (
          <div key={download.url} className="mt-4">
            <a
              className="editorial-action inline-flex items-center justify-center rounded-md px-6 py-3"
              href={download.url}
            >
              Télécharger {download.track} — {download.title}
              {download.quantity > 1 ? ` (×${download.quantity})` : ""}
            </a>
          </div>
        ))}
        {paid && downloads.length === 0 && <p className="body-copy mt-4">Référence : {order}</p>}
      </section>
    </SiteLayout>
  );
}
