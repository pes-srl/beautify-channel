const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://eufahlzjxbimyiwivoiq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZmFobHpqeGJpbXlpd2l2b2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4ODU0MjEsImV4cCI6MjA4NzQ2MTQyMX0.rW0CCKGEwecaCqpPda3kj7j1uoWy1DI0o5TcwJAKa7o');

async function run() {
    console.log("Fetching profile...");
    const { data: profile, error: profError } = await supabase.from('profiles').select('id, role').eq('email', 'mirkodgzguillen@gmail.com').single();
    if (profError) {
        console.error("Profile Error:", profError);
        return;
    }

    console.log("Fetching authorized channels for:", profile.id, "(Role:", profile.role, ")");
    const { data, error } = await supabase.rpc('get_authorized_channels', { req_user_id: profile.id });
    console.log("RPC Error:", error);
    console.log("RPC Data:", data);
}

run();
