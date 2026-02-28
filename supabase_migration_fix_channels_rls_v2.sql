-- BEAUTIFY CHANNEL SAAS: FIX RADIO CHANNELS RLS FOR NEW ADMIN ROLE (v2)

-- Drop the old policies first
DROP POLICY IF EXISTS "Admins can insert channels" ON public.radio_channels;
DROP POLICY IF EXISTS "Admins can update channels" ON public.radio_channels;
DROP POLICY IF EXISTS "Admins can delete channels" ON public.radio_channels;

-- Let's make the RLS check more robust. We'll use a `SECURITY DEFINER` function or a simpler check.
-- Sometimes SELECT inside RLS fails if the profile hasn't successfully synced or if role has whitespace.

-- 1. Permetti agli amministratori di creare nuovi canali
CREATE POLICY "Admins can insert channels" 
ON public.radio_channels FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'Admin' OR is_admin = true)
  )
);

-- 2. Permetti agli amministratori di modificare i canali esistenti
CREATE POLICY "Admins can update channels" 
ON public.radio_channels FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'Admin' OR is_admin = true)
  )
);

-- 3. Permetti agli amministratori di eliminare i canali
CREATE POLICY "Admins can delete channels" 
ON public.radio_channels FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'Admin' OR is_admin = true)
  )
);
