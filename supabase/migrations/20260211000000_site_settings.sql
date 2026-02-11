-- Site settings key-value store (admin-configurable)
create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute procedure public.set_updated_at();

alter table public.site_settings enable row level security;

-- Everyone can read settings
create policy "site_settings_select_all"
on public.site_settings for select
using (true);

-- Only admin can write
create policy "site_settings_admin_write"
on public.site_settings for all
using (public.is_admin())
with check (public.is_admin());

-- Default: bulk order threshold = 10
insert into public.site_settings (key, value)
values ('bulk_order_threshold', '10');
