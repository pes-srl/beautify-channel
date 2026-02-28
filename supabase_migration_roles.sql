-- BEAUTIFY CHANNEL SAAS: MIGRATION TO CUSTOM SYSTEM ROLES

-- 1. Create the new ENUM for User Roles
CREATE TYPE user_role AS ENUM ('Admin', 'Free', 'Basic', 'Premium', 'PremiumCustomizzato');

-- 2. Add the new role column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN role user_role DEFAULT 'Free';

-- 3. Automatically convert existings Admins to the 'Admin' role
UPDATE public.profiles
SET role = 'Admin'
WHERE is_admin = true;

-- 4. Automatically set existing non-admins to 'Basic' just as a default
UPDATE public.profiles
SET role = 'Basic'
WHERE is_admin = false;

-- NOTE: We are keeping the old "is_admin" column for now to not break your existing RLS policies 
-- until we update them all, but moving forward we will map the frontend to use "role".

-- 5. Add custom column to Radio Channels if you want them individually locked to a role
ALTER TABLE public.radio_channels 
ADD COLUMN min_role_required user_role DEFAULT 'Free';
