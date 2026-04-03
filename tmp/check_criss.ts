import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkUserCriss() {
  const email = 'criss.dellorto@gmail.com'
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('trial_ends_at, subscription_expiration, plan_type')
    .eq('email', email)
    .single()

  if (error) {
    console.error('Error fetching user:', error.message)
    process.exit(1)
  }

  if (!profile) {
    console.log('User not found.')
    process.exit(0)
  }

  console.log(`User: ${email}`)
  console.log(`Plan: ${profile.plan_type}`)
  console.log(`Trial Ends At: ${profile.trial_ends_at || 'NULL'}`)
  console.log(`Subscription Expiration: ${profile.subscription_expiration || 'NULL'}`)
}

checkUserCriss()
