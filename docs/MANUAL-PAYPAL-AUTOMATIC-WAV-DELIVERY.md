# PayPal.Me personal account with IPN-based automatic WAV delivery

## Intended flow

1. The shop creates a private `shop_orders` row before sending the buyer to PayPal.Me.
2. The buyer sees a unique reference in the form `NFLT:<order UUID>`, copies it, opens the owner-provided PayPal.Me personal link with the exact EUR amount, and enters that reference in PayPal's optional payment note.
3. PayPal sends an IPN notification to `/api/paypal/ipn` when the personal-account payment is recorded.
4. The listener posts the exact original payload back to PayPal for `VERIFIED` authentication.
5. The listener accepts only `txn_type=send_money`, the configured receiving email, `payment_status=Completed`, EUR, exact order amount, and the unique order UUID extracted from the PayPal note (`memo`).
6. Only then does the server mark the order paid, resolve the release UPC to its private R2 master, create a seven-day HMAC-protected download link, and send it using Resend.

**Important limitation:** this depends on PayPal sending an IPN for the PayPal.Me personal-account transfer and including the buyer's note in the IPN `memo` field. PayPal documents IPN for transaction notifications and documents the `memo` field for notes, but does not clearly guarantee this exact combination for every PayPal.Me payment. It must be proven with one small live test before the shop accepts orders. No payment is delivered if the note/reference is missing or the IPN cannot be verified.

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
