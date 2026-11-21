import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Search } from "lucide-react";
import { useState } from "react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { releases, filterReleases, type Release } from "@/lib/catalogue";
import { releaseCovers } from "@/lib/covers";
import { artistBiographies } from "@/lib/biographies";
import { publicPages, type Locale } from "@/lib/seo";
import hero from "@/assets/hero-studio.jpg";
import { ApplicationBlock } from "@/components/ApplicationPage";
import { implantations } from "@/lib/brand-content";
import { RadioTeaser } from "@/components/RadioPage";
import { ReleasePrice } from "@/components/ReleasePrice";
import { ReleasePreview } from "@/components/ReleasePreview";
import { useCart } from "@/lib/cart-store";
import { releasePriceCents as releasePriceCentsForButton } from "@/lib/commerce";
import { ShoppingBag } from "lucide-react";

const t = (locale: Locale, fr: string, en: string) => (locale === "fr" ? fr : en);
function Action({
  locale,
  page,
  children,
}: {
  locale: Locale;
  page: keyof typeof publicPages;
  children: React.ReactNode;
}) {
  return (
    <Button asChild variant="outline" className="editorial-action">
      <Link to={publicPages[page][locale]}>
        {children}
        <ArrowUpRight />
      </Link>
    </Button>
  );
}
function ReleaseRow({
  release,
  locale,
  index,
  showPrice = false,
}: {
  release: Release;
  locale: Locale;
  index: number;
  showPrice?: boolean;
}) {
  const cart = useCart();
  const quantity = cart.items[release.upc] ?? 0;
  const canAdd = releasePriceCentsForButton(release.upc) !== null && quantity < 20;
  return (
    <div className={`release-row group${showPrice ? " release-row--commerce" : ""}`}>
      <span className="release-index">{String(index + 1).padStart(2, "0")}</span>
      <img
        className="release-cover"
        src={releaseCovers[release.upc]}
        alt={t(locale, `Pochette — ${release.title}`, `Cover — ${release.title}`)}
        loading="lazy"
        width={64}
        height={64}
      />
      <Link
        to={locale === "fr" ? "/catalogue/$upc" : "/en/catalogue/$upc"}
        params={{ upc: release.upc }}
        className="release-row-main"
      >
        <span className="release-artist">NFLT</span>
        <h3 className="release-title">{release.title}</h3>
        {showPrice ? <ReleasePrice upc={release.upc} locale={locale} /> : null}
      </Link>
      <span className="release-upc">UPC {release.upc}</span>
      {showPrice ? (
        <Button
          type="button"
          size="sm"
          className="release-row-add"
          disabled={!canAdd}
          onClick={() => cart.add(release.upc)}
          aria-label={t(
            locale,
            `Ajouter ${release.title} au panier`,
            `Add ${release.title} to cart`,
          )}
        >
          <ShoppingBag size={15} />
          {t(locale, "Ajouter", "Add")}
          {quantity > 0 ? ` · ${quantity}` : ""}
        </Button>
      ) : (
        <Link
          to={locale === "fr" ? "/catalogue/$upc" : "/en/catalogue/$upc"}
          params={{ upc: release.upc }}
          aria-label={t(locale, `Voir ${release.title}`, `View ${release.title}`)}
        >
          <ArrowUpRight className="text-primary transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
export function HomePage({ locale = "fr" }: { locale?: Locale }) {
  return (
    <SiteLayout>
      <section className="label-hero">
        <img
          src={hero}
          alt={t(
            locale,
            "Console de production musicale — visuel de studio",
            "Music production console — studio visual",
          )}
          className="hero-photo"
        />
        <div className="hero-shade" />
        <div className="hero-topline">
          <span>{t(locale, "MAISON DE DISQUES INDÉPENDANTE", "INDEPENDENT RECORD LABEL")}</span>
          <span>NEW-YORK</span>
        </div>
        <div className="hero-content">
          <p className="eyebrow">INDEPENDENT. INTERNATIONAL.</p>
          <h1 className="hero-title">
            NFLT
            <span>
              RECORDS<span className="text-primary"></span>
            </span>
          </h1>
          <div className="hero-bottom">
            <p>
              {t(
                locale,
                "THE MOST ADVANCED DEPARTMENTS.",
                "THE MOST ADVANCED DEPARTMENTS.",
              )}
            </p>
            <Button asChild className="editorial-action">
              <Link to={publicPages.catalogue[locale]}>
                {t(locale, "Explorer le catalogue", "Explore the catalogue")}
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
        <span className="hero-scroll">
          <ArrowDown size={16} /> {t(locale, "LE LABEL / LA MUSIQUE", "THE LABEL / THE MUSIC")}
        </span>
      </section>
      <div className="identity-strip">
        <span>NFLT RECORDS INC.</span>
        <span className="identity-divider" aria-hidden="true" />
        <span>NFLT RECORDS FRANCE</span>
        <span className="identity-divider" aria-hidden="true" />
        <span>NFLT RECORDS BRUSSELS</span>
      </div>
      <section className="editorial-section intro-grid">
        <p className="eyebrow">01 / {t(locale, "LE LABEL", "THE LABEL")}</p>
        <div>
          <h2 className="statement">
            {t(
              locale,
              "UNE MAISON.\nUNE IDENTITÉ.\nLA MUSIQUE.",
              "ONE LABEL.\nONE IDENTITY.\nTHE MUSIC.",
            )}
          </h2>
          <div className="intro-bottom">
            <p className="body-copy">
              {t(
                locale,
                "NFLT RECORDS est une maison de disques indépendante internationale. Le label rassemble les activités de production musicale et le catalogue de l’artiste NFLT, au sein du groupe NFLT RECORDS INC.",
                "NFLT RECORDS is an international independent record label. The label brings together music production activities and the artist NFLT’s catalogue within the NFLT RECORDS INC. group.",
              )}
            </p>
            <Action locale={locale} page="about">
              {t(locale, "Découvrir le groupe", "Discover the group")}
            </Action>
          </div>
        </div>
      </section>
      <section className="editorial-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / {t(locale, "LES SORTIES", "THE RELEASES")}</p>
            <h2>{t(locale, "CATALOGUE NFLT", "NFLT CATALOGUE")}</h2>
          </div>
          <span className="text-muted-foreground">18 {t(locale, "SORTIES", "RELEASES")}</span>
        </div>
        {[releases[17], releases[16], releases[15]].map((r, i) => (
          <ReleaseRow key={r.upc} release={r} locale={locale} index={i} />
        ))}
        <div className="mt-8">
          <Action locale={locale} page="catalogue">
            {t(locale, "Les 18 sorties", "All 18 releases")}
          </Action>
        </div>
      </section>
      <section className="artist-band">
        <div className="editorial-section artist-band-inner">
          <div>
            <p className="eyebrow">03 / {t(locale, "L’ARTISTE", "THE ARTIST")}</p>
            <h2 className="artist-word">
              NFLT<span className="text-primary">.</span>
            </h2>
          </div>
          <div>
            <p className="body-copy">
              {t(
                locale,
                "L’artiste NFLT. Le label NFLT RECORDS. Deux identités distinctes, un catalogue à découvrir.",
                "The artist NFLT. The label NFLT RECORDS. Two distinct identities, a catalogue to discover.",
              )}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Action locale={locale} page="artist">
                {t(locale, "Profil & biographies", "Profile & biographies")}
              </Action>
              <Action locale={locale} page="artists">
                {t(locale, "Le roster", "The roster")}
              </Action>
            </div>
          </div>
        </div>
      </section>
      <ApplicationBlock locale={locale} compact />
      <RadioTeaser locale={locale} />
      <section className="editorial-section">
        <p className="eyebrow">04 / {t(locale, "EN MOUVEMENT", "IN MOTION")}</p>
        <div className="home-links">
          {(
            [
              ["services", t(locale, "PRODUCTION & LABEL", "PRODUCTION & LABEL")],
              ["shop", t(locale, "BOUTIQUE", "SHOP")],
              ["licensing", t(locale, "LICENCES MUSICALES", "MUSIC LICENSING")],
              ["press", t(locale, "PRESSE & MÉDIAS", "PRESS & MEDIA")],
              ["contact", t(locale, "ENTRONS EN CONTACT", "GET IN TOUCH")],
            ] as const
          ).map(([page, title]) => (
            <Link
              key={page}
              to={publicPages[page][locale]}
              search={page === "licensing" ? { release: undefined, intent: undefined } : {}}
            >
              <h2>{title}</h2>
              <ArrowUpRight />
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
export function CataloguePage({ locale = "fr" }: { locale?: Locale }) {
  const [year, setYear] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = filterReleases(year, query);
  return (
    <SiteLayout>
      <PageHeader kicker="NFLT / DISCOGRAPHY" title={t(locale, "Catalogue", "Catalogue")} />
      <section className="editorial-section pt-0">
        <div className="catalogue-intro">
          <p className="body-copy">
            {t(
              locale,
              "Les 18 sorties de l’artiste NFLT, publiées via NFLT Records.",
              "18 releases by the artist NFLT, published via NFLT Records.",
            )}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Action locale={locale} page="shop">
              {t(locale, "Explorer la boutique", "Explore the shop")}
            </Action>
            <Action locale={locale} page="artist">
              {t(locale, "L’artiste NFLT", "Artist NFLT")}
            </Action>
          </div>
        </div>
        <div className="catalogue-filters">
          <label className="search-field">
            <Search size={18} />
            <input
              aria-label={t(locale, "Rechercher une sortie", "Search releases")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(locale, "Rechercher un titre", "Search a title")}
            />
          </label>
          <label className="year-field">
            <span>{t(locale, "Année", "Year")}</span>
            <select
              aria-label={t(locale, "Année", "Year")}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="all">{t(locale, "Toutes", "All")}</option>
              {["2026", "2025", "2024", "2021", "2020", "2017"].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
          <span className="text-muted-foreground">{filtered.length} / 18</span>
        </div>
        {filtered.map((r, i) => (
          <ReleaseRow key={r.upc} release={r} locale={locale} index={i} showPrice />
        ))}
        {filtered.length === 0 && (
          <p className="py-16 text-muted-foreground">
            {t(locale, "Aucune sortie correspondante.", "No matching releases.")}
          </p>
        )}
      </section>
    </SiteLayout>
  );
}
export function ReleasePage({ release, locale = "fr" }: { release: Release; locale?: Locale }) {
  const cart = useCart();
  const quantity = cart.items[release.upc] ?? 0;
  return (
    <SiteLayout>
      <section className="editorial-section release-detail">
        <p className="eyebrow">NFLT / {t(locale, "FICHE CATALOGUE", "CATALOGUE ENTRY")}</p>
        <h1>{release.title}</h1>
        <div className="release-detail-grid">
          <img
            className="release-cover-detail"
            src={releaseCovers[release.upc]}
            alt={t(
              locale,
              `Pochette officielle — ${release.title}`,
              `Official cover — ${release.title}`,
            )}
            width={500}
            height={500}
          />
          <div>
            <dl className="release-facts">
              {[
                [t(locale, "Artiste", "Artist"), "NFLT"],
                ["Label", "NFLT Records"],
                ["UPC", release.upc],
                [t(locale, "Date", "Date"), release.suppliedDate],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <ReleasePrice upc={release.upc} locale={locale} />
            <ReleasePreview upc={release.upc} locale={locale} />
            <div className="mt-6">
              <Button
                type="button"
                className="editorial-action"
                onClick={() => cart.add(release.upc)}
                disabled={quantity >= 20 || releasePriceCentsForButton(release.upc) === null}
              >
                <ShoppingBag size={16} />
                {t(locale, "Ajouter au panier", "Add to cart")}
                {quantity > 0 ? ` · ${quantity}` : ""}
              </Button>
              {quantity > 0 ? (
                <p className="body-copy mt-2">
                  {t(
                    locale,
                    `${quantity} article(s) dans votre panier.`,
                    `${quantity} item(s) in your cart.`,
                  )}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <Button asChild variant="outline" className="editorial-action">
                <Link
                  to={publicPages.licensing[locale]}
                  search={{ release: release.upc, intent: "availability" }}
                >
                  {t(locale, "Demande de disponibilité", "Contact for availability")}
                  <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild variant="outline" className="editorial-action">
                <Link
                  to={publicPages.licensing[locale]}
                  search={{ release: release.upc, intent: "licensing" }}
                >
                  {t(locale, "Licence musicale", "Music licensing")}
                  <ArrowUpRight />
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <Action locale={locale} page="catalogue">
                {t(locale, "Retour au catalogue", "Back to catalogue")}
              </Action>
              <Action locale={locale} page="shop">
                {t(locale, "Boutique", "Shop")}
              </Action>
              <Action locale={locale} page="artist">
                {t(locale, "L’artiste NFLT", "Artist NFLT")}
              </Action>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
export function ArtistPage({ locale = "fr" }: { locale?: Locale }) {
  return (
    <SiteLayout>
      <PageHeader
        kicker={t(locale, "L’ARTISTE / PAS LE LABEL", "THE ARTIST / NOT THE LABEL")}
        title="NFLT"
      />
      <section className="editorial-section pt-0">
        <div className="intro-grid">
          <p className="eyebrow">ARTIST PROFILE</p>
          <div>
            <p className="body-copy">
              {t(
                locale,
                "NFLT est l’artiste auquel appartiennent les 18 sorties du catalogue. NFLT RECORDS est la marque du label, distincte de l’identité de l’artiste.",
                "NFLT is the artist behind the catalogue’s 18 releases. NFLT RECORDS is the label brand, distinct from the artist’s identity.",
              )}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Action locale={locale} page="catalogue">
                {t(locale, "Discographie NFLT", "NFLT discography")}
              </Action>
              <Action locale={locale} page="shop">
                {t(locale, "Boutique NFLT", "NFLT shop")}
              </Action>
            </div>
          </div>
        </div>
        <div className="section-heading mt-24">
          <h2>NFLT — Artist biography</h2>
        </div>
        {artistBiographies.map((b) => (
          <article className="biography" key={b.profile}>
            <div>
              <p className="eyebrow">SPOTIFY / {b.label}</p>
              <a href={b.source} target="_blank" rel="noopener noreferrer" className="source-link">
                {t(locale, "Profil artiste source", "Source artist profile")}
                <ArrowUpRight size={16} />
              </a>
            </div>
            <blockquote lang="en" className="biography-text">
              {b.text}
            </blockquote>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
export function RosterPage({ locale = "fr" }: { locale?: Locale }) {
  return (
    <SiteLayout>
      <PageHeader kicker="NFLT RECORDS / ROSTER" title={t(locale, "Les artistes", "The artists")} />
      <section className="editorial-section pt-0">
        <Link to={publicPages.artist[locale]} className="roster-feature">
          <h2>
            NFLT<span className="text-primary">.</span>
          </h2>
          <div>
            <span className="eyebrow">ARTIST PROFILE / 18 {t(locale, "SORTIES", "RELEASES")}</span>
            <ArrowUpRight />
          </div>
        </Link>
        <div className="intro-grid mt-20">
          <p className="eyebrow">NEXT CHAPTER</p>
          <div>
            <h2 className="text-4xl mb-6">
              {t(locale, "LE ROSTER SE CONSTRUIT.", "THE ROSTER IS TAKING SHAPE.")}
            </h2>
            <p className="body-copy">
              {t(
                locale,
                "Les futurs artistes seront ajoutés progressivement.",
                "Future artists will be added progressively.",
              )}
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
export function AboutPage({ locale = "fr" }: { locale?: Locale }) {
  return (
    <SiteLayout>
      <PageHeader
        kicker="INDEPENDENT / INTERNATIONAL"
        title={t(locale, "Le groupe", "The group")}
      />
      <section className="editorial-section pt-0">
        <div className="intro-grid">
          <p className="eyebrow">NFLT RECORDS</p>
          <div>
            <h2 className="statement">
              {t(locale, "UNE IDENTITÉ.\nTROIS ENTITÉS.", "ONE IDENTITY.\nTHREE ENTITIES.")}
            </h2>
            <p className="body-copy mt-8">
              {t(
                locale,
                "NFLT RECORDS est une maison de disques indépendante internationale. La structure du groupe réunit une maison mère, une filiale française et une branche à Bruxelles. Le label et l’artiste NFLT gardent des identités distinctes.",
                "NFLT RECORDS is an international independent record label. The group structure brings together a parent company, a French subsidiary and a Brussels branch. The label and artist NFLT retain distinct identities.",
              )}
            </p>
          </div>
        </div>
        <h2 className="text-4xl mt-20">{t(locale, "Implantations", "Locations")}</h2>
        <dl className="group-entities mt-10">
          {implantations.map((entity, i) => (
            <div key={entity.name}>
              <span className="eyebrow">0{i + 1}</span>
              <dt>{entity.name}</dt>
              <dd>
                <span className="block text-foreground mb-2">{entity.city[locale]}</span>
                {entity.role[locale]}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-4 mt-10">
          <Action locale={locale} page="services">
            {t(locale, "Activités du label", "Label activities")}
          </Action>
          <Action locale={locale} page="press">
            {t(locale, "Presse & médias", "Press & media")}
          </Action>
        </div>
      </section>
    </SiteLayout>
  );
}
export function ServicesPage({ locale = "fr" }: { locale?: Locale }) {
  const rows =
    locale === "fr"
      ? [
          [
            "Production musicale",
            "Composition, beatmaking, arrangements et direction artistique : les activités de création musicale présentées par NFLT RECORDS.",
          ],
          [
            "Mixage & mastering",
            "Travail sur l’équilibre, la profondeur et la finalisation sonore des projets musicaux. Les besoins et le périmètre sont définis lors de l’échange avec le label.",
          ],
          [
            "Catalogue & projets",
            "Le catalogue rassemble les sorties de NFLT. Pour un projet musical ou une demande de collaboration, prenez contact avec le label.",
          ],
        ]
      : [
          [
            "Music production",
            "Composition, beatmaking, arrangements and artistic direction: the music creation activities presented by NFLT RECORDS.",
          ],
          [
            "Mixing & mastering",
            "Work on balance, depth and sound finalisation for music projects. Needs and scope are defined in discussion with the label.",
          ],
          [
            "Catalogue & projects",
            "The catalogue brings together NFLT releases. Contact the label about a music project or a collaboration enquiry.",
          ],
        ];
  return (
    <SiteLayout>
      <PageHeader
        kicker={t(locale, "LES ACTIVITÉS DU LABEL", "LABEL ACTIVITIES")}
        title={t(locale, "Production\n& création", "Production\n& creation")}
      />
      <section className="editorial-section pt-0">
        {rows.map(([title, text], i) => (
          <article className="service-row" key={title}>
            <span className="eyebrow">0{i + 1}</span>
            <h2>{title}</h2>
            <p className="body-copy">{text}</p>
          </article>
        ))}
        <p className="metadata-note my-8">
          {t(
            locale,
            "Chaque demande fait l’objet d’un échange préalable. Aucune installation, prestation de booking ou offre de distribution n’est annoncée ici.",
            "Every enquiry is discussed individually. No facilities, booking service or distribution offer is announced here.",
          )}
        </p>
        <Action locale={locale} page="contact">
          {t(locale, "Parlons de votre projet", "Let’s discuss your project")}
        </Action>
      </section>
    </SiteLayout>
  );
}
export function PressPage({ locale = "fr" }: { locale?: Locale }) {
  return (
    <SiteLayout>
      <PageHeader
        kicker="NFLT RECORDS / MEDIA"
        title={t(locale, "Presse\n& médias", "Press\n& media")}
      />
      <section className="editorial-section pt-0">
        <div className="intro-grid">
          <p className="eyebrow">MEDIA INFORMATION</p>
          <div>
            <h2 className="text-4xl mb-6">NFLT RECORDS / NFLT</h2>
            <p className="body-copy">
              {t(
                locale,
                "NFLT RECORDS : maison de disques indépendante internationale. NFLT : artiste du catalogue présenté sur ce site. Pour une interview, des informations éditoriales ou une demande de visuels officiels, contactez le label.",
                "NFLT RECORDS: international independent record label. NFLT: artist of the catalogue presented on this site. Contact the label for interviews, editorial information or official image requests.",
              )}
            </p>
            <div className="mt-8">
              <Action locale={locale} page="contact">
                {t(locale, "Demande presse", "Press enquiry")}
              </Action>
            </div>
          </div>
        </div>
        <div className="home-links mt-16">
          {(
            [
              ["about", t(locale, "STRUCTURE DU GROUPE", "GROUP STRUCTURE")],
              ["artist", t(locale, "BIOGRAPHIES OFFICIELLES", "OFFICIAL BIOGRAPHIES")],
              ["catalogue", t(locale, "CATALOGUE & UPC", "CATALOGUE & UPC")],
              ["shop", t(locale, "BOUTIQUE NFLT", "NFLT SHOP")],
            ] as const
          ).map(([p, title]) => (
            <Link key={p} to={publicPages[p][locale]}>
              <h2>{title}</h2>
              <ArrowUpRight />
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
