import { createClient } from '../src/utils/supabase/server.ts'; 

async function checkTable() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('user_feedbacks').select('*').limit(1);
        if (error) {
            console.log(`ERROR: ${error.message} (Code: ${error.code})`);
        } else {
            console.log('SUCCESS: Table exists and is accessible');
        }
    } catch (e) {
        console.error('CRITICAL ERROR:', e);
    }
}

checkTable();
