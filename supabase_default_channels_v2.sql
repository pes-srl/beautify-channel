-- BEAUTIFY CHANNEL: DEFAULT CHANNELS & TRIGGER RESTORE V2

-- 1. Restore the signup trigger (so the user gets 'free_trial' plan)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (
      id, email, role, is_admin, plan_type, trial_ends_at, salon_name, full_name
    )
    VALUES (
      new.id, new.email, 'Free', false,
      COALESCE(new.raw_user_meta_data->>'plan_type', 'free'),
      NULLIF(new.raw_user_meta_data->>'trial_ends_at', '')::timestamp with time zone,
      new.raw_user_meta_data->>'salon_name',
      new.raw_user_meta_data->>'full_name'
    );
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.profiles (id, email, role, is_admin, plan_type)
    VALUES (new.id, new.email, 'Free', false, 'free')
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

-- 2. Add 'is_default' column to radio_channels
ALTER TABLE public.radio_channels ADD COLUMN IF NOT EXISTS is_default boolean DEFAULT false;

-- 3. Mark the 6 specific channels as default (and ensure they exist using 'stream_url_hls')
-- This tries to update them, or insert them if they don't exist
INSERT INTO public.radio_channels (name, stream_url_hls, min_tier_required, is_active, is_default)
VALUES 
  ('Acoustic Vocal', 'https://canali2.pesstream.eu/hls/beautify-channel/live.m3u8', 'Basic', true, true),
  ('Ambient Massage', 'https://canali2.pesstream.eu/hls/beautify-channel/live.m3u8', 'Basic', true, true),
  ('Deep Soft', 'https://canali2.pesstream.eu/hls/beautify-channel/live.m3u8', 'Basic', true, true),
  ('Jazz', 'https://canali2.pesstream.eu/hls/beautify-channel/live.m3u8', 'Basic', true, true),
  ('Lounge', 'https://canali2.pesstream.eu/hls/beautify-channel/live.m3u8', 'Basic', true, true),
  ('Relax', 'https://canali2.pesstream.eu/hls/beautify-channel/live.m3u8', 'Basic', true, true)
ON CONFLICT DO NOTHING;

UPDATE public.radio_channels 
SET is_default = true 
WHERE name ILIKE ANY (ARRAY['acoustic vocal', 'ambiental massage', 'ambient massage', 'deep soft', 'jazz', 'lounge', 'relax']);


-- 4. Rewrite get_authorized_channels to allow 'is_default' for Free Trial / Basic / Premium users
CREATE OR REPLACE FUNCTION public.get_authorized_channels(req_user_id uuid)
RETURNS SETOF public.radio_channels AS $$
DECLARE
    user_role text;
    user_plan text;
    user_isAdmin boolean;
BEGIN
    -- Fetch the user's role and plan_type
    SELECT role, plan_type, is_admin INTO user_role, user_plan, user_isAdmin
    FROM public.profiles 
    WHERE id = req_user_id;

    -- Admins see everything
    IF user_isAdmin OR user_role = 'Admin' THEN
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
