import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { approveManualPayPalOrder, listManualPayPalOrders } from "@/lib/manual-orders.functions";
import { Button } from "@/components/ui/button";

type Order = { id: string; title: string; buyer_email: string; amount_cents: number; status: string; created_at: string };
export const Route = createFileRoute("/espace-commandes")({
  head: () => ({ meta: [{ title: "Espace commandes — NFLT RECORDS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: OrdersPage,
});
function OrdersPage() {
  const list = useServerFn(listManualPayPalOrders);
  const approve = useServerFn(approveManualPayPalOrder);
  const [code, setCode] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState("");
  async function refresh() {
    setLoading(true); setMessage(""); setDownload("");
    try {
      const result = await list({ data: { code } });
      if (result.ok) setOrders(result.orders);
      else setMessage("Code administrateur incorrect.");
    } catch { setMessage("Base de commandes inaccessible. Vérifiez la configuration serveur."); }
    finally { setLoading(false); }
  }
  async function validate(orderId: string) {
    setLoading(true); setMessage(""); setDownload("");
    try {
      const result = await approve({ data: { code, orderId } });
      if (result.ok) { setDownload(result.downloadUrl); setMessage("Livraison WAV automatique confirmée par e-mail."); setOrders((current) => current.filter((order) => order.id !== orderId)); }
      else setMessage("Commande non validable. Vérifiez son état.");
    } catch { setMessage("Validation enregistrée ou livraison impossible. Vérifiez la configuration R2, Supabase et Resend avant de réessayer."); }
    finally { setLoading(false); }
  }
  return <SiteLayout><PageHeader kicker="NFLT RECORDS / ADMINISTRATION" title="Commandes PayPal" /><section className="mx-auto max-w-3xl px-5 pb-20 space-y-6">
    <p className="body-copy">Vérifiez le paiement reçu dans PayPal avant de valider une commande. La validation déclenche l’envoi automatique du lien de téléchargement WAV.</p>
    <form className="flex flex-wrap gap-3" onSubmit={(e) => { e.preventDefault(); void refresh(); }}>
      <input type="password" autoComplete="current-password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code administrateur" className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2" />
      <Button type="submit" disabled={loading || !code}>Afficher les commandes</Button>
    </form>
    {message ? <p role="status" className="text-sm">{message}</p> : null}
    {download ? <p className="break-all text-sm"><a className="underline text-primary" href={download}>Lien sécurisé de téléchargement (secours)</a></p> : null}
    <ul className="space-y-4">{orders.map((order) => <li key={order.id} className="border p-4 space-y-2">
      <p className="font-semibold">{order.title}</p>
      <p>{(order.amount_cents / 100).toFixed(2).replace(".", ",")} € · {order.buyer_email}</p>
      <p className="text-xs text-muted-foreground">Référence {order.id} · {new Date(order.created_at).toLocaleString("fr-FR")}</p>
      <Button disabled={loading} onClick={() => void validate(order.id)}>{order.status === "paid" ? "Renvoyer le lien WAV" : "Paiement vérifié — envoyer le WAV"}</Button>
    </li>)}</ul>
    {orders.length === 0 && code ? <p className="text-sm text-muted-foreground">Aucune commande en attente affichée.</p> : null}
  </section></SiteLayout>;
}
