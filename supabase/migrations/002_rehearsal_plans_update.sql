-- Migration: Update rehearsal membership plans
-- Renames Unlimited → Professional, corrects hours to 8/12/16, removes room-tier copy.
-- Run this if you already executed 001_initial.sql.

-- Update rehearsal plan names, hours and features
update public.subscription_plans
set
  name = 'Starter',
  included_hours = 8,
  features = '["8 hours/month rehearsal time","Access to the rehearsal room","Online booking 24/7","Up to 2h rollover per month","Extra hours at €25/hr"]',
  is_active = true
where pillar = 'rehearsal' and tier = 'starter';

update public.subscription_plans
set
  name = 'Performer',
  included_hours = 12,
  features = '["12 hours/month rehearsal time","Access to the rehearsal room","Online booking 24/7","Up to 3h rollover per month","Extra hours at €25/hr"]',
  is_active = true
where pillar = 'rehearsal' and tier = 'performer';

-- Rename Unlimited → Professional and set 16 hours
update public.subscription_plans
set
  name = 'Professional',
  tier = 'professional',
  included_hours = 16,
  features = '["16 hours/month rehearsal time","Access to the rehearsal room","Online booking 24/7","Up to 4h rollover per month","Extra hours at €25/hr"]',
  is_active = true
where pillar = 'rehearsal' and tier = 'unlimited';

-- Consolidate to a single rehearsal room
-- Deactivate the old Room B and Room C entries if they exist
update public.rooms
set is_active = false
where pillar = 'rehearsal' and name in ('Rehearsal Room B', 'Rehearsal Room C');

-- Rename Room A → Rehearsal Room and update description
update public.rooms
set
  name = 'Rehearsal Room',
  description = 'Fully equipped rehearsal space with PA system, backline and drum kit. Available 24/7 for all members.'
where pillar = 'rehearsal' and name = 'Rehearsal Room A';
