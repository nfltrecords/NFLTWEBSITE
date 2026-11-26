# NFLT RECORDS — Shopify sole commerce platform and continuation record

**Date:** 26 November 2026  
**Repository:** `nfltrecords/NFLTWEBSITE`, branch `main`  
**Store:** https://shop.nflt-records.com/  
**Decision:** Shopify Advanced is the sole merchant platform. BigCommerce is abandoned.

## Permanent platform decision

- Shopify Advanced owns the online catalog, cart, checkout, payments, orders and digital delivery.
- PayPal approved and connected inside Shopify is the payment provider to retain. Do not disconnect it or turn it off because of any legacy Cloudflare code.
- BigCommerce is not part of the NFLT stack going forward. No BigCommerce credentials, app, checkout or migration should be configured.
- The Cloudflare-hosted website remains the label's main website and links to the Shopify store.
- The legacy Cloudflare PayPal IPN/API checkout is retired. `checkoutActivationApproved=false` applies only to that old checkout and must not be interpreted as a global payment block.
- The legacy Cloudflare checkout has been removed from the customer-facing boutique flow. The main site's boutique now directs customers to Shopify.

## Shopify work completed and verified

- Store context read directly: `shop.nflt-records.com`, Advanced plan, France, EUR.
- All 18 existing Shopify products were re-read. No duplicates were created.
- SKU/UPC and prices were retained.
- All 18 HD cover images were attached to their matching products using the UPC-based files from `public/assets/covers/`.
- Shopify read-back confirmed each product has a featured image of **1536 × 1536 px**, with matching alt text.
- Created the manual collection `Catalogue NFLT RECORDS` with all 18 products.
- Updated the main navigation to include the new collection.
- The products remain DRAFT; no product was published.

## Digital delivery and product publication

- Shopify Digital Products is installed and the connector test succeeds.
- No WAV file is currently attached to any of the 18 product variants through Digital Products.
- Private R2 object URLs are not valid file attachments for Digital Products. Its upload workflow needs the actual file to be uploaded to Shopify storage.
- Do not attach M4A sources as WAV masters. Do not convert, recompress or replace the originals.
- Do not publish any product until its complete original WAV track set is attached and a test download is verified.
- This product-level draft protection is not a reason to disable PayPal globally in Shopify.

## Payment status — careful distinction

- PayPal's approval/connection inside Shopify was confirmed by the owner's Shopify screenshot and instruction. Keep it.
- This record does not claim a completed live customer payment, a bank payout or a successful end-to-end digital delivery; those require a real controlled test.
- Do not reactivate the retired Cloudflare PayPal IPN checkout in parallel. Shopify is the single order/payment authority to avoid duplicate orders or duplicate delivery.
- The seller-of-record, VAT, consumer terms and territories remain separate legal checks; this document does not declare legal compliance.

## Permanent anti-regression rule

Every future audit, roadmap and handoff must state:
1. Shopify is the only commerce platform.
2. BigCommerce is abandoned.
3. Shopify PayPal remains connected and must not be disabled by the legacy Cloudflare checkout gate.
4. The legacy Cloudflare PayPal checkout remains retired.
5. Digital products remain unpublished until their complete original WAV delivery file is attached and tested.

## Relevant commits

- Website boutique routes purchases to Shopify: `7fc16a627b84332d24a145c99745a9129f825e9d`
- Legacy Cloudflare PayPal gate documented as retired: `e6bddf51cf53f9840d28b92d51392d59bafd13a3`
- Master operating truth corrected: `5d70e6bcbbac3b9cf227d81a6bb29ef00f1a84f3`
- Roadmap corrected: `f65f019517b2b2f0c4dab853996fd2f05fc7378d`
- PayPal readiness report superseded: `1a33c196b6c6748ec4716d7fae6d42e5c0411e18`
