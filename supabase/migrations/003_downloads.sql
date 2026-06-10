create table if not exists downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  file text not null,
  downloaded_at timestamptz default now(),
  ip text
);

create index idx_downloads_user on downloads(user_id);

alter table downloads enable row level security;

create policy "users see own downloads" on downloads
  for select using (auth.uid() = user_id);
