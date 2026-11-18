import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SiteLayout } from "@/components/SiteLayout";
import { mobileApplication, validatedGooglePlayUrl } from "@/lib/brand-content";
import { goldLogoUrl } from "@/lib/covers";
import { publicPages, type Locale } from "@/lib/seo";

export function ApplicationBlock({
  locale,
  compact = false,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  const fr = locale === "fr";
  const downloadUrl = validatedGooglePlayUrl(mobileApplication.googlePlayUrl);
  return (
    <section className="editorial-section border-t border-border">
      <div className="intro-grid">
        <p className="eyebrow flex items-start gap-3">
          <Smartphone size={20} aria-hidden="true" />
          {fr ? "APPLICATION MOBILE" : "MOBILE APPLICATION"}
        </p>
        <div className="min-w-0">
          <img
            className="app-brand-logo"
            src={goldLogoUrl}
            alt="NFLT RECORDS"
            width={220}
            height={108}
          />
          <h2 className="statement">NFLT RECORDS</h2>
          <p className="body-copy mt-8">
            {fr
              ? "L’application officielle NFLT RECORDS est disponible sur Google Play."
              : "The official NFLT RECORDS app is available on Google Play."}
          </p>
          <div className="mt-10 border-y border-border py-8">
            <p className="eyebrow mb-4">GOOGLE PLAY</p>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">{fr ? "Application" : "App"}</dt>
                <dd className="mt-1">{mobileApplication.name}</dd>
              </div>
              <div className="min-w-0 sm:col-span-2">
                <dt className="text-muted-foreground">
                  {fr ? "Identifiant du package" : "Package ID"}
                </dt>
                <dd className="mt-1 break-all">{mobileApplication.packageId}</dd>
              </div>
            </dl>
            {downloadUrl ? (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block w-fit max-w-full"
                aria-label={
                  fr
                    ? "Télécharger NFLT RECORDS sur Google Play (nouvel onglet)"
                    : "Download NFLT RECORDS on Google Play (new tab)"
                }
              ></a>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center gap-5">
              {downloadUrl ? (
                <Button asChild className="editorial-action">
                  <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Download aria-hidden="true" />
                    {fr ? "Télécharger sur Google Play" : "Download on Google Play"}
                  </a>
                </Button>
              ) : (
                <Button
                  disabled
                  className="editorial-action"
                  aria-describedby={compact ? "home-play-pending" : "application-play-pending"}
                >
                  <Download aria-hidden="true" />
                  {fr ? "Télécharger sur Google Play" : "Download on Google Play"}
                </Button>
              )}
              {!downloadUrl && (
                <p
                  id={compact ? "home-play-pending" : "application-play-pending"}
                  className="metadata-note"
                >
                  {fr ? "Bientôt disponible." : "Coming soon."}
                </p>
              )}
            </div>
          </div>
          {compact ? (
            <Button asChild variant="outline" className="editorial-action mt-8">
              <Link to={publicPages.application[locale]}>
                {fr ? "L’application" : "The application"}
                <ArrowUpRight />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function ApplicationPage({ locale }: { locale: Locale }) {
  return (
    <SiteLayout>
      <PageHeader kicker="NFLT RECORDS / MOBILE" title="Application" />
      <ApplicationBlock locale={locale} />
    </SiteLayout>
  );
}
