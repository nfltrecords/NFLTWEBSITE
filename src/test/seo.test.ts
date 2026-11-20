import { describe, expect, it } from "vitest";
import { absoluteUrl, groupOrganization, pageHead, publicPages } from "@/lib/seo";

describe("Public bilingual SEO rules", () => {
  it("keeps French as the default for all public pages", () => {
    expect(Object.values(publicPages).map((page) => page.fr)).toEqual([
      "/",
      "/services",
      "/artistes",
      "/a-propos",
      "/contact",
      "/catalogue",
      "/nflt",
      "/presse",
      "/application",
      "/radio",
      "/boutique",
      "/licences-musicales",
      "/ecouter",
    ]);
    expect(
      pageHead("home").links.find((link) => "hrefLang" in link && link.hrefLang === "x-default")
        ?.href,
    ).toBe("https://nflt-records.com/");
  });

  it("excludes the private messages route from the public language map", () => {
    expect(Object.values(publicPages).flatMap((page) => [page.fr, page.en])).not.toContain(
      "/messages",
    );
    expect(Object.keys(publicPages)).toHaveLength(13);
  });

  it("uses a self-canonical and reciprocal French and English alternatives", () => {
    for (const page of Object.keys(publicPages) as (keyof typeof publicPages)[]) {
      for (const locale of ["fr", "en"] as const) {
        const head = pageHead(page, locale);
        expect(head.links.find((link) => link.rel === "canonical")?.href).toBe(
          absoluteUrl(publicPages[page][locale]),
        );
        expect(head.links.filter((link) => link.rel === "alternate")).toEqual([
          { rel: "alternate", hrefLang: "fr", href: absoluteUrl(publicPages[page].fr) },
          { rel: "alternate", hrefLang: "en", href: absoluteUrl(publicPages[page].en) },
          { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(publicPages[page].fr) },
        ]);
      }
    }
  });

  it("models the owner's three entities as organizations, not musical artists", () => {
    expect(groupOrganization["@type"]).toBe("Organization");
    expect(groupOrganization.name).toBe("NFLT RECORDS INC.");
    expect(groupOrganization.subOrganization).toEqual([
      {
        "@type": "Organization",
        name: "NFLT RECORDS FRANCE",
        location: { "@type": "Place", name: "Paris" },
      },
      {
        "@type": "Organization",
        name: "NFLT RECORDS BRUSSELS",
        location: { "@type": "Place", name: "Brussels" },
      },
    ]);
    expect(groupOrganization).not.toHaveProperty("sameAs");
    expect(groupOrganization).not.toHaveProperty("address");
  });
});
