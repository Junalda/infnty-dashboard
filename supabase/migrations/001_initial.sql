-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null default 'customer' check (role in ('customer', 'partner', 'admin')),
  full_name text,
  email text not null,
  phone text,
  avatar_url text,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can manage all profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- SUBSCRIPTION PLANS
-- ============================================================
create table if not exists public.subscription_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  pillar text not null check (pillar in ('rehearsal', 'content', 'soundlab')),
  tier text not null,
  price_monthly numeric(10,2) not null,
  included_hours integer, -- null = unlimited
  stripe_price_id text,
  features jsonb not null default '[]',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.subscription_plans enable row level security;

create policy "Anyone can read active plans"
  on public.subscription_plans for select
  using (is_active = true);

create policy "Admins can manage plans"
  on public.subscription_plans for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Seed subscription plans
insert into public.subscription_plans (name, pillar, tier, price_monthly, included_hours, features) values
  ('Starter',            'rehearsal', 'starter',           200,  8,    '["8 hours/month rehearsal time","Access to the rehearsal room","Online booking 24/7","Up to 2h rollover per month","Extra hours at €25/hr"]'),
  ('Performer',          'rehearsal', 'performer',         300,  12,   '["12 hours/month rehearsal time","Access to the rehearsal room","Online booking 24/7","Up to 3h rollover per month","Extra hours at €25/hr"]'),
  ('Professional',       'rehearsal', 'professional',      400,  16,   '["16 hours/month rehearsal time","Access to the rehearsal room","Online booking 24/7","Up to 4h rollover per month","Extra hours at €25/hr"]'),
  ('Starter',            'content',   'starter',           750,  null, '["2 content shoots/month","Basic editing","Social media package","3 revisions per video","Content calendar"]'),
  ('Growth',             'content',   'growth',           1500,  null, '["4 content shoots/month","Advanced editing + color grade","Multi-platform optimization","Unlimited revisions","Content strategy session","Analytics report"]'),
  ('Authority',          'content',   'authority',        2700,  null, '["8 content shoots/month","Full production team","All platforms covered","Unlimited revisions","Dedicated content strategist","Monthly performance review","Priority scheduling"]'),
  ('Song Starter',       'soundlab',  'song_starter',      300,  null, '["1 song production/month","AI-assisted production","Professional mix","2 revisions","Stems delivery"]'),
  ('Artist Builder',     'soundlab',  'artist_builder',    750,  null, '["3 songs/month","Full AI + live production","Mastering included","Unlimited revisions","Distribution ready files","Artist development session"]'),
  ('Artist Accelerator', 'soundlab',  'artist_accelerator',1500, null, '["6 songs/month","Full production suite","Mastering + stems","Unlimited revisions","Distribution support","Monthly strategy session","Priority scheduling","Music video consultation"]');

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles on delete cascade,
  plan_id uuid not null references public.subscription_plans,
  status text not null default 'active' check (status in ('active', 'cancelled', 'past_due', 'trialing')),
  stripe_subscription_id text,
  stripe_customer_id text,
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null default (now() + interval '1 month'),
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Admins can manage all subscriptions"
  on public.subscriptions for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- HOUR BALANCES
-- ============================================================
create table if not exists public.hour_balances (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles on delete cascade,
  month_year text not null, -- format: 'yyyy-MM'
  included_hours numeric(8,2) not null default 0,
  used_hours numeric(8,2) not null default 0,
  rollover_hours numeric(8,2) not null default 0,
  rollover_expiry timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, month_year)
);

alter table public.hour_balances enable row level security;

create policy "Users can read own hour balances"
  on public.hour_balances for select
  using (auth.uid() = user_id);

create policy "Admins can manage all hour balances"
  on public.hour_balances for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- ROOMS
-- ============================================================
create table if not exists public.rooms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  pillar text not null check (pillar in ('rehearsal', 'content', 'soundlab')),
  description text,
  capacity integer not null default 1,
  hourly_rate numeric(8,2) not null default 35,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.rooms enable row level security;

create policy "Authenticated users can read active rooms"
  on public.rooms for select
  to authenticated
  using (is_active = true);

create policy "Admins can manage rooms"
  on public.rooms for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Seed rooms
insert into public.rooms (name, pillar, description, capacity, hourly_rate) values
  ('Rehearsal Room', 'rehearsal', 'Fully equipped rehearsal space with PA system, backline and drum kit. Available 24/7 for all members.', 6, 35),
  ('Content Studio', 'content',   'Professional content studio with lighting, backdrop and teleprompter.', 4, 35),
  ('Sound Lab',      'soundlab',  'Professional recording studio with isolation booth and full production suite.', 3, 35);

-- ============================================================
-- BOOKINGS
-- ============================================================
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles on delete cascade,
  room_id uuid not null references public.rooms,
  start_time timestamptz not null,
  end_time timestamptz not null,
  buffer_end_time timestamptz not null, -- end_time + 15 min
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  booking_type text not null default 'loose' check (booking_type in ('subscription', 'loose')),
  hours_used numeric(6,2) not null,
  total_price numeric(10,2) not null default 0,
  payment_id uuid,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- prevent double bookings: new start_time must be >= previous buffer_end_time
  constraint no_overlap exclude using gist (
    room_id with =,
    tstzrange(start_time, buffer_end_time) with &&
  ) where (status != 'cancelled')
);

alter table public.bookings enable row level security;

create policy "Users can read own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

create policy "Admins can manage all bookings"
  on public.bookings for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- PAYMENTS
-- ============================================================
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles on delete cascade,
  booking_id uuid references public.bookings,
  subscription_id uuid references public.subscriptions,
  amount numeric(10,2) not null,
  currency text not null default 'EUR',
  status text not null default 'pending' check (status in ('paid', 'pending', 'failed', 'cancelled')),
  payment_method text,
  stripe_payment_intent_id text,
  stripe_session_id text,
  description text,
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;

create policy "Users can read own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Admins can manage all payments"
  on public.payments for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- UPLOADED FILES
-- ============================================================
create table if not exists public.uploaded_files (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles on delete cascade,
  uploaded_by uuid not null references public.profiles,
  project_type text not null check (project_type in ('content', 'soundlab')),
  project_id uuid,
  file_name text not null,
  file_url text not null,
  file_size bigint not null default 0,
  mime_type text not null default 'application/octet-stream',
  created_at timestamptz not null default now()
);

alter table public.uploaded_files enable row level security;

create policy "Users can read own files"
  on public.uploaded_files for select
  using (auth.uid() = user_id or auth.uid() = uploaded_by);

create policy "Partners and admins can insert files"
  on public.uploaded_files for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('partner', 'admin')
    )
  );

create policy "Admins can manage all files"
  on public.uploaded_files for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- CONTENT PROJECTS
-- ============================================================
create table if not exists public.content_projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles on delete cascade,
  partner_id uuid references public.profiles,
  title text not null,
  status text not null default 'planned' check (status in ('planned', 'filmed', 'editing', 'review', 'delivered')),
  production_day date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.content_projects enable row level security;

create policy "Users can read own content projects"
  on public.content_projects for select
  using (auth.uid() = user_id or auth.uid() = partner_id);

create policy "Partners and admins can manage content projects"
  on public.content_projects for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('partner', 'admin')
    )
  );

-- ============================================================
-- SOUNDLAB PROJECTS
-- ============================================================
create table if not exists public.soundlab_projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles on delete cascade,
  partner_id uuid references public.profiles,
  title text not null,
  status text not null default 'idea' check (status in ('idea', 'writing', 'ai_production', 'recording', 'final_mix', 'released')),
  genre text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.soundlab_projects enable row level security;

create policy "Users can read own soundlab projects"
  on public.soundlab_projects for select
  using (auth.uid() = user_id or auth.uid() = partner_id);

create policy "Partners and admins can manage soundlab projects"
  on public.soundlab_projects for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('partner', 'admin')
    )
  );

-- ============================================================
-- PARTNER ASSIGNMENTS
-- ============================================================
create table if not exists public.partner_assignments (
  id uuid primary key default uuid_generate_v4(),
  partner_id uuid not null references public.profiles,
  client_id uuid not null references public.profiles,
  project_type text not null check (project_type in ('content', 'soundlab')),
  project_id uuid not null,
  assigned_at timestamptz not null default now()
);

alter table public.partner_assignments enable row level security;

create policy "Partners can read own assignments"
  on public.partner_assignments for select
  using (auth.uid() = partner_id);

create policy "Admins can manage all assignments"
  on public.partner_assignments for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- EMAIL NOTIFICATIONS
-- ============================================================
create table if not exists public.email_notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles on delete cascade,
  type text not null,
  subject text not null,
  sent_at timestamptz not null default now(),
  status text not null default 'sent' check (status in ('sent', 'failed', 'pending'))
);

alter table public.email_notifications enable row level security;

create policy "Users can read own notifications"
  on public.email_notifications for select
  using (auth.uid() = user_id);

create policy "Admins can read all notifications"
  on public.email_notifications for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public) values
  ('content-files', 'content-files', false),
  ('soundlab-files', 'soundlab-files', false),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Users can upload own avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Public can read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Partners and admins can upload content files"
  on storage.objects for insert
  with check (
    bucket_id in ('content-files', 'soundlab-files')
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('partner', 'admin')
    )
  );

create policy "Users can read their files"
  on storage.objects for select
  using (
    bucket_id in ('content-files', 'soundlab-files')
    and auth.uid() is not null
  );

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Calculate rollover hours for new month (25% of unused included hours)
create or replace function public.calculate_rollover(
  p_user_id uuid,
  p_prev_month text
) returns numeric as $$
declare
  v_balance public.hour_balances;
  v_unused numeric;
  v_max_rollover numeric;
begin
  select * into v_balance
  from public.hour_balances
  where user_id = p_user_id and month_year = p_prev_month;

  if not found then return 0; end if;
  if v_balance.included_hours = 0 then return 0; end if;

  v_unused := greatest(0, v_balance.included_hours - v_balance.used_hours);
  v_max_rollover := v_balance.included_hours * 0.25;

  return least(v_unused, v_max_rollover);
end;
$$ language plpgsql security definer;

-- Mark past bookings as completed
create or replace function public.complete_past_bookings()
returns void as $$
begin
  update public.bookings
  set status = 'completed', updated_at = now()
  where end_time < now() and status = 'confirmed';
end;
$$ language plpgsql security definer;

-- Indexes for performance
create index if not exists bookings_user_id_idx on public.bookings(user_id);
create index if not exists bookings_room_id_idx on public.bookings(room_id);
create index if not exists bookings_start_time_idx on public.bookings(start_time);
create index if not exists bookings_status_idx on public.bookings(status);
create index if not exists hour_balances_user_month_idx on public.hour_balances(user_id, month_year);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);
