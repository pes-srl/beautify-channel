-- Create the trial_ips table to prevent multiple free trials from the same IP

CREATE TABLE IF NOT EXISTS public.trial_ips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Settings
ALTER TABLE public.trial_ips ENABLE ROW LEVEL SECURITY;

-- Allow only service role to bypass RLS (used in Server Actions)
-- We don't want authenticated or anonymous users to be able to read or modify this directly from the client.
-- The server action will use a service_role client.

CREATE POLICY "Service role has full access" ON public.trial_ips
    FOR ALL
    USING (auth.role() = 'service_role');
