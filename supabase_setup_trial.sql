-- BEAUTIFY CHANNEL: FREE TRIAL SCHEMA & TRIGGER UPDATE

-- 1. Add plan_type and trial_ends_at to profiles if they don't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone;

-- 2. Update the handle_new_user trigger to read metadata
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Insert the new user with their actual email and the default 'Free' role (Admin roles handled elsewhere)
  -- Reads plan_type and trial_ends_at from the user's raw metadata sent during signup
  INSERT INTO public.profiles (id, email, role, is_admin, plan_type, trial_ends_at, salon_name)
  VALUES (
    new.id, 
    new.email, 
    'Free', 
    false,
    COALESCE(new.raw_user_meta_data->>'plan_type', 'free'),
    (new.raw_user_meta_data->>'trial_ends_at')::timestamp with time zone,
    new.raw_user_meta_data->>'salon_name'
  );
  
  -- Create a default 'Basic' subscription in the old table for backwards compatibility (can be ignored later)
  INSERT INTO public.subscriptions (profile_id, tier)
  VALUES (new.id, 'Basic');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
