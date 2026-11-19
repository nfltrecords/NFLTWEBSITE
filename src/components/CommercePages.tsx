/* eslint-disable prettier/prettier -- JSX cart layout is intentionally kept compact. */
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowUpRight, Check, Search, Send, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { releases, filterReleases } from "@/lib/catalogue";
import { releaseCovers } from "@/lib/covers";
import { publicPages, type Locale } from "@/lib/seo";
import { inquirySchema, shopPriceTiers, formatShopPrice, releasePriceCents, type Inquiry } from "@/lib/commerce";
import { submitLicensingInquiry } from "@/lib/commerce.functions";
import { ReleasePrice } from "@/components/ReleasePrice";

const text = (locale: Locale, fr: string, en: string) => (locale === "fr" ? fr : en);

export function ShopPage({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const items = filterReleases("all", query);
  const cartItems = releases.filter((release) => (cart[release.upc] ?? 0) > 0);
  const cartCount = cartItems.reduce((total, release) => total + cart[release.upc], 0);
  const cartTotalCents = cartItems.reduce((total, release) => total + (releasePriceCents(release.upc) ?? 0) * cart[release.upc], 0);
  const addToCart = (upc: string) => setCart((previous) => ({ ...previous, [upc]: Math.min((previous[upc] ?? 0) + 1, 20) }));
  const changeCartQuantity = (upc: string, delta: number) => setCart((previous) => {
    const next = { ...previous };
    const quantity = (next[upc] ?? 0) + delta;
    if (quantity <= 0) delete next[upc];
    else next[upc] = Math.min(quantity, 20);
    return next;
  });
  return (
    <SiteLayout>
      <div className="commerce-theme">
        <PageHeader kicker="NFLT RECORDS / MUSIC" title={text(locale, "Boutique", "Shop")} />
        <section className="editorial-section pt-0">
          <div className="commerce-intro">
            <p className="body-copy">
              {text(
                locale,
                "Parcourez les 18 sorties du catalogue NFLT et ajoutez vos sélections au panier. Les prix affichés sont indicatifs ; le paiement en ligne sera ouvert après validation des ventes et des livraisons.",
                "Browse all 18 NFLT catalogue releases and add your selections to the cart. Displayed prices are indicative; online checkout will open after sales and delivery validation.",
              )}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" className="editorial-action">
                <Link to={publicPages.catalogue[locale]}>
                  {text(locale, "Catalogue NFLT", "NFLT catalogue")}
                  <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild variant="outline" className="editorial-action">
                <Link
                  to={publicPages.licensing[locale]}
                  search={{ intent: "licensing", release: undefined }}
                >
                  {text(locale, "Licences musicales", "Music licensing")}
                  <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </div>
          <section aria-labelledby="shop-cart-title" className="mb-10 border-y border-border py-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="shop-cart-title" className="flex items-center gap-3 text-2xl">
                <ShoppingBag aria-hidden="true" />
                {text(locale, "Votre panier", "Your cart")}
                <span className="text-base text-muted-foreground">({cartCount})</span>
              </h2>
              {cartCount > 0 && <Button type="button" variant="ghost" onClick={() => setCart({})}><Trash2 size={16} />{text(locale, "Vider le panier", "Clear cart")}</Button>}
            </div>
            {cartItems.length === 0 ? (
              <p className="body-copy mt-3">{text(locale, "Votre panier est vide. Ajoutez les sorties qui vous intéressent.", "Your cart is empty. Add the releases you are interested in.")}</p>
            ) : (
              <>
                <ul className="mt-5 divide-y divide-border">
                  {cartItems.map((release) => {
                    const unitPrice = releasePriceCents(release.upc) ?? 0;
                    const quantity = cart[release.upc];
                    return (
                      <li key={release.upc} className="flex flex-wrap items-center justify-between gap-4 py-4">
                        <div className="min-w-0 flex-1"><p className="font-medium">{release.title}</p><p className="text-sm text-muted-foreground">{formatShopPrice(unitPrice)} {text(locale, "l’unité", "each")}</p></div>
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" size="icon" aria-label={text(locale, "Retirer une unité", "Remove one")} onClick={() => changeCartQuantity(release.upc, -1)}><Minus size={15} /></Button>
                          <span className="min-w-6 text-center tabular-nums" aria-live="polite">{quantity}</span>
                          <Button type="button" variant="outline" size="icon" aria-label={text(locale, "Ajouter une unité", "Add one")} onClick={() => changeCartQuantity(release.upc, 1)} disabled={quantity >= 20}><Plus size={15} /></Button>
                          <strong className="min-w-24 text-right tabular-nums">{formatShopPrice(unitPrice * quantity)}</strong>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                  <div><p className="text-sm text-muted-foreground">{text(locale, "Total indicatif", "Indicative total")}</p><p className="text-3xl text-primary tabular-nums">{formatShopPrice(cartTotalCents)}</p></div>
                  <Button type="button" className="editorial-action" disabled>
                    {text(locale, "Paiement bientôt disponible", "Checkout coming soon")}
                  </Button>
                </div>
                <p className="body-copy mt-4 text-sm">
                  {text(
                    locale,
                    "Le paiement en ligne est temporairement désactivé. Le panier sert uniquement à préparer votre sélection ; aucune commande ni aucun paiement ne sont acceptés pour le moment. Les prix, droits, vendeur, livraison et conditions doivent être validés avant l’ouverture des ventes.",
                    "Online checkout is temporarily disabled. The cart is only for preparing your selection; orders and payments are not accepted at this time. Prices, rights, seller, delivery and terms must be validated before sales open.",
                  )}
                </p>
              </>
            )}
          </section>
          <section
            aria-labelledby="shop-pricing-title"
            className="mb-12 border-y border-border py-8"
          >
            <h2 id="shop-pricing-title" className="mb-6 text-3xl">
              {text(locale, "Tarifs de référence", "Reference price tiers")}
            </h2>
            <dl className="grid gap-8 sm:grid-cols-3">
              {shopPriceTiers.map((tier) => (
                <div key={tier.tracks} className="min-w-0">
                  <dt className="mb-3 text-sm text-muted-foreground">{tier.label[locale]}</dt>
                  <dd className="text-3xl text-primary">
                    {locale === "fr"
                      ? formatShopPrice(tier.cents)
                      : `€${(tier.cents / 100).toFixed(2)}`}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="body-copy mt-6">
              {text(
                locale,
                "Tarifs indicatifs, calculés à partir de nombres de pistes qui restent à confirmer pour chaque sortie. Le panier permet de préparer une sélection, mais aucune commande ni aucun paiement n’est encore accepté. Les CD physiques, stocks et livraisons ne sont pas encore configurés.",
                "Indicative prices based on track counts that still require confirmation for each release. The cart lets you prepare a selection, but orders and payments are not yet accepted. Physical CDs, inventory and shipping are not configured.",
              )}
            </p>
          </section>
          <label className="search-field commerce-search">
            <Search size={18} />
            <input
              aria-label={text(locale, "Rechercher une sortie", "Search releases")}
              placeholder={text(locale, "Rechercher une sortie", "Search releases")}
              value={query}
              maxLength={150}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span>{items.length} / 18</span>
          </label>
          <div className="shop-grid">
            {items.map((release) => (
              <article key={release.upc} className="shop-release">
                <Link
                  to={locale === "fr" ? "/catalogue/$upc" : "/en/catalogue/$upc"}
                  params={{ upc: release.upc }}
                  className="shop-cover-link"
                >
                  <img
                    src={releaseCovers[release.upc]}
                    alt={text(locale, `Pochette — ${release.title}`, `Cover — ${release.title}`)}
                    width={500}
                    height={500}
                    loading="lazy"
                  />
                </Link>
                <div className="shop-caption">
                  <span className="eyebrow">NFLT / NFLT RECORDS</span>
                  <h2>{release.title}</h2>
                  <ReleasePrice upc={release.upc} />
                  <p>UPC {release.upc}</p>
                </div>
                <Button type="button" className="editorial-action w-full" onClick={() => addToCart(release.upc)} disabled={(cart[release.upc] ?? 0) >= 20 || releasePriceCents(release.upc) === null}>
                  <ShoppingBag size={16} />{text(locale, "Ajouter au panier", "Add to cart")}{(cart[release.upc] ?? 0) > 0 ? ` · ${cart[release.upc]}` : ""}
                </Button>
                <Button asChild variant="outline" className="editorial-action shop-availability">
                  <Link
                    to={publicPages.licensing[locale]}
                    search={{ release: release.upc, intent: "availability" }}
                  >
                    {text(locale, "Demande de disponibilité", "Contact for availability")}
                    <ArrowUpRight />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
          {items.length === 0 && (
            <p className="body-copy py-12">
              {text(locale, "Aucune sortie correspondante.", "No matching releases.")}
            </p>
          )}
        </section>
      </div>
    </SiteLayout>
  );
}

export function LicensingPage({
  locale,
  release,
  intent,
}: {
  locale: Locale;
  release?: string | undefined;
  intent?: "availability" | "licensing" | undefined;
}) {
  return (
    <SiteLayout>
      <div className="commerce-theme">
        <PageHeader
          kicker="NFLT RECORDS / SYNC"
          title={text(locale, "Licences\nmusicales", "Music\nlicensing")}
        />
        <section className="editorial-section pt-0">
          <div className="commerce-intro">
            <p className="body-copy">
              {text(
                locale,
                "La musique de NFLT pour votre projet. Adressez au label votre demande de licence et présentez l’utilisation envisagée.",
                "The music of NFLT for your project. Send the label your licensing inquiry and tell us about the intended use.",
              )}
            </p>
            <Button asChild variant="outline" className="editorial-action">
              <Link to={publicPages.shop[locale]}>
                {text(locale, "Explorer la boutique", "Explore the shop")}
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <div className="licensing-uses">
            {(locale === "fr"
              ? ["Audiovisuel", "Publicité", "Cinéma", "Créateurs", "Jeux vidéo"]
              : ["Audiovisual", "Advertising", "Film", "Creators", "Games"]
            ).map((use, i) => (
              <div key={use}>
                <span>0{i + 1}</span>
                <h2>{use}</h2>
              </div>
            ))}
          </div>
          <div className="licensing-layout">
            <div>
              <p className="eyebrow">NFLT RECORDS</p>
              <h2>{text(locale, "Votre projet.\nNotre musique.", "Your project.\nOur music.")}</h2>
              <p className="body-copy mt-6">
                {text(
                  locale,
                  "Un titre, une idée, un contexte. Parlons-en.",
                  "A track, an idea, a context. Let’s talk.",
                )}
              </p>
            </div>
            <InquiryForm
              key={`${locale}-${release}-${intent}`}
              locale={locale}
              release={release}
              intent={intent}
            />
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

function InquiryForm({
  locale,
  release,
  intent,
}: {
  locale: Locale;
  release?: string | undefined;
  intent?: "availability" | "licensing" | undefined;
}) {
  const submit = useServerFn(submitLicensingInquiry);
  const [values, setValues] = useState<Inquiry>({
    name: "",
    email: "",
    organization: "",
    inquiry_type: intent ?? "licensing",
    release_upc: release ?? "",
    usage: "audiovisual",
    territory: "",
    duration: "",
    message: "",
    locale,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const update = (key: keyof Inquiry, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
  };
  const input = (
    key: "name" | "email" | "organization" | "territory" | "duration",
    label: string,
    max: number,
    required = false,
  ) => (
    <label className="inquiry-field">
      {label}
      <input
        name={key}
        type={key === "email" ? "email" : "text"}
        autoComplete={
          key === "name"
            ? "name"
            : key === "email"
              ? "email"
              : key === "organization"
                ? "organization"
                : "off"
        }
        maxLength={max}
        required={required}
        value={values[key]}
        onChange={(e) => update(key, e.target.value)}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `error-${key}` : undefined}
      />
      {errors[key] && (
        <span id={`error-${key}`} className="text-destructive">
          {errors[key]}
        </span>
      )}
    </label>
  );
  if (state === "success")
    return (
      <div className="inquiry-success" role="status">
        <Check className="text-primary" />
        <h3>{text(locale, "Demande reçue", "Inquiry received")}</h3>
        <p className="body-copy">
          {text(
            locale,
            "Merci d’avoir contacté NFLT RECORDS au sujet de votre projet.",
            "Thank you for contacting NFLT RECORDS about your project.",
          )}
        </p>
        <Button
          variant="outline"
          className="editorial-action"
          onClick={() => {
            setState("idle");
            setValues({ ...values, message: "" });
          }}
        >
          {text(locale, "Nouvelle demande", "New inquiry")}
          <ArrowUpRight />
        </Button>
      </div>
    );
  return (
    <form
      className="inquiry-form"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        if (state === "sending") return;
        const parsed = inquirySchema.safeParse(values);
        if (!parsed.success) {
          setErrors(
            Object.fromEntries(
              parsed.error.issues.map((issue) => [
                issue.path[0],
                text(locale, "Veuillez vérifier ce champ.", "Please check this field."),
              ]),
            ),
          );
          return;
        }
        setState("sending");
        try {
          const result = await submit({ data: parsed.data });
          setState(result.ok ? "success" : "error");
        } catch {
          setState("error");
        }
      }}
    >
      <h3>{text(locale, "Votre demande", "Your inquiry")}</h3>
      <label className="inquiry-field">
        {text(locale, "Objet", "Inquiry type")}
        <select
          value={values.inquiry_type}
          onChange={(e) => update("inquiry_type", e.target.value)}
        >
          <option value="licensing">{text(locale, "Licence musicale", "Music licensing")}</option>
          <option value="availability">
            {text(locale, "Disponibilité d’un titre", "Release availability")}
          </option>
        </select>
      </label>
      <div className="inquiry-pair">
        {input("name", text(locale, "Nom *", "Name *"), 100, true)}
        {input("email", "Email *", 255, true)}
      </div>
      {input("organization", text(locale, "Société / projet", "Company / project"), 150)}
      <label className="inquiry-field">
        {text(locale, "Titre", "Release")}
        <select
          name="release_upc"
          value={values.release_upc}
          onChange={(e) => update("release_upc", e.target.value)}
        >
          <option value="">
            {text(locale, "Catalogue / plusieurs titres", "Catalogue / multiple releases")}
          </option>
          {releases.map((r) => (
            <option key={r.upc} value={r.upc}>
              {r.title} — UPC {r.upc}
            </option>
          ))}
        </select>
      </label>
      {values.inquiry_type === "licensing" && (
        <>
          <label className="inquiry-field">
            {text(locale, "Utilisation envisagée", "Intended use")}
            <select value={values.usage} onChange={(e) => update("usage", e.target.value)}>
              {(
                [
                  ["audiovisual", "Audiovisuel", "Audiovisual"],
                  ["advertising", "Publicité", "Advertising"],
                  ["film", "Cinéma", "Film"],
                  ["creator", "Créateur", "Creator"],
                  ["game", "Jeu vidéo", "Game"],
                  ["other", "Autre", "Other"],
                ] as const
              ).map(([value, fr, en]) => (
                <option value={value} key={value}>
                  {text(locale, fr, en)}
                </option>
              ))}
            </select>
          </label>
          <div className="inquiry-pair">
            {input("territory", text(locale, "Territoire envisagé", "Intended territory"), 150)}
            {input("duration", text(locale, "Durée d’utilisation", "Usage duration"), 150)}
          </div>
        </>
      )}
      <label className="inquiry-field">
        {text(locale, "Message *", "Message *")}
        <textarea
          name="message"
          rows={5}
          maxLength={3000}
          required
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={Boolean(errors["message"])}
          aria-describedby={errors["message"] ? "error-message" : undefined}
        />
        {errors["message"] && (
          <span className="text-destructive" id="error-message">
            {errors["message"]}
          </span>
        )}
      </label>
      {state === "error" && (
        <p role="alert" className="text-destructive">
          {text(
            locale,
            "Votre demande n’a pas été enregistrée. Veuillez réessayer.",
            "Your inquiry could not be saved. Please try again.",
          )}
        </p>
      )}
      <Button type="submit" className="editorial-action" disabled={state === "sending"}>
        {state === "sending"
          ? text(locale, "Envoi…", "Sending…")
          : text(locale, "Envoyer la demande", "Send inquiry")}
        <Send size={16} />
      </Button>
    </form>
  );
}
