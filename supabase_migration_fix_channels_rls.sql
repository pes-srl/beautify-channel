-- BEAUTIFY CHANNEL SAAS: FIX RADIO CHANNELS RLS FOR NEW ADMIN ROLE

-- Drop the old policies first
DROP POLICY IF EXISTS "Admins can insert channels" ON public.radio_channels;
DROP POLICY IF EXISTS "Admins can update channels" ON public.radio_channels;
DROP POLICY IF EXISTS "Admins can delete channels" ON public.radio_channels;

-- 1. Permetti agli amministratori (che hanno role = 'Admin' o is_admin = true) di creare nuovi canali
CREATE POLICY "Admins can insert channels" 
ON public.radio_channels FOR INSERT 
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin' OR 
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- 2. Permetti agli amministratori di modificare i canali esistenti
CREATE POLICY "Admins can update channels" 
ON public.radio_channels FOR UPDATE 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin' OR 
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- 3. Permetti agli amministratori di eliminare i canali
CREATE POLICY "Admins can delete channels" 
ON public.radio_channels FOR DELETE 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin' OR 
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
