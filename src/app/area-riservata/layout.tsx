import { AudioPlayer } from "@/components/player/AudioPlayer";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
        <div className="min-h-screen bg-zinc-950 relative pb-24 pt-16">
            {/* 
        Header could go here:
        <AreaClienteHeader /> 
      */}

            <main className="mx-auto max-w-7xl pt-8 px-6">
                {children}
            </main>

            <AudioPlayer />
        </div>
    );
}
