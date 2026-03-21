"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logActivity } from "@/app/actions/activity-actions";
import { Resend } from "resend";

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
                .update({
                    is_online: true,
                    last_login_at: new Date().toISOString()
                })
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
            .select("role, full_name, salon_name")
            .eq("id", user.id)
            .single();

        // Send login notification to admin
        if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const now = new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" });
            try {
                await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || "Beautify Channel <info@beautify-channel.com>",
                    to: "pessrl@gmail.com",
                    subject: `🔔 Nuovo accesso: ${user.email}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #c026d3;">Nuovo Accesso a Beautify Channel</h2>
                            <p>Qualcuno ha appena effettuato l'accesso alla piattaforma.</p>
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #c026d3;">
                                <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
                                <p style="margin: 5px 0;"><strong>Data e Ora:</strong> ${now}</p>
                                ${profile?.full_name ? `<p style="margin: 5px 0;"><strong>Nome:</strong> ${profile.full_name}</p>` : ''}
                                ${profile?.salon_name ? `<p style="margin: 5px 0;"><strong>Salone:</strong> ${profile.salon_name}</p>` : ''}
                                ${profile?.role ? `<p style="margin: 5px 0;"><strong>Ruolo:</strong> ${profile.role}</p>` : ''}
                            </div>
                        </div>
                    `
                });
            } catch (err) {
                console.error("Errore invio notifica login:", err);
            }
        }

        if (profile?.role === "Admin") {
            return redirect("/admin");
        }
    }

    return redirect("/area-riservata");
}
