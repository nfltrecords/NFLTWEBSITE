/**
 * Legacy personal-PayPal checkout is disabled while NFLT connects and verifies
 * its BigCommerce merchant account. Do not re-enable before end-to-end tests.
 */
export const checkoutActivationApproved = false;

export function payPalCheckoutIsEnabled(): boolean {
  return checkoutActivationApproved;
}
