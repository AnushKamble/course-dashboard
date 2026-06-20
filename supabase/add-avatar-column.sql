-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
