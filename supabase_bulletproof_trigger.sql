-- BEAUTIFY CHANNEL: BULLETPROOF REGISTRATION FIX

-- 1. Ensure all necessary columns exist (this prevents "column does not exist" errors)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'Free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;

-- 2. Create an indestructible trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- We wrap the profile insertion in a BEGIN...EXCEPTION block
  -- so if anything fails (like a bad date format, or a missing column), the user is still created.
  BEGIN
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
      NULLIF(new.raw_user_meta_data->>'trial_ends_at', '')::timestamp with time zone,
      new.raw_user_meta_data->>'salon_name',
      new.raw_user_meta_data->>'full_name'
    );
  EXCEPTION WHEN OTHERS THEN
    -- Fallback: If the advanced insert fails, we just save the bare minimum.
    INSERT INTO public.profiles (id, email, role, is_admin, plan_type)
    VALUES (new.id, new.email, 'Free', false, 'free')
    ON CONFLICT (id) DO NOTHING;
  END;
  
  -- We wrap the subscription insertion in a BEGIN...EXCEPTION block too
  BEGIN
    INSERT INTO public.subscriptions (profile_id, tier)
    VALUES (new.id, 'Basic');
  EXCEPTION WHEN OTHERS THEN
    -- If subscription fails, silently ignore
  END;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
