/**
 * Live PayPal checkout is enabled for releases whose complete original WAV masters
 * are verified in R2/D1. The server re-checks availability before creating each order.
 * Releases without a complete WAV set remain unavailable in the shop.
 */
export const checkoutActivationApproved = true;

export function payPalCheckoutIsEnabled(): boolean {
  return checkoutActivationApproved;
}
