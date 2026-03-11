"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function updateUserProfile(userId: string, targetField: 'role' | 'plan_type' | 'subscription_expiration', newValue: string) {
    const supabase = await createClient();

    // Verify current user is Admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Non sei loggato." };

    const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (adminProfile?.role !== 'Admin') return { error: "Accesso negato. Solo gli admin possono modificare gli utenti." };

    // Create an Admin client using the Service Role Key to bypass RLS for profile updates
    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: { autoRefreshToken: false, persistSession: false }
        }
    );

    const actualValue = newValue === '' ? null : newValue;
    const updateData: any = { [targetField]: actualValue };

    if (targetField === 'plan_type' && newValue === 'free_trial') {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);
        updateData.trial_ends_at = trialEndDate.toISOString();
    }

    // Update the profile bypassing RLS
    const { data: updatedProfile, error } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error("Error updating profile:", error);
        return { error: error.message };
    }

    if (!updatedProfile) {
        return { error: "Utente non trovato o aggiornamento fallito (RLS bypass error)." };
    }

    revalidatePath('/admin/users');
    return { success: true };
}

export async function deleteUserAccount(userIdToDelete: string) {
    const supabase = await createClient();

    // Verify current user is Admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Non sei loggato." };

    const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (adminProfile?.role !== 'Admin') return { error: "Accesso negato. Solo gli admin possono eliminare gli utenti." };
    if (user.id === userIdToDelete) return { error: "Non puoi eliminare il tuo stesso account." };

    // Create an Admin client using the Service Role Key to bypass RLS and delete from Auth
    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    // Delete user from Auth. This will trigger Supabase's CASCADE rule to delete the profile if configured, 
    // or just remove the auth representation making the profile orphan (which is fine, or we can delete both).
    // Deleting from Auth is the critical security step.
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userIdToDelete);

    if (error) {
        console.error("Error deleting user from Auth:", error);
        return { error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true };
}
