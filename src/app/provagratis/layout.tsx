import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProvaGratisLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Se l'utente è GIÀ loggato, sbattilo fuori dalla pagina della prova gratis.
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

    // Altrimenti, mostra la pagina di prova gratis
    return <>{children}</>;
}
