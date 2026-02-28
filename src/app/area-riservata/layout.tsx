import { AudioPlayer } from "@/components/player/AudioPlayer";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { FooterNew } from "@/components/homepagenew/FooterNew";

export default async function AreaClienteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Shield: Kick unauthenticated users out to login
    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col relative pt-16">
            <main className="flex-1 mx-auto w-full max-w-7xl pt-8 px-6 pb-24">
                {children}
            </main>

            <AudioPlayer />
            <FooterNew />
        </div>
    );
}
