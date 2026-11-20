import { describe, expect, it } from "vitest";
import review from "../../.lovable/catalogue-readiness-review.json";
import { releases } from "@/lib/catalogue";
import { verifiedReleaseTrackCounts, releasePriceCents } from "@/lib/commerce";
import { releaseCovers } from "@/lib/covers";

describe("Owner-reported original artwork evidence", () => {
  it("records all 18 owner-confirmed 3000 by 3000 JPG originals without a missing cover", () => {
    expect(review.ownerReportedOriginals.count).toBe(18);
    expect(review.ownerReportedOriginals.dimensions).toEqual([3000, 3000]);
    expect(review.ownerReportedOriginals.format).toBe("JPG");
    expect(review.ownerReportedOriginals.releaseScreenshotsReported).toBe(true);
    expect(
      review.releases.every((release) => release.hdOriginalStatus === "missing-replacement-needed"),
    ).toBe(false);
  });
  it("records the omitted turn-133 original exactly without assigning an unproved UPC", () => {
    expect(review.ownerReportedOriginals.previouslyOmittedOriginal).toEqual({
      filename: "3000x3000-10608196--FECC901C-D13F-46EF-A31A3746312C0B99--0--786111--IMG00060.jpg",
      contentType: "image/jpeg",
      conversationTurnAsReported: 133,
      upc: null,
      mappingStatus: "received-1536-square-CSV-candidate-199955742094-no-UPC-in-Spotify-screenshot",
    });
  });
  it("records 18 received binaries at their measured dimensions, not their filename dimensions", () => {
    expect(review.packageAudit.originalCount).toBe(18);
    expect(review.packageAudit.measuredDimensions).toEqual([1536, 1536]);
    expect(new Set(review.releases.map((release) => release.suppliedArtwork.sha256)).size).toBe(18);
    expect(
      review.releases.every(
        (release) =>
          release.suppliedArtwork.dimensions[0] === 1536 &&
          release.suppliedArtwork.dimensions[1] === 1536,
      ),
    ).toBe(true);
  });
  it("integrates only the 16 screenshot-verified UPC associations", () => {
    expect(review.releases.filter((release) => release.suppliedArtwork.integrated)).toHaveLength(
      16,
    );
    for (const release of review.releases.filter((release) => release.suppliedArtwork.integrated)) {
      expect(releaseCovers[release.upc]).toContain(`cover-${release.upc}.jpg`);
      expect(release.suppliedArtwork.mappingStatus).toBe(
        "screenshot-title-artwork-and-UPC-verified",
      );
    }
  });
  it("integrates the two owner-confirmed originals for their stated UPCs", () => {
    expect(review.packageAudit.unverifiedUPCs).toEqual([]);
    expect(releaseCovers["199955715135"]).toContain("cover-199955715135.jpg");
    expect(releaseCovers["199955742094"]).toContain("cover-199955742094.jpg");
    expect(Object.keys(releaseCovers)).toHaveLength(18);
  });
  it("retains all 18 canonical UPCs but assigns track-count evidence only where confirmed", () => {
    expect(review.releases.map((release) => release.upc)).toEqual(
      releases.map((release) => release.upc),
    );
    expect(review.releases).toHaveLength(18);
    expect(verifiedReleaseTrackCounts).toEqual({
      "199955715135": 1,
      "199955742094": 8,
    });
    for (const release of releases) {
      if (release.upc === "199955715135") expect(verifiedReleaseTrackCounts[release.upc]).toBe(1);
      else if (release.upc === "199955742094") expect(verifiedReleaseTrackCounts[release.upc]).toBe(8);
      else expect(verifiedReleaseTrackCounts[release.upc]).toBeUndefined();
    }
    expect(releasePriceCents("199955715135")).toBe(999);
    expect(releasePriceCents("199955742094")).toBe(1999);
    for (const release of releases.filter((r) => !["199955715135", "199955742094"].includes(r.upc))) {
      expect(releasePriceCents(release.upc)).toBeNull();
    }
  });
});
