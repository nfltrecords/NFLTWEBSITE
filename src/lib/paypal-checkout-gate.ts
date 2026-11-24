/**
 * Keep checkout closed until the readiness checks pass and the owner explicitly approves
 * live activation. A request to repair the implementation does not activate payments.
 */
export const checkoutActivationApproved = false;

export function payPalCheckoutIsEnabled(): boolean {
  return checkoutActivationApproved;
}
