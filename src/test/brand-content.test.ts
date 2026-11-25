import { describe, expect, it } from "vitest";
import { implantations, mobileApplication, validatedGooglePlayUrl } from "@/lib/brand-content";

describe("Owner-confirmed application and locations", () => {
  it("keeps the official application name without public developer attribution", () => {
    expect(mobileApplication.name).toBe("NFLT RECORDS");
    expect(mobileApplication).not.toHaveProperty("developer");
  });
  it("keeps the download link disabled while the application is unpublished", () => {
    expect(mobileApplication.googlePlayUrl).toBeNull();
    expect(validatedGooglePlayUrl(mobileApplication.googlePlayUrl)).toBeNull();
  });
  it("keeps download unavailable when no link exists", () => {
    expect(validatedGooglePlayUrl(null)).toBeNull();
  });
  it("does not expose the legacy package identifier on the public application page", () => {
    expect(mobileApplication).not.toHaveProperty("packageId");
    expect(mobileApplication.googlePlayUrl).toBeNull();
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
