"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileInfo(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Non autorizzato' };
    }

    const fullName = formData.get('fullName') as string;
    const salonName = formData.get('salonName') as string;
    const partitaIva = formData.get('partitaIva') as string;

    // 1. Update auth.users user_metadata
    const { error: authError } = await supabase.auth.updateUser({
        data: {
            full_name: fullName,
            salon_name: salonName,
            partita_iva: partitaIva
        }
    });

    if (authError) {
        console.error('Error updating user_metadata:', authError);
        return { error: 'Si è verificato un errore durante l\'aggiornamento del profilo.' };
    }

    // 2. Update public.profiles table
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            salon_name: salonName,
            partita_iva: partitaIva
        })
        .eq('id', user.id);

    if (profileError) {
        console.error('Error updating profiles table:', profileError);
        // We don't necessarily fail here if the auth update succeeded, but ideally it should.
    }

    revalidatePath('/area-riservata/profilo');
    revalidatePath('/', 'layout');
    
    return { success: true };
}

export async function updateProfilePassword(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        return { error: 'Non autorizzato' };
    }

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confPassword = formData.get('confPassword') as string;

    if (!currentPassword) {
        return { error: 'Inserisci la password attuale.' };
    }

    if (!newPassword || newPassword !== confPassword) {
        return { error: 'Le password non coincidono o sono vuote.' };
    }

    if (newPassword.length < 6) {
        return { error: 'La password deve avere almeno 6 caratteri.' };
    }

    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
    });

    if (signInError) {
        return { error: 'La password attuale non è corretta.' };
    }

    // Actually updating the user password
    const { error: authError } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (authError) {
        console.error('Error updating password:', authError);
        return { error: authError.message };
    }

    return { success: true };
}

export async function sendPasswordResetEmail(email: string) {
    const supabase = await createClient();
    
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/area-riservata/profilo`,
    });

    if (error) {
        console.error('Error sending reset email:', error);
        return { error: error.message };
    }

    return { success: true };
}
