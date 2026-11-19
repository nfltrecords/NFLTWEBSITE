import commerceConfig from "../../.lovable/commerce-config.json";

/** Require both the private approval record and an explicit server-side activation flag. */
export function payPalCheckoutIsEnabled(value = process.env["PAYPAL_CHECKOUT_ENABLED"]): boolean {
  return commerceConfig.checkoutEnabled === true && value === "true";
}
