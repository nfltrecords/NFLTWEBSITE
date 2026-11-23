# Manual PayPal checkout with automatic WAV delivery

## Intended flow

1. The shop creates a private `shop_orders` row before redirecting the buyer to the owner-supplied PayPal.Me link.
2. The payment instruction page shows the unique order UUID. The buyer copies it into the PayPal payment note.
3. The owner checks the incoming payment in PayPal and opens `/espace-commandes`.
4. The owner enters the private admin code and approves only a payment that is visible as completed in PayPal.
5. The server changes the order from `pending` to `paid`, resolves the release UPC to its private R2 master, creates a seven-day HMAC-protected download link, and sends that link to the buyer using Resend.
6. If email delivery fails, the paid order remains visible in the admin queue until the owner retries delivery. A successful email is recorded to prevent duplicate sends.

PayPal.Me is not an API payment confirmation. This design deliberately requires the owner to verify each incoming payment manually. The download email is automatic only after that manual approval.

## Required database setup

Apply these migrations to the production Supabase project, in order:

- `drizzle/migrations/0002_create_private_shop_orders.sql`
- `drizzle/migrations/0003_shop_order_delivery.sql`

Do not expose the service-role key to the browser.

## Required Worker secrets / variables

Configure these on the production Cloudflare Worker `nfltwebsite`:

- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: service-role key for the same project where migrations were applied
- `ADMIN_ORDERS_CODE`: a unique random secret of at least 32 characters
- `DELIVERY_TOKEN_SECRET`: independent random secret of at least 32 characters
- `RESEND_API_KEY`: Resend API key
- `DELIVERY_FROM_EMAIL`: sender address on a domain verified in Resend

The existing R2 binding must remain named `NFLT_AUDIO` and point to `nflt-audio-master`.

## Required private audio mapping

Upload each verified full WAV master to the private R2 bucket. Add one row per release to `shop_release_assets`, mapping its exact UPC to the exact R2 object key. Never map a 30-second MP3 preview as a master. Do not guess ambiguous UPC-to-file matches.

The delivery endpoint refuses to serve a file unless the order is marked paid, the HMAC token is valid and unexpired, the release has a mapping, and the private R2 object exists.

## Operational checks before launch

- Verify the PayPal.Me link and exact EUR amount in a real browser.
- Confirm the customer sees and copies the order UUID into the PayPal payment note.
- Confirm the admin code works only for the owner.
- Confirm every release UPC maps to the correct full WAV master.
- Test one low-value payment and one complete email delivery end-to-end.
- Test an invalid/expired token and an unmapped release.
- Keep the store closed until migrations, secrets, sender domain and WAV mappings are configured and the production Worker is deployed.
