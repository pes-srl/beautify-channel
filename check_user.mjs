import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eufahlzjxbimyiwivoiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZmFobHpqeGJpbXlpd2l2b2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTg4NTQyMSwiZXhwIjoyMDg3NDYxNDIxfQ.N1gOS_NQOXUvpfsafu2KQsciZhId1DpcFXpxYvkKOOY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser() {
    // Let's first search in a public table like users or profiles, or we can list users from auth.
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error("Error fetching auth users:", error);
    } else {
        const user = users.users.find(u => u.email?.includes('crissweb73') || u.user_metadata?.username?.includes('crissweb73') || u.raw_user_meta_data?.username?.includes('crissweb73') || u.email === 'crissweb73@gmail.com' || JSON.stringify(u).includes('crissweb73'));
        if (user) {
            console.log('Auth User Found:', user);
        } else {
            console.log('User crissweb73 not found in Auth');
            console.log('Checking all users:', users.users.map(u => u.email).join(', '));
        }
    }

    // Also query a possible 'profiles' or 'users' table
    try {
        const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
        if (!pError) {
            const profile = profiles.find(p => JSON.stringify(p).includes('crissweb73'));
            if (profile) console.log('Profile Found:', profile);
        }
    } catch (e) { }
}

checkUser();
