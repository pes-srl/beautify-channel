-- BEAUTIFY CHANNEL SAAS: FIX RADIO CHANNELS RLS FOR SELECT (v5)

-- Drop the policy if it exists so we can recreate it cleanly
DROP POLICY IF EXISTS "Admins can select all channels" ON public.radio_channels;

-- 4. Permetti agli amministratori di VEDERE (SELECT) tutti i canali, compresi quelli inattivi (Bozze)
-- Altrimenti, quando provi a creare un canale inattivo e l'app tenta di leggerlo subito dopo per mostrartelo, Supabase lo blocca.
CREATE POLICY "Admins can select all channels" 
ON public.radio_channels FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Admin'
  )
);
