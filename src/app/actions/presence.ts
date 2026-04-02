'use server'

import { createClient } from '@/utils/supabase/server'
import { differenceInMinutes, parseISO } from 'date-fns'

/**
 * Updates the last_ping_at for the current user to track presence.
 */
export async function updatePresence() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false }

    // Bypass RLS to update presence fields
    try {
        const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
        const supabaseAdmin = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { autoRefreshToken: false, persistSession: false } }
        )

        // First, check the current status to see if we need to reset last_login_at (new session)
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('is_online, last_ping_at')
            .eq('id', user.id)
            .single()

        const now = new Date();
        const isActuallyOffline = !profile?.is_online ||
            (profile.last_ping_at && (differenceInMinutes(now, parseISO(profile.last_ping_at)) >= 3));

        const updateData: any = {
            last_ping_at: now.toISOString(),
            last_seen: now.toISOString(),
            is_online: true
        }

        // If they were effectively offline, this is a new session
        if (isActuallyOffline) {
            updateData.last_login_at = now.toISOString();
        }

        const { error } = await supabaseAdmin
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)

        if (error) {
            console.error('Error updating presence ping:', error)
            return { success: false, error: error.message }
        }
    } catch (err) {
        console.error('Critical error updating presence:', err)
        return { success: false }
    }

    return { success: true }
}
