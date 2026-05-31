-- ============================================================
-- TASK 1: New tables for demo content
-- ============================================================

-- Content deliverables (individual content pieces)
create table if not exists public.content_deliverables (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.content_projects on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  platform text not null check (platform in ('instagram','tiktok','linkedin','youtube','general')),
  type text not null check (type in ('reel','short','post','story','video')),
  status text not null default 'pending' check (status in ('pending','review','approved','revision_requested','delivered')),
  file_url text,
  thumbnail_url text,
  duration_seconds integer,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.content_deliverables enable row level security;

create policy "Users can select own content deliverables"
  on public.content_deliverables for select
  using (auth.uid() = user_id);

create policy "Users can insert own content deliverables"
  on public.content_deliverables for insert
  with check (auth.uid() = user_id);

create policy "Users can update own content deliverables"
  on public.content_deliverables for update
  using (auth.uid() = user_id);

create policy "Admins can manage all content deliverables"
  on public.content_deliverables for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Content calendar
create table if not exists public.content_calendar (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  deliverable_id uuid references public.content_deliverables on delete set null,
  title text not null,
  platform text not null,
  scheduled_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled','published','failed')),
  caption text,
  created_at timestamptz not null default now()
);

alter table public.content_calendar enable row level security;

create policy "Users can select own content calendar"
  on public.content_calendar for select
  using (auth.uid() = user_id);

create policy "Users can insert own content calendar"
  on public.content_calendar for insert
  with check (auth.uid() = user_id);

create policy "Users can update own content calendar"
  on public.content_calendar for update
  using (auth.uid() = user_id);

create policy "Admins can manage all content calendar"
  on public.content_calendar for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Song projects (for Sound Lab members)
create table if not exists public.song_projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  artist text not null,
  genre text,
  status text not null default 'in_progress' check (status in ('in_progress','mix_ready','master_ready','delivered','revision')),
  revisions_included integer not null default 2,
  revisions_used integer not null default 0,
  demo_url text,
  mix_url text,
  master_url text,
  stems_url text,
  bpm integer,
  key text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.song_projects enable row level security;

create policy "Users can select own song projects"
  on public.song_projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own song projects"
  on public.song_projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own song projects"
  on public.song_projects for update
  using (auth.uid() = user_id);

create policy "Admins can manage all song projects"
  on public.song_projects for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Song revisions log
create table if not exists public.song_revisions (
  id uuid primary key default uuid_generate_v4(),
  song_id uuid references public.song_projects on delete cascade not null,
  round integer not null,
  requested_by uuid references auth.users not null,
  notes text,
  status text not null default 'pending' check (status in ('pending','in_progress','completed')),
  created_at timestamptz not null default now()
);

alter table public.song_revisions enable row level security;

create policy "Users can select own song revisions"
  on public.song_revisions for select
  using (
    exists (select 1 from public.song_projects where id = song_id and user_id = auth.uid())
  );

create policy "Users can insert own song revisions"
  on public.song_revisions for insert
  with check (auth.uid() = requested_by);

create policy "Admins can manage all song revisions"
  on public.song_revisions for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Distribution status
create table if not exists public.distribution_status (
  id uuid primary key default uuid_generate_v4(),
  song_id uuid references public.song_projects on delete cascade not null,
  platform text not null check (platform in ('spotify','apple_music','youtube_music','tidal','amazon_music','cdbaby')),
  status text not null default 'not_submitted' check (status in ('not_submitted','pending','live','rejected')),
  url text,
  submitted_at timestamptz,
  live_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.distribution_status enable row level security;

create policy "Users can select own distribution status"
  on public.distribution_status for select
  using (
    exists (select 1 from public.song_projects where id = song_id and user_id = auth.uid())
  );

create policy "Users can insert own distribution status"
  on public.distribution_status for insert
  with check (
    exists (select 1 from public.song_projects where id = song_id and user_id = auth.uid())
  );

create policy "Users can update own distribution status"
  on public.distribution_status for update
  using (
    exists (select 1 from public.song_projects where id = song_id and user_id = auth.uid())
  );

create policy "Admins can manage all distribution status"
  on public.distribution_status for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- SEED DEMO DATA
-- Fixed UUIDs:
--   Marcus (rehearsal): '00000000-0000-0000-0000-000000000001'
--   Sarah  (content):   '00000000-0000-0000-0000-000000000002'
--   Daniel (soundlab):  '00000000-0000-0000-0000-000000000003'
--   Admin:              '00000000-0000-0000-0000-000000000004'
-- ============================================================

DO $$ BEGIN

-- ------------------------------------------------------------
-- Profiles
-- ------------------------------------------------------------
INSERT INTO public.profiles (id, email, full_name, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'marcus@demo.infnty.studio', 'Marcus Johnson', 'customer'),
  ('00000000-0000-0000-0000-000000000002', 'sarah@demo.infnty.studio',  'Sarah Williams', 'customer'),
  ('00000000-0000-0000-0000-000000000003', 'daniel@demo.infnty.studio', 'Daniel Chen',    'customer'),
  ('00000000-0000-0000-0000-000000000004', 'admin@demo.infnty.studio',  'Admin User',     'admin')
ON CONFLICT (id) DO NOTHING;

EXCEPTION WHEN unique_violation THEN NULL;
END $$;

-- ------------------------------------------------------------
-- Subscription plans IDs we'll need (look them up by name+pillar)
-- Seed subscriptions
-- ------------------------------------------------------------
DO $$ DECLARE
  v_rehearsal_plan_id uuid;
  v_content_plan_id   uuid;
  v_soundlab_plan_id  uuid;
BEGIN

  SELECT id INTO v_rehearsal_plan_id FROM public.subscription_plans WHERE pillar = 'rehearsal' AND tier = 'starter' LIMIT 1;
  SELECT id INTO v_content_plan_id   FROM public.subscription_plans WHERE pillar = 'content'   AND tier = 'growth'  LIMIT 1;
  SELECT id INTO v_soundlab_plan_id  FROM public.subscription_plans WHERE pillar = 'soundlab'  AND tier = 'song_starter' LIMIT 1;

  INSERT INTO public.subscriptions (user_id, plan_id, status, current_period_start, current_period_end)
  VALUES
    ('00000000-0000-0000-0000-000000000001', v_rehearsal_plan_id, 'active', now() - interval '10 days', now() + interval '20 days'),
    ('00000000-0000-0000-0000-000000000002', v_content_plan_id,   'active', now() - interval '5 days',  now() + interval '25 days'),
    ('00000000-0000-0000-0000-000000000003', v_soundlab_plan_id,  'active', now() - interval '15 days', now() + interval '15 days')
  ON CONFLICT DO NOTHING;

EXCEPTION WHEN unique_violation THEN NULL;
END $$;

-- ------------------------------------------------------------
-- Hour balance for Marcus
-- ------------------------------------------------------------
DO $$ BEGIN
  INSERT INTO public.hour_balances (user_id, month_year, included_hours, used_hours, rollover_hours)
  VALUES ('00000000-0000-0000-0000-000000000001', to_char(now(), 'YYYY-MM'), 8, 3, 0)
  ON CONFLICT (user_id, month_year) DO NOTHING;
EXCEPTION WHEN unique_violation THEN NULL;
END $$;

-- ------------------------------------------------------------
-- Bookings for Marcus
-- ------------------------------------------------------------
DO $$ DECLARE
  v_room_id uuid;
BEGIN
  SELECT id INTO v_room_id FROM public.rooms WHERE pillar = 'rehearsal' LIMIT 1;

  IF v_room_id IS NOT NULL THEN
    INSERT INTO public.bookings (user_id, room_id, start_time, end_time, buffer_end_time, status, booking_type, hours_used, total_price, notes)
    VALUES
      (
        '00000000-0000-0000-0000-000000000001', v_room_id,
        now() + interval '3 days' + interval '14 hours',
        now() + interval '3 days' + interval '16 hours',
        now() + interval '3 days' + interval '16 hours 15 minutes',
        'confirmed', 'subscription', 2, 0, 'Band rehearsal — new setlist run-through'
      ),
      (
        '00000000-0000-0000-0000-000000000001', v_room_id,
        now() + interval '7 days' + interval '10 hours',
        now() + interval '7 days' + interval '11 hours',
        now() + interval '7 days' + interval '11 hours 15 minutes',
        'confirmed', 'subscription', 1, 0, 'Solo practice session'
      ),
      (
        '00000000-0000-0000-0000-000000000001', v_room_id,
        now() - interval '7 days' + interval '18 hours',
        now() - interval '7 days' + interval '20 hours',
        now() - interval '7 days' + interval '20 hours 15 minutes',
        'completed', 'subscription', 2, 0, 'Full band rehearsal'
      ),
      (
        '00000000-0000-0000-0000-000000000001', v_room_id,
        now() - interval '14 days' + interval '15 hours',
        now() - interval '14 days' + interval '17 hours 30 minutes',
        now() - interval '14 days' + interval '17 hours 45 minutes',
        'completed', 'subscription', 2.5, 0, 'Pre-gig preparation'
      )
    ON CONFLICT DO NOTHING;
  END IF;

EXCEPTION WHEN unique_violation THEN NULL;
END $$;

-- ------------------------------------------------------------
-- Content project for Sarah
-- ------------------------------------------------------------
DO $$ DECLARE
  v_project_id uuid;
  v_d1 uuid; v_d2 uuid; v_d3 uuid; v_d4 uuid; v_d5 uuid;
  v_d6 uuid; v_d7 uuid; v_d8 uuid; v_d9 uuid; v_d10 uuid;
  v_d11 uuid; v_d12 uuid;
BEGIN
  v_project_id := uuid_generate_v4();

  INSERT INTO public.content_projects (id, user_id, title, status, production_day, notes)
  VALUES (
    v_project_id,
    '00000000-0000-0000-0000-000000000002',
    'May Growth Campaign',
    'editing',
    (now() + interval '5 days')::date,
    'Focus on personal brand and thought leadership content across Instagram, TikTok, LinkedIn, and YouTube.'
  ) ON CONFLICT DO NOTHING;

  -- 12 deliverables: mix of approved/pending/review/revision_requested/delivered
  v_d1  := uuid_generate_v4(); v_d2  := uuid_generate_v4(); v_d3  := uuid_generate_v4();
  v_d4  := uuid_generate_v4(); v_d5  := uuid_generate_v4(); v_d6  := uuid_generate_v4();
  v_d7  := uuid_generate_v4(); v_d8  := uuid_generate_v4(); v_d9  := uuid_generate_v4();
  v_d10 := uuid_generate_v4(); v_d11 := uuid_generate_v4(); v_d12 := uuid_generate_v4();

  INSERT INTO public.content_deliverables (id, project_id, user_id, title, platform, type, status, duration_seconds, notes)
  VALUES
    (v_d1,  v_project_id, '00000000-0000-0000-0000-000000000002', 'Morning Routine Reel',          'instagram', 'reel',  'approved',           30,  NULL),
    (v_d2,  v_project_id, '00000000-0000-0000-0000-000000000002', 'Top 3 Productivity Hacks',       'tiktok',    'short', 'approved',           45,  NULL),
    (v_d3,  v_project_id, '00000000-0000-0000-0000-000000000002', 'Behind The Scenes Studio Day',   'instagram', 'story', 'approved',           15,  NULL),
    (v_d4,  v_project_id, '00000000-0000-0000-0000-000000000002', 'Personal Brand Masterclass',     'linkedin',  'video', 'approved',           120, NULL),
    (v_d5,  v_project_id, '00000000-0000-0000-0000-000000000002', 'My Creative Process Explained',  'youtube',   'video', 'approved',           480, NULL),
    (v_d6,  v_project_id, '00000000-0000-0000-0000-000000000002', 'Weekly Wins & Lessons',          'instagram', 'post',  'approved',           NULL,NULL),
    (v_d7,  v_project_id, '00000000-0000-0000-0000-000000000002', 'How I Structure My Work Day',    'tiktok',    'short', 'approved',           60,  NULL),
    (v_d8,  v_project_id, '00000000-0000-0000-0000-000000000002', 'Content Creation Tips Vol. 2',   'instagram', 'reel',  'review',             35,  NULL),
    (v_d9,  v_project_id, '00000000-0000-0000-0000-000000000002', 'LinkedIn Growth Strategy Post',  'linkedin',  'post',  'review',             NULL,NULL),
    (v_d10, v_project_id, '00000000-0000-0000-0000-000000000002', 'Studio Tour Video',              'youtube',   'video', 'review',             300, NULL),
    (v_d11, v_project_id, '00000000-0000-0000-0000-000000000002', 'Q&A: Your Content Questions',    'instagram', 'reel',  'review',             55,  NULL),
    (v_d12, v_project_id, '00000000-0000-0000-0000-000000000002', 'Day In The Life Vlog',           'tiktok',    'short', 'revision_requested', 90, 'Please add text overlays and adjust the music volume. Color grade feels too warm.')
  ON CONFLICT DO NOTHING;

  -- Content calendar entries
  INSERT INTO public.content_calendar (user_id, deliverable_id, title, platform, scheduled_at, status, caption)
  VALUES
    ('00000000-0000-0000-0000-000000000002', v_d1,  'Morning Routine Reel',        'instagram', now() + interval '1 day'  + interval '9 hours',  'scheduled', 'Start your day right 🌅 #morningroutine #productivity'),
    ('00000000-0000-0000-0000-000000000002', v_d2,  'Top 3 Productivity Hacks',    'tiktok',    now() + interval '2 days' + interval '18 hours', 'scheduled', '3 hacks that changed everything 🔥 #productivity #tiktok'),
    ('00000000-0000-0000-0000-000000000002', v_d4,  'Personal Brand Masterclass',  'linkedin',  now() + interval '3 days' + interval '8 hours',  'scheduled', 'Building a personal brand in 2026 — here is what actually works.'),
    ('00000000-0000-0000-0000-000000000002', v_d6,  'Weekly Wins & Lessons',       'instagram', now() + interval '4 days' + interval '12 hours', 'scheduled', 'Week recap: wins, lessons, and what is next 💡'),
    ('00000000-0000-0000-0000-000000000002', v_d5,  'My Creative Process Explained','youtube',  now() + interval '5 days' + interval '15 hours', 'scheduled', 'Full breakdown of how I create content from idea to publish.'),
    ('00000000-0000-0000-0000-000000000002', v_d7,  'How I Structure My Work Day', 'tiktok',    now() + interval '6 days' + interval '19 hours', 'scheduled', 'The schedule that 10x my output ⚡'),
    ('00000000-0000-0000-0000-000000000002', v_d3,  'Behind The Scenes Studio Day','instagram', now() + interval '7 days' + interval '11 hours', 'scheduled', 'A day at INFNTY Studio 🎬 #behindthescenes'),
    -- past published entries
    ('00000000-0000-0000-0000-000000000002', NULL, 'April Highlights Reel',        'instagram', now() - interval '5 days' + interval '10 hours', 'published', 'Looking back at an incredible April!'),
    ('00000000-0000-0000-0000-000000000002', NULL, 'Why Consistency Beats Talent', 'linkedin',  now() - interval '3 days' + interval '9 hours',  'published', 'Controversial opinion: talent is overrated.')
  ON CONFLICT DO NOTHING;

EXCEPTION WHEN unique_violation THEN NULL;
END $$;

-- ------------------------------------------------------------
-- Song projects for Daniel
-- ------------------------------------------------------------
DO $$ DECLARE
  v_song1 uuid;
  v_song2 uuid;
BEGIN
  v_song1 := uuid_generate_v4();
  v_song2 := uuid_generate_v4();

  INSERT INTO public.song_projects (id, user_id, title, artist, genre, status, revisions_included, revisions_used, demo_url, mix_url, master_url, stems_url, bpm, key, notes)
  VALUES
    (
      v_song1,
      '00000000-0000-0000-0000-000000000003',
      'Neon Nights',
      'Daniel Chen',
      'Synthwave',
      'delivered',
      3, 2,
      'https://storage.infnty.studio/demo/neon-nights-demo.mp3',
      'https://storage.infnty.studio/demo/neon-nights-mix.mp3',
      'https://storage.infnty.studio/demo/neon-nights-master.mp3',
      'https://storage.infnty.studio/demo/neon-nights-stems.zip',
      128, 'F Minor',
      'Full synthwave production. Radio edit delivered. Stems ready for remixers.'
    ),
    (
      v_song2,
      '00000000-0000-0000-0000-000000000003',
      'Echoes of Tomorrow',
      'Daniel Chen',
      'Electronic / Pop',
      'in_progress',
      3, 1,
      'https://storage.infnty.studio/demo/echoes-demo.mp3',
      NULL, NULL, NULL,
      140, 'A Major',
      'Working on the drop and bridge. Mix scheduled for next week.'
    )
  ON CONFLICT DO NOTHING;

  -- Revisions
  INSERT INTO public.song_revisions (song_id, round, requested_by, notes, status)
  VALUES
    (v_song1, 1, '00000000-0000-0000-0000-000000000003', 'Boost the bass in the chorus, reduce reverb on vocals.', 'completed'),
    (v_song1, 2, '00000000-0000-0000-0000-000000000003', 'Compress the kick tighter, bring up the synth lead by 2dB.', 'completed'),
    (v_song2, 1, '00000000-0000-0000-0000-000000000003', 'The demo feels too sparse in the verses — add more layers.', 'in_progress')
  ON CONFLICT DO NOTHING;

  -- Distribution for song1 (delivered — all platforms)
  INSERT INTO public.distribution_status (song_id, platform, status, url, submitted_at, live_at)
  VALUES
    (v_song1, 'spotify',       'live',          'https://open.spotify.com/track/demo',   now() - interval '20 days', now() - interval '17 days'),
    (v_song1, 'apple_music',   'live',          'https://music.apple.com/track/demo',    now() - interval '20 days', now() - interval '16 days'),
    (v_song1, 'youtube_music', 'live',          'https://music.youtube.com/track/demo',  now() - interval '20 days', now() - interval '15 days'),
    (v_song1, 'tidal',         'live',          'https://tidal.com/track/demo',          now() - interval '20 days', now() - interval '14 days'),
    (v_song1, 'amazon_music',  'live',          'https://music.amazon.com/track/demo',   now() - interval '20 days', now() - interval '13 days'),
    (v_song1, 'cdbaby',        'live',          'https://store.cdbaby.com/track/demo',   now() - interval '20 days', now() - interval '12 days')
  ON CONFLICT DO NOTHING;

  -- Distribution for song2 (in_progress — some submitted, some not)
  INSERT INTO public.distribution_status (song_id, platform, status, submitted_at)
  VALUES
    (v_song2, 'spotify',       'not_submitted', NULL),
    (v_song2, 'apple_music',   'not_submitted', NULL),
    (v_song2, 'youtube_music', 'not_submitted', NULL),
    (v_song2, 'tidal',         'not_submitted', NULL),
    (v_song2, 'amazon_music',  'not_submitted', NULL),
    (v_song2, 'cdbaby',        'not_submitted', NULL)
  ON CONFLICT DO NOTHING;

EXCEPTION WHEN unique_violation THEN NULL;
END $$;
