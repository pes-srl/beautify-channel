-- FIX FOR ADMINS VISIBILITY OF ALL PROFILES
-- The previous policy was checking the TARGET row's role instead of the REQUESTER's role.

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Admin'
  )
);
