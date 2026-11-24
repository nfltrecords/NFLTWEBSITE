/**
 * PayPal checkout activation explicitly approved by the owner.
 * Payment processing still depends on the configured PayPal account credentials.
 */
export const checkoutActivationApproved = false;

export function payPalCheckoutIsEnabled(): boolean {
  return checkoutActivationApproved;
}
