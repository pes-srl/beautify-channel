import { ChannelGrid } from "@/components/player/ChannelGrid";
import { createClient } from "@/utils/supabase/server";
import { LogOut, Sparkles, AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Paywall } from "./Paywall";

export const dynamic = "force-dynamic";

export default async function AreaClientePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("salon_name, role, plan_type, trial_ends_at")
        .eq("id", user.id)
        .single();

    // Calculate Trial State
    const isAdmin = profile?.role === 'Admin';
    let isExpired = profile?.plan_type === 'free';
    let daysLeft = 0;

    if (profile?.plan_type === 'free_trial') {
        if (profile?.trial_ends_at) {
            const trialEndDate = new Date(profile.trial_ends_at);
            daysLeft = Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            if (daysLeft <= 0) {
                isExpired = true;
            }
        } else {
            // Fallback for old accounts without date: assume active but give 0 days visual
            daysLeft = 0;
        }
    }

    // Server-side fetching of channels to prevent client-side lock contention
    const { data: channels, error: channelsError } = await supabase
        .rpc('get_authorized_channels', { req_user_id: user.id });

    if (channelsError) {
        console.error("Error fetching channels on server:", channelsError);
    }

    return (
        <div className="pt-12 pb-32">

            {/* TRIAL OVERVIEW BANNER */}
            {profile?.plan_type === 'free_trial' && daysLeft > 0 && !isAdmin && (
                <div className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white px-6 py-4 rounded-2xl mb-10 flex flex-col md:flex-row justify-between items-center shadow-lg shadow-fuchsia-900/20 gap-4 border border-fuchsia-400/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[50px] rounded-full mix-blend-screen -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-2 bg-white/20 rounded-full backdrop-blur-md">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">La tua prova gratuita è attiva</h3>
                            <p className="text-fuchsia-100 text-sm">Scade tra <strong className="text-white bg-black/20 px-2 py-0.5 rounded-md mx-1">{daysLeft} giorni</strong>. Sblocca tutto prima della scadenza.</p>
                        </div>
                    </div>
                    <Link href="#pricing" className="relative z-10 shrink-0 bg-white text-zinc-950 px-6 py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-zinc-100 transition-colors shadow-xl">
                        Vedi Piani Premium
                    </Link>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight flex items-center gap-3">
                        Area Riservata
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-4 mb-2">
                        <span className="text-zinc-300 text-lg font-medium">
                            {profile?.salon_name || user.email}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest border border-white/10">
                            Piano: {profile?.plan_type || 'Free'}
                        </span>
                        {isAdmin && (
                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest border border-red-500/30">
                                Admin Privileges
                            </span>
                        )}
                    </div>
                    {!isExpired || isAdmin ? (
                        <p className="text-zinc-400 text-lg mt-2">Seleziona un canale radio per impostare l'atmosfera perfetta nel tuo istituto.</p>
                    ) : (
                        <p className="text-fuchsia-400 text-lg mt-2 font-medium">L'accesso ai canali è bloccato.</p>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT OR PAYWALL */}
            {(!isExpired || isAdmin) ? (
                <ChannelGrid initialChannels={channels || []} serverError={channelsError?.message} />
            ) : (
                <Paywall salonName={profile?.salon_name || user.email || 'Utente'} />
            )}
        </div>
    );
}
