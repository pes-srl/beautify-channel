const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function check() {
    const { data: profiles } = await supabase.from('profiles').select('email, plan_type, store_license_url, store_contract_url').eq('plan_type', 'basic').order('updated_at', { ascending: false }).limit(2);
    console.log("PDF URLs:", profiles);
}
check();
