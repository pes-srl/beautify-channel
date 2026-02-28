-- MIGRATION: ADD SLUG TO RADIO CHANNELS
-- Esegui questo script nel tuo ambiente Supabase SQL Editor

-- 1. Aggiungiamo la colonna slug
ALTER TABLE public.radio_channels 
ADD COLUMN slug text;

-- 2. Popoliamo lo slug per i canali esistenti (convertiamo il nome in minuscolo, sostituiamo gli spazi con i trattini)
UPDATE public.radio_channels
SET slug = lower(regexp_replace(name, '\s+', '-', 'g'))
WHERE slug IS NULL;

-- 3. Rendiamo la colonna slug unica 
ALTER TABLE public.radio_channels
ADD CONSTRAINT radio_channels_slug_key UNIQUE (slug);
