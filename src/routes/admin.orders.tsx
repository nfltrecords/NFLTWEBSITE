import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

type AdminOrder = {
  id: string;
  buyer_email: string;
  amount_cents: number;
  currency: string;
  status: "pending" | "paid" | "cancelled" | "refunded";
  paypal_transaction_id: string | null;
  created_at: string;
  paid_at: string | null;
  items: { upc: string; quantity: number; title: string }[];
};

type OrdersResponse = { ok: boolean; orders?: AdminOrder[]; error?: string };

const statusLabels: Record<AdminOrder["status"], string> = {
  pending: "En attente",
  paid: "Payée",
  cancelled: "Annulée",
  refunded: "Remboursée",
};

export const Route = createFileRoute("/admin/orders")({
  component: Page,
  head: () => ({
    meta: [
      { title: "NFLT RECORDS — Gestion des commandes" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function Page() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("all");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadOrders() {
    if (!code || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const query = status === "all" ? "" : `?status=${encodeURIComponent(status)}`;
      const response = await fetch(`/api/admin/orders${query}`, {
        headers: { "x-nflt-admin-code": code },
      });
      const data = (await response.json()) as OrdersResponse;
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Accès refusé");
      setOrders(data.orders ?? []);
      setMessage(`${data.orders?.length ?? 0} commande(s) chargée(s)`);
    } catch (error) {
      setOrders([]);
      setMessage(error instanceof Error ? error.message : "Erreur de chargement");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout>
      <section className="editorial-section min-h-[60vh]">
        <p className="eyebrow">NFLT RECORDS / ADMIN</p>
        <h1>Gestion des commandes</h1>
        <p className="body-copy mt-3">
          Consultation sécurisée des commandes PayPal et de leur statut. Les statuts payés sont
          déterminés par la notification PayPal IPN vérifiée ; cette page ne permet pas de marquer
          manuellement une commande comme payée.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
          <label className="grid gap-2">
            Code administrateur
            <input
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              autoComplete="current-password"
              className="rounded border p-3"
            />
          </label>
          <label className="grid gap-2">
            Statut
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded border p-3"
            >
              <option value="all">Toutes</option>
              <option value="pending">En attente</option>
              <option value="paid">Payées</option>
              <option value="refunded">Remboursées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </label>
          <Button className="editorial-action" disabled={!code || busy} onClick={loadOrders}>
            {busy ? "Chargement…" : "Charger les commandes"}
          </Button>
        </div>
        <p role="status" className="body-copy mt-3">
          {message}
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3">Date</th>
                <th className="p-3">Client</th>
                <th className="p-3">Commande</th>
                <th className="p-3">Montant</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Transaction PayPal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b align-top">
                  <td className="p-3 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="p-3">{order.buyer_email}</td>
                  <td className="p-3">
                    <div className="font-medium">
                      {order.items.map((item) => item.title).join(", ")}
                    </div>
                    <div className="text-xs opacity-70">
                      {order.items.map((item) => `${item.quantity} × ${item.upc}`).join(" · ")}
                    </div>
                    <div className="mt-1 text-xs opacity-70">ID : {order.id}</div>
                    {order.status === "paid" && (
                      <a
                        className="mt-2 inline-block underline"
                        href={`/commande/confirmation?order=${encodeURIComponent(order.id)}`}
                      >
                        Voir la confirmation
                      </a>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: order.currency,
                    }).format(order.amount_cents / 100)}
                  </td>
                  <td className="p-3">{statusLabels[order.status]}</td>
                  <td className="p-3 text-xs">{order.paypal_transaction_id ?? "—"}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td className="p-3 opacity-70" colSpan={6}>
                    Aucune commande chargée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="body-copy mt-6">
          <a className="underline" href="/admin/audio">
            Transférer des masters WAV
          </a>
        </p>
      </section>
    </SiteLayout>
  );
}
