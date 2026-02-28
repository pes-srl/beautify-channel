-- BEAUTIFY CHANNEL SAAS: FIX RADIO CHANNELS RLS FOR NEW ADMIN ROLE (v3)
-- This version removes any references to the old `is_admin` column.

-- Drop the old policies first
DROP POLICY IF EXISTS "Admins can insert channels" ON public.radio_channels;
DROP POLICY IF EXISTS "Admins can update channels" ON public.radio_channels;
DROP POLICY IF EXISTS "Admins can delete channels" ON public.radio_channels;

-- 1. Permetti agli amministratori di creare nuovi canali
CREATE POLICY "Admins can insert channels" 
ON public.radio_channels FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Admin'
  )
);

-- 2. Permetti agli amministratori di modificare i canali esistenti
CREATE POLICY "Admins can update channels" 
ON public.radio_channels FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Admin'
  )
);

-- 3. Permetti agli amministratori di eliminare i canali
CREATE POLICY "Admins can delete channels" 
ON public.radio_channels FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Admin'
  )
);
