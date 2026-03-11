import { AudioPlayer } from "@/components/player/AudioPlayer";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ActivityTracker } from "@/components/providers/ActivityTracker";
import { FooterNew } from "@/components/homepagenew/FooterNew";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

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

    const { data: profile } = await supabase
        .from("profiles")
        .select("plan_type")
        .eq("id", user.id)
        .single();

    const bgClass = "bg-[#1e0c31]";

    return (
        <div className={`min-h-screen ${bgClass} flex flex-col relative pt-16 ${inter.className}`}>
            <ActivityTracker />
            <main className="flex-1 mx-auto w-full max-w-7xl pt-8 px-6 pb-24">
                {children}
            </main>

            <AudioPlayer />
            <FooterNew />
        </div>
    );
}
