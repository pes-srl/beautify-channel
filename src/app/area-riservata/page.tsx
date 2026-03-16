import { ChannelGrid2 } from "@/components/draft2026/ChannelGrid2";
import { BasicHeroChannel2 } from "@/components/draft2026/BasicHeroChannel2";
import { createClient } from "@/utils/supabase/server";
import { LogOut, Sparkles, AlertCircle, CheckCircle2, Lock, Radio, ArrowDown, Play } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Paywall } from "./Paywall";
import { UpgradeCheckoutForm } from "@/components/draft2026/UpgradeCheckoutForm";
import { AudioPlayer } from "@/components/player/AudioPlayer";
import { PollActivation } from "@/components/draft2026/PollActivation";

export const dynamic = "force-dynamic";

export default async function AreaClientePage2(props: {
    searchParams?: Promise<{ upgrade?: string }>;
}) {
    const searchParams = await props.searchParams;
    const upgradeStatus = searchParams?.upgrade;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: dbProfile } = await supabase
        .from("profiles")
        .select("salon_name, role, plan_type, trial_ends_at")
        .eq("id", user.id)
        .single();

    let profile = dbProfile ? { ...dbProfile, partita_iva: user?.user_metadata?.partita_iva || null } : {
        salon_name: user?.user_metadata?.salon_name || null,
        role: 'User',
        plan_type: user?.user_metadata?.plan_type || 'free',
        trial_ends_at: user?.user_metadata?.trial_ends_at || null,
        partita_iva: user?.user_metadata?.partita_iva || null,
    };

    // Robustness Check: If replication lag causes plan_type to be 'free' but they just signed up as 'free_trial'
    if (profile.plan_type === 'free' && user?.user_metadata?.plan_type === 'free_trial') {
        profile.plan_type = 'free_trial';
        profile.trial_ends_at = profile.trial_ends_at || user.user_metadata.trial_ends_at;
        profile.salon_name = profile.salon_name || user.user_metadata.salon_name;
    }

    // Calculate Trial State
    const isAdmin = profile?.role === 'Admin';
    let isExpired = profile?.plan_type === 'free';
    let daysLeft = 0;

    if (profile?.plan_type === 'free_trial') {
        if (profile?.trial_ends_at) {
            const trialEndDate = new Date(profile.trial_ends_at);
            const now = new Date();
            const diffTime = trialEndDate.getTime() - now.getTime();
            daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Allow 1 day grace period for timezone issues and immediate signup edge case
            if (daysLeft < 0) {
                isExpired = true;
                profile.plan_type = 'free';
                daysLeft = 0;
            } else if (daysLeft === 0 && diffTime > -86400000) {
                // still active, just < 24h left
                daysLeft = 1;
            }
        } else {
            // Fallback for new accounts where triggers might be delayed: give 7 days visual
            daysLeft = 7;
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
        <div className="pt-[7rem] pb-32 min-h-screen relative w-full bg-[#0f0518] selection:bg-[#D8B2A3]/30">
            {/* Dynamic Background identico alla Home Page */}
            <div className="fixed inset-0 z-0 flex justify-center bg-[#0f0518] pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#AB7169]/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-[#5D6676]/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            {/* Wrapper z-10 per far fluttuare il contenuto SOPRA il background */}
            <div className="relative z-10 text-white w-full">

                {/* STRIPE RETURN BANNER */}
                {upgradeStatus === 'success' && (
                    <>
                        <div className="mb-8 bg-emerald-500/10 border border-emerald-500/30 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto shadow-lg shadow-emerald-900/20">
                            <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0 animate-pulse" />
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Pagamento Completato con Successo!</h3>
                                <p className="text-emerald-200/80 font-medium">Il tuo abbonamento è in fase di attivazione. I tuoi canali si sbloccheranno automaticamente a breve. L'elaborazione del pagamento richede qualche istante, non chiudere la pagina.</p>
                            </div>
                        </div>
                        <PollActivation />
                    </>
                )}

                {upgradeStatus === 'cancel' && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/30 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto shadow-lg shadow-red-900/20">
                        <AlertCircle className="w-10 h-10 text-red-400 shrink-0" />
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Pagamento Annullato</h3>
                            <p className="text-red-200/80 font-medium">Il processo di pagamento è stato interrotto. Nessun addebito è stato effettuato. Puoi riprovare quando desideri selezionando nuovamente il piano qui sotto.</p>
                        </div>
                    </div>
                )}

                {/* 1. DYNAMIC WELCOME BANNER */}
                {!isAdmin && profile?.plan_type === 'free_trial' && !isExpired && (
                    <div className="w-full max-w-4xl mx-auto mt-24 mb-16 flex flex-col gap-6 items-center px-4">
                        {/* TOP CARD */}
                        <div className="w-full bg-gradient-to-br from-[#3b1c6b] via-[#2a1154] to-[#1a0b33] border border-white/5 rounded-3xl p-8 md:p-12 text-center shadow-2xl flex flex-col items-center">
                            <h2 className="text-xl md:text-3xl font-semibold text-white mb-8 max-w-2xl mx-auto leading-relaxed">
                                Benvenuta, grazie di aver scelto di provare BeautiFy Channel! Buona esperienza!
                            </h2>
                            <div className="bg-black/20 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col items-center shadow-inner mb-8 w-full max-w-sm">
                                <span className="text-zinc-400 text-xs md:text-sm uppercase tracking-[0.2em] font-medium mb-3">
                                    IL TUO PIANO ATTUALE
                                </span>
                                <h3 className="text-4xl md:text-5xl font-black text-[#ff5a7e] uppercase tracking-wider mb-2">
                                    FREE TRIAL
                                </h3>
                                <span className="text-zinc-400 text-sm md:text-base italic">
                                    {daysLeft} {daysLeft === 1 ? 'giorno' : 'giorni'} alla fine della prova gratuita
                                </span>
                            </div>
                            
                            <a
                                href="#scegli-piano-section"
                                className="inline-block bg-white text-black font-bold uppercase tracking-widest text-sm md:text-base px-8 py-3.5 rounded-full hover:scale-105 transition-transform"
                            >
                                SCEGLI UN PIANO
                            </a>
                        </div>

                        {/* GLOWING BAR */}
                        <div className="w-full bg-gradient-to-r from-[#9b3bff] to-[#ff5a7e] rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 justify-between shadow-[0_0_40px_rgba(255,90,126,0.3)]">
                            <div className="flex items-center gap-4">
                                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white shrink-0" />
                                <span className="font-bold text-white text-lg md:text-xl">
                                    La tua prova gratuita è attiva
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-white/90 text-sm md:text-base">Scade tra</span>
                                <span className="bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-xl text-white text-sm md:text-base font-bold">
                                    {daysLeft} {daysLeft === 1 ? 'giorno' : 'giorni'}
                                </span>
                            </div>
                        </div>

                        {/* AREA RISERVATA BLOCK */}
                        <div className="w-full mt-8 md:mt-12 bg-[#0f0518]/50 border border-[#ff5a7e]/20 rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center justify-center relative shadow-[0_0_50px_rgba(255,90,126,0.05)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#ff5a7e]/5 to-transparent rounded-[2.5rem] pointer-events-none" />
                            <h1 className="text-5xl md:text-7xl font-sans font-bold text-[#ff5a7e] mb-6 drop-shadow-md tracking-tight">
                                Area Riservata
                            </h1>
                            <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
                                <span className="text-white font-bold text-xl md:text-2xl">
                                    {profile?.salon_name || user.email}
                                </span>
                                <span className="text-xs md:text-sm font-bold text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                                    PIANO: FREE TRIAL
                                </span>
                            </div>
                        </div>

                        {/* QUESTO E IL TUO CANALE AUDIO PRINCIPALE */}
                        <div className="mt-12 mb-0 flex flex-col items-center">
                            <h3 className="text-white/90 font-medium tracking-[0.2em] uppercase text-center text-sm md:text-base mb-6">
                                Questo e' il tuo canale audio principale
                            </h3>
                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                                <ArrowDown className="w-5 h-5 text-white/70" />
                            </div>
                        </div>
                    </div>
                )}

                {/* GRAZIE BANNER FOR NON-TRIAL USERS (PREMIUM/BASIC) */}
                {!isAdmin && profile?.plan_type !== 'free_trial' && profile?.plan_type && !isExpired && (
                    <div className="w-full mt-32 md:mt-40 mb-20 flex flex-col items-center justify-center text-center">
                        <h1 className={`text-5xl md:text-7xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-amber-200 mb-4 drop-shadow-lg`}>
                            GRAZIE
                        </h1>
                        <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] font-[family-name:var(--font-montserrat)] text-white mb-6 uppercase">
                            Benvenuta nel tuo account
                        </h2>
                        
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-xl md:text-2xl font-bold text-white">
                                {profile?.salon_name || user.email}
                            </span>
                            <div className="flex bg-white/5 border border-white/10 rounded-full px-4 py-1.5 items-center gap-2 backdrop-blur-sm">
                                <span className={`w-2 h-2 rounded-full animate-pulse bg-amber-400`} />
                                <span className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                                    {`Piano: ${profile.plan_type === 'basic' ? 'Basic' : 'Premium'}`}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* MAIN CONTENT V2 */}
                {(!isExpired || isAdmin) ? (
                    <>
                        {/* THE HERO PLAYER */}
                        <div className="mb-0 flex flex-col items-center">
                             <BasicHeroChannel2
                                planType={profile?.plan_type}
                                channel={channels?.find((c: any) =>
                                    profile?.plan_type === 'premium'
                                        ? (c.name.toLowerCase().includes('premium') || c.name.toLowerCase() === 'beautify channel premium')
                                        : (c.name.toLowerCase().includes('basic') || c.name.toLowerCase() === 'beautify channel basic')
                                ) || null}
                            />
                        </div>

                        {/* ACCORDIONS */}
                        <div className="w-full max-w-6xl mx-auto mt-6 mb-24 px-4">
                            {/* COME FUNZIONA ACCORDION (UNIFIED LAYOUT) */}
                            <details className="group mb-4 marker:content-['']">
                                <summary className="flex items-center justify-between cursor-pointer list-none bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md border border-white/5 rounded-[2rem] p-4 pr-6 transition-all duration-300 w-full md:w-3/4 mx-auto select-none">
                                    <div className="flex items-center gap-3 md:gap-5">
                                        <div className="p-3 bg-white/5 rounded-full shrink-0">
                                            <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-transparent stroke-[1.5]" />
                                        </div>
                                        <span className="text-white font-black uppercase text-xl md:text-3xl tracking-widest">COME FUNZIONA</span>
                                    </div>
                                    <div className={`p-2 rounded-full border ${profile?.plan_type === 'premium' ? 'border-amber-500/20 bg-amber-500/10' : 'border-emerald-500/20 bg-emerald-500/10'}`}>
                                        <ArrowDown className={`w-5 h-5 transition-transform duration-300 group-open:rotate-180 ${profile?.plan_type === 'premium' ? 'text-amber-400' : 'text-emerald-400'}`} />
                                    </div>
                                </summary>
                                <div className="overflow-hidden mt-4 animate-in fade-in slide-in-from-top-4 duration-500 w-full xl:w-5/6 mx-auto">
                                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10">
                                        
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                                            {/* LEFT COLUMN: Istruzioni */}
                                            <div className="text-lg md:text-xl font-light leading-relaxed text-zinc-300 flex flex-col justify-center">
                                                <p className="mb-6">Nulla di più semplice!<br />
                                                Collega il tuo pc / smartphone / tablet all'<strong className="text-white">impianto audio</strong> del tuo istituto o a delle <strong className="text-white">casse Bluetooth</strong>.</p>
                                                
                                                <p className="mb-8">Premi play sul canale principale qui sopra, imposta il giusto volume in salone e <strong className="text-white">dimenticatene</strong>, il resto lo fa <strong className="text-white">BeautiFy</strong>.</p>
                                                
                                                <div className={`pl-5 md:pl-6 border-l-2 ${profile?.plan_type === 'premium' ? 'border-amber-500/30' : 'border-purple-500/40'} py-1`}>
                                                    <p>I nostri canali audio propongono una <strong className="text-white">raffinata selezione di diversi generi musicali</strong>, intervallata da <strong className="text-white">eleganti, delicati e generici suggerimenti vocali</strong>.</p>
                                                    <p className="mt-4">Studiati per <strong className="text-white">stimolare la curiosità</strong> delle tue clienti e l'<strong className="text-white">acquisto dei tuoi servizi</strong>.</p>
                                                </div>
                                            </div>

                                            {/* RIGHT COLUMN: Cambia il tuo Mood (The +6 Card) */}
                                            <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 md:p-8 relative shadow-lg">
                                                <div className={`absolute -top-4 -right-4 text-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-xl rotate-6 transition-transform hover:rotate-12 ${profile?.plan_type === 'premium' ? 'bg-amber-600 shadow-amber-900/50' : 'bg-slate-600/80 shadow-slate-900/50 border border-white/10'}`}>
                                                    <span className="font-black text-xl">+6</span>
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Cambia il tuo Mood</h3>
                                                <p className="text-base md:text-lg text-zinc-400 font-light mb-6">
                                                    Qui sotto, hai a disposizione altri 6 canali settoriali, per cambiare il tuo mood musicale in istituto durante la giornata.
                                                </p>
                                                <div className="bg-black/20 p-4 md:p-5 rounded-[1.25rem] border border-white/5 space-y-4 shadow-inner mb-6">
                                                    <p className="text-zinc-200 text-sm md:text-base font-light leading-relaxed">
                                                        Anche questi canali contengono <span className="text-white italic font-normal">morbidi suggerimenti vocali</span> tranne <strong className="bg-white/5 text-white px-2.5 py-1 rounded-md align-middle mx-1 text-xs font-bold tracking-wider uppercase border border-white/10">RELAX</strong> e <strong className="bg-white/5 text-white px-2.5 py-1 rounded-md align-middle mx-1 text-xs font-bold tracking-wider uppercase border border-white/10">MASSAGE</strong>.
                                                    </p>
                                                    <p className="text-zinc-200 text-sm md:text-base font-light leading-relaxed">
                                                        Rilassati con <strong className="bg-white/5 text-white px-2.5 py-1 rounded-md align-middle mx-1 text-xs font-bold tracking-wider uppercase border border-white/10">DEEP SOFT</strong> nel weekend o del <strong className="bg-white/5 text-white px-2.5 py-1 rounded-md align-middle mx-1 text-xs font-bold tracking-wider uppercase border border-white/10">JAZZ</strong> a fine giornata.
                                                    </p>
                                                </div>
                                                <div className="pt-2 flex items-center gap-2">
                                                    <Radio className={`w-5 h-5 ${profile?.plan_type === 'premium' ? 'text-amber-400' : 'text-emerald-400'}`} />
                                                    <p className={`font-bold tracking-widest uppercase text-sm md:text-base ${profile?.plan_type === 'premium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                        BUON ASCOLTO
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </details>

                            {/* ALTRI CANALI ACCORDION (CONTAINS THE GRID) */}
                            <details className="group marker:content-['']" open>
                                <summary className="flex items-center justify-between cursor-pointer list-none bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md border border-white/5 rounded-[2rem] p-4 pr-6 transition-all duration-300 w-full md:w-3/4 mx-auto select-none">
                                    <div className="flex items-center gap-3 md:gap-5">
                                        <div className="p-3 bg-white/5 rounded-full shrink-0">
                                            <Radio className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                        </div>
                                        <span className="text-white font-black uppercase text-xl md:text-3xl tracking-widest">ALTRI CANALI</span>
                                    </div>
                                    <div className={`p-2 rounded-full border ${profile?.plan_type === 'premium' ? 'border-amber-500/20 bg-amber-500/10' : profile?.plan_type === 'free_trial' ? 'border-fuchsia-500/20 bg-fuchsia-500/10' : 'border-indigo-500/20 bg-indigo-500/10'}`}>
                                        <ArrowDown className={`w-5 h-5 transition-transform duration-300 group-open:rotate-180 ${profile?.plan_type === 'premium' ? 'text-amber-400' : profile?.plan_type === 'free_trial' ? 'text-fuchsia-400' : 'text-indigo-400'}`} />
                                    </div>
                                </summary>
                                <div className="overflow-hidden mt-4 animate-in fade-in slide-in-from-top-4 duration-500 w-full xl:w-[90%] mx-auto">
                                    <div className="relative w-full py-12 md:py-20 -mx-4 px-4 sm:mx-0 sm:px-0 mt-2 mb-6" style={{ width: 'calc(100% + 2rem)' }}>
                                        {/* Sfondo sfumato bianco dall'alto più visibile e diffuso */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none -z-10 rounded-[3rem]" />
                                        {/* Bagliore alto */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-72 bg-white/5 blur-[100px] pointer-events-none -z-10" />
                                        {/* Bagliore basso per diffonderlo in fondo */}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] max-w-4xl h-72 bg-white/5 blur-[120px] pointer-events-none -z-10" />

                                        <ChannelGrid2 initialChannels={channels || []} serverError={channelsError?.message} planType={profile?.plan_type} />
                                    </div>
                                </div>
                            </details>

                        </div>
                        {/* END ACCORDIONS E GRIGLIA */}

                        {/* Upgrade Form for Free Trial and Basic Users */}
                        {(profile?.plan_type === 'free_trial' || profile?.plan_type === 'basic') && !isAdmin && (
                            <div id="scegli-piano-section" className="w-full max-w-4xl mx-auto mt-0 md:mt-16 border-t border-white/10 pt-4 md:pt-16">
                                {profile?.plan_type === 'basic' && (
                                    <div className="text-center mb-16 px-4">
                                        {/* Elegant Divider */}
                                        <div className="flex items-center justify-center w-full mb-16 relative">
                                            {/* Core line */}
                                            <div className="w-11/12 max-w-4xl h-[3px] rounded-full z-10 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                                            {/* Glow effect */}
                                            <div className="absolute w-11/12 max-w-4xl h-[12px] blur-[8px] rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                        </div>

                                        <h2 className="text-xl md:text-3xl font-black uppercase text-white tracking-widest leading-tight mb-6 w-full max-w-5xl mx-auto">
                                            IL MESE PROSSIMO HAI PIANIFICATO UNA PROMOZIONE SU UN TUO SERVIZIO PER LE TUE CLIENTI?
                                        </h2>
                                        <p className="text-zinc-200 text-xl w-full max-w-4xl mx-auto leading-relaxed mb-12 font-medium">
                                            Facendo upgrade al <strong className="text-amber-400 font-black uppercase tracking-wider">Piano Premium</strong> puoi chiederci di realizzare delle <span className="text-white font-bold underline decoration-amber-400/50 underline-offset-4">promo audio personalizzate</span> con le tue promozioni.
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
                                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 font-bold text-3xl md:text-4xl xl:text-5xl py-2 drop-shadow-sm">
                                                        eleganti suggerimenti vocali
                                                    </span>
                                                    <span className="block text-base md:text-lg text-zinc-300 mt-4 font-light italic">
                                                        con le <strong className="text-amber-400 font-semibold not-italic">tue promozioni</strong> e i tuoi <strong className="text-amber-400 font-semibold not-italic">servizi personalizzati</strong>.
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#D8B2A3]/20 w-full mt-auto aspect-[4/3] lg:aspect-video mb-16 h-64 md:h-80 lg:h-96">
                                                <Image
                                                    src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772934286210-zjhcxj.png"
                                                    alt="Servizi Personalizzati Premium"
                                                    fill
                                                    sizes="(max-width: 1024px) 100vw, 80vw"
                                                    className="object-cover scale-[1.15]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {profile?.plan_type === 'free_trial' ? (
                                    <UpgradeCheckoutForm userEmail={user.email} userVat={profile?.partita_iva} userSalonName={profile?.salon_name as string} planType={profile?.plan_type} />
                                ) : (
                                    <div className="flex justify-center mt-[-1rem] mb-4">
                                        <a
                                            href="https://wa.link/5apci9"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg md:text-xl rounded-[35px] px-10 py-5 shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all hover:scale-105 gap-3"
                                        >
                                            Contattaci per UPGRADE A PREMIUM
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        <AudioPlayer />
                    </>
                ) : (
                    <Paywall salonName={profile?.salon_name || user.email || 'Utente'} userEmail={user.email} />
                )}
            </div>
        </div>
    );
}
