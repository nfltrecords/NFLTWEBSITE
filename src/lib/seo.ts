import { artistBiographies } from "@/lib/biographies";
import type { Release } from "@/lib/catalogue";
import { implantations } from "@/lib/brand-content";
import { goldLogoUrl, releaseCovers } from "@/lib/covers";
export const SITE_URL = "https://nflt-records.com";
export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;
export type Locale = "fr" | "en";
// Preparation routes are deliberately separate from the indexable public sitemap map.
export const legalPages = {
  terms: { fr: "/conditions-de-vente", en: "/en/terms-of-sale" },
  privacy: { fr: "/confidentialite", en: "/en/privacy-policy" },
} as const;
export type LegalPage = keyof typeof legalPages;
export function legalPageHead(page: LegalPage, locale: Locale) {
  const title =
    page === "terms"
      ? locale === "fr"
        ? "Conditions générales de vente"
        : "Terms of Sale"
      : locale === "fr"
        ? "Politique de confidentialité"
        : "Privacy Policy";
  const description =
    locale === "fr"
      ? `${title} de NFLT RECORDS. Document en préparation.`
      : `NFLT RECORDS ${title}. Document in preparation.`;
  const paths = legalPages[page];
  const url = `https://nflt-records.com${paths[locale]}`;
  return {
    meta: [
      { title: `${title} — NFLT RECORDS` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — NFLT RECORDS` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,nofollow" },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "fr", href: `https://nflt-records.com${paths.fr}` },
      { rel: "alternate", hrefLang: "en", href: `https://nflt-records.com${paths.en}` },
      { rel: "alternate", hrefLang: "x-default", href: `https://nflt-records.com${paths.fr}` },
    ],
  };
}
export const publicPages = {
  home: { fr: "/", en: "/en" },
  services: { fr: "/services", en: "/en/services" },
  artists: { fr: "/artistes", en: "/en/artists" },
  about: { fr: "/a-propos", en: "/en/about" },
  contact: { fr: "/contact", en: "/en/contact" },
  catalogue: { fr: "/catalogue", en: "/en/catalogue" },
  artist: { fr: "/nflt", en: "/en/nflt" },
  press: { fr: "/presse", en: "/en/press" },
  application: { fr: "/application", en: "/en/application" },
  radio: { fr: "/radio", en: "/en/radio" },
  shop: { fr: "/boutique", en: "/en/shop" },
  licensing: { fr: "/licences-musicales", en: "/en/music-licensing" },
  streaming: { fr: "/ecouter", en: "/en/listen" },
} as const;
export type PublicPage = keyof typeof publicPages;
export const groupOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NFLT RECORDS INC.",
  alternateName: ["NFLT RECORDS", "NFLT Records"],
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}${goldLogoUrl}`,
  location: { "@type": "Place", name: implantations[0].city.en },
  subOrganization: implantations.slice(1).map((entity) => ({
    "@type": "Organization",
    name: entity.name,
    location: { "@type": "Place", name: entity.city.en },
  })),
};
export const artistSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "NFLT",
  url: `${SITE_URL}/nflt`,
  sameAs: artistBiographies.map((b) => b.source),
};
const descriptions: Record<PublicPage, Record<Locale, [string, string]>> = {
  shop: {
    fr: [
      "Boutique — NFLT RECORDS",
      "Explorez les 18 sorties de NFLT, leurs pochettes et UPC. Contactez NFLT RECORDS pour une demande de disponibilité.",
    ],
    en: [
      "Shop — NFLT RECORDS",
      "Explore all 18 NFLT releases, their artwork and UPCs. Contact NFLT RECORDS for release availability.",
    ],
  },
  licensing: {
    fr: [
      "Licences musicales — NFLT RECORDS",
      "Adressez à NFLT RECORDS votre demande de licence musicale pour l’audiovisuel, la publicité, le cinéma, les créateurs et les jeux vidéo.",
    ],
    en: [
      "Music licensing — NFLT RECORDS",
      "Send NFLT RECORDS a music licensing inquiry for audiovisual, advertising, film, creator and game projects.",
    ],
  },
  radio: {
    fr: [
      "NFLT RECORDS NYC RADIO — Radio internationale en préparation",
      "NFLT RECORDS NYC RADIO : future radio internationale 24/7 : rotation NFLT, hip-hop, rap, R&B, soul et émissions. Flux en préparation ; programmation à venir.",
    ],
    en: [
      "NFLT RECORDS NYC RADIO — International radio in preparation",
      "NFLT RECORDS NYC RADIO: a future international 24/7 station: NFLT rotation, hip-hop, rap, R&B, soul and shows. Stream in preparation; programming coming soon.",
    ],
  },
  application: {
    fr: [
      "Application mobile officielle — NFLT RECORDS",
      "L’application NFLT RECORDS est en cours de réorganisation ; sa republication officielle sera annoncée ultérieurement.",
    ],
    en: [
      "Official mobile application — NFLT RECORDS",
      "The NFLT RECORDS app is being reorganised; its official republication will be announced later.",
    ],
  },
  home: {
    fr: [
      "NFLT RECORDS — Maison de disques indépendante internationale",
      "Découvrez NFLT RECORDS, label indépendant international, le catalogue de l’artiste NFLT et le groupe NFLT RECORDS INC., France et Brussels.",
    ],
    en: [
      "NFLT RECORDS — International independent record label",
      "Discover NFLT RECORDS, an international independent record label, artist NFLT’s catalogue and NFLT RECORDS INC., France and Brussels.",
    ],
  },
  services: {
    fr: [
      "Production musicale & activités du label — NFLT RECORDS",
      "Les activités de création musicale de NFLT RECORDS : production, mixage, mastering et projets du label. Contactez-nous pour échanger.",
    ],
    en: [
      "Music production & label activities — NFLT RECORDS",
      "Music creation at NFLT RECORDS: production, mixing, mastering and label projects. Contact the label to discuss your project.",
    ],
  },
  artists: {
    fr: [
      "Artistes & roster — NFLT RECORDS",
      "Découvrez l’artiste NFLT et le roster de NFLT RECORDS. Les futurs profils d’artistes seront annoncés progressivement après confirmation.",
    ],
    en: [
      "Artists & roster — NFLT RECORDS",
      "Discover artist NFLT and the NFLT RECORDS roster. Future artist profiles will be announced progressively following confirmation.",
    ],
  },
  about: {
    fr: [
      "Le groupe NFLT RECORDS INC., France & Brussels",
      "NFLT RECORDS INC., maison mère, NFLT RECORDS FRANCE, filiale française, et NFLT RECORDS BRUSSELS, branche de Bruxelles : le groupe.",
    ],
    en: [
      "The NFLT RECORDS INC., France & Brussels group",
      "NFLT RECORDS INC., parent company, NFLT RECORDS FRANCE, French subsidiary, and NFLT RECORDS BRUSSELS, Brussels branch: meet the group.",
    ],
  },
  contact: {
    fr: [
      "Contact & projets musicaux — NFLT RECORDS",
      "Contactez le label NFLT RECORDS pour un projet musical, une collaboration ou une demande presse via le formulaire de contact.",
    ],
    en: [
      "Contact & music projects — NFLT RECORDS",
      "Contact NFLT RECORDS for music projects, collaborations and press enquiries through the label’s existing contact form.",
    ],
  },
  catalogue: {
    fr: [
      "Catalogue NFLT — 18 sorties | NFLT RECORDS",
      "Les 18 sorties de l’artiste NFLT, publiées via NFLT Records. Découvrez les titres, pochettes et UPC.",
    ],
    en: [
      "NFLT catalogue — 18 releases | NFLT RECORDS",
      "18 releases by artist NFLT, published via NFLT Records. Discover titles, covers and UPCs.",
    ],
  },
  artist: {
    fr: [
      "NFLT — Artiste, biographies officielles & catalogue",
      "Le profil de l’artiste NFLT, distinct du label NFLT RECORDS : deux biographies Spotify originales autorisées et son catalogue de 18 sorties.",
    ],
    en: [
      "NFLT — Artist, official biographies & catalogue",
      "Artist NFLT, distinct from the NFLT RECORDS label: two authorised original Spotify biographies and a catalogue of 18 releases.",
    ],
  },
  streaming: {
    fr: [
      "Écouter NFLT — Streaming | NFLT RECORDS",
      "Retrouvez NFLT sur Spotify, Apple Music et YouTube, puis explorez les 18 sorties du catalogue.",
    ],
    en: [
      "Listen to NFLT — Streaming | NFLT RECORDS",
      "Find NFLT on Spotify, Apple Music and YouTube, and explore all 18 catalogue releases.",
    ],
  },
  press: {
    fr: [
      "Presse & médias — NFLT RECORDS / NFLT",
      "Informations presse sur le label NFLT RECORDS et l’artiste NFLT : structure du groupe, biographies, catalogue et demandes via le formulaire.",
    ],
    en: [
      "Press & media — NFLT RECORDS / NFLT",
      "Press information about label NFLT RECORDS and artist NFLT: group structure, biographies, catalogue and enquiries through the contact form.",
    ],
  },
};
function metadata(
  title: string,
  description: string,
  paths: { fr: string; en: string },
  locale: Locale,
  image: string = goldLogoUrl,
) {
  const abs = { fr: absoluteUrl(paths.fr), en: absoluteUrl(paths.en) };
  const img = `${SITE_URL}${image}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:site_name", content: "NFLT RECORDS" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: abs[locale] },
      { property: "og:image", content: img },
      { name: "twitter:image", content: img },
      { name: "robots", content: "index,follow" },
      { name: "theme-color", content: "#0a0a0a" },
      { property: "og:locale", content: locale === "fr" ? "fr_FR" : "en_GB" },
      { property: "og:locale:alternate", content: locale === "fr" ? "en_GB" : "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: abs[locale] },
      { rel: "alternate", hrefLang: "fr", href: abs.fr },
      { rel: "alternate", hrefLang: "en", href: abs.en },
      { rel: "alternate", hrefLang: "x-default", href: abs.fr },
    ],
  };
}
export function pageHead(page: PublicPage, locale: Locale = "fr") {
  const [title, description] = descriptions[page][locale];
  const schema =
    page === "artist"
      ? artistSchema
      : page === "about" || page === "home"
        ? groupOrganization
        : undefined;
  return {
    ...metadata(title, description, publicPages[page], locale),
    ...(schema
      ? { scripts: [{ type: "application/ld+json", children: JSON.stringify(schema) }] }
      : {}),
  };
}
export function releaseHead(release: Release, locale: Locale) {
  const title =
    locale === "fr"
      ? `${release.title} — NFLT | Sortie NFLT RECORDS`
      : `${release.title} — NFLT | NFLT RECORDS release`;
  const description =
    locale === "fr"
      ? `${release.title}, une sortie de NFLT publiée via NFLT Records. UPC ${release.upc}.`
      : `${release.title}, a release by NFLT published via NFLT Records. UPC ${release.upc}.`;
  return {
    ...metadata(
      title,
      description,
      { fr: `/catalogue/${release.upc}`, en: `/en/catalogue/${release.upc}` },
      locale,
      releaseCovers[release.upc] ?? goldLogoUrl,
    ),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MusicRelease",
          name: release.title,
          url: absoluteUrl(
            locale === "fr" ? `/catalogue/${release.upc}` : `/en/catalogue/${release.upc}`,
          ),
          ...(releaseCovers[release.upc]
            ? { image: `${SITE_URL}${releaseCovers[release.upc]}` }
            : {}),
          byArtist: { "@type": "Person", name: "NFLT", url: `${SITE_URL}/nflt` },
          identifier: { "@type": "PropertyValue", propertyID: "UPC", value: release.upc },
          recordLabel: { "@type": "Organization", name: "NFLT RECORDS", url: `${SITE_URL}/` },
        }),
      },
    ],
  };
}
