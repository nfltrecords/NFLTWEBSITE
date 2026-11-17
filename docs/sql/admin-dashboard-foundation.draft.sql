-- DRAFT ONLY — do not apply to production until the live Supabase schema,
-- auth configuration, data-protection basis and RLS tests have been reviewed.
-- Admin authorization is provisioned only by trusted server/admin tooling via
-- auth.users.app_metadata.nflt_role = 'admin'. Never use user-editable user_metadata.

create or replace function public.nflt_is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'nflt_role') = 'admin', false);
$$;

create table if not exists public.nflt_organizations (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null check (char_length(trim(legal_name)) between 1 and 200),
  organization_type text not null default 'client'
    check (organization_type in ('group_entity', 'client', 'supplier', 'partner')),
  country_code char(2),
  registration_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nflt_people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 1 and 160),
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint nflt_people_email_length check (email is null or char_length(email) <= 255)
);

create table if not exists public.nflt_relationships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.nflt_organizations(id) on delete restrict,
  person_id uuid references public.nflt_people(id) on delete restrict,
  relationship_type text not null
    check (relationship_type in ('prospect', 'client', 'supplier', 'partner', 'representative')),
  status text not null default 'active'
    check (status in ('active', 'inactive', 'archived')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint nflt_relationship_has_party check (organization_id is not null or person_id is not null)
);

create table if not exists public.nflt_projects (
  id uuid primary key default gen_random_uuid(),
  reference text unique,
  title text not null check (char_length(trim(title)) between 1 and 200),
  description text not null default '',
  status text not null default 'lead'
    check (status in ('lead', 'quoted', 'approved', 'in_progress', 'on_hold', 'delivered', 'cancelled')),
  responsible_entity text not null
    check (responsible_entity in ('NFLT_RECORDS_INC', 'NFLT_RECORDS_FRANCE', 'NFLT_RECORDS_BRUSSELS', 'to_be_confirmed')),
  client_relationship_id uuid references public.nflt_relationships(id) on delete restrict,
  start_date date,
  due_date date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint nflt_project_dates check (due_date is null or start_date is null or due_date >= start_date)
);

create table if not exists public.nflt_services (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(trim(name)) between 1 and 160),
  description text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.nflt_project_services (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.nflt_projects(id) on delete cascade,
  service_id uuid not null references public.nflt_services(id) on delete restrict,
  status text not null default 'planned'
    check (status in ('planned', 'in_progress', 'delivered', 'cancelled')),
  agreed_amount_cents integer check (agreed_amount_cents is null or agreed_amount_cents >= 0),
  currency char(3) not null default 'EUR',
  notes text not null default '',
  created_at timestamptz not null default now(),
  unique(project_id, service_id)
);

create table if not exists public.nflt_user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'operations', 'sales', 'read_only')),
  created_at timestamptz not null default now()
);

create table if not exists public.nflt_audit_events (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(trim(action)) between 1 and 100),
  table_name text not null,
  record_id text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists nflt_relationships_status_idx on public.nflt_relationships(status);
create index if not exists nflt_projects_status_idx on public.nflt_projects(status);
create index if not exists nflt_projects_due_date_idx on public.nflt_projects(due_date);
create index if not exists nflt_audit_events_created_at_idx on public.nflt_audit_events(created_at desc);

alter table public.nflt_organizations enable row level security;
alter table public.nflt_people enable row level security;
alter table public.nflt_relationships enable row level security;
alter table public.nflt_projects enable row level security;
alter table public.nflt_services enable row level security;
alter table public.nflt_project_services enable row level security;
alter table public.nflt_user_roles enable row level security;
alter table public.nflt_audit_events enable row level security;

revoke all on public.nflt_organizations, public.nflt_people, public.nflt_relationships,
  public.nflt_projects, public.nflt_services, public.nflt_project_services,
  public.nflt_user_roles, public.nflt_audit_events from anon, authenticated;

grant select, insert, update, delete on public.nflt_organizations, public.nflt_people,
  public.nflt_relationships, public.nflt_projects, public.nflt_services,
  public.nflt_project_services to authenticated;
grant select on public.nflt_user_roles, public.nflt_audit_events to authenticated;
grant insert on public.nflt_audit_events to authenticated;
grant all on public.nflt_organizations, public.nflt_people, public.nflt_relationships,
  public.nflt_projects, public.nflt_services, public.nflt_project_services,
  public.nflt_user_roles, public.nflt_audit_events to service_role;

create policy nflt_organizations_admin_all on public.nflt_organizations
  for all to authenticated using (public.nflt_is_admin()) with check (public.nflt_is_admin());
create policy nflt_people_admin_all on public.nflt_people
  for all to authenticated using (public.nflt_is_admin()) with check (public.nflt_is_admin());
create policy nflt_relationships_admin_all on public.nflt_relationships
  for all to authenticated using (public.nflt_is_admin()) with check (public.nflt_is_admin());
create policy nflt_projects_admin_all on public.nflt_projects
  for all to authenticated using (public.nflt_is_admin()) with check (public.nflt_is_admin());
create policy nflt_services_admin_all on public.nflt_services
  for all to authenticated using (public.nflt_is_admin()) with check (public.nflt_is_admin());
create policy nflt_project_services_admin_all on public.nflt_project_services
  for all to authenticated using (public.nflt_is_admin()) with check (public.nflt_is_admin());
create policy nflt_user_roles_admin_read on public.nflt_user_roles
  for select to authenticated using (public.nflt_is_admin());
create policy nflt_audit_events_admin_read on public.nflt_audit_events
  for select to authenticated using (public.nflt_is_admin());
create policy nflt_audit_events_admin_insert on public.nflt_audit_events
  for insert to authenticated with check (public.nflt_is_admin());

comment on function public.nflt_is_admin() is
  'Checks trusted app_metadata.nflt_role; never authorize from user_metadata.';
comment on table public.nflt_projects is
  'Project entity assignment is mandatory; to_be_confirmed prevents implied seller/rights ownership.';
