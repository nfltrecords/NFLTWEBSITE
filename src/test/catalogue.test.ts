import { describe, expect, it } from "vitest";
import { releases, filterReleases } from "@/lib/catalogue";
import { releaseCovers, goldLogoUrl } from "@/lib/covers";
import { artistBiographies } from "@/lib/biographies";
import { artistSchema, releaseHead } from "@/lib/seo";
const supplied = [
  ["The Luxury - The Highest - Unequivocal", "27/06/2017", "199955740199"],
  ["0+", "07/11/2020", "199956554184"],
  ["NOUS Y SOMMES (TU M'AURAS JAMAIS)", "26/11/2020", "199956222809"],
  ["#NEVERFAKELIKETHEM (Chapter One)", "01/12/2020", "199955715135"],
  ["30.000 GÉNOCIDES", "01/12/2020", "199955742094"],
  ["Dilemma (Radio Edit)", "19/01/2021", "199955701558"],
  ["Hustle & Grind (Radio Edit)", "19/01/2021", "199955715203"],
  ["The Dopest Collection (Vol. 1)", "02/11/2024", "199751511160"],
  ["In My Party", "02/11/2024", "199751512501"],
  ["The Dopest Collection, Vol. 2", "02/11/2024", "199751514697"],
  ["Ma Luxure", "02/11/2024", "199751613871"],
  ["Hot", "02/11/2024", "199751508283"],
  ["836.722 (1995) [18] [73]", "04/11/2024", "199751168234"],
  ["Transcendence Of Natural Truths", "04/11/2024", "199751170992"],
  ["Ma Luxure 2 (MVP)", "07/11/2024", "199956557857"],
  ["NFLT Social Community (The Most Advanced Societies)", "04/12/2024", "199954147302"],
  ["L'écran vient de chez nous (Radio Edit)", "23/11/2025", "199951252436"],
  ["GR 4LIFE", "07/02/2026", "821440674572"],
];
describe("Owner-supplied catalogue", () => {
  it.each(supplied)("preserves %s, supplied date %s and UPC %s", (title, suppliedDate, upc) => {
    expect(releases.find((r) => r.upc === upc)).toEqual({
      title,
      suppliedDate,
      upc,
      artist: "NFLT",
      label: "NFLT Records",
      dateStatus: "Release date as supplied",
    });
  });
  it("contains precisely 18 confirmed releases", () => expect(releases).toHaveLength(18));
  it("never certifies supplied dates or invents formats, artwork or links", () => {
    for (const r of releases) {
      expect(r).not.toHaveProperty("format");
      expect(r).not.toHaveProperty("artwork");
      expect(r).not.toHaveProperty("spotify");
      const script = releaseHead(r, "fr").scripts[0];
      if (!script) throw new Error("Release schema missing");
      const schema = JSON.parse(script.children);
      expect(schema).not.toHaveProperty("datePublished");
      expect(schema.image).toBe(`https://nflt-records.com${releaseCovers[r.upc]}`);
      expect(schema).not.toHaveProperty("isrcCode");
    }
  });
  it("shows exactly the 18 owner-supplied covers, one per release UPC", () => {
    expect(Object.keys(releaseCovers).sort()).toEqual(releases.map((r) => r.upc).sort());
    for (const url of Object.values(releaseCovers)) {
      expect(url).toMatch(/^\/assets\/covers\//);
    }
    expect(goldLogoUrl).toBe("/nflt-records-favicon.png");
  });
  it("filters by supplied year without guessing a format", () =>
    expect(filterReleases("2024", "")).toHaveLength(9));
  it("combines year and title search", () =>
    expect(filterReleases("2024", "luxure").map((r) => r.upc)).toEqual([
      "199751613871",
      "199956557857",
    ]));
  it("keeps the two authorised Spotify profiles attached only to the artist", () => {
    expect(artistSchema["@type"]).toBe("Person");
    expect(artistSchema.sameAs).toEqual([
      "https://open.spotify.com/artist/2kcuv7ZpGK97c1UPBj1RIk",
      "https://open.spotify.com/artist/1xOHMeJwYAOE5RxW1hYgZh",
    ]);
    expect(artistBiographies).toHaveLength(2);
    expect(artistBiographies[0].text).not.toBe(artistBiographies[1].text);
  });
});
