-- Private PayPal order ledger. Apply through the Lovable/Supabase migration workflow.
-- No browser role can read or write payment records; trusted server code uses service_role.
create table if not exists public.shop_orders (
  id uuid primary key default gen_random_uuid(),
  release_upc text not null,
  buyer_email text not null,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'EUR' check (currency = 'EUR'),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'paid', 'denied', 'cancelled', 'refunded')),
  paypal_order_id text unique,
  paypal_capture_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz,
  constraint shop_orders_release_upc_format check (release_upc ~ '^[0-9]{12,14}$'),
  constraint shop_orders_buyer_email_length check (char_length(buyer_email) between 3 and 255)
);

create index if not exists shop_orders_created_at_idx
  on public.shop_orders (created_at desc);
create index if not exists shop_orders_status_idx
  on public.shop_orders (status);

alter table public.shop_orders enable row level security;
revoke all on table public.shop_orders from anon, authenticated;
grant all on table public.shop_orders to service_role;

-- Idempotency ledger for verified PayPal webhook deliveries.
create table if not exists public.paypal_webhook_events (
  event_id text primary key,
  event_type text not null,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

alter table public.paypal_webhook_events enable row level security;
revoke all on table public.paypal_webhook_events from anon, authenticated;
grant all on table public.paypal_webhook_events to service_role;
