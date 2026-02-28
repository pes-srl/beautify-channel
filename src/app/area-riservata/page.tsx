import { ChannelGrid } from "@/components/player/ChannelGrid";
import { createClient } from "@/utils/supabase/server";
import { LogOut, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AreaClientePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("salon_name, role")
        .eq("id", user.id)
        .single();

    return (
        <div className="pt-12 pb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                <div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-2xl">
                        <Sparkles className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                        Bentornato, {profile?.salon_name || user.email}
                    </h1>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-xs font-bold uppercase tracking-widest border border-fuchsia-500/30">
                            Ruolo: {profile?.role || 'User'}
                        </span>
                        <span className="text-zinc-400 text-sm bg-black/20 px-3 py-1 rounded-full border border-white/5">
                            {user.email}
                        </span>
                    </div>
                    <p className="text-zinc-400 text-lg">Seleziona un canale radio per impostare l'atmosfera perfetta nel tuo istituto.</p>
                </div>

            </div>

            <ChannelGrid />
        </div>
    );
}
