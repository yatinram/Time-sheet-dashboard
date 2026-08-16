-- ==========================================================
-- Timesheet Dashboard — Supabase Schema + Row Level Security
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ==========================================================

create extension if not exists "uuid-ossp";

create table if not exists time_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  description text not null,
  hours numeric(5, 2) not null check (hours > 0),
  entry_date date not null,
  category text not null check (category in ('Development', 'Design', 'Client Meeting')),
  is_billable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for common query patterns (filter by user, sort/filter by date)
create index if not exists idx_time_entries_user_id on time_entries (user_id);
create index if not exists idx_time_entries_date on time_entries (entry_date);
create index if not exists idx_time_entries_user_date on time_entries (user_id, entry_date desc);

-- Keep updated_at fresh on every edit
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_updated_at on time_entries;
create trigger trg_set_updated_at
  before update on time_entries
  for each row
  execute function set_updated_at();

-- ==========================================================
-- Row Level Security — each user can only see/edit their own rows
-- ==========================================================
alter table time_entries enable row level security;

drop policy if exists "Users can view their own entries" on time_entries;
create policy "Users can view their own entries"
  on time_entries for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own entries" on time_entries;
create policy "Users can insert their own entries"
  on time_entries for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own entries" on time_entries;
create policy "Users can update their own entries"
  on time_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own entries" on time_entries;
create policy "Users can delete their own entries"
  on time_entries for delete
  using (auth.uid() = user_id);

-- ==========================================================
-- Optional: weekly target hours per user (used by Hours Tracker)
-- Defaults every user to 40 hrs/week if no row exists (handled in app code)
-- ==========================================================
create table if not exists user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  weekly_target_hours numeric(5, 2) not null default 40
);

alter table user_settings enable row level security;

drop policy if exists "Users can manage their own settings" on user_settings;
create policy "Users can manage their own settings"
  on user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
