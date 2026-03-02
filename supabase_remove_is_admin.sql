-- BEAUTIFY CHANNEL: REMOVE IS_ADMIN DEPENDENCIES V4

-- 1. Restore the signup trigger WITHOUT touching is_admin
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  BEGIN
    -- Removed is_admin from INSERT
    INSERT INTO public.profiles (
      id, email, role, plan_type, trial_ends_at, salon_name, full_name
    )
    VALUES (
      new.id, new.email, 'Free',
      COALESCE(new.raw_user_meta_data->>'plan_type', 'free'),
      NULLIF(new.raw_user_meta_data->>'trial_ends_at', '')::timestamp with time zone,
      new.raw_user_meta_data->>'salon_name',
      new.raw_user_meta_data->>'full_name'
    );
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.profiles (id, email, role, plan_type)
    VALUES (new.id, new.email, 'Free', 'free')
    ON CONFLICT (id) DO NOTHING;
  END;

  BEGIN
    INSERT INTO public.subscriptions (profile_id, tier)
    VALUES (new.id, 'Basic'::subscription_tier);
  EXCEPTION WHEN OTHERS THEN
  END;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Rewrite get_authorized_channels WITHOUT is_admin
DROP FUNCTION IF EXISTS public.get_authorized_channels(uuid);

CREATE OR REPLACE FUNCTION public.get_authorized_channels(req_user_id uuid)
RETURNS SETOF public.radio_channels AS $$
DECLARE
    user_role text;
    user_plan text;
BEGIN
    -- Fetch ONLY the user's role and plan_type
    SELECT role, plan_type INTO user_role, user_plan
    FROM public.profiles 
    WHERE id = req_user_id;

    -- Admins see everything
    IF user_role = 'Admin' THEN
        RETURN QUERY SELECT * FROM public.radio_channels WHERE is_active = true ORDER BY name ASC;
    
    -- If user plan is purely 'free' (expired), they get NOTHING
    ELSIF user_plan = 'free' THEN
        RETURN;
    
    -- Otherwise (free_trial, basic, premium), they see default channels + manually assigned ones
    ELSE
        RETURN QUERY 
        SELECT rc.* 
        FROM public.radio_channels rc
        LEFT JOIN public.user_channels uc ON uc.channel_id = rc.id AND uc.profile_id = req_user_id
        WHERE rc.is_active = true AND (rc.is_default = true OR uc.channel_id IS NOT NULL)
        ORDER BY rc.name ASC;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
