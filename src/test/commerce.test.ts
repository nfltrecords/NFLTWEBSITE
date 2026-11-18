import { describe, expect, it } from "vitest";
import {
  commerceSearchSchema,
  inquirySchema,
  LICENSING_RECIPIENT,
  shopPriceTiers,
  formatShopPrice,
  priceForTrackCount,
  releasePriceCents,
  verifiedReleaseTrackCounts,
} from "@/lib/commerce";
import { releases } from "@/lib/catalogue";
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
  it("prices exactly one actual track at 999 cents", () => { expect(priceForTrackCount(1)).toBe(999); });
  it("prices exactly five actual tracks at 1499 cents", () => { expect(priceForTrackCount(5)).toBe(1499); });
  it("prices six or more actual tracks at 1999 cents", () => { for (const count of [6, 7, 18, 30]) expect(priceForTrackCount(count)).toBe(1999); });
  it("does not invent tiers for two, three or four tracks", () => { for (const count of [2, 3, 4]) expect(priceForTrackCount(count)).toBeNull(); });
  it("does not price missing or invalid counts", () => { for (const count of [undefined, 0, -1, 1.5, NaN, Infinity]) expect(priceForTrackCount(count)).toBeNull(); });
  it("has provisional track counts for every catalog UPC and applies the price tiers", () => {
    expect(Object.keys(verifiedReleaseTrackCounts)).toHaveLength(18);
    expect(releases.every((release) => verifiedReleaseTrackCounts[release.upc] !== undefined)).toBe(true);
    expect(releasePriceCents("199956222809")).toBe(1999);
    expect(releasePriceCents("199955742094")).toBe(1999);
    for (const release of releases.filter((r) => !["199956222809", "199955742094"].includes(r.upc)) {
      expect(verifiedReleaseTrackCounts[release.upc]).toBe(1);
      expect(releasePriceCents(release.upc)).toBe(999);
    }
  });
  it("records the exact owner-provided French company identifiers privately", () => {
    const { vat, ...france } = commerceConfig.companyRecords.france;
    expect(france).toEqual({ name: "SAS NFLT RECORDS FRANCE", legalForm: "SAS", siren: "999268741", siret: "99926874100017", registeredOffice: "Bureau 326 SOURCE, 78 AV DES CHAMPS ELYSEES, 75008 PARIS", ape: "5920Z", president: "Mohamed-Ali Jarry" });
  });
  it("records VIES validation from the supplied evidence without inferring VAT treatment", () => {
    expect(commerceConfig.companyRecords.france.vat).toEqual({ id: "FR89999268741", status: "VIES-validated", formatMatchesSirenKey: true, viesValidation: "validated", evidenceDate: "2026-11-14", evidenceSource: "owner-supplied-VIES-screenshot-details", evidenceTimestampAsShown: "14/11/2026 11:31:39", memberState: "FR", numberAsShown: "89999268741", resultAsShown: "Oui, numéro de TVA valide" });
    const siren = Number(commerceConfig.companyRecords.france.siren);
    expect((12 + 3 * (siren % 97)) % 97).toBe(89);
    expect(commerceConfig.checkoutReadiness.viesValidationAndVatTreatment).toBe("VIES-validated-vat-treatment-pending");
  });
  it("records the exact owner-provided INC. identifiers separately", () => {
    expect(commerceConfig.companyRecords.inc).toEqual({ name: "NFLT RECORDS INC.", ein: "36-5112157", newYorkDosId: "7371381", incorporationDate: "2024-07-11", registeredMailingAddress: "447 Broadway, Floor 2, #656, New York, NY 10013", registeredAgent: "Republic Registered Agent Services Inc." });
  });
  it("does not request existing company documents or approve public legal copy", () => { expect(commerceConfig.companyRecords.requestExistingCompanyDocumentsAgain).toBe(false); expect(commerceConfig.companyRecords.publicLegalCopyApproved).toBe(false); expect(commerceConfig.companyRecords.independentlyRevalidated).toBe(false); });
  it("requires a verified sender and delivery test for licensing without changing contact", () => { expect(commerceConfig.licensingNotificationReadiness).toEqual({ recipient: "nfltrecords@nflt-records.com", status: "pending-verified-sender-and-delivery-test", senderVerification: "pending", recipientDeliveryTest: "pending", emailDeliveryEnabled: false, existingContactWorkflow: "unchanged", domainStatus: "not-rechecked-no-expiry-assumption" }); });
  it("keeps per-release rights and seller assignment pending after company identification", () => { expect(commerceConfig.checkoutReadiness.productRightsAndMasters).toBe("pending-per-release-verification"); expect(commerceConfig.checkoutReadiness.sellerAssignment).toBe("pending-per-product-rights-verification"); });
  it("keeps files pending and checkout disabled after private readiness preparation", () => { expect(commerceConfig.checkoutReadiness.mp3AndWavFiles).toBe("pending-existing-audio-inventory-location-and-format-verification-remaining-masters-from-DistroKid-Vault"); expect(commerceConfig.intendedDeliveryFormats.formats).toEqual(["MP3", "WAV"]); expect(commerceConfig.intendedDeliveryFormats.status).toBe("intended-only"); expect(commerceConfig.checkoutEnabled).toBe(false); expect(commerceConfig.checkoutReadiness.explicitCheckoutActivationApproval).toBe("not-granted"); });
  it("does not treat NFLT RECORDS FRANCE as the default seller for digital, licensing or all online purchases", () => { expect(commerceConfig.intendedEUSeller).toBeNull(); expect(commerceConfig.sellerStatus).toBe("not-default-for-digital-licensing-or-all-online-purchases"); expect(commerceConfig.sellerRoleClarification.digitalDownloadsAndLicensing.franceIsDefaultSeller).toBe(false); expect(commerceConfig.sellerRoleClarification.digitalDownloadsAndLicensing.franceIsDefaultLicensingCounterparty).toBe(false); });
  it("associates NFLT RECORDS FRANCE with physical CDs without confirming seller or territory", () => { const physical = commerceConfig.sellerRoleClarification.physicalCDPurchases; expect(physical.associatedEntity).toBe("SAS NFLT RECORDS FRANCE"); expect(physical.sellerOfRecordConfirmed).toBe(false); expect(physical.applicableTerritoryConfirmed).toBe(false); expect(physical.franceOnlyCustomers).toBe(false); });
  it("keeps INC. separate for sales it owns or fulfills", () => { expect(commerceConfig.separateSeller).toEqual({ name: "NFLT RECORDS INC.", scope: "only-sales-it-owns-or-fulfills" }); });
  it("keeps checkout disabled after intended seller confirmation", () => { expect(commerceConfig.checkoutEnabled).toBe(false); });
  it("records the owner-confirmed INC. to FRANCE authorization as internal only", () => { const auth = commerceConfig.ownerConfirmedAuthorization; expect(auth.grantor).toBe("NFLT RECORDS INC."); expect(auth.grantee).toBe("NFLT RECORDS FRANCE"); expect(auth.scope).toEqual(["sell digital music downloads in Europe", "manage music-licensing inquiries for the relevant catalogue"]); expect(auth.status).toBe("owner-confirmed-internal-only"); });
  it("keeps checkout disabled after the owner-confirmed authorization", () => { expect(commerceConfig.checkoutEnabled).toBe(false); });
  it("records MP3 and WAV as the intended delivery formats, not yet available", () => { const delivery = commerceConfig.intendedDeliveryFormats; expect(delivery.formats).toEqual(["MP3", "WAV"]); expect(delivery.status).toBe("intended-only"); });
  it("prices a single / one track at exactly EUR 9.99", () => { expect(shopPriceTiers.find((tier) => tier.tracks === 1)?.cents).toBe(999); expect(formatShopPrice(999)).toBe("9,99 €"); });
  it("prices a 5-track release or EP at exactly EUR 14.99", () => { expect(shopPriceTiers.find((tier) => tier.tracks === 5)?.cents).toBe(1499); expect(formatShopPrice(1499)).toBe("14,99 €"); });
  it("prices a 6-track release or album at exactly EUR 19.99", () => { expect(shopPriceTiers.find((tier) => tier.tracks === 6)?.cents).toBe(1999); expect(formatShopPrice(1999)).toBe("19,99 €"); });
  it("contains only the three confirmed EUR tiers", () => { expect(shopPriceTiers.map((tier) => [tier.tracks, tier.currency])).toEqual([[1, "EUR"], [5, "EUR"], [6, "EUR"]]); });
  it("reserves the exact licensing recipient, distinct from the contact form", () => expect(LICENSING_RECIPIENT).toBe("nfltrecords@nflt-records.com"));
  it.each(releases)("accepts the existing release $upc without adding products", (r) => expect(inquirySchema.safeParse({ ...input, release_upc: r.upc }).success).toBe(true));
  it("rejects an invented release", () => expect(inquirySchema.safeParse({ ...input, release_upc: "123456789012" }).success).toBe(false));
  it.each(["audiovisual", "advertising", "film", "creator", "game"])("accepts %s licensing inquiries", (usage) => expect(inquirySchema.safeParse({ ...input, usage }).success).toBe(true));
  it("supports purchase interest without a checkout", () => expect(inquirySchema.safeParse({ ...input, inquiry_type: "availability" }).success).toBe(true));
  it("rejects an arbitrary recipient or payment data", () => expect(inquirySchema.safeParse({ ...input, recipient: "other@example.com", card: "1234" }).success).toBe(false));
  it("rejects invalid emails and oversized messages", () => { expect(inquirySchema.safeParse({ ...input, email: "invalid" }).success).toBe(false); expect(inquirySchema.safeParse({ ...input, message: "x".repeat(3001) }).success).toBe(false); });
  it("drops invalid preselection", () => expect(commerceSearchSchema.parse({ release: "invented", intent: "buy" })).toEqual({ release: undefined, intent: undefined }));
  it.each(releases)("preserves availability and licensing intent for UPC $upc in both languages", (r) => {
    for (const locale of ["fr", "en"]) for (const intent of ["availability", "licensing"] as const) {
      expect(commerceSearchSchema.parse({ release: r.upc, intent })).toEqual({ release: r.upc, intent });
      expect(inquirySchema.safeParse({ ...input, release_upc: r.upc, inquiry_type: intent, locale }).success).toBe(true);
    }
  });
});
