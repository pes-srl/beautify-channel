-- THE ULTIMATE FIX FOR INFINITE RECURSION IN PROFILES RLS
-- Error 42P17 occurs when a policy on table X queries table X to check permissions.
-- We must break the loop by using a secure, direct approach or a security definer function.

-- 1. Drop ALL existing policies on profiles to clear the board
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles_Self_View" ON public.profiles;
DROP POLICY IF EXISTS "Profiles_Admin_View_All" ON public.profiles;

-- 2. Create a Security Definer function to check admin status WITHOUT triggering RLS on profiles again
-- This runs as the table owner and bypasses RLS for the exact check we need.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  _role text;
BEGIN
  -- We query the profile table directly, bypass RLS since it's a security definer function
  SELECT role INTO _role FROM public.profiles WHERE id = auth.uid();
  RETURN _role = 'Admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Policy 1: Everyone can read their OWN profile (Always safe, no recursion)
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- 4. Policy 2: Admins can read ALL profiles (Uses our safe function)
CREATE POLICY "Admins can read all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin());

-- 5. Force update the user to ensure data is absolutely correct
UPDATE public.profiles 
SET role = 'Admin', plan_type = 'premium' 
WHERE email = 'mirkodgzguillen@gmail.com';
