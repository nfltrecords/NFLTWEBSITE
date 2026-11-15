import { Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { HomePage, ServicesPage, AboutPage, RosterPage } from "@/components/LabelPages";
import { ArrowUpRight } from "lucide-react";
export function EnglishHome() {
  return <HomePage locale="en" />;
}
export function EnglishServices() {
  return <ServicesPage locale="en" />;
}
export function EnglishAbout() {
  return <AboutPage locale="en" />;
}
export function EnglishArtists() {
  return <RosterPage locale="en" />;
}
export function EnglishContact() {
  return (
    <SiteLayout>
      <PageHeader kicker="LET’S TALK MUSIC" title="Contact" />
      <section className="editorial-section pt-0">
        <p className="body-copy mb-8">
          Contact NFLT RECORDS about your music project or a press enquiry. The contact form is in
          French; you can write your message in English.
        </p>
        <Button asChild className="editorial-action">
          <Link to="/contact" hrefLang="fr">
            Open the contact form
            <ArrowUpRight />
          </Link>
        </Button>
      </section>
    </SiteLayout>
  );
}
