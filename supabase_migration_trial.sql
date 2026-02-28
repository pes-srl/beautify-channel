-- BEAUTIFY CHANNEL SAAS: PROVA GRATIS & TRIAL PERIOD

-- 1. Aggiungiamo le colonne per tracciare la prova gratuita (Trial)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_start timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_end timestamp with time zone;

-- 2. Aggiorniamo il trigger di Registrazione per leggere i metadati extra
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  is_trial boolean;
  user_salon_name text;
BEGIN
  -- Estrarre i metadati grezzi passati durante il signUp dal frontend
  is_trial := COALESCE((new.raw_user_meta_data->>'is_trial')::boolean, false);
  user_salon_name := COALESCE(new.raw_user_meta_data->>'salon_name', new.email);

  IF is_trial THEN
    -- Se l'utente si è iscritto dalla pagina /provagratis
    INSERT INTO public.profiles (id, email, role, plan_type, plan_status, salon_name, trial_start, trial_end)
    VALUES (
      new.id, 
      new.email, 
      'User', 
      'free_trial', 
      'active', 
      user_salon_name,
      now(),
      now() + interval '7 days'
    );
  ELSE
    -- Reazione standard per iscrizioni normali (es. da /register o pannello Admin)
    INSERT INTO public.profiles (id, email, role, plan_type, plan_status, salon_name)
    VALUES (
      new.id, 
      new.email, 
      'User', 
      'free', 
      'active', 
      user_salon_name
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
