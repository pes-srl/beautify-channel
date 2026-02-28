-- BEAUTIFY CHANNEL SAAS: RADIO CHANNELS CPT MIGRATION

-- 1. Aggiorna la tabella radio_channels con i nuovi campi
ALTER TABLE public.radio_channels 
ADD COLUMN stream_url_hls text,
ADD COLUMN stream_url_mp3 text,
ADD COLUMN stream_url_mp3_mobile text,
ADD COLUMN subtitle text;

-- (Opzionale, ma consigliato per migrazione) Rimuoviamo il vecchio campo generico
ALTER TABLE public.radio_channels DROP COLUMN stream_url;

-- 2. Crea la nuova tabella "Ponte" (Junction Table) per assegnare manualmente gli Utenti/Saloni a specifici canali
CREATE TABLE public.user_channels (
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  channel_id uuid REFERENCES public.radio_channels(id) ON DELETE CASCADE NOT NULL,
  assigned_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  assigned_by uuid REFERENCES auth.users(id), -- Opzionale: Traccia quale Admin ha assegnato il canale
  PRIMARY KEY (user_id, channel_id) -- Un utente non può avere lo stesso canale assegnato due volte
);

-- 3. Row Level Security (RLS) per la nuova tabella
ALTER TABLE public.user_channels ENABLE ROW LEVEL SECURITY;

-- Gli Utenti possono vedere solo i LORO canali assegnati
CREATE POLICY "Users can view their own channel assignments"
ON public.user_channels FOR SELECT
USING (auth.uid() = user_id);

-- Gli Amministratori possono gestire e vedere tutto
CREATE POLICY "Admins can manage all user_channels"
ON public.user_channels
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- 4. Inserimento dei 4 Canali Base (Seed Data se la tabella è vuota o pulizia)
-- Nota: se hai già dei canali dentro, questa query INSERT potrebbe fallire sui nomi, si può skippare o gestire.
INSERT INTO public.radio_channels (name, subtitle, stream_url_hls, stream_url_mp3, stream_url_mp3_mobile, is_active)
VALUES 
('Basic', 'Basic Channel', 'https://canali2.pesstream.eu/hls/beautify_basic_channel/live.m3u8', 'https://canali.pesstream.eu/listen/beautify_basic_channel/radio.mp3', 'https://canali.pesstream.eu/listen/beautify_basic_channel/radio.mp3', true),
('Laser Channel', 'Laser Channel', 'https://canali2.pesstream.eu/hls/beautify_laser_channel/live.m3u8', 'https://canali.pesstream.eu/listen/beautify_laser_channel/radio.mp3', 'https://canali.pesstream.eu/listen/beautify_laser_channel/radio.mp3', true),
('Cosmetic Channel', 'Cosmetic Channel', 'https://canali2.pesstream.eu/hls/beautify_cosmetic_channel/live.m3u8', 'https://canali.pesstream.eu/listen/beautify_cosmetic_channel/radio.mp3', 'https://canali.pesstream.eu/listen/beautify_cosmetic_channel/radio.mp3', true),
('Premium', 'Premium Channel', 'https://canali2.pesstream.eu/hls/beautify_premium_channel/live.m3u8', 'https://canali.pesstream.eu/listen/beautify_premium_channel/radio.mp3', 'https://canali.pesstream.eu/listen/beautify_premium_channel/radio.mp3', true);
