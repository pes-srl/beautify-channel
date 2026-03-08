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
    const { data: rawChannels, error: channelsError } = await supabase
        .rpc('get_authorized_channels', { req_user_id: user.id });

    let channels = rawChannels;

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
                    <div className="w-full">
                        {profile.plan_type === 'free_trial' ? (
                            <div className="flex flex-col items-center justify-center space-y-4 py-4">
                                <h2 className="text-2xl md:text-4xl uppercase tracking-[0.15em] text-zinc-100 font-[family-name:var(--font-montserrat)] font-light flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                                    <span>BENVENUTA NEL TUO ACCOUNT</span>
                                    <img
                                        src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg"
                                        alt="BeautiFy Channel Logo"
                                        className="h-8 md:h-10 lg:h-12 w-auto mt-2 md:mt-0"
                                    />
                                </h2>
                                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
                                <p className="text-zinc-300 font-medium text-lg tracking-wide leading-relaxed">
                                    Al momento il tuo piano è il <span className="font-bold text-emerald-400 uppercase text-2xl px-1">FREE TRIAL</span> della durata di 7 giorni
                                </p>
                            </div>
                        ) : (
                            <p className="text-zinc-300 font-medium text-lg tracking-wide w-full leading-relaxed">
                                Benvenuta nella versione{' '}
                                <span className="font-bold text-white uppercase">
                                    {profile.plan_type === 'basic' ? 'BASIC' :
                                        profile.plan_type === 'premium' ? 'PREMIUM' :
                                            profile.plan_type}
                                </span>
                                {' '}del tuo account BeautiFy
                            </p>
                        )}
                    </div>
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
                            <p className="text-fuchsia-100 text-sm">Scade tra <strong className="text-emerald-400 bg-black/20 px-2 py-0.5 rounded-md mx-1">{daysLeft} giorni</strong>. Sblocca tutto prima della scadenza.</p>
                        </div>
                    </div>
                    <Link href="#upgrade-section" className="relative z-10 shrink-0 bg-white text-zinc-950 px-6 py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-zinc-100 transition-colors shadow-xl text-center">
                        SCEGLI UN PIANO
                    </Link>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                <div className="flex flex-col items-center md:items-start w-full text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-semibold font-[family-name:var(--font-montserrat)] text-white mb-3 tracking-tight flex items-center justify-center md:justify-start gap-3 w-full">
                        Area Riservata
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 mb-2">
                        <span className="text-lg font-medium text-white">
                            {profile?.salon_name || user.email}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 ${profile?.plan_type === 'premium' ? 'bg-amber-500/10 text-amber-500' :
                            profile?.plan_type === 'free_trial' ? 'bg-emerald-500/10 text-emerald-400' :
                                profile?.plan_type === 'basic' ? 'bg-indigo-500/10 text-indigo-400' :
                                    'bg-zinc-800 text-zinc-400'
                            }`}>
                            Piano: {profile?.plan_type?.replace('_', ' ') || 'Free'}
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
                            {/* INFO BLOCK INNOVATIVO */}
                            <div id="welcome-pricing-banner" className="w-full mt-12 mb-16 relative">
                                {/* Sfondo decorativo */}
                                <div className="absolute inset-0 bg-linear-to-b from-fuchsia-900/10 via-indigo-900/5 to-transparent rounded-[3rem] -z-10 blur-xl pointer-events-none" />

                                <div className="bg-[#0f0518] border border-white/5 rounded-[35px] shadow-2xl p-8 md:p-14 relative overflow-hidden backdrop-blur-xl">
                                    {/* Overlay di luce */}
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                                        {/* Colonna Sinistra: Canale Principale */}
                                        <div className="lg:col-span-5 space-y-6">
                                            <h2 className="text-3xl md:text-5xl font-semibold font-[family-name:var(--font-montserrat)] text-transparent bg-clip-text bg-linear-to-br from-white to-zinc-500 tracking-tight leading-tight">
                                                Come <br />Funziona
                                            </h2>
                                            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
                                                Nulla di più semplice! Collega il tuo pc / smartphone / tablet all'impianto audio del tuo istituto. Premi play sul canale principale qui sopra, imposta il giusto volume in salone e dimenticatene, il resto lo fa BeautiFy.<br /><br />
                                                I nostri canali audio propongono una raffinata selezione di diversi generi musicali, intervallata da eleganti, delicati e generici <span className="text-fuchsia-300">suggerimenti vocali</span>.
                                            </p>
                                            <p className="text-fuchsia-300 text-base">
                                                Studiati per stimolare la curiosità delle tue clienti e l'acquisto dei tuoi servizi.
                                            </p>
                                        </div>

                                        {/* Divisore centrale su Desktop */}
                                        <div className="hidden lg:flex lg:col-span-2 justify-center items-center">
                                            <div className="w-[1px] h-32 bg-linear-to-b from-transparent via-white/20 to-transparent" />
                                        </div>

                                        {/* Colonna Destra: Altri Canali */}
                                        <div className="lg:col-span-5 space-y-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 relative group hover:bg-white/[0.04] transition-colors">
                                            <div className="absolute -top-4 -right-4 bg-indigo-500 text-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg rotate-12 group-hover:rotate-6 transition-transform">
                                                <span className="font-black text-2xl">+6</span>
                                            </div>
                                            <h3 className="text-2xl font-semibold font-[family-name:var(--font-montserrat)] text-white flex items-center gap-3">
                                                Cambia il tuo Mood
                                            </h3>
                                            <p className="text-base md:text-lg text-zinc-300 leading-relaxed font-light">
                                                Qui sotto, hai a disposizione altri <strong className="text-indigo-400">6 canali settoriali</strong>, per cambiare il tuo mood musicale in istituto durante la giornata.
                                            </p>
                                            <ul className="space-y-3 mt-4">
                                                <li className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-fuchsia-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                        <div className="w-2 h-2 rounded-full bg-fuchsia-400" />
                                                    </div>
                                                    <span className="text-zinc-300 text-sm">Anche questi canali contengono morbidi suggerimenti vocali tranne <strong className="text-white font-semibold font-[family-name:var(--font-montserrat)]">RELAX</strong> e <strong className="text-white font-semibold font-[family-name:var(--font-montserrat)]">MASSAGE</strong>.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                                    </div>
                                                    <span className="text-zinc-300 text-sm">Rilassati con <strong className="text-white font-semibold font-[family-name:var(--font-montserrat)]">DEEP SOFT</strong> nel weekend o del <strong className="text-white font-semibold font-[family-name:var(--font-montserrat)]">JAZZ</strong> a fine giornata.</span>
                                                </li>
                                            </ul>
                                            <div className="pt-4 mt-2 border-t border-white/5">
                                                <p className="font-bold font-[family-name:var(--font-montserrat)] text-fuchsia-400 tracking-wider uppercase text-lg flex items-center gap-2">
                                                    <Radio className="w-5 h-5" /> Buon ascolto
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-montserrat)] text-white mb-8 mt-12 md:mt-24 lg:mt-32 flex flex-col md:flex-row items-center justify-center gap-3 uppercase tracking-wider text-center">
                                <Radio className="w-6 h-6 text-zinc-400" />
                                ALTRI CANALI DISPONIBILI
                            </h3>
                        </div>
                    )}

                    <ChannelGrid initialChannels={channels || []} serverError={channelsError?.message} planType={profile?.plan_type} />

                    {/* Upgrade Form for Free Trial Users */}
                    {profile?.plan_type === 'free_trial' && !isAdmin && (
                        <div className="w-full max-w-4xl mx-auto mt-0 md:mt-16 border-t border-white/10 pt-4 md:pt-16">
                            <UpgradeForm userEmail={user.email} />
                        </div>
                    )}

                </>
            ) : (
                <Paywall salonName={profile?.salon_name || user.email || 'Utente'} />
            )}
        </div>
    );
}
