# PayPal Standard IPN checkout with automatic WAV delivery

## Intended flow

1. The shop creates a private `shop_orders` row before redirecting the buyer to the owner-supplied PayPal.Me link.
2. The payment instruction page shows the unique order UUID. The buyer copies it into the PayPal payment note.
3. 2. The buyer is sent to PayPal Payments Standard (`_xclick`) with the order UUID in both `custom` and `invoice`, and the IPN listener URL in `notify_url`.
3. PayPal posts the payment event to `/api/paypal/ipn`. The listener sends the exact original payload back to PayPal for `VERIFIED` authentication.
4. The listener checks the intended recipient, `payment_status=Completed`, EUR currency, exact order amount, and unique transaction ID.
5. Only then does the server mark the order paid, resolve the release UPC to its private R2 master, create a seven-day HMAC-protected download link, and send it to the buyer using Resend.
6. PayPal retries failed IPN deliveries. The admin page can retry email delivery only for orders already marked paid.

PayPal.Me does not provide the order-linked server callback required here. This integration uses legacy PayPal Standard IPN rather than REST API credentials or REST webhooks. It requires a PayPal Business account and must be tested in the live account before accepting sales.

## Required database setup

Apply these migrations to the production Supabase project, in order:

- `drizzle/migrations/0002_create_private_shop_orders.sql`
- `drizzle/migrations/0003_shop_order_delivery.sql`\n- `drizzle/migrations/0004_paypal_ipn_transaction.sql`

Do not expose the service-role key to the browser.

## PayPal account requirement\n\nPayPal's current documentation says only Business accounts can create Payment Links and Buttons, and the Belgian user agreement requires a Business account when PayPal is used primarily to sell. Convert the receiving account to Business or use the NFLT RECORDS business account. The checkout form currently names the owner-provided PayPal email as the recipient; verify it is the primary receiving email on the upgraded account before launch.\n\nIn PayPal account settings, enable Instant Payment Notifications (IPN) and set the notification URL to `https://nflt-records.com/api/paypal/ipn`. The form also sends `notify_url` for each payment.\n\n## Required Worker secrets / variables

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
