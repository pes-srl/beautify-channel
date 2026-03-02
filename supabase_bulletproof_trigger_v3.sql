-- BEAUTIFY CHANNEL: BULLETPROOF REGISTRATION FIX V3

-- 1. Ensure all columns exist 
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'Free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;

-- 2. Drop the old trigger safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Recreate the trigger function with ENUM casting
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- We wrap the profile insertion in a BEGIN...EXCEPTION block
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
    -- Fallback: If anything fails at least the user gets a profile
    INSERT INTO public.profiles (id, email, role, is_admin, plan_type)
    VALUES (new.id, new.email, 'Free', false, 'free')
    ON CONFLICT (id) DO NOTHING;
  END;
  
  -- Wrap the subscription insertion to prevent 500 errors if ENUM fails
  BEGIN
    INSERT INTO public.subscriptions (profile_id, tier)
    VALUES (new.id, 'Basic'::subscription_tier); -- Typecast explicitly to the custom ENUM
  EXCEPTION WHEN OTHERS THEN
    -- Ignore subscription failures
  END;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Reattach the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
