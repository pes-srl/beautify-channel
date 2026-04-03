import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkUserTrial() {
  const email = 'marina.ricordi@gmail.com'
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('trial_ends_at, plan_type')
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

  if (profile.plan_type !== 'free_trial' || !profile.trial_ends_at) {
    console.log(`User ${email} is not in a free trial. Plan: ${profile.plan_type}`)
    process.exit(0)
  }

  const trialEnd = new Date(profile.trial_ends_at)
  const now = new Date()
  const diffTime = trialEnd.getTime() - now.getTime()
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  console.log(`User: ${email}`)
  console.log(`Plan: ${profile.plan_type}`)
  console.log(`Trial Ends At: ${profile.trial_ends_at}`)
  console.log(`Days Left: ${daysLeft}`)
}

checkUserTrial()
