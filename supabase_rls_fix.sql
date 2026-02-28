-- IMPORTANT SETUP FOR THE ADMIN PANEL:
-- These policies grant ADMINS the right to Insert, Update, and Delete channels.
-- Previously, only SELECT (read) access was configured.

-- 1. Permetti agli amministratori di creare (Clonare/Aggiungere) nuovi canali
CREATE POLICY "Admins can insert channels" 
ON public.radio_channels FOR INSERT 
WITH CHECK (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- 2. Permetti agli amministratori di modificare (Aggiornare) i canali esistenti
CREATE POLICY "Admins can update channels" 
ON public.radio_channels FOR UPDATE 
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- 3. Permetti agli amministratori di eliminare (Cestinare) i canali
CREATE POLICY "Admins can delete channels" 
ON public.radio_channels FOR DELETE 
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
