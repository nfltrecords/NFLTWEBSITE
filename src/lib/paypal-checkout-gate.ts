/**
 * Checkout stays closed in source until the owner has completed rights, seller,
 * file-delivery and legal checks and explicitly approves activation in a reviewed commit.
 * The server environment flag alone can never activate checkout.
 */
export const checkoutActivationApproved = false;

export function payPalCheckoutIsEnabled(value = process.env["PAYPAL_CHECKOUT_ENABLED"]): boolean {
  return checkoutActivationApproved && value === "true";
}
