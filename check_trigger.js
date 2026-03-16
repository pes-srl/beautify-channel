const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('profiles').select('id');
  console.log("Total profiles:", data ? data.length : error);
  
  const { data: users } = await supabase.auth.admin.listUsers();
  console.log("Total users:", users.users.length);
}

check();
