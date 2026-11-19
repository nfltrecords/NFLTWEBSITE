# PayPal Checkout integration — private implementation notes

Status: server adapter prepared; checkout remains disabled.

## Required Cloudflare Worker secrets

- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_MODE` = `sandbox` for testing, then `live` only after end-to-end approval
- `PAYPAL_WEBHOOK_ID` after registering the production webhook URL

Never put the client secret in browser code, Git, chat, or a public environment variable.

## Safety gates still required before enabling checkout

1. Persist a pending order server-side before redirecting to PayPal; never trust a browser-supplied price.
2. Re-verify every UPC-to-track-count mapping against primary catalogue evidence; the current map contains provisional counts and must not be treated as checkout authorization.
3. Confirm per-release seller, rights, territory and MP3/WAV master availability.
4. Implement idempotent capture and persist PayPal order/capture IDs and final state.
5. Verify webhook signatures with PayPal and fulfill only on `PAYMENT.CAPTURE.COMPLETED`; never fulfill on approval or pending status.
6. Test sandbox create, approve, capture, duplicate webhook, denied payment, refund/reversal, and failure paths.
7. Apply `drizzle/migrations/0002_create_private_shop_orders.sql` to the connected Supabase database, then add restricted service-role order operations before exposing checkout UI.

## Server checkout functions committed

`src/lib/paypal.functions.ts` contains server functions to create a pending order using a server-derived UPC price, request PayPal approval, and confirm/capture only against the matching stored order. It verifies the returned capture status, EUR currency and exact amount before marking an order paid. These functions are not connected to the shop UI and have not been exercised against PayPal Sandbox. The UPC track-count map now contains provisional values for all 18 releases; these values still require primary evidence review. A separate two-part fail-closed activation gate now requires both `checkoutEnabled: true` in the private commerce configuration and `PAYPAL_CHECKOUT_ENABLED=true` in the server environment. The recorded configuration remains `false`, so neither starting checkout nor browser confirmation can proceed, even if the environment flag is accidentally set.

## Database foundation committed

`drizzle/migrations/0002_create_private_shop_orders.sql` defines a private `shop_orders` ledger and an idempotency ledger for verified PayPal webhook events. RLS is enabled, and `anon` / `authenticated` receive no table privileges; only `service_role` is granted access. The migration is committed but has **not** been applied to the live Lovable/Supabase database.

## Current behaviour

This adapter has no UI entry point and does not enable payments. It fails closed unless both the private approval record and the explicit server-side activation flag are enabled; the approval record remains false. It also fails closed when PayPal credentials are absent. Sandbox is the default; live mode must be deliberately configured.

## Raw-body webhook verification correction

The earlier parsed-and-reserialized webhook verification limitation has been corrected in `src/lib/paypal.server.ts` and the route now passes the original request body unchanged to PayPal's verification API. Preserve this raw-body path; do not replace it with JSON parse/stringify before verification.

## Webhook endpoint added — not yet validated in Sandbox

`src/routes/api.paypal.webhook.ts` now defines the TanStack Start POST endpoint at `/api/paypal/webhook`. It captures the original request body before parsing, checks the PayPal transmission headers and HTTPS certificate URL, asks PayPal to verify the signature while embedding the original event JSON unchanged, stores event IDs in the private idempotency ledger, and only marks a matching order paid for a verified `PAYMENT.CAPTURE.COMPLETED` event whose EUR amount matches the stored order. Duplicate completed events are acknowledged without applying the payment twice. If a verified capture arrives before its order row is visible, the endpoint returns HTTP 503 so PayPal can retry delivery; it no longer acknowledges that unprocessed capture with a 2xx response. The browser confirmation path also checks the persisted capture ID after a concurrent webhook update rather than assuming an empty database update succeeded. The route has not been built or tested against real PayPal Sandbox deliveries. It requires the SQL migration and `SUPABASE_SERVICE_ROLE_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_WEBHOOK_ID` before it can operate. Do not register the endpoint in the PayPal dashboard or enable live checkout until the build and Sandbox delivery/retry tests pass.
