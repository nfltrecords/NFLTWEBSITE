import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { submitContactMessage } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("contact"),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  message: z.string().trim().min(1, "Message requis").max(2000),
});

function Contact() {
  const submit = useServerFn(submitContactMessage);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const field = "w-full bg-card border px-4 py-3 focus:outline-none focus:border-primary";

  return (
    <SiteLayout>
      <PageHeader kicker="Parlons musique" title="Contact" />
      <section className="mx-auto max-w-2xl px-5 pb-20">
        {done ? (
          <p className="text-primary text-xl">
            Merci ! Votre message a bien été enregistré. Nous vous répondrons rapidement.
          </p>
        ) : (
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
              if (!r.success) return setError(r.error.issues[0]?.message ?? "Erreur");
              setError("");
              setSending(true);
              try {
                const res = await submit({ data: r.data });
                if (res.ok) setDone(true);
                else setError("Une erreur est survenue. Réessayez dans un instant.");
              } catch {
                setError("Une erreur est survenue. Réessayez dans un instant.");
              } finally {
                setSending(false);
              }
            }}
          >
            <input name="name" placeholder="Nom" className={field} />
            <input name="email" type="email" placeholder="Email" className={field} />
            <textarea
              name="message"
              rows={6}
              placeholder="Votre projet, lien vers votre démo…"
              className={field}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <button
              disabled={sending}
              className="bg-primary text-primary-foreground px-6 py-3 uppercase tracking-widest text-sm font-bold disabled:opacity-60"
            >
              {sending ? "Envoi…" : "Envoyer"}
            </button>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}
