-- Create diagnostics table for AI hair analysis results
create table if not exists diagnostics (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  
  -- идентификация
  ip_address text,
  user_id uuid references profiles(id),
  user_email text,
  
  -- фото
  image_path text,
  
  -- результаты AI анализа
  damage_level int not null check (damage_level >= 1 and damage_level <= 5),
  signs text[] not null,
  recommendations text[] not null,
  summary text not null,
  
  -- метрики использования
  tokens_used int,
  cost numeric(10, 6)
);

-- Indexes for queries
create index idx_diagnostics_user on diagnostics(user_id);
create index idx_diagnostics_email on diagnostics(user_email);
create index idx_diagnostics_ip on diagnostics(ip_address);
create index idx_diagnostics_created on diagnostics(created_at);

-- RLS
alter table diagnostics enable row level security;

-- Policy: users can read their own diagnostics
create policy "users can read own diagnostics"
on diagnostics
for select
using (auth.uid() = user_id);

-- Policy: service role can insert (for API)
create policy "service role can insert diagnostics"
on diagnostics
for insert
to service_role
with check (true);
