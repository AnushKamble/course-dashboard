-- Schedule settings
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_type TEXT NOT NULL UNIQUE CHECK (day_type IN ('weekday', 'weekend')),
  label TEXT NOT NULL,
  days TEXT NOT NULL,
  timing TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default schedules
INSERT INTO public.schedules (day_type, label, days, timing) VALUES
  ('weekday', 'Weekday Classes', 'Mon, Wed, Fri', '6:00 PM – 7:30 PM'),
  ('weekend', 'Weekend Classes', 'Sat, Sun', '10:00 AM – 12:00 PM')
ON CONFLICT (day_type) DO NOTHING;

-- Track which submissions have had their XP bonus awarded
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS xp_awarded BOOLEAN DEFAULT FALSE;

-- Question types: coding (editor + Pyodide) vs dry_run (code sample + predicted output)
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS question_type TEXT DEFAULT 'coding' CHECK (question_type IN ('coding', 'dry_run'));
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS code_sample TEXT;
