-- BEAUTIFY CHANNEL SAAS: CLEANUP LEGACY PLAN NAMES

-- 1. Convert 'Free' to 'free'
UPDATE public.profiles SET plan_type = 'free' WHERE plan_type = 'Free';

-- 2. Convert 'Basic' to 'basic'
UPDATE public.profiles SET plan_type = 'basic' WHERE plan_type = 'Basic';

-- 3. Convert 'Premium' to 'premium'
UPDATE public.profiles SET plan_type = 'premium' WHERE plan_type = 'Premium';

-- 4. Convert legacy 'Ultra' or 'PremiumCustomizzato' down to 'premium' (or 'basic', up to you)
-- Since 'Ultra' is no longer in our defined list, we downgrade it gracefully to 'premium'
UPDATE public.profiles SET plan_type = 'premium' WHERE plan_type IN ('Ultra', 'PremiumCustomizzato');
