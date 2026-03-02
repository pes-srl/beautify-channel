-- BEAUTIFY CHANNEL: FIX REGISTRATION DATABASE ERROR

-- 1. Ensure all new columns exist in the profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'Free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;

-- 2. Update the handle_new_user trigger to read all metadata safely
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Insert the new user with their actual email and the default 'Free' role
  -- Reads plan_type, trial_ends_at, full_name, etc., from the user's raw metadata sent during signup
  INSERT INTO public.profiles (
    id, 
    email, 
    role, 
    is_admin, 
    plan_type, 
    trial_ends_at, 
    salon_name,
    full_name
  )
  VALUES (
    new.id, 
    new.email, 
    'Free', 
    false,
    COALESCE(new.raw_user_meta_data->>'plan_type', 'free'),
    (new.raw_user_meta_data->>'trial_ends_at')::timestamp with time zone,
    new.raw_user_meta_data->>'salon_name',
    new.raw_user_meta_data->>'full_name'
  );
  
  -- Create a default 'Basic' subscription in the old table for backwards compatibility
  INSERT INTO public.subscriptions (profile_id, tier)
  VALUES (new.id, 'Basic');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
