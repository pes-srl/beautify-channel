-- BEAUTIFY CHANNEL SAAS: DATABASE SCHEMA INITIALIZATION

-- 1. Create the custom ENUM types for subscription tiers and categories
CREATE TYPE subscription_tier AS ENUM ('Basic', 'Premium', 'Ultra');
CREATE TYPE salon_category AS ENUM ('Beauty', 'Massage', 'Barber', 'Estetica');

-- 2. Create the Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  salon_name text,
  category salon_category,
  logo_url text,
  is_admin boolean DEFAULT false, -- This defines if the user can access /admin
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create the Subscriptions table
CREATE TABLE public.subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tier subscription_tier DEFAULT 'Basic',
  valid_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create the Radio Channels table
CREATE TABLE public.radio_channels (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  stream_url text NOT NULL,
  min_tier_required subscription_tier DEFAULT 'Basic',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Set up Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_channels ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile. Admins can read all profiles.
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- Subscriptions: Users can read their own subscription. Admins can read all.
CREATE POLICY "Users can view own subscription" 
ON public.subscriptions FOR SELECT 
USING (profile_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions" 
ON public.subscriptions FOR SELECT 
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- Radio Channels: Anyone authenticated can read active channels (filtering by tier happens in the app/API)
CREATE POLICY "Authenticated users can view active channels" 
ON public.radio_channels FOR SELECT 
TO authenticated
USING (is_active = true);


-- 6. Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, salon_name)
  VALUES (new.id, new.email); -- Temporarily using email as salon name
  
  -- Create a default 'Basic' subscription for the new user
  INSERT INTO public.subscriptions (profile_id, tier)
  VALUES (new.id, 'Basic');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
