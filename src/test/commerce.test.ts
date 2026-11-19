/* eslint-disable prettier/prettier -- test assertions intentionally kept compact. */
import { describe, expect, it } from "vitest";
import {
  commerceSearchSchema,
  inquirySchema,
  shopPriceTiers,
  formatShopPrice,
  priceForTrackCount,
  releasePriceCents,
  verifiedReleaseTrackCounts,
} from "@/lib/commerce";
import { releases } from "@/lib/catalogue";
import { checkoutActivationApproved, payPalCheckoutIsEnabled } from "@/lib/paypal-checkout-gate";
import commerceConfig from "../../.lovable/commerce-config.json";

const input = {
  name: "Test",
  email: "test@example.com",
  organization: "",
  inquiry_type: "licensing",
  release_upc: "821440674572",
  usage: "film",
  territory: "France",
  duration: "1 year",
  message: "Licensing inquiry",
  locale: "fr",
};

describe("Commerce inquiry rules", () => {
  it("keeps PayPal checkout closed unless an explicit server-side activation flag is true", () => {
    expect(checkoutActivationApproved).toBe(false);
    expect(payPalCheckoutIsEnabled(undefined)).toBe(false);
    expect(payPalCheckoutIsEnabled("false")).toBe(false);
    expect(payPalCheckoutIsEnabled("TRUE")).toBe(false);
    expect(payPalCheckoutIsEnabled("true")).toBe(false);
  });

  it("prices only the confirmed reference tiers", () => {
    expect(priceForTrackCount(1)).toBe(999);
    expect(priceForTrackCount(5)).toBe(1499);
    for (const count of [6, 7, 18, 30]) expect(priceForTrackCount(count)).toBe(1999);
    for (const count of [2, 3, 4, undefined, 0, -1, 1.5, NaN, Infinity])
      expect(priceForTrackCount(count)).toBeNull();
  });

  it("keeps the provisional catalogue mapping explicit and checkout disabled", () => {
    expect(Object.keys(verifiedReleaseTrackCounts)).toHaveLength(18);
    expect(releases.every((release) => verifiedReleaseTrackCounts[release.upc] !== undefined)).toBe(true);
    expect(releasePriceCents("199956222809")).toBe(1999);
    expect(releasePriceCents("199955742094")).toBe(1999);
    for (const release of releases.filter((r) => !["199956222809", "199955742094"].includes(r.upc))) {
      expect(verifiedReleaseTrackCounts[release.upc]).toBe(1);
      expect(releasePriceCents(release.upc)).toBe(999);
    }
    expect(commerceConfig.checkoutEnabled).toBe(false);
    expect(commerceConfig.checkoutReadiness.trackCountsAndPriceTierMapping).toBe("pending");
  });

  it("does not publish company identifiers or claim legal approval", () => {
    expect(commerceConfig.companyRecords.status).toBe("owner-provided-identifiers-held-outside-public-repository");
    expect(commerceConfig.companyRecords.independentlyRevalidated).toBe(false);
    expect(commerceConfig.companyRecords.requestExistingCompanyDocumentsAgain).toBe(false);
    expect(commerceConfig.companyRecords.publicLegalCopyApproved).toBe(false);
    expect(Object.keys(commerceConfig.companyRecords)).toEqual([
      "status",
      "independentlyRevalidated",
      "requestExistingCompanyDocumentsAgain",
      "publicLegalCopyApproved",
    ]);
  });

  it("keeps seller assignment pending and does not infer the seller for digital or licensing", () => {
    expect(commerceConfig.intendedEUSeller).toBeNull();
    expect(commerceConfig.sellerStatus).toBe("not-default-for-digital-licensing-or-all-online-purchases");
    expect(commerceConfig.sellerRoleClarification.digitalDownloadsAndLicensing.franceIsDefaultSeller).toBe(false);
    expect(commerceConfig.sellerRoleClarification.digitalDownloadsAndLicensing.franceIsDefaultLicensingCounterparty).toBe(false);
    expect(commerceConfig.sellerRoleClarification.physicalCDPurchases.associatedEntity).toBe("SAS NFLT RECORDS FRANCE");
    expect(commerceConfig.sellerRoleClarification.physicalCDPurchases.sellerOfRecordConfirmed).toBe(false);
    expect(commerceConfig.sellerRoleClarification.physicalCDPurchases.applicableTerritoryConfirmed).toBe(false);
    expect(commerceConfig.sellerRoleClarification.physicalCDPurchases.franceOnlyCustomers).toBe(false);
  });

  it("keeps owner and company authorization details out of the public configuration", () => {
    expect("ownerConfirmedAuthorization" in commerceConfig).toBe(false);
    expect("vat" in commerceConfig.companyRecords).toBe(false);
    expect("inc" in commerceConfig.companyRecords).toBe(false);
    expect("france" in commerceConfig.companyRecords).toBe(false);
    expect("registeredOffice" in commerceConfig.companyRecords).toBe(false);
    expect("president" in commerceConfig.companyRecords).toBe(false);
  });

  it("keeps intended formats distinct from delivered files", () => {
    expect(commerceConfig.intendedDeliveryFormats.formats).toEqual(["MP3", "WAV"]);
    expect(commerceConfig.intendedDeliveryFormats.status).toBe("intended-only");
    expect(commerceConfig.checkoutReadiness.mp3AndWavFiles).toContain("pending");
  });

  it("requires a verified sender and delivery test without changing contact", () => {
    expect(commerceConfig.licensingNotificationReadiness.status).toBe("pending-verified-sender-and-delivery-test");
    expect(commerceConfig.licensingNotificationReadiness.emailDeliveryEnabled).toBe(false);
    expect(commerceConfig.licensingNotificationReadiness.existingContactWorkflow).toBe("unchanged");
  });

  it("keeps the checkout readiness gates closed", () => {
    expect(commerceConfig.checkoutReadiness.explicitCheckoutActivationApproval).toBe("not-granted");
    expect(commerceConfig.checkoutReadiness.paymentProviderAndMerchantAccount).toBe("not-selected-or-integrated");
    expect(commerceConfig.checkoutReadiness.ordersInvoicesSecureDeliveryAndRefunds).toBe("not-implemented");
    expect(commerceConfig.sellerOfRecordPreparation.automaticSellerAssignment).toBe(false);
    expect(commerceConfig.sellerOfRecordPreparation.productSellerAssignments).toEqual({});
    expect(commerceConfig.sellerOfRecordPreparation.approvedTerritories).toEqual([]);
  });

  it("keeps the licensing contact channel separate from user-provided recipients", () => {
    expect(inquirySchema.safeParse({ ...input, recipient: "other@example.com", card: "1234" }).success).toBe(false);
  });

  it("preserves only the three confirmed reference price tiers", () => {
    expect(shopPriceTiers.map((tier) => [tier.tracks, tier.currency])).toEqual([
      [1, "EUR"], [5, "EUR"], [6, "EUR"],
    ]);
    expect(formatShopPrice(999)).toBe("9,99 €");
    expect(formatShopPrice(1499)).toBe("14,99 €");
    expect(formatShopPrice(1999)).toBe("19,99 €");
  });

  it.each(releases)("accepts the existing release $upc without adding products", (r) =>
    expect(inquirySchema.safeParse({ ...input, release_upc: r.upc }).success).toBe(true),
  );
  it("rejects an invented release", () =>
    expect(inquirySchema.safeParse({ ...input, release_upc: "123456789012" }).success).toBe(false));
  it.each(["audiovisual", "advertising", "film", "creator", "game"])(
    "accepts %s licensing inquiries",
    (usage) => expect(inquirySchema.safeParse({ ...input, usage }).success).toBe(true),
  );
  it("supports purchase interest without a checkout", () =>
    expect(inquirySchema.safeParse({ ...input, inquiry_type: "availability" }).success).toBe(true));
  it("rejects invalid emails and oversized messages", () => {
    expect(inquirySchema.safeParse({ ...input, email: "invalid" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...input, message: "x".repeat(3001) }).success).toBe(false);
  });
  it("drops invalid preselection", () =>
    expect(commerceSearchSchema.parse({ release: "invented", intent: "buy" })).toEqual({
      release: undefined,
      intent: undefined,
    }));
  it.each(releases)("preserves availability and licensing intent for UPC $upc in both languages", (r) => {
    for (const locale of ["fr", "en"])
      for (const intent of ["availability", "licensing"] as const) {
        expect(commerceSearchSchema.parse({ release: r.upc, intent })).toEqual({
          release: r.upc,
          intent,
        });
        expect(inquirySchema.safeParse({ ...input, release_upc: r.upc, inquiry_type: intent, locale }).success).toBe(true);
      }
  });
});
