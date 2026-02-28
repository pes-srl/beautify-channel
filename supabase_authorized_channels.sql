-- beautify_authorized_channels.sql
-- Questa funzione di database controlla l'accesso ibrido:
-- Restituisce i 6 canali base per i piani 'basic', 'premium', e 'free_trial'
-- PIU' qualsiasi canale custom assegnato specificamente all'utente tramite 'user_channels'

CREATE OR REPLACE FUNCTION get_authorized_channels(req_user_id uuid)
RETURNS TABLE (
    id uuid,
    name text,
    subtitle text,
    stream_url_hls text,
    stream_url_mp3 text,
    is_active boolean,
    imageUrl text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_plan_type text;
    v_role text;
BEGIN
    -- 1. Recupera il piano e il ruolo dell'utente
    SELECT plan_type, role INTO v_plan_type, v_role
    FROM profiles
    WHERE profiles.id = req_user_id;

    -- 2. Restituisci i canali basati sul piano + assegnazioni custom (Gli ADMIN vedono tutto)
    RETURN QUERY
    WITH UserCustomChannels AS (
        -- Canali assegnati specificamente a questo utente
        SELECT rc.id AS ch_id
        FROM radio_channels rc
        JOIN user_channels uc ON rc.id = uc.channel_id
        WHERE uc.profile_id = req_user_id
        AND rc.is_active = true
    ),
    PlanBaseChannels AS (
        -- I canali base in base al ruolo o piano
        SELECT rc.id AS ch_id
        FROM radio_channels rc
        WHERE rc.is_active = true
        AND (
            -- Gli ADMIN vedono in automatico TUTTI i canali attivi
            v_role = 'Admin' 
            OR 
            -- Gli utenti veri vedono solo i 6 di default se hanno un piano
            (
                v_plan_type IN ('basic', 'premium', 'free_trial', 'free')
                AND rc.name IN (
                    'RELAX', 
                    'LOUNGE', 
                    'JAZZ', 
                    'AMBIENT MASSAGE', 
                    'ACOUSTIC VOCAL', 
                    'DEEP SOFT',
                    'Relax', 
                    'Lounge', 
                    'Jazz', 
                    'Ambient Massage', 
                    'Acoustic Vocal', 
                    'Deep Soft',
                    'relax', 
                    'lounge', 
                    'jazz', 
                    'ambient massage', 
                    'deep soft'
                )
            )
        )
    )
    -- Combina e rimuovi i duplicati
    SELECT DISTINCT
        rc.id,
        rc.name,
        rc.subtitle,
        rc.stream_url_hls,
        rc.stream_url_mp3,
        rc.is_active,
        -- Qui potresti avere una colonna vera in futuro, intanto null
        NULL::text as imageUrl
    FROM radio_channels rc
    WHERE rc.id IN (SELECT ch_id FROM UserCustomChannels)
       OR rc.id IN (SELECT ch_id FROM PlanBaseChannels)
    ORDER BY rc.name ASC;
END;
$$;
