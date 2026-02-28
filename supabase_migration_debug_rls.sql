-- BEAUTIFY CHANNEL SAAS: FIX RADIO CHANNELS RLS FOR NEW ADMIN ROLE (v4 - debug)
-- Let's make the RLS check extremely simple to see if role evaluation is the problem.

-- Drop the old policies first
DROP POLICY IF EXISTS "Admins can insert channels" ON public.radio_channels;
DROP POLICY IF EXISTS "Admins can update channels" ON public.radio_channels;
DROP POLICY IF EXISTS "Admins can delete channels" ON public.radio_channels;

-- 1. Create a super simple INSERT policy first to check if RLS is the actual failure point or the schema constraint
-- This allows anyone who is authenticated to insert a channel
CREATE POLICY "Admins can insert channels" 
ON public.radio_channels FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated'
);

-- 2. Permetti agli amministratori di modificare i canali esistenti
CREATE POLICY "Admins can update channels" 
ON public.radio_channels FOR UPDATE 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin' 
);

-- 3. Permetti agli amministratori di eliminare i canali
CREATE POLICY "Admins can delete channels" 
ON public.radio_channels FOR DELETE 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin' 
);
