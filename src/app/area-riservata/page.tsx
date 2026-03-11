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
            {!isAdmin && profile?.plan_type && profile?.plan_type !== 'basic' && !isExpired && (
                <div className={`mb-6 p-4 rounded-xl border backdrop-blur-md flex items-center justify-center text-center shadow-lg relative overflow-hidden ${profile.plan_type === 'free_trial'
                    ? 'border-purple-500/30 bg-gradient-to-r from-fuchsia-900/20 to-purple-900/80 shadow-purple-900/20'
                    : profile.plan_type === 'basic'
                        ? 'border-[#dfa3fb]/30 bg-gradient-to-r from-[#fba5cc] to-[#dfa3fb] shadow-[#dfa3fb]/20'
                        : 'border-white/5 bg-zinc-900/50 shadow-md'
                    }`}>
                    {profile.plan_type === 'basic' && (
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10 pointer-events-none z-0" />
                    )}
                    <div className="w-full relative z-10">
                        {profile.plan_type === 'free_trial' ? (
                            <div className="flex flex-col items-center justify-center py-1">
                                <h2 className="text-2xl md:text-4xl md:leading-relaxed text-white/80 font-[family-name:var(--font-montserrat)] font-light text-center px-4 max-w-4xl">
                                    Benvenuta, grazie di aver scelto di provare <br />
                                    <span className="font-medium text-white/90">BeautiFy Channel!</span> Buona esperienza!
                                </h2>
                                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent my-4" />
                                <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">

                                    <div className="relative inline-flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl border border-emerald-500/20 bg-emerald-950/20 shadow-[0_0_40px_rgba(16,185,129,0.15)] overflow-hidden w-full max-w-lg mb-6">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />

                                        <span className="relative z-10 text-sm md:text-base text-white font-medium tracking-widest uppercase mb-1">
                                            Il tuo piano attuale
                                        </span>
                                        <span className="relative z-10 font-black text-[#FF4D79] text-4xl md:text-5xl tracking-[0.1em] py-2 drop-shadow-sm font-[family-name:var(--font-montserrat)]">
                                            FREE TRIAL
                                        </span>
                                        <span className="relative z-10 text-white italic font-light text-base md:text-lg mt-1">
                                            {daysLeft} {daysLeft === 1 ? 'giorno' : 'giorni'} alla fine della prova gratuita
                                        </span>
                                    </div>
                                    <Link href="#upgrade-section" className="relative z-10 bg-white text-zinc-900 px-8 py-4 rounded-xl font-bold font-[family-name:var(--font-montserrat)] text-base md:text-lg tracking-widest hover:bg-zinc-100 transition-transform duration-300 hover:scale-105 shadow-xl text-center">
                                        SCEGLI UN PIANO
                                    </Link>
                                </div>
                            </div>
                        ) : profile.plan_type === 'basic' ? (
                            <div className="flex flex-col items-center justify-center space-y-4 py-8 px-4">
                                <h2 className="text-2xl md:text-4xl text-white/90 font-[family-name:var(--font-montserrat)] font-light leading-relaxed text-center flex flex-col md:flex-row items-center gap-3">
                                    <span>Benvenuta nella tua Area Riservata, il tuo piano è <strong className="font-black text-[#5B21B6] uppercase drop-shadow-sm">BASIC</strong></span>
                                    <img
                                        src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg"
                                        alt="BeautiFy Channel Logo"
                                        className="h-6 md:h-8 lg:h-10 w-auto mt-2 md:mt-0 brightness-0 invert opacity-80"
                                    />
                                </h2>
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
                                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                <p className="text-zinc-300 font-medium text-lg tracking-wide leading-relaxed">
                                    Hai attivo il piano <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 uppercase text-2xl px-1 tracking-wider">PREMIUM</span>. COMPLIMENTI! Hai a disposizione il <strong className="text-amber-400 font-black">TOP</strong> delle potenzialità di BeautiFy
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TRIAL OVERVIEW BANNER */}
            {/* TRIAL OVERVIEW AND PROMO BANNER */}
            {profile?.plan_type === 'free_trial' && daysLeft > 0 && !isAdmin && (
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl mb-12 border border-white/10 shadow-2xl shadow-purple-900/40 overflow-hidden max-w-5xl mx-auto w-full group/trial">
                    {/* Status Header */}
                    <div className="bg-gradient-to-r from-[#8624FF] to-[#FF4D79] text-white px-6 md:px-10 py-5 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4 relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[50px] rounded-full mix-blend-screen -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                            <div className="p-2.5 bg-white/20 rounded-full backdrop-blur-md shrink-0 shadow-inner">
                                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-extrabold text-lg md:text-xl font-[family-name:var(--font-montserrat)] leading-tight mb-0.5 tracking-wide">La tua prova gratuita è attiva</h3>
                                <p className="text-white/90 text-sm md:text-base font-medium">Scade tra <strong className="text-emerald-400 bg-black/30 px-2 py-0.5 rounded-md mx-1 text-base md:text-lg font-black shadow-inner">{daysLeft} {daysLeft === 1 ? 'giorno' : 'giorni'}</strong>.</p>
                            </div>
                        </div>
                    </div>


                </div>
            )}

            <div className="mt-32 md:mt-40 flex flex-col items-center justify-center gap-6 mb-12 border-b border-white/10 pb-8">
                <div className="flex flex-col items-center justify-center w-full text-center">
                    <div className="relative inline-flex flex-col items-center justify-center p-6 md:p-10 rounded-[2.5rem] border border-[#FF4D79]/20 bg-[#FF4D79]/[0.03] shadow-[0_0_40px_rgba(255,77,121,0.1)] overflow-hidden w-full max-w-3xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D79]/5 to-transparent pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#FF4D79]/10 blur-[60px] rounded-full pointer-events-none" />

                        <h1 className={`font-bold font-[family-name:var(--font-montserrat)] text-[#FF4D79] mb-3 md:mb-5 tracking-tight flex flex-col items-center justify-center gap-1 md:gap-2 w-full relative z-10 ${profile?.plan_type === 'basic' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-5xl md:text-7xl'}`}>
                            {profile?.plan_type === 'basic' ? (
                                <>
                                    <span>Area Riservata</span>
                                    <span>Piano Basic</span>
                                </>
                            ) : 'Area Riservata'}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 mb-2 relative z-10">
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
                            <p className="text-fuchsia-400 text-lg mt-4 font-medium relative z-10">L'accesso ai canali è bloccato.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT OR PAYWALL */}
            {(!isExpired || isAdmin) ? (
                <>
                    {/* Basic/Premium Channel Hero */}
                    {(profile?.plan_type === 'free_trial' || profile?.plan_type === 'basic' || profile?.plan_type === 'premium') && (
                        <div className="mb-8">
                            <div className="text-center mb-8 flex flex-col items-center justify-center">
                                <h3 className={`text-xl md:text-2xl font-black font-[family-name:var(--font-montserrat)] uppercase mb-4 tracking-[0.15em] md:tracking-[0.2em] ${profile?.plan_type === 'premium' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#D8B2A3] to-[#C69C85] drop-shadow-[0_0_10px_rgba(198,156,133,0.5)]' :
                                    profile?.plan_type === 'basic' ? 'text-white drop-shadow-sm' :
                                        'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                                    }`}>
                                    QUESTO E' IL TUO CANALE AUDIO PRINCIPALE
                                </h3>
                                <div className={`p-3 rounded-full border animate-bounce ${profile?.plan_type === 'premium' ? 'bg-[#C69C85]/20 border-[#C69C85]/30 shadow-[0_0_15px_rgba(198,156,133,0.3)]' :
                                    profile?.plan_type === 'basic' ? 'bg-white/10 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.3)]' :
                                        'bg-white/10 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                    }`}>
                                    <ArrowDown className={`w-6 h-6 md:w-8 md:h-8 ${profile?.plan_type === 'premium' ? 'text-[#C69C85]' :
                                        profile?.plan_type === 'basic' ? 'text-white' :
                                            'text-white'
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
                            <div id="welcome-pricing-banner" className="w-full mt-12 mb-4 relative z-30">
                                {/* Sfondo decorativo */}
                                <div className={`absolute inset-0 bg-linear-to-b ${profile?.plan_type === 'free_trial' ? 'from-emerald-900/10 via-teal-900/5' : 'from-fuchsia-900/10 via-indigo-900/5'} to-transparent rounded-[3rem] -z-10 blur-xl pointer-events-none`} />

                                <details className="group w-full max-w-7xl mx-auto relative z-20 mb-4 md:mb-8">
                                    <summary className="cursor-pointer list-none flex justify-center items-center w-full outline-none select-none mb-4 text-center relative z-20">
                                        <div className={`flex items-center justify-between w-full max-w-[360px] md:max-w-[640px] px-6 md:px-10 py-4 rounded-[2rem] border border-white/5 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-white/10 relative overflow-hidden group/btn ${profile?.plan_type === 'free_trial' ? 'bg-gradient-to-br from-[#FAFAFA]/20 via-purple-300/10 to-[#DDA0DD]/5' : profile?.plan_type === 'basic' ? 'bg-gradient-to-r from-white/10 to-transparent border-white/10' : 'bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                            <div className="flex items-center gap-3 md:gap-4 flex-1 text-left">
                                                <PlayCircle className={`w-8 h-8 md:w-10 md:h-10 shrink-0 ${profile?.plan_type === 'free_trial' ? 'text-purple-300' : profile?.plan_type === 'basic' ? 'text-[#dfa3fb]' : 'text-white'}`} />
                                                <span className={`text-lg md:text-xl lg:text-2xl font-bold font-[family-name:var(--font-montserrat)] tracking-widest md:tracking-[0.15em] uppercase drop-shadow-sm whitespace-nowrap pt-1 ${profile?.plan_type === 'free_trial' ? 'text-white' : profile?.plan_type === 'basic' ? 'text-white' : 'text-[#C69C85]'}`}>
                                                    COME FUNZIONA
                                                </span>
                                            </div>
                                            <div className={`p-1.5 md:p-2 rounded-full border transition-transform duration-300 group-open:rotate-180 flex-shrink-0 ${profile?.plan_type === 'free_trial' ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' : profile?.plan_type === 'basic' ? 'bg-white/5 border-white/10 text-[#dfa3fb]' : 'bg-white/10 border-white/20 text-white'}`}>
                                                <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                                            </div>
                                        </div>
                                    </summary>

                                    {/* Content Wrapper */}
                                    <div className={`border border-white/5 rounded-[35px] shadow-2xl p-6 md:p-10 relative overflow-hidden backdrop-blur-xl ${profile?.plan_type === 'free_trial' ? 'bg-gradient-to-br from-[#FAFAFA]/20 via-purple-300/10 to-[#DDA0DD]/5' : profile?.plan_type === 'basic' ? 'bg-[#312344]' : 'bg-[#2b2730]'} animate-in fade-in slide-in-from-top-4 duration-500`}>
                                        {/* Overlay di luce */}
                                        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none ${profile?.plan_type === 'free_trial' ? 'bg-[#FAFAFA]/10' : profile?.plan_type === 'basic' ? 'bg-fuchsia-600/10' : 'bg-[#D8B2A3]/10'}`} />
                                        <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none ${profile?.plan_type === 'free_trial' ? 'bg-purple-400/10' : profile?.plan_type === 'basic' ? 'bg-indigo-600/10' : 'bg-[#5D6676]/10'}`} />

                                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                                            <div className="lg:col-span-5 space-y-6">
                                                <p className="text-xl md:text-2xl text-zinc-200 font-light leading-relaxed">
                                                    Nulla di più semplice!<br /><span className="text-white font-medium">Collega il tuo pc / smartphone / tablet</span> all'impianto audio del tuo istituto o a delle <span className="text-white font-medium">casse Bluetooth</span>.<br /><br /><span className="text-white font-medium">Premi play sul canale principale</span> qui sopra, imposta il giusto volume in salone e <span className="text-white font-medium">dimenticatene</span>, il resto lo fa <span className="text-white font-medium">BeautiFy</span>.
                                                </p>
                                                <div className={`pl-6 border-l-2 py-1 space-y-4 ${profile?.plan_type === 'free_trial' ? 'border-purple-500/30' : profile?.plan_type === 'basic' ? 'border-[#00E5FF]/30' : 'border-[#C69C85]/30'}`}>
                                                    <p className="text-lg md:text-xl text-zinc-200 leading-relaxed font-light">
                                                        I nostri canali audio propongono una <span className="text-white font-medium">raffinata selezione</span> <span className={`font-medium ${profile?.plan_type === 'free_trial' ? 'text-purple-200' : profile?.plan_type === 'basic' ? 'text-[#00E5FF]/80' : 'text-[#D8B2A3]'}`}>di diversi generi musicali</span>, intervallata da <span className={`font-medium ${profile?.plan_type === 'free_trial' ? 'text-purple-200' : profile?.plan_type === 'basic' ? 'text-[#00E5FF]/80' : 'text-[#D8B2A3]'}`}>eleganti, delicati e generici</span> <span className={`font-medium ${profile?.plan_type === 'free_trial' ? 'text-purple-300' : profile?.plan_type === 'basic' ? 'text-[#00E5FF]' : 'text-[#C69C85]'}`}>suggerimenti vocali</span>.
                                                    </p>
                                                    <p className={`text-lg tracking-wide mt-2 font-light ${profile?.plan_type === 'free_trial' ? 'text-purple-300/90' : profile?.plan_type === 'basic' ? 'text-[#00E5FF]/90' : 'text-[#D8B2A3]/90'}`}>
                                                        Studiati per <span className="text-white font-medium">stimolare la curiosità</span> delle tue clienti e l'<span className="text-white font-medium">acquisto dei tuoi servizi</span>.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Divisore centrale su Desktop */}
                                            <div className="hidden lg:flex lg:col-span-2 justify-center items-center">
                                                <div className="w-[1px] h-32 bg-linear-to-b from-transparent via-white/20 to-transparent" />
                                            </div>

                                            {/* Colonna Destra: Altri Canali */}
                                            <div className="lg:col-span-5 space-y-6 bg-white/[0.02] p-8 md:p-10 rounded-[2.5rem] border border-white/5 relative group hover:bg-white/[0.04] transition-all duration-500 hover:border-[#5D6676]/20 shadow-xl">
                                                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#5D6676] to-[#5D6676] text-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl shadow-[#5D6676]/30 rotate-12 group-hover:rotate-6 transition-transform">
                                                    <span className="font-black text-2xl font-[family-name:var(--font-montserrat)]">+6</span>
                                                </div>
                                                <h3 className="text-2xl md:text-4xl font-semibold font-[family-name:var(--font-montserrat)] text-white flex items-center gap-3 drop-shadow-sm leading-tight mb-2">
                                                    Cambia il tuo Mood
                                                </h3>
                                                <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
                                                    Qui sotto, hai a disposizione altri <strong className="text-[#8b8599] font-semibold">6 canali settoriali</strong>, per cambiare il tuo mood musicale in istituto durante la giornata.
                                                </p>

                                                <div className="bg-zinc-950/40 p-5 rounded-3xl border border-white/5 space-y-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#AB7169]/20 to-[#5D6676]/20 flex items-center justify-center shrink-0 mt-1 shadow-inner border border-[#AB7169]/20">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-[#AB7169] shadow-[0_0_10px_rgba(232,121,249,0.8)]" />
                                                        </div>
                                                        <p className="text-zinc-300 text-[15px] leading-relaxed">
                                                            Anche questi canali contengono <span className="text-[#D8B2A3] italic font-light">morbidi suggerimenti vocali</span> tranne <strong className="text-white font-semibold font-[family-name:var(--font-montserrat)] tracking-wide bg-white/10 px-2 py-0.5 rounded-md align-middle mx-1 text-xs">RELAX</strong> e <strong className="text-white font-semibold font-[family-name:var(--font-montserrat)] tracking-wide bg-white/10 px-2 py-0.5 rounded-md align-middle mx-1 text-xs">MASSAGE</strong>.
                                                        </p>
                                                    </div>
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5D6676]/20 to-[#D8B2A3]/20 flex items-center justify-center shrink-0 mt-1 shadow-inner border border-[#5D6676]/20">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-[#5D6676] shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                                                        </div>
                                                        <p className="text-zinc-300 text-[15px] leading-relaxed">
                                                            Rilassati con <strong className="text-white font-semibold font-[family-name:var(--font-montserrat)] tracking-wide bg-[#5D6676]/20 border border-[#5D6676]/30 text-[#5D6676] px-2 py-0.5 rounded-md align-middle mx-1 text-xs">DEEP SOFT</strong> nel weekend o del <strong className="text-white font-semibold font-[family-name:var(--font-montserrat)] tracking-wide bg-[#D8B2A3]/20 border border-[#D8B2A3]/30 text-[#D8B2A3] px-2 py-0.5 rounded-md align-middle mx-1 text-xs">JAZZ</strong> a fine giornata.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="pt-4 mt-2 border-t border-white/5">
                                                    <p className={`font-bold font-[family-name:var(--font-montserrat)] tracking-wider uppercase text-lg flex items-center gap-2 ${profile?.plan_type === 'free_trial' ? 'text-purple-300' : profile?.plan_type === 'basic' ? 'text-[#00E5FF]' : 'text-[#C69C85]'}`}>
                                                        <Radio className="w-5 h-5" /> Buon ascolto
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </details>
                            </div>

                        </div>
                    )}

                    <details className="group w-full max-w-7xl mx-auto mb-4 md:mb-8 relative z-10">
                        <summary className="cursor-pointer list-none flex justify-center items-center w-full outline-none select-none mb-4 text-center relative z-20">
                            <div className={`flex items-center justify-between w-full max-w-[360px] md:max-w-[640px] px-6 md:px-10 py-4 rounded-[2rem] border border-white/5 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-white/10 relative overflow-hidden group/btn ${profile?.plan_type === 'free_trial' ? 'bg-gradient-to-br from-[#FAFAFA]/20 via-purple-300/10 to-[#DDA0DD]/5' : profile?.plan_type === 'basic' ? 'bg-gradient-to-r from-white/10 to-transparent border-white/10' : 'bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                <div className="flex items-center gap-3 md:gap-4 flex-1 text-left">
                                    <Radio className={`w-8 h-8 md:w-10 md:h-10 shrink-0 ${profile?.plan_type === 'free_trial' ? 'text-purple-300' : profile?.plan_type === 'basic' ? 'text-[#dfa3fb]' : 'text-white'}`} />
                                    <span className={`text-lg md:text-xl lg:text-2xl font-bold font-[family-name:var(--font-montserrat)] tracking-widest md:tracking-[0.15em] uppercase drop-shadow-sm whitespace-nowrap pt-1 ${profile?.plan_type === 'free_trial' ? 'text-white' : profile?.plan_type === 'basic' ? 'text-white' : 'text-[#C69C85]'}`}>
                                        ALTRI CANALI
                                    </span>
                                </div>
                                <div className={`p-1.5 md:p-2 rounded-full border transition-transform duration-300 group-open:rotate-180 flex-shrink-0 ${profile?.plan_type === 'free_trial' ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' : profile?.plan_type === 'basic' ? 'bg-white/5 border-white/10 text-[#dfa3fb]' : 'bg-white/10 border-white/20 text-white'}`}>
                                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                            </div>
                        </summary>

                        <div className="animate-in fade-in slide-in-from-top-8 duration-500 pt-4">
                            <ChannelGrid initialChannels={channels || []} serverError={channelsError?.message} planType={profile?.plan_type} />
                        </div>
                    </details>

                    {profile?.plan_type === 'free_trial' && (
                        <div className="w-full max-w-7xl mx-auto mt-12 mb-8 flex justify-center relative z-10">
                            <div className="relative w-full max-w-4xl p-2 md:p-3 rounded-[2.5rem] bg-gradient-to-br from-purple-500/20 via-fuchsia-500/10 to-pink-500/20 shadow-2xl shadow-purple-900/40 backdrop-blur-xl overflow-hidden group">
                                <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
                                <div className="absolute inset-0 border border-white/10 rounded-[2.5rem]" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <img 
                                    src="/free-trial-banner.png" 
                                    alt="Promozione Free Trial" 
                                    className="relative z-10 w-full h-auto object-cover rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] transform transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                            </div>
                        </div>
                    )}

                    {profile?.plan_type === 'basic' && (
                        <div className="w-full max-w-7xl mx-auto mt-12 mb-8 flex justify-center relative z-10">
                            <div className="relative w-full max-w-4xl p-2 md:p-3 rounded-[2.5rem] bg-gradient-to-br from-purple-500/20 via-fuchsia-500/10 to-pink-500/20 shadow-2xl shadow-purple-900/40 backdrop-blur-xl overflow-hidden group">
                                <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
                                <div className="absolute inset-0 border border-white/10 rounded-[2.5rem]" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <img 
                                    src="/basic-plan-banner.png" 
                                    alt="Promozione Basic" 
                                    className="relative z-10 w-full h-auto object-cover rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] transform transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Upgrade Form for Free Trial and Basic Users */}
                    {(profile?.plan_type === 'free_trial' || profile?.plan_type === 'basic') && !isAdmin && (
                        <details className="group w-full max-w-7xl mx-auto mb-16 relative z-10" id="upgrade-section">
                            <summary className="cursor-pointer list-none flex justify-center items-center w-full outline-none select-none mb-4 text-center relative z-20">
                                <div className={`flex items-center justify-between w-full max-w-[360px] md:max-w-[640px] px-6 md:px-10 py-4 rounded-[2rem] border border-white/5 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-white/10 relative overflow-hidden group/btn ${profile?.plan_type === 'free_trial' ? 'bg-gradient-to-br from-[#FAFAFA]/20 via-purple-300/10 to-[#DDA0DD]/5' : profile?.plan_type === 'basic' ? 'bg-gradient-to-r from-white/10 to-transparent border-white/10' : 'bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                    <div className="flex items-center gap-3 md:gap-4 flex-1 text-left">
                                        <Sparkles className={`w-8 h-8 md:w-10 md:h-10 shrink-0 ${profile?.plan_type === 'free_trial' ? 'text-purple-300' : profile?.plan_type === 'basic' ? 'text-[#dfa3fb]' : 'text-sky-400'}`} />
                                        <span className="text-lg md:text-xl lg:text-2xl font-bold text-white font-[family-name:var(--font-montserrat)] tracking-widest md:tracking-[0.15em] uppercase drop-shadow-sm whitespace-nowrap pt-1">
                                            MIGLIORA L'ESPERIENZA
                                        </span>
                                    </div>
                                    <div className={`p-1.5 md:p-2 rounded-full border transition-transform duration-300 group-open:rotate-180 flex-shrink-0 ${profile?.plan_type === 'free_trial' ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' : profile?.plan_type === 'basic' ? 'bg-white/5 border-white/10 text-[#dfa3fb]' : 'bg-sky-500/10 border-sky-500/20 text-sky-400'}`}>
                                        <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                </div>
                            </summary>

                            <div className="animate-in fade-in slide-in-from-top-8 duration-500 pt-4 w-full max-w-4xl mx-auto">
                                {profile?.plan_type === 'basic' ? (
                                    <UpgradeFormBasic userEmail={user.email} />
                                ) : (
                                    <UpgradeFormTrial userEmail={user.email} />
                                )}
                            </div>
                        </details>
                    )}

                </>
            ) : (
                <Paywall salonName={profile?.salon_name || user.email || 'Utente'} userEmail={user.email} />
            )
            }
        </div >
    );
}
