const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data: profiles, error } = await supabase.from('profiles').select('email, plan_type, updated_at').order('created_at', { ascending: false }).limit(5);
    console.log("Recent profiles:", profiles);
    
    const { data: requests, error: reqErr } = await supabase.from('upgrade_requests').select('status, payment_intent_id, created_at').order('created_at', { ascending: false }).limit(5);
    console.log("Recent upgrade requests:", requests);
}
check();
