/**
 * Legacy PayPal checkout on the Cloudflare-hosted site is retired.
 * Shopify is the sole merchant checkout for NFLT RECORDS; the PayPal
 * provider connected inside Shopify is retained and must not be disabled.
 * This gate applies only to the obsolete Cloudflare PayPal flow.
 */
export const checkoutActivationApproved = false;

export function payPalCheckoutIsEnabled(): boolean {
  return checkoutActivationApproved;
}
