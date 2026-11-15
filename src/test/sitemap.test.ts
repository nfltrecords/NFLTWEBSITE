import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { releases } from "@/lib/catalogue";
import { publicPages, SITE_URL } from "@/lib/seo";
const xml = readFileSync("public/sitemap.xml", "utf8");
describe("sitemap", () => {
  it("contains exactly the bilingual public pages and all 18 release pairs", () => {
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    const expected = [
      ...Object.values(publicPages).flatMap((paths) => [paths.fr, paths.en]),
      ...releases.flatMap((r) => [`/catalogue/${r.upc}`, `/en/catalogue/${r.upc}`]),
    ].map((path) => `${SITE_URL}${path}`);
    expect(locs.sort()).toEqual(expected.sort());
  });
  it("lists 60 absolute public URLs without lastmod or private routes", () => {
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1] ?? "");
    expect(locs).toHaveLength(60);
    expect(new Set(locs).size).toBe(60);
    expect(locs).toContain("https://nflt-records.com/radio");
    expect(locs).toContain("https://nflt-records.com/en/radio");
    expect(locs.every((u) => u.startsWith("https://nflt-records.com/"))).toBe(true);
    expect(xml).not.toContain("lastmod");
    expect(xml).not.toContain("/messages");
    expect(xml).not.toContain("preview");
  });
  it("is referenced by robots.txt", () => {
    expect(readFileSync("public/robots.txt", "utf8")).toContain(
      "Sitemap: https://nflt-records.com/sitemap.xml",
    );
  });
});
