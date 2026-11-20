import { describe, expect, it } from "vitest";
import { releasePreviews } from "@/lib/previews";

describe("verified catalogue audio previews", () => {
  it("maps only the six release associations confirmed in the DistroKid review", () => {
    expect(releasePreviews).toEqual({
      "199751168234": "/assets/previews/MASTERPIECE_PREVIEW_30S.mp3",
      "199955701558": "/assets/previews/Dilemma_PREVIEW_30S.mp3",
      "821440674572": "/assets/previews/GR4LIFE_PREVIEW_30S.mp3",
      "199751508283": "/assets/previews/NFLTTHOT_PREVIEW_30S.mp3",
      "199955715203": "/assets/previews/Hustlegrind_PREVIEW_30S.mp3",
      "199751512501": "/assets/previews/NFLTINMYPARTYBEATNFLTRECORDS_PREVIEW_30S.mp3",
    });
    expect(Object.keys(releasePreviews)).toHaveLength(6);
  });

  it("does not assign a preview to a release without verified evidence", () => {
    expect(releasePreviews["199951252436"]).toBeUndefined();
    expect(releasePreviews["199956222809"]).toBeUndefined();
  });

  it("uses only the existing 30-second preview directory", () => {
    for (const src of Object.values(releasePreviews)) {
      expect(src).toMatch(/^\/assets\/previews\/.+_PREVIEW_30S\.mp3$/);
    }
  });
});
