import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { listContactMessages } from "@/lib/contact.functions";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Espace NFLT — Messages reçus" },
      { name: "description", content: "Espace privé NFLT Records : messages reçus via le formulaire de contact." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MessagesPage,
});

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

function MessagesPage() {
  const list = useServerFn(listContactMessages);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);

  const load = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await list({ data: { code } });
      if (res.ok) setMessages(res.messages);
      else setError("Code incorrect.");
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <PageHeader kicker="Espace privé" title="Messages reçus" />
      <section className="mx-auto max-w-2xl px-5 pb-20">
        {messages === null ? (
          <form onSubmit={load} className="space-y-4">
            <p className="text-muted-foreground">Entrez votre code pour consulter les messages du formulaire de contact.</p>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Votre code"
              className="w-full bg-card border px-4 py-3 focus:outline-none focus:border-primary"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <button
              disabled={loading}
              className="bg-primary text-primary-foreground px-6 py-3 uppercase tracking-widest text-sm font-bold disabled:opacity-60"
            >
              {loading ? "Chargement…" : "Voir les messages"}
            </button>
          </form>
        ) : messages.length === 0 ? (
          <p className="text-muted-foreground">Aucun message pour le moment.</p>
        ) : (
          <ul className="space-y-6">
            {messages.map((m) => (
              <li key={m.id} className="bg-card border p-5 space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-bold">{m.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(m.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <a href={`mailto:${m.email}`} className="text-primary text-sm underline">
                  {m.email}
                </a>
                <p className="whitespace-pre-wrap">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteLayout>
  );
}
