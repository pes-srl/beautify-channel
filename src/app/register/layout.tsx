import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Se l'utente è GIÀ loggato, non ha senso che veda la pagina di registrazione. Sbattilo fuori.
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role === "Admin") {
            redirect("/admin");
        } else {
            redirect("/area-riservata");
        }
    }

    // Altrimenti, mostra la pagina di registrazione
    return <>{children}</>;
}
