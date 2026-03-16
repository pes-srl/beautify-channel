const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: users, error: userErr } = await supabase.auth.admin.listUsers();
  const testUser = users.users.find(u => u.email === 'agent.test1@gmail.com');
  if (!testUser) {
    console.log("no user");
    return;
  }
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', testUser.id).single();
  console.log("DB Profile Output:", JSON.stringify(profile, null, 2));
}

check();
