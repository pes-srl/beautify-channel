-- BEAUTIFY CHANNEL SAAS: UNIFY ROLES AND SUBSCRIPTIONS (FIXED 2)

-- 1. DROP DEPENDENT POLICIES FIRST
-- We must drop these before deleting the is_admin column or the old role type
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Admins can insert channels" ON public.radio_channels;
DROP POLICY IF EXISTS "Admins can update channels" ON public.radio_channels;
DROP POLICY IF EXISTS "Admins can delete channels" ON public.radio_channels;
DROP POLICY IF EXISTS "Admins have full access to user_channels" ON public.user_channels;
DROP POLICY IF EXISTS "Admins can manage all user_channels" ON public.user_channels;

-- 2. Rename the old strict ENUM role column to get it out of the way
ALTER TABLE public.profiles RENAME COLUMN role TO old_role;

-- 3. Add new text columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'User';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'Free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_status text DEFAULT 'active';

-- 4. Migrate existing data from old_role and is_admin
-- First, copy old_role to plan_type, casting the enum to text
UPDATE public.profiles SET plan_type = old_role::text WHERE old_role IS NOT NULL;

-- Make sure anyone who was an Admin in the old role is recognized
UPDATE public.profiles SET role = 'Admin' WHERE old_role::text = 'Admin';

-- Set role to Admin where the old is_admin checkbox was true
UPDATE public.profiles SET role = 'Admin' WHERE is_admin = true;

-- Ensure plan_type makes sense for Admins (Optional but clean)
UPDATE public.profiles SET plan_type = 'Ultra' WHERE role = 'Admin';

-- Remove the 'Admin' from plan_type if it was copied over accidentally
UPDATE public.profiles SET plan_type = 'Free' WHERE plan_type = 'Admin' AND role = 'User';

-- 5. Drop obsolete columns, tables, and types NOW
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_admin;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS old_role;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- 6. Update the trigger for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, plan_type, plan_status, salon_name)
  VALUES (new.id, new.email, 'User', 'Free', 'active', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. RECREATE THE RLS POLICIES using the new text 'role' column
-- Profiles policy: Admins see all
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (role = 'Admin');

-- Radio Channels policies: Admins can do full CRUD
CREATE POLICY "Admins can insert channels" 
ON public.radio_channels FOR INSERT 
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin');

CREATE POLICY "Admins can update channels" 
ON public.radio_channels FOR UPDATE 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin');

CREATE POLICY "Admins can delete channels" 
ON public.radio_channels FOR DELETE 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin');

-- User Channels policies: Admins have full access
CREATE POLICY "Admins have full access to user_channels" 
ON public.user_channels FOR ALL 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin');
