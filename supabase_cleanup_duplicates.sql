-- BEAUTIFY CHANNEL: CLEANUP DUPLICATE CHANNELS
-- Questo script elimina i 6 canali duplicati che avevamo inserito via script 
-- e converte in "Default" i TUOI canali originali.

-- 1. Eliminiamo chirurgicamente i 6 canali che ho creato io nello script precedente. 
-- Li riconosciamo perché avevano gli slug esatti creati a mano e non quelli autogenerati.
DELETE FROM public.radio_channels 
WHERE slug IN (
  'relax',
  'lounge',
  'jazz',
  'deep-soft',
  'ambient-massage',
  'acoustic-vocal'
);

-- 2. I tuoi canali originali ora rimangono.
-- Vai in http://localhost:3000/admin/channels 
-- Clicca sulla matita per modificarli e attiva il nuovo bottone "Canale di Default"
