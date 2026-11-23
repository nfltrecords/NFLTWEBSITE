-- Additive, private digital-delivery ledger. Apply only after reviewing the target Supabase project.
alter table public.shop_orders
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists paid_at timestamptz,
  add column if not exists download_expires_at timestamptz,
  add column if not exists delivery_email_sent_at timestamptz;

create table if not exists public.shop_release_assets (
  release_upc text primary key check (release_upc ~ '^[0-9]{12,14}$'),
  r2_object_key text not null unique check (char_length(r2_object_key) between 1 and 512),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.shop_release_assets enable row level security;
revoke all on table public.shop_release_assets from anon, authenticated;
grant all on table public.shop_release_assets to service_role;

-- PayPal Standard IPN transaction idempotency.
alter table public.shop_orders
  add column if not exists paypal_transaction_id text unique;
