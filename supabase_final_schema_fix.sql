-- BEAUTIFY CHANNEL: FINAL SCHEMA FIX
-- Questo script si assicura che tutte le colonne necessarie esistano nella tabella profiles.
-- Risolverà definitivamente l'errore 500 in registrazione e l'errore "column is_admin does not exist".

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'Free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS salon_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
