-- Move paid WAV delivery to a private Supabase Storage bucket (no public object URLs).
-- Safe to apply repeatedly; existing R2 metadata is retained for rollback.
alter table public.shop_release_assets
  add column if not exists storage_object_path text;

create unique index if not exists shop_release_assets_storage_object_path_uidx
  on public.shop_release_assets (storage_object_path)
  where storage_object_path is not null;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('nflt-private-audio', 'nflt-private-audio', false, 536870912, array['audio/wav', 'audio/x-wav', 'application/octet-stream'])
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- No anon/authenticated storage policies are created. Server-side service-role
-- access is required for uploads and authenticated downloads.
