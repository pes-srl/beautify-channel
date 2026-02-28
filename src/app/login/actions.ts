"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
