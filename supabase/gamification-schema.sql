-- Run this in your Supabase Dashboard SQL Editor

-- Add gamification columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_practice_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'green';

-- Badges master table
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value INTEGER
);

-- User earned badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Seed badges
INSERT INTO public.badges (name, description, icon, condition_type, condition_value) VALUES
  ('First Steps', 'Submit your first answer', '👶', 'first_submission', 1),
  ('Perfect Week', '7-day practice streak', '🔥', 'streak_7', 7),
  ('Bill Splitter', 'Complete the Lunch Bill question', '💰', 'question_complete', NULL),
  ('Century Club', 'Earn 100 XP', '💯', 'xp_100', 100),
  ('Bug Hunter', 'Fix a wrong answer after getting it wrong', '🐛', 'wrong_to_correct', 1),
  ('Dedicated', '30-day practice streak', '⭐', 'streak_30', 30),
  ('Python Master', 'Reach level 10', '🐍', 'level_10', 10),
  ('Speedy Starter', 'Submit within 5 minutes', '⚡', 'speedy', 1)
ON CONFLICT DO NOTHING;

-- Backfill: award +25 XP for each existing correct submission (non-destructive)
UPDATE profiles
SET xp = xp + subq.correct_count * 25
FROM (
  SELECT user_id, COUNT(*) AS correct_count
  FROM submissions
  WHERE status = 'correct'
  GROUP BY user_id
) subq
WHERE profiles.id = subq.user_id;
