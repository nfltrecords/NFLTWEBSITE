import { ArrowUpRight, Music2, Search } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { releases } from "@/lib/catalogue";
import { publicPages, type Locale } from "@/lib/seo";
import { releaseCovers } from "@/lib/covers";

const services = [
  {
    name: "Spotify",
    detail: "Profil artiste NFLT",
    href: "https://open.spotify.com/artist/2kcuv7ZpGK97c1UPBj1RIk",
    verified: true,
  },
  {
    name: "Apple Music",
    detail: "Profil artiste NFLT et catalogue",
    href: "https://music.apple.com/us/artist/nflt/1253527531",
    verified: true,
  },
  {
    name: "YouTube",
    detail: "Chaîne artiste NFLT 21ST G.K.",
    href: "https://www.youtube.com/channel/UCQCvinx2N4o6X9Wz08mwbJw",
    verified: true,
  },
  {
    name: "YouTube Music",
    detail: "Rechercher NFLT dans le catalogue",
    href: "https://music.youtube.com/search?q=NFLT",
    verified: false,
  },
  {
    name: "Amazon Music",
    detail: "Rechercher NFLT dans le catalogue",
    href: "https://music.amazon.com/search/NFLT",
    verified: false,
  },
  {
    name: "Deezer",
    detail: "Rechercher NFLT dans le catalogue",
    href: "https://www.deezer.com/search/NFLT",
    verified: false,
  },
  {
    name: "TIDAL",
    detail: "Rechercher NFLT dans le catalogue",
    href: "https://tidal.com/search?q=NFLT",
    verified: false,
  },
] as const;

const copy = (locale: Locale) =>
  locale === "fr"
    ? {
        kicker: "NFLT RECORDS / ÉCOUTER",
        title: "RETROUVEZ NFLT EN STREAMING.",
        intro:
          "Retrouvez la musique de NFLT sur les plateformes de streaming. Ouvrez directement les profils confirmés ou lancez une recherche sur les autres services.",
        verified: "Profil artiste confirmé",
        search: "Ouvrir la recherche",
        catalogue: "Les 18 sorties du catalogue",
        catalogueText:
          "Parcourez les 18 sorties officielles et retrouvez chaque titre sur votre plateforme préférée.",
        view: "Rechercher la sortie sur Apple Music",
        note: "Les liens de recherche ouvrent le catalogue du service ; ils ne garantissent pas qu'une page artiste ou chaque sortie soit disponible dans toutes les régions.",
      }
    : {
        kicker: "NFLT RECORDS / LISTEN",
        title: "FIND NFLT ON STREAMING.",
        intro:
          "Listen to NFLT on streaming platforms. Open confirmed artist profiles directly or search the catalogue on other services.",
        verified: "Verified artist profile",
        search: "Open search",
        catalogue: "The 18 catalogue releases",
        catalogueText:
          "Browse all 18 official releases and find each title on your preferred platform.",
        view: "Search this release on Apple Music",
        note: "Search links open each service's catalogue; they do not guarantee that an artist page or every release is available in all regions.",
      };

export function StreamingPage({ locale }: { locale: Locale }) {
  const t = copy(locale);
  return (
    <SiteLayout>
      <div className="commerce-theme">
        <PageHeader kicker={t.kicker} title={t.title} />
        <section className="editorial-section pt-0">
          <p className="body-copy mb-12">{t.intro}</p>
          <div className="grid gap-0 border-y border-border md:grid-cols-2">
            {services.map((service, index) => (
              <a
                key={service.name}
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-28 items-center justify-between gap-5 border-b border-border p-6 transition-colors hover:bg-card md:odd:border-r md:odd:pr-8 md:even:pl-8"
              >
                <div className="streaming-release-info flex min-w-0 items-center gap-4">
                  <span className="text-xs text-primary">0{index + 1}</span>
                  <div className="min-w-0">
                    <h2 className="text-2xl">{service.name}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{service.detail}</p>
                    {service.verified && (
                      <span className="mt-2 inline-block text-[10px] uppercase tracking-wider text-primary">
                        {t.verified}
                      </span>
                    )}
                  </div>
                </div>
                {service.verified ? (
                  <ArrowUpRight className="shrink-0 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                ) : (
                  <Search className="shrink-0 text-primary" />
                )}
              </a>
            ))}
          </div>
          <p className="body-copy mt-6 text-sm">{t.note}</p>
        </section>
        <section className="editorial-section border-t border-border">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">NFLT RECORDS / 18 UPC</p>
              <h2 className="text-4xl md:text-6xl">{t.catalogue}</h2>
              <p className="body-copy mt-5">{t.catalogueText}</p>
            </div>
            <Music2 className="hidden h-12 w-12 shrink-0 text-primary md:block" />
          </div>
          <div className="divide-y divide-border border-y border-border">
            {releases.map((release, index) => (
              <a
                key={release.upc}
                href={`https://music.apple.com/us/search?term=${encodeURIComponent(release.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="streaming-release-row flex items-center justify-between gap-5 py-5 transition-colors hover:bg-card"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span className="text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <img
                    src={releaseCovers[release.upc] ?? "/nflt-records-favicon.png"}
                    alt={`Pochette de ${release.title}`}
                    loading="lazy"
                    className="streaming-release-cover h-16 w-16 shrink-0 rounded-sm border border-border object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-medium">{release.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">UPC {release.upc}</p>
                  </div>
                </div>
                <span className="streaming-release-action flex shrink-0 items-center gap-2 text-xs uppercase text-primary">
                  {t.view} <ArrowUpRight size={15} />
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
