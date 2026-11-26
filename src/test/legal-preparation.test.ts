import { readFileSync } from "node:fs";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { legalPages, legalPageHead, type LegalPage } from "@/lib/seo";
import commerceConfig from "../../.lovable/commerce-config.json";

describe("Private legal preparation boundaries", () => {
  it("does not presume a sole seller or limit customers to France", () => {
    const prep = commerceConfig.sellerOfRecordPreparation;
    expect(prep.soleSellerAssumed).toBe(false);
    expect(prep.customersLimitedToFrance).toBe(false);
    expect(prep.brandIsContractingSeller).toBe(false);
    expect(commerceConfig.sellerRoleClarification.physicalCDPurchases.associatedEntity).toBe(
      "SAS NFLT RECORDS FRANCE",
    );
    expect(commerceConfig.sellerRoleClarification.digitalDownloadsAndLicensing.assignment).toBe(
      "pending-per-transaction-rights-fulfillment-and-territory-review",
    );
    expect(prep.automaticSellerAssignment).toBe(false);
    expect(prep.franceDefaultForDigitalDownloads).toBe(false);
    expect(prep.franceDefaultForLicensing).toBe(false);
    expect(prep.franceDefaultForAllOnlinePurchases).toBe(false);
  });
  it("requires product rights, fulfillment and territory evidence without assigning sellers", () => {
    const prep = commerceConfig.sellerOfRecordPreparation;
    expect(prep.assignmentFactors).toEqual([
      "product-category",
      "product-release",
      "controlled-rights",
      "fulfillment-arrangement",
      "customer-territory",
    ]);
    expect(prep.automaticSellerAssignment).toBe(false);
    expect(prep.productSellerAssignments).toEqual({});
    expect(prep.approvedTerritories).toEqual([]);
  });
  it("keeps seller particulars, pricing and consumer-law review explicitly outstanding", () => {
    const prep = commerceConfig.sellerOfRecordPreparation;
    expect(prep.requiredBeforeCheckout).toEqual([
      "exact-contracting-entity",
      "validated-registration-address-details",
      "validated-seller-contact",
      "applicable-tax-and-total-price",
      "validated-governing-law",
      "mandatory-consumer-protections",
      "applicable-terms-version",
    ]);
    expect(prep.globalFrenchLawAssumed).toBe(false);
    expect(prep.governingLawAssignments).toEqual({});
    expect(commerceConfig.checkoutEnabled).toBe(false);
    expect(commerceConfig.checkoutReadiness.sellerAssignment).toContain(
      "legal-seller-of-record-review-pending",
    );
    expect(commerceConfig.checkoutReadiness.salesTermsRefundWithdrawalMediatorAndPrivacy).toBe(
      "pending-confirmation",
    );
  });
  it("separates physical CDs from digital downloads and licensing in both private drafts", () => {
    const fr = readFileSync(".lovable/legal/conditions-de-vente.fr.md", "utf8");
    const en = readFileSync(".lovable/legal/terms-of-sale.en.md", "utf8");
    expect(fr).toContain("CD physiques");
    expect(fr).toContain(
      "n’est pas le vendeur par défaut des téléchargements numériques, des licences",
    );
    expect(fr).toContain("ne limite pas les acheteurs de CD à la France");
    expect(en).toContain("Physical CDs are a category distinct from digital downloads");
    expect(en).toContain(
      "not the default seller for digital downloads, licensing or all online purchases",
    );
    expect(en).toContain("does not limit CD customers to France");
  });
  it.each(["terms", "privacy"] as const)(
    "keeps %s unindexed and out of the public sitemap in FR/EN",
    (page: LegalPage) => {
      const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
      const xml = readFileSync("public/sitemap.xml", "utf8");
      for (const locale of ["fr", "en"] as const) {
        const path = legalPages[page][locale];
        const match = router.matchRoutes(path).at(-1);
        expect(match?.routeId).not.toBe(rootRouteId);
        expect(match?.pathname).toBe(path);
        const head = legalPageHead(page, locale);
        expect(head.meta.find((meta) => "name" in meta && meta.name === "robots")?.content).toBe(
          "noindex,nofollow",
        );
        expect(head.links.find((link) => link.rel === "canonical")?.href).toBe(
          `https://nflt-records.com${path}`,
        );
        expect(xml).not.toContain(path);
      }
    },
  );
});
