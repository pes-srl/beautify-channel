import { ChannelGrid } from "@/components/player/ChannelGrid";
import { BasicHeroChannel } from "@/components/player/BasicHeroChannel";
import { createClient } from "@/utils/supabase/server";
import { LogOut, Sparkles, AlertCircle, CheckCircle2, Lock, Radio, ArrowDown, ChevronDown, PlayCircle } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Paywall } from "./Paywall";
import { UpgradeFormTrial } from "@/components/UpgradeFormTrial";
import { UpgradeFormBasic } from "@/components/UpgradeFormBasic";

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
                profile.plan_type = 'free';
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
                                <h1 className="text-5xl md:text-7xl uppercase tracking-[0.2em] font-[family-name:var(--font-montserrat)] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-sm mb-2">
                                    GRAZIE
                                </h1>
                                <h2 className="text-2xl md:text-4xl uppercase tracking-[0.15em] text-zinc-100 font-[family-name:var(--font-montserrat)] font-light flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left mb-6">
                                    <span>BENVENUTA NEL TUO ACCOUNT</span>
                                    <img
                                        src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg"
                                        alt="BeautiFy Channel Logo"
                                        className="h-8 md:h-10 lg:h-12 w-auto mt-2 md:mt-0"
                                    />
                                </h2>
                                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent mt-2 mb-8" />
                                <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mt-4">

                                    <div className="relative inline-flex flex-col items-center justify-center p-4 md:p-6 rounded-3xl border border-emerald-500/20 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] overflow-hidden w-full max-w-sm">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none" />

                                        <span className="relative z-10 text-xs md:text-sm text-white font-medium tracking-widest uppercase mb-1">
                                            Il tuo piano attuale
                                        </span>
                                        <span className="relative z-10 font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 text-2xl md:text-3xl tracking-[0.1em] py-0.5 drop-shadow-sm font-[family-name:var(--font-montserrat)]">
                                            FREE TRIAL
                                        </span>
                                        <span className="relative z-10 text-emerald-300/70 italic font-light text-xs md:text-sm mt-1">
                                            {daysLeft} {daysLeft === 1 ? 'giorno' : 'giorni'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : profile.plan_type === 'basic' ? (
                            <div className="flex flex-col items-center justify-center space-y-4 py-4">
                                <h2 className="text-2xl md:text-4xl uppercase tracking-[0.15em] text-zinc-100 font-[family-name:var(--font-montserrat)] font-light flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                                    <span>BENVENUTA NEL TUO ACCOUNT</span>
                                    <img
                                        src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg"
                                        alt="BeautiFy Channel Logo"
                                        className="h-8 md:h-10 lg:h-12 w-auto mt-2 md:mt-0"
                                    />
                                </h2>
                                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
                                <p className="text-zinc-300 font-medium text-xl tracking-wide leading-relaxed">
                                    <strong className="text-sky-400 font-black">GRAZIE PER LA FIDUCIA</strong> in BeautiFy Channel <strong className="text-sky-400 font-black">ORA</strong>, hai a disposizione il <strong className="text-sky-400 font-black">NUOVO</strong> e unico<br className="md:hidden" /> strumento di <strong className="text-sky-400 font-black">MARKETING SENSORIALE</strong> dedicato al settore, con le sue potenzialità.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-4 py-4">
                                <h2 className="text-2xl md:text-4xl uppercase tracking-[0.15em] text-zinc-100 font-[family-name:var(--font-montserrat)] font-light flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                                    <span>BENVENUTA NEL TUO ACCOUNT</span>
                                    <img
                                        src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg"
                                        alt="BeautiFy Channel Logo"
                                        className="h-8 md:h-10 lg:h-12 w-auto mt-2 md:mt-0"
                                    />
                                </h2>
                                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                                <p className="text-zinc-300 font-medium text-lg tracking-wide leading-relaxed">
                                    Hai attivo il piano <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 uppercase text-2xl px-1 tracking-wider">PREMIUM</span>. COMPLIMENTI! Hai a disposizione il <strong className="text-amber-400 font-black">TOP</strong> delle potenzialità di BeautiFy
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TRIAL OVERVIEW BANNER */}
            {profile?.plan_type === 'free_trial' && daysLeft > 0 && !isAdmin && (
                <div className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white px-6 py-5 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center shadow-lg shadow-fuchsia-900/20 gap-4 border border-fuchsia-400/30 relative overflow-hidden max-w-3xl mx-auto w-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[30px] rounded-full mix-blend-screen -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                        <div className="p-2 bg-white/20 rounded-full backdrop-blur-md shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-base md:text-lg leading-tight mb-1">La tua prova gratuita è attiva</h3>
                            <p className="text-fuchsia-100 text-base md:text-lg">Scade tra <strong className="text-emerald-400 bg-black/20 px-1.5 py-0.5 rounded-md mx-1 text-lg md:text-xl font-black">{daysLeft} {daysLeft === 1 ? 'giorno' : 'giorni'}</strong>.</p>
                        </div>
                    </div>
                    <Link href="#upgrade-section" className="relative z-10 shrink-0 w-full md:w-auto bg-white text-zinc-950 px-5 py-2.5 rounded-lg font-bold text-sm tracking-wide hover:bg-zinc-100 transition-colors shadow-md text-center mt-3 md:mt-0">
                        SCEGLI UN PIANO
                    </Link>
                </div>
            )}

            <div className="mt-32 md:mt-40 flex flex-col items-center justify-center gap-6 mb-12 border-b border-white/10 pb-8">
                <div className="flex flex-col items-center justify-center w-full text-center">
                    <h1 className="text-6xl md:text-7xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-3 tracking-tight flex items-center justify-center gap-3 w-full">
                        Area Riservata
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-4 mb-2">
                        <span className="text-lg font-medium text-white">
                            {profile?.salon_name || user.email}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 ${profile?.plan_type === 'premium' ? 'bg-amber-500/10 text-amber-500' :
                            profile?.plan_type === 'free_trial' ? 'bg-emerald-500/10 text-emerald-400' :
                                profile?.plan_type === 'basic' ? 'bg-indigo-500/10 text-indigo-400' :
                                    profile?.plan_type === 'free' ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
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
                            <div className="text-center mb-8 flex flex-col items-center justify-center">
                                <h3 className={`text-xl md:text-2xl font-black text-transparent bg-clip-text uppercase mb-4 tracking-[0.15em] md:tracking-[0.2em] ${profile?.plan_type === 'premium' ? 'bg-gradient-to-r from-amber-300 to-orange-100 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' :
                                    profile?.plan_type === 'basic' ? 'bg-gradient-to-r from-sky-300 to-indigo-200 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]' :
                                        'bg-gradient-to-r from-emerald-300 to-teal-100 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                                    }`}>
                                    QUESTO E' IL TUO CANALE AUDIO PRINCIPALE
                                </h3>
                                <div className={`p-3 rounded-full border animate-bounce ${profile?.plan_type === 'premium' ? 'bg-amber-500/20 border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.3)]' :
                                    profile?.plan_type === 'basic' ? 'bg-sky-500/20 border-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.3)]' :
                                        'bg-emerald-500/20 border-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                                    }`}>
                                    <ArrowDown className={`w-6 h-6 md:w-8 md:h-8 ${profile?.plan_type === 'premium' ? 'text-amber-300' :
                                        profile?.plan_type === 'basic' ? 'text-sky-300' :
                                            'text-emerald-300'
                                        }`} />
                                </div>
                            </div>
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
                                <div className={`absolute inset-0 bg-linear-to-b ${profile?.plan_type === 'free_trial' ? 'from-emerald-900/10 via-teal-900/5' : 'from-fuchsia-900/10 via-indigo-900/5'} to-transparent rounded-[3rem] -z-10 blur-xl pointer-events-none`} />

                                <details className={`group border border-white/5 rounded-[35px] shadow-2xl p-6 md:p-10 relative overflow-hidden backdrop-blur-xl ${profile?.plan_type === 'free_trial' ? 'bg-gradient-to-br from-[#061e16] to-[#010906]' : 'bg-[#0f0518]'} transition-all duration-300`}>
                                    <summary className="cursor-pointer list-none flex justify-center items-center w-full outline-none select-none relative z-20">
                                        <div className="flex items-center justify-between w-full gap-4 px-2">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <PlayCircle className={`w-8 h-8 md:w-10 md:h-10 shrink-0 ${profile?.plan_type === 'free_trial' ? 'text-emerald-400' : 'text-sky-400'}`} />
                                                <span className="text-2xl md:text-4xl text-white font-black font-[family-name:var(--font-montserrat)] tracking-[0.2em] md:tracking-[0.3em] uppercase drop-shadow-sm">
                                                    COME FUNZIONA
                                                </span>
                                            </div>
                                            <div className={`p-2 md:p-3 rounded-full border transition-transform duration-300 group-open:rotate-180 flex-shrink-0 ${profile?.plan_type === 'free_trial' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-sky-500/10 border-sky-500/20 text-sky-400'}`}>
                                                <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                                            </div>
                                        </div>
                                    </summary>

                                    {/* Overlay di luce */}
                                    <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-0 group-open:opacity-100 transition-opacity duration-500 ${profile?.plan_type === 'free_trial' ? 'bg-emerald-600/10' : 'bg-fuchsia-600/10'}`} />
                                    <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none opacity-0 group-open:opacity-100 transition-opacity duration-500 ${profile?.plan_type === 'free_trial' ? 'bg-teal-600/10' : 'bg-indigo-600/10'}`} />

                                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-10 mt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">

                                        <div className="lg:col-span-5 space-y-6">
                                            <p className="text-xl md:text-2xl text-zinc-200 font-light leading-relaxed">
                                                Nulla di più semplice!<br /><strong className="text-white font-semibold">Collega il tuo pc / smartphone / tablet</strong> all'impianto audio del tuo istituto o a delle <strong className="text-white font-semibold">casse Bluetooth</strong>.<br /><br /><strong className="text-white font-semibold">Premi play sul canale principale</strong> qui sopra, imposta il giusto volume in salone e <strong className="font-semibold text-white">dimenticatene</strong>, il resto lo fa <strong className="text-white font-semibold">BeautiFy</strong>.
                                            </p>
                                            <div className={`pl-6 border-l-2 py-1 space-y-4 ${profile?.plan_type === 'free_trial' ? 'border-teal-500/30' : 'border-indigo-500/30'}`}>
                                                <p className="text-lg md:text-xl text-zinc-200 leading-relaxed font-light">
                                                    I nostri canali audio propongono una <strong className="font-semibold text-white">raffinata selezione</strong> <strong className={`font-semibold ${profile?.plan_type === 'free_trial' ? 'text-emerald-200' : 'text-sky-200'}`}>di diversi generi musicali</strong>, intervallata da <strong className={`font-semibold ${profile?.plan_type === 'free_trial' ? 'text-emerald-200' : 'text-sky-200'}`}>eleganti, delicati e generici</strong> <span className={`font-bold ${profile?.plan_type === 'free_trial' ? 'text-emerald-400' : 'text-sky-400'}`}>suggerimenti vocali</span>.
                                                </p>
                                                <p className={`text-lg font-medium tracking-wide mt-2 ${profile?.plan_type === 'free_trial' ? 'text-emerald-300/90' : 'text-sky-300/90'}`}>
                                                    Studiati per <strong className="text-white font-bold">stimolare la curiosità</strong> delle tue clienti e l'<strong className="text-white font-bold">acquisto dei tuoi servizi</strong>.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Divisore centrale su Desktop */}
                                        <div className="hidden lg:flex lg:col-span-2 justify-center items-center">
                                            <div className="w-[1px] h-32 bg-linear-to-b from-transparent via-white/20 to-transparent" />
                                        </div>

                                        {/* Colonna Destra: Altri Canali */}
                                        <div className="lg:col-span-5 space-y-6 bg-white/[0.02] p-8 md:p-10 rounded-[2.5rem] border border-white/5 relative group hover:bg-white/[0.04] transition-all duration-500 hover:border-indigo-500/20 shadow-xl">
                                            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl shadow-indigo-500/30 rotate-12 group-hover:rotate-6 transition-transform">
                                                <span className="font-black text-2xl font-[family-name:var(--font-montserrat)]">+6</span>
                                            </div>
                                            <h3 className="text-2xl md:text-4xl font-semibold font-[family-name:var(--font-montserrat)] text-transparent bg-clip-text bg-gradient-to-br from-indigo-100 to-indigo-400 flex items-center gap-3 drop-shadow-sm leading-tight mb-2">
                                                Cambia il tuo Mood
                                            </h3>
                                            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
                                                Qui sotto, hai a disposizione altri <strong className="text-indigo-400 font-semibold">6 canali settoriali</strong>, per cambiare il tuo mood musicale in istituto durante la giornata.
                                            </p>

                                            <div className="bg-zinc-950/40 p-5 rounded-3xl border border-white/5 space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 flex items-center justify-center shrink-0 mt-1 shadow-inner border border-fuchsia-500/20">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.8)]" />
                                                    </div>
                                                    <p className="text-zinc-300 text-[15px] leading-relaxed">
                                                        Anche questi canali contengono <span className="text-sky-300 italic font-light">morbidi suggerimenti vocali</span> tranne <strong className="text-white font-semibold font-[family-name:var(--font-montserrat)] tracking-wide bg-white/10 px-2 py-0.5 rounded-md align-middle mx-1 text-xs">RELAX</strong> e <strong className="text-white font-semibold font-[family-name:var(--font-montserrat)] tracking-wide bg-white/10 px-2 py-0.5 rounded-md align-middle mx-1 text-xs">MASSAGE</strong>.
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-sky-500/20 flex items-center justify-center shrink-0 mt-1 shadow-inner border border-indigo-500/20">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                                                    </div>
                                                    <p className="text-zinc-300 text-[15px] leading-relaxed">
                                                        Rilassati con <strong className="text-white font-semibold font-[family-name:var(--font-montserrat)] tracking-wide bg-indigo-500/20 border border-indigo-500/30 text-indigo-100 px-2 py-0.5 rounded-md align-middle mx-1 text-xs">DEEP SOFT</strong> nel weekend o del <strong className="text-white font-semibold font-[family-name:var(--font-montserrat)] tracking-wide bg-amber-500/20 border border-amber-500/30 text-amber-100 px-2 py-0.5 rounded-md align-middle mx-1 text-xs">JAZZ</strong> a fine giornata.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pt-4 mt-2 border-t border-white/5">
                                                <p className={`font-bold font-[family-name:var(--font-montserrat)] tracking-wider uppercase text-lg flex items-center gap-2 ${profile?.plan_type === 'free_trial' ? 'text-emerald-400' : 'text-sky-400'}`}>
                                                    <Radio className="w-5 h-5" /> Buon ascolto
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                </details>
                            </div>

                        </div>
                    )}

                    <details className="group w-full max-w-7xl mx-auto mt-12 md:mt-24 lg:mt-32 mb-16">
                        <summary className="cursor-pointer list-none flex justify-start items-center w-full outline-none select-none mb-10 text-left relative z-20 pl-4 md:pl-0">
                            <div className="inline-flex items-center justify-start gap-3 md:gap-4 px-6 md:px-10 py-4 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-md shadow-xl transition-all duration-300 hover:bg-white/[0.05] hover:border-white/10 relative overflow-hidden group/btn">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                <Radio className={`w-8 h-8 md:w-10 md:h-10 shrink-0 ${profile?.plan_type === 'free_trial' ? 'text-emerald-400' : 'text-sky-400'}`} />
                                <span className="text-2xl md:text-4xl text-white font-black font-[family-name:var(--font-montserrat)] tracking-[0.2em] md:tracking-[0.3em] uppercase drop-shadow-sm">
                                    ALTRI CANALI DISPONIBILI
                                </span>
                                <div className={`p-1.5 md:p-2 rounded-full border transition-transform duration-300 group-open:rotate-180 flex-shrink-0 ml-2 ${profile?.plan_type === 'free_trial' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-sky-500/10 border-sky-500/20 text-sky-400'}`}>
                                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                            </div>
                        </summary>

                        <div className="animate-in fade-in slide-in-from-top-8 duration-500 pt-4">
                            <ChannelGrid initialChannels={channels || []} serverError={channelsError?.message} planType={profile?.plan_type} />
                        </div>
                    </details>

                    {/* Upgrade Form for Free Trial and Basic Users */}
                    {(profile?.plan_type === 'free_trial' || profile?.plan_type === 'basic') && !isAdmin && (
                        <div className="w-full max-w-4xl mx-auto mt-0 md:mt-16 border-t border-white/10 pt-4 md:pt-16">
                            {(profile?.plan_type === 'basic' || profile?.plan_type === 'free_trial') && (
                                <div className="text-center mb-16 px-4">
                                    {/* Elegant Divider */}
                                    <div className="flex items-center justify-center w-full mb-16 relative">
                                        {/* Core line */}
                                        <div className={`w-11/12 max-w-4xl h-[3px] rounded-full z-10 ${profile?.plan_type === 'basic' ? 'bg-gradient-to-r from-transparent via-sky-400 to-transparent' : 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent'}`} />
                                        {/* Glow effect */}
                                        <div className={`absolute w-11/12 max-w-4xl h-[12px] blur-[8px] rounded-full ${profile?.plan_type === 'basic' ? 'bg-gradient-to-r from-transparent via-sky-500/60 to-transparent' : 'bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent'}`} />
                                    </div>

                                    <h2 className="text-xl md:text-3xl font-black uppercase text-white tracking-widest leading-tight mb-6 w-full max-w-5xl mx-auto">
                                        IL MESE PROSSIMO HAI PIANIFICATO UNA PROMOZIONE SU UN TUO SERVIZIO PER LE TUE CLIENTI?
                                    </h2>
                                    <p className="text-zinc-200 text-xl w-full max-w-4xl mx-auto leading-relaxed mb-12 font-medium">
                                        Facendo upgrade al <strong className="text-amber-400 font-black uppercase tracking-wider">Piano Premium</strong> puoi chiederci di realizzare delle <span className="text-white font-bold underline decoration-amber-500/50 underline-offset-4">promo audio personalizzate</span> con le tue promozioni.
                                    </p>

                                    {/* Premium Plan Layout */}
                                    <div className="text-center flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
                                        <div className="relative mb-8 flex flex-col items-center justify-center px-4 shrink-0">
                                            <h3 className="font-[family-name:var(--font-montserrat)] text-center w-full max-w-4xl mx-auto">
                                                <span className="block text-xs md:text-sm text-zinc-400 uppercase tracking-[0.3em] mb-4">
                                                    Con il <strong className="text-amber-400 font-black">Piano Premium</strong>
                                                </span>
                                                <span className="block text-xl md:text-2xl xl:text-3xl text-white font-semibold leading-tight tracking-tight opacity-90 mb-1">
                                                    puoi aggiungere ai canali audio
                                                </span>
                                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 font-bold text-3xl md:text-4xl xl:text-5xl py-2 drop-shadow-sm">
                                                    eleganti suggerimenti vocali
                                                </span>
                                                <span className="block text-base md:text-lg text-zinc-300 mt-4 font-light italic">
                                                    con le tue promozioni e i tuoi servizi personalizzati.
                                                </span>
                                            </h3>
                                        </div>
                                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/20 w-full border border-white/10 group mt-auto aspect-[4/3] lg:aspect-video mb-16">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 z-10 pointer-events-none"></div>
                                            <img
                                                src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772934286210-zjhcxj.png"
                                                alt="Servizi Personalizzati Premium"
                                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {profile?.plan_type === 'basic' ? (
                                <UpgradeFormBasic userEmail={user.email} />
                            ) : (
                                <UpgradeFormTrial userEmail={user.email} />
                            )}
                        </div>
                    )}

                </>
            ) : (
                <Paywall salonName={profile?.salon_name || user.email || 'Utente'} userEmail={user.email} />
            )
            }
        </div >
    );
}
