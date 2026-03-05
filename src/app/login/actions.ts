"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logActivity } from "@/app/actions/activity-actions";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect(`/login?message=${encodeURIComponent("Email o password non validi")}`);
    }

    // Determine where to redirect based on user role
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await logActivity(user.id, 'login');

        // Bypass RLS locally to forcefully set the user online
        try {
            const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
            const supabaseAdmin = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
                { auth: { autoRefreshToken: false, persistSession: false } }
            );

            const { error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({ is_online: true })
                .eq('id', user.id);

            if (updateError) {
                console.error("Error setting user online in DB:", updateError);
            }
        } catch (adminErr) {
            console.error("Critical error setting online state:", adminErr);
        }

        // Redirection based on role
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role === "Admin") {
            return redirect("/admin");
        }
    }

    return redirect("/area-riservata");
}
