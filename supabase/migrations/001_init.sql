-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  default_currency text not null default 'RUB' check (default_currency in ('RUB', 'USD', 'EUR')),
  monthly_budget numeric,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Subscriptions table
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  price numeric not null check (price > 0),
  currency text not null default 'RUB' check (currency in ('RUB', 'USD', 'EUR')),
  frequency text not null check (frequency in ('monthly', 'yearly', 'weekly', 'custom')),
  custom_frequency_days integer,
  category text not null default 'other' check (category in (
    'streaming', 'music', 'gaming', 'cloud', 'productivity',
    'news', 'fitness', 'education', 'finance', 'other'
  )),
  next_payment_date date not null,
  start_date date not null,
  notes text,
  color text,
  is_active boolean not null default true,
  reminder_days_before integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index subscriptions_user_id_idx on public.subscriptions(user_id);
create index subscriptions_next_payment_idx on public.subscriptions(next_payment_date);

-- RLS: Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Subscriptions policies
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can create own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete own subscriptions"
  on public.subscriptions for delete
  using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.update_updated_at();
