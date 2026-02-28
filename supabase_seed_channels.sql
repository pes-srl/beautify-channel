-- BEAUTIFY CHANNEL SAAS: SEED DEI 6 CANALI RADIO PRINCIPALI
-- Esegui questo script nel SQL Editor di Supabase per popolare il database con i tuoi 6 canali reali.

-- Opzionale: Pulisce la tabella se c'erano vecchi test o bozze (rimuovi i trattini '--' sulla riga qui sotto se vuoi cancellare tutto prima di inserire)
-- TRUNCATE TABLE public.radio_channels CASCADE;

INSERT INTO public.radio_channels (name, subtitle, stream_url_hls, stream_url_mp3, is_active)
VALUES 
  ('RELAX', 'Il tuo rifugio di pace per i clienti', 'https://canali2.pesstream.eu/hls/beautify_relax_(azuracast)-aac-96/live.m3u8', 'https://canali2.pesstream.eu/listen/beautify_relax_(azuracast)-aac-96/radio.mp3', true),
  
  ('LOUNGE', 'Atmosfera elegante e raffinata', 'https://canali2.pesstream.eu/hls/beautify_lounge_(azuracast)-aac-96/live.m3u8', 'https://canali2.pesstream.eu/listen/beautify_lounge_(azuracast)-aac-96/radio.mp3', true),
  
  ('JAZZ', 'Classici, Smooth e ritmi ricercati', 'https://canali2.pesstream.eu/hls/beautify_jazz_(azuracast)-aac-96/live.m3u8', 'https://canali2.pesstream.eu/listen/beautify_jazz_(azuracast)-aac-96/radio.mp3', true),
  
  ('AMBIENT MASSAGE', 'Note delicate per trattamenti profondi', 'https://canali2.pesstream.eu/hls/beautify_massage_(azuracast)-aac-96/live.m3u8', 'https://canali2.pesstream.eu/listen/beautify_massage_(azuracast)-aac-96/radio.mp3', true),
  
  ('ACOUSTIC VOCAL', 'Voci calde ed emozionanti d''autore', 'https://canali2.pesstream.eu/hls/beautify_vocal_(azuracast)-aac-96/live.m3u8', 'https://canali2.pesstream.eu/listen/beautify_vocal_(azuracast)-aac-96/radio.mp3', true),
  
  ('DEEP SOFT', 'Morbidi ritmi per energie moderne', 'https://canali2.pesstream.eu/hls/beautify_deep_(azuracast)-aac-96/live.m3u8', 'https://canali2.pesstream.eu/listen/beautify_deep_(azuracast)-aac-96/radio.mp3', true);
