import { describe, expect, it } from "vitest";
import { implantations, mobileApplication, validatedGooglePlayUrl } from "@/lib/brand-content";

describe("Owner-confirmed application and locations", () => {
  it("keeps the exact application and developer identities", () => {
    expect(mobileApplication.name).toBe("NFLT RECORDS");
    expect(mobileApplication.developer).toBe("Apps wiz");
  });
  it("uses the exact official Google Play link confirmed by the owner", () => {
    const officialUrl =
      "https://play.google.com/store/apps/details?id=com.appswiz.nfltrecordshfegh";
    expect(mobileApplication.googlePlayUrl).toBe(officialUrl);
    expect(validatedGooglePlayUrl(mobileApplication.googlePlayUrl)).toBe(officialUrl);
  });
  it("keeps download unavailable when no link exists", () => {
    expect(validatedGooglePlayUrl(null)).toBeNull();
  });
  it("preserves the confirmed package identifier and its official store destination", () => {
    expect(mobileApplication.packageId).toBe("com.appswiz.nfltrecordshfegh");
    expect(new URL(mobileApplication.googlePlayUrl).searchParams.get("id")).toBe(
      mobileApplication.packageId,
    );
  });
  it("rejects invalid or non-Google Play store destinations", () => {
    for (const value of [
      "invalid",
      "https://example.com",
      "http://play.google.com/store/apps/details?id=test",
      "https://play.google.com/store/apps/details",
      "https://play.google.com.evil.example/store/apps/details?id=test",
    ]) {
      expect(validatedGooglePlayUrl(value)).toBeNull();
    }
  });
  it("does not declare an unconfirmed iOS version", () => {
    expect(mobileApplication).not.toHaveProperty("ios");
    expect(mobileApplication).not.toHaveProperty("appStoreUrl");
  });
  it("associates the parent company with New York", () => {
    expect(implantations[0].name).toBe("NFLT RECORDS INC.");
    expect(implantations[0].city.fr).toBe("New York");
  });
  it("associates the French subsidiary with Paris", () => {
    expect(implantations[1].name).toBe("NFLT RECORDS FRANCE");
    expect(implantations[1].city.fr).toBe("Paris");
  });
  it("associates the Brussels branch with Bruxelles", () => {
    expect(implantations[2].name).toBe("NFLT RECORDS BRUSSELS");
    expect(implantations[2].city.fr).toBe("Bruxelles");
    expect(implantations[2].city.en).toBe("Brussels");
  });
});
