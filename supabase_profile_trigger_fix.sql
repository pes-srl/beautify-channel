-- BEAUTIFY CHANNEL SAAS: REGISTRATION SYNC UPGRADE & RLS FIX

-- 1. Add 'email' column to profiles so we don't stuff it inside 'salon_name' anymore
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- 2. Retroactively update existing profiles to grab their email from auth.users
UPDATE public.profiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id AND p.email IS NULL;

-- 3. Rewrite the Registration Trigger to properly seed the Profile with the correct role
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Insert the new user with their actual email and the default 'Free' role
  INSERT INTO public.profiles (id, email, role, is_admin)
  VALUES (new.id, new.email, 'Free', false);
  
  -- Create a default 'Basic' subscription for the new user (This can be modified later by the webhook)
  INSERT INTO public.subscriptions (profile_id, tier)
  VALUES (new.id, 'Basic');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recreate the junction table correctly (Drop old one if it existed with wrong column names like `user_id`)
DROP TABLE IF EXISTS public.user_channels CASCADE;

CREATE TABLE public.user_channels (
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  channel_id uuid REFERENCES public.radio_channels(id) ON DELETE CASCADE,
  assigned_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (profile_id, channel_id)
);

-- Enable RLS for user_channels
ALTER TABLE public.user_channels ENABLE ROW LEVEL SECURITY;

-- Admins can do everything with user_channels
CREATE POLICY "Admins have full access to user_channels" 
ON public.user_channels FOR ALL 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin' OR 
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- Users can only SELECT their own assigned channels
CREATE POLICY "Users can read own user_channels" 
ON public.user_channels FOR SELECT 
USING (profile_id = auth.uid());
