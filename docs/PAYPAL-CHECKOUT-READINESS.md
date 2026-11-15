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
2. Populate the UPC-to-track-count map only from verified catalogue evidence; current map is empty, so catalogue prices are intentionally withheld.
3. Confirm per-release seller, rights, territory and MP3/WAV master availability.
4. Implement idempotent capture and persist PayPal order/capture IDs and final state.
5. Verify webhook signatures with PayPal and fulfill only on `PAYMENT.CAPTURE.COMPLETED`; never fulfill on approval or pending status.
6. Test sandbox create, approve, capture, duplicate webhook, denied payment, refund/reversal, and failure paths.
7. Apply `drizzle/migrations/0002_create_private_shop_orders.sql` to the connected Supabase database, then add restricted service-role order operations before exposing checkout UI.

## Server checkout functions committed
`src/lib/paypal.functions.ts` now contains server functions to create a pending order using a server-derived UPC price, request PayPal approval, and confirm/capture only against the matching stored order. It verifies the returned capture status, EUR currency and exact amount before marking an order paid. These functions are not yet connected to the shop UI and have not been build-tested or exercised against PayPal Sandbox. The current UPC track-count map is empty, so order creation correctly returns `price_not_verified` for every catalogue release.

## Database foundation committed
`drizzle/migrations/0002_create_private_shop_orders.sql` defines a private `shop_orders` ledger and an idempotency ledger for verified PayPal webhook events. RLS is enabled, and `anon` / `authenticated` receive no table privileges; only `service_role` is granted access. The migration is committed but has **not** been applied to the live Lovable/Supabase database.

## Current behaviour
This adapter has no UI entry point and does not enable payments. It fails closed when PayPal credentials are absent. Sandbox is the default; live mode must be deliberately configured.
## Webhook verification limitation — do not register or enable yet
The current `verifyPayPalWebhook` helper in `src/lib/paypal.server.ts` sends a parsed event object back to PayPal's verification API. PayPal's current integration guide warns that the webhook event must be supplied exactly as received and that parsing then re-serializing can change formatting and cause verification failure. Therefore this helper is not yet an approved production webhook verifier. There is also no deployed HTTPS webhook listener, no raw-body preservation path, and no event-processing transaction. Do not register a live webhook or treat this helper as sufficient proof of payment until the listener preserves the raw request body, verifies the signature using a documented method, deduplicates event IDs, and updates the order ledger atomically. See https://developer.paypal.com/api/rest/webhooks/rest/ and https://developer.paypal.com/api/rest/webhooks/.
## Webhook endpoint added — not yet validated in Sandbox
`src/routes/api.paypal.webhook.ts` now defines the TanStack Start POST endpoint at `/api/paypal/webhook`. It captures the original request body before parsing, checks the PayPal transmission headers and HTTPS certificate URL, asks PayPal to verify the signature while embedding the original event JSON unchanged, stores event IDs in the private idempotency ledger, and only marks a matching order paid for a verified `PAYMENT.CAPTURE.COMPLETED` event whose EUR amount matches the stored order. Duplicate completed events are acknowledged without applying the payment twice. The route has not been built or tested against real PayPal Sandbox deliveries. It requires the SQL migration and `SUPABASE_SERVICE_ROLE_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_WEBHOOK_ID` before it can operate. Do not register the endpoint in the PayPal dashboard or enable live checkout until the build and Sandbox delivery/retry tests pass.
