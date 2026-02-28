"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(userId: string, targetField: 'role' | 'plan_type', newValue: string) {
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

    // Update the profile
    const { error } = await supabase
        .from('profiles')
        .update({ [targetField]: newValue })
        .eq('id', userId);

    if (error) {
        console.error("Error updating profile:", error);
        return { error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true };
}
