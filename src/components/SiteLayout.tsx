import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { publicPages, legalPages } from "@/lib/seo";
import { goldLogoUrl } from "@/lib/covers";
export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { count: cartCount } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const english = pathname === "/en" || pathname.startsWith("/en/");
  const locale = english ? "en" : "fr";
  const current = [...Object.values(publicPages), ...Object.values(legalPages)].find(
    (p) => p.fr === pathname || p.en === pathname,
  );
  const upc = pathname.match(/\/(?:en\/)?catalogue\/(\d+)$/)?.[1];
  const nav = [
    ["shop", english ? "Shop" : "Boutique"],
    ["licensing", english ? "Music licensing" : "Licences musicales"],
    ["catalogue", english ? "Catalogue" : "Catalogue"],
    ["streaming", english ? "Listen" : "Écouter"],
    ["artists", english ? "Artists" : "Artistes"],
    ["about", english ? "The label" : "Le label"],
    ["services", "Services"],
    ["press", english ? "Press" : "Presse"],
    ["application", "Application"],
    ["radio", "RADIO"],
  ] as const;
  return (
    <div className="site-shell">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4"
      >
        {english ? "Skip to content" : "Aller au contenu"}
      </a>
      <header className="site-header">
        <Link
          to={publicPages.home[locale]}
          className="wordmark"
          aria-label={english ? "NFLT RECORDS — home" : "NFLT RECORDS — accueil"}
        >
          <img
            src={goldLogoUrl}
            alt="NFLT RECORDS"
            className="wordmark-logo"
            width={537}
            height={263}
          />
        </Link>
        <nav
          className="desktop-nav"
          aria-label={english ? "Main navigation" : "Navigation principale"}
        >
          {nav.map(([p, l]) => (
            <Link
              to={publicPages[p][locale]}
              search={p === "licensing" ? { release: undefined, intent: undefined } : {}}
              key={p}
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: true }}
            >
              {l}
            </Link>
          ))}
          <Link
            to={publicPages.shop[locale]}
            hash="panier"
            className="inline-flex items-center gap-2"
            aria-label={english ? `Cart, ${cartCount} items` : `Panier, ${cartCount} article(s)`}
          >
            <ShoppingBag size={18} />
            {english ? "Cart" : "Panier"}
            <span className="text-primary">({cartCount})</span>
          </Link>
        </nav>
        <div className="header-actions">
          {current && (
            <Link
              to={english ? current.fr : current.en}
              search={
                current === publicPages.licensing
                  ? (previous) => ({ release: previous.release, intent: previous.intent })
                  : {}
              }
              hrefLang={english ? "fr" : "en"}
              aria-label={english ? "Version française" : "English version"}
            >
              {english ? "FR" : "EN"}
            </Link>
          )}
          {upc && (
            <Link
              to={english ? "/catalogue/$upc" : "/en/catalogue/$upc"}
              params={{ upc }}
              hrefLang={english ? "fr" : "en"}
            >
              {english ? "FR" : "EN"}
            </Link>
          )}
          <Button asChild variant="outline" className="header-contact">
            <Link to={publicPages.contact[locale]}>
              Contact
              <ArrowUpRight />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu-button"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </header>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label={english ? "Mobile navigation" : "Navigation mobile"}
        >
          {nav.map(([p, l], i) => (
            <Link
              key={p}
              to={publicPages[p][locale]}
              search={p === "licensing" ? { release: undefined, intent: undefined } : {}}
              onClick={() => setOpen(false)}
            >
              <span>0{i + 1}</span>
              {l}
              <ArrowUpRight />
            </Link>
          ))}
          <Link to={publicPages.shop[locale]} hash="panier" onClick={() => setOpen(false)}>
            <span>10</span>
            {english ? "Cart" : "Panier"} <span className="text-primary">({cartCount})</span>
            <ShoppingBag />
          </Link>
          <Link to={publicPages.contact[locale]} onClick={() => setOpen(false)}>
            Contact
            <ArrowUpRight />
          </Link>
        </nav>
      )}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <p>11 DEPARTMENTS</p>
          <Link to={publicPages.contact[locale]}>
            {english ? "LET’S TALK." : "PARLONS-EN."}
            <ArrowUpRight />
          </Link>
        </div>
        <div className="footer-wordmark footer-wordmark-type" aria-label="NFLT RECORDS">
          <span>NFLT</span>
          <span>RECORDS</span>
        </div>
        <div className="footer-bottom">
          <p>
            "11 DEPARTMENTS"
            <br />
            NEW-YORK / PARIS / BRUSSELS
          </p>
          <nav aria-label={english ? "Footer navigation" : "Navigation de pied de page"}>
            <Link to={publicPages.artist[locale]}>NFLT</Link>
            <Link to={publicPages.press[locale]}>{english ? "Press" : "Presse"}</Link>
            <Link to={publicPages.catalogue[locale]}>Catalogue</Link>
            <Link to={publicPages.application[locale]}>Application</Link>
            <Link to={publicPages.radio[locale]}>RADIO</Link>
            <Link to={publicPages.shop[locale]}>{english ? "Shop" : "Boutique"}</Link>
            <Link
              to={publicPages.licensing[locale]}
              search={{ release: undefined, intent: undefined }}
            >
              {english ? "Licensing" : "Licences"}
            </Link>
            <Link to={legalPages.terms[locale]}>
              {english ? "Terms of Sale" : "Conditions de vente"}
            </Link>
            <Link to={legalPages.privacy[locale]}>
              {english ? "Privacy Policy" : "Confidentialité"}
            </Link>
          </nav>
          <span>© {new Date().getFullYear()} NFLT RECORDS</span>
        </div>
      </footer>
    </div>
  );
}
export function PageHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <section className="page-header">
      <p className="eyebrow">{kicker}</p>
      <h1>{title}</h1>
    </section>
  );
}
