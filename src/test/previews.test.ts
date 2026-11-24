import { describe, expect, it } from "vitest";
import { releasePreviews } from "@/lib/previews";

describe("catalogue audio previews", () => {
  it("links every explicitly matched release preview", () => {
    expect(Object.keys(releasePreviews)).toHaveLength(17);
    expect(releasePreviews["821440674572"]).toBe("/assets/previews/GR4LIFE_PREVIEW_30S.mp3");
    expect(releasePreviews["199955742094"]).toBe("/assets/previews/30.000Genocides_PREVIEW_30S.mp3");
    expect(releasePreviews["199956222809"]).toBe("/assets/previews/Nousysommes_PREVIEW_30S.mp3");
  });

  it("does not invent links for releases without an exact matching preview", () => {
    expect(releasePreviews["199956554184"]).toBeUndefined();
    expect(releasePreviews["199751613871"]).toBe("/assets/previews/NFLT_PREVIEW_30S.mp3");
    expect(releasePreviews["199956557857"]).toBe("/assets/previews/Ridewithme_PREVIEW_30S.mp3");
    expect(releasePreviews["199954147302"]).toBe("/assets/previews/NINTENDO_PREVIEW_30S.mp3");
    expect(releasePreviews["199951252436"]).toBe("/assets/previews/medley_PREVIEW_30S.mp3");
  });

  it("uses only the existing 30-second preview directory", () => {
    for (const src of Object.values(releasePreviews)) {
      expect(src).toMatch(/^\/assets\/previews\/.+_PREVIEW_30S\.mp3$/);
    }
  });
});
