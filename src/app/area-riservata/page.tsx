import { ChannelGrid } from "@/components/player/ChannelGrid";
import { BasicHeroChannel } from "@/components/player/BasicHeroChannel";
import { createClient } from "@/utils/supabase/server";
import { LogOut, Sparkles, AlertCircle, CheckCircle2, Lock, Radio } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Paywall } from "./Paywall";
import { UpgradeForm } from "@/components/UpgradeForm";

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
    let { data: channels, error: channelsError } = await supabase
        .rpc('get_authorized_channels', { req_user_id: user.id });

    if (channelsError) {
        console.error("Error fetching channels on server:", channelsError);
    }

    channels = channels || [];

    // If Premium, automatically add Laser Channel and Cosmetic Channel via hardcoded UUIDs
    if (profile?.plan_type === 'premium') {
        const { data: premiumExclusives } = await supabase
            .from('radio_channels')
            .select('*')
            .in('id', [
                'ef6cd00d-1966-4aff-b8a5-4d416deae0ec', // Cosmetic Channel
                '850d1e16-7842-4e12-a66f-8879a0662d57'  // Laser Channel
            ])
            .eq('is_active', true);

        if (premiumExclusives && premiumExclusives.length > 0) {
            const existingIds = new Set(channels.map((c: any) => c.id));
            const newChannels = premiumExclusives.filter((c: any) => !existingIds.has(c.id));
            channels = [...channels, ...newChannels];
        }
    }

    return (
        <div className="pt-12 pb-32">

            {/* DYNAMIC WELCOME BANNER BASED ON PLAN */}
            {!isAdmin && profile?.plan_type && !isExpired && (
                <div className="mb-6 p-4 rounded-xl border border-white/5 bg-zinc-900/50 flex items-center justify-center text-center shadow-md">
                    <p className="text-zinc-300 font-medium text-lg tracking-wide">
                        Benvenuta nella versione <span className="font-bold text-white uppercase">{
                            profile.plan_type === 'free_trial' ? 'FREE TRIAL' :
                                profile.plan_type === 'basic' ? 'BASIC' :
                                    profile.plan_type === 'premium' ? 'PREMIUM' :
                                        profile.plan_type
                        }</span> del tuo account BeautiFy
                    </p>
                </div>
            )}

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
                    <Link href="#upgrade-section" className="relative z-10 shrink-0 bg-white text-zinc-950 px-6 py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-zinc-100 transition-colors shadow-xl">
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
                    {!isExpired || isAdmin ? null : (
                        <p className="text-fuchsia-400 text-lg mt-2 font-medium">L'accesso ai canali è bloccato.</p>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT OR PAYWALL */}
            {(!isExpired || isAdmin) ? (
                <>
                    {/* Basic/Premium Channel Hero */}
                    {(profile?.plan_type === 'free_trial' || profile?.plan_type === 'basic' || profile?.plan_type === 'premium') && (
                        <div className="mb-8">
                            <BasicHeroChannel
                                planType={profile?.plan_type}
                                channel={channels?.find((c: any) =>
                                    profile?.plan_type === 'premium'
                                        ? (c.name.toLowerCase().includes('premium') || c.name.toLowerCase() === 'beautify channel premium')
                                        : (c.name.toLowerCase().includes('basic') || c.name.toLowerCase() === 'beautify channel basic')
                                ) || null}
                            />
                            <h3 className="text-xl font-bold text-white mb-4 mt-8 flex items-center gap-2">
                                <Radio className="w-5 h-5 text-zinc-400" />
                                Altri Canali Disponibili
                            </h3>
                        </div>
                    )}

                    <ChannelGrid initialChannels={channels || []} serverError={channelsError?.message} />

                    {/* COME FUNZIONA BANNER */}
                    <div id="welcome-pricing-banner" className="bg-[#17092b] w-full py-16 px-6 md:px-12 rounded-3xl mt-16 mb-8 flex flex-col items-center shadow-xl border border-white/5 text-center">

                        {/* 2-Column Audio Channel Explanation */}
                        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 mb-16">
                            {/* Text Content */}
                            <div className="flex-1 text-left space-y-6">
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-wider">
                                    Come funziona
                                </h2>
                                <p className="text-zinc-50 text-base md:text-lg leading-relaxed">
                                    Il canale audio BeautiFy Channel Basic è il canale principale. Propone una raffinata selezione musicale intervallata da eleganti e generici suggerimenti vocali, studiati per stimolare l’interesse e l’acquisto dei tuoi servizi in istituto.
                                </p>
                                <p className="text-zinc-50 text-base md:text-lg leading-relaxed">
                                    Inoltre, hai a disposizione altri 6 canali per cambiare mood durante la giornata o magari con DEEP SOFT nel weekend, tutti con eleganti suggerimenti per stimolare l’interesse all’acquisto.
                                </p>
                            </div>
                            {/* Image Content */}
                            <div className="flex-1 w-full max-w-md shrink-0">
                                <img
                                    src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772477138781-nxz25k.jpg"
                                    alt="BeautiFy Ascolto"
                                    className="w-full h-auto rounded-3xl border border-white/5 shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* Philosophy / Vision Texts */}
                        <div className="w-full max-w-4xl mx-auto space-y-10 mt-8 border-t border-white/10 pt-16">
                            <p className="text-zinc-300 text-lg md:text-xl leading-relaxed italic font-light px-4 md:px-12">
                                "BeautiFy Channel è un supporto irrinunciabile per la tua professione, perché ti consentirà di non preoccuparti più della comunicazione interna del tuo salone, ma di dedicarti e concentrarti pienamente sullo svolgimento del tuo lavoro."
                            </p>
                            <p className="text-zinc-300 text-lg md:text-xl leading-relaxed italic font-light px-4 md:px-12">
                                "BeautiFy Channel è la soluzione innovativa di marketing sonoro ideata per aumentare le vendite, la professionalità e la customer experience nel settore del beauty, inducendo una piacevole sensazione di coinvolgimento."
                            </p>
                        </div>

                        {/* Call To Action */}
                        <div className="mt-16 mb-8 px-4">
                            <p className="font-bold text-xl md:text-2xl tracking-wide uppercase text-fuchsia-400">
                                Basta parole, BeautiFy Channel lo si capisce prima schiacciando Play, buon ascolto
                            </p>
                        </div>

                        {/* Upgrade Form for Free Trial Users */}
                        {profile?.plan_type === 'free_trial' && !isAdmin && (
                            <div className="w-full max-w-4xl mx-auto mt-16 border-t border-white/10 pt-16">
                                <UpgradeForm userEmail={user.email} />
                            </div>
                        )}

                    </div>
                </>
            ) : (
                <Paywall salonName={profile?.salon_name || user.email || 'Utente'} />
            )}
        </div>
    );
}
