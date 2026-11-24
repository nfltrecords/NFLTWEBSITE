import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { releasePreviews } from "@/lib/previews";
import { verifiedReleaseTrackCounts } from "@/lib/commerce";

describe("catalogue audio previews", () => {
  it("maps all 18 releases to their archived preview assets", () => {
    expect(Object.keys(releasePreviews)).toHaveLength(18);
    expect(releasePreviews["199955742094"]).toHaveLength(8);
    expect(releasePreviews["199956222809"]).toHaveLength(9);
    expect(releasePreviews["199956554184"]).toHaveLength(5);
  });

  it("uses all 37 distinct MP3 previews that exist in public assets", () => {
    const sources = Object.values(releasePreviews).flat();
    expect(sources).toHaveLength(37);
    expect(new Set(sources).size).toBe(37);
    for (const src of sources) {
      expect(src).toMatch(/^\/assets\/previews\/.+_PREVIEW_30S\.mp3$/);
      expect(existsSync(resolve(process.cwd(), "public", src.slice(1)))).toBe(true);
    }
  });

  it("keeps every owner-verified track count aligned with its preview set", () => {
    for (const [upc, count] of Object.entries(verifiedReleaseTrackCounts)) {
      expect(releasePreviews[upc]).toHaveLength(count);
    }
    expect(verifiedReleaseTrackCounts["199955715203"]).toBeUndefined();
  });

  it("keeps preview assets separate from master delivery formats", () => {
    for (const src of Object.values(releasePreviews).flat()) {
      expect(src.toLowerCase()).not.toMatch(/\.(wav|m4a)$/);
    }
  });
});
