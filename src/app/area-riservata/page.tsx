import { ChannelGrid2 } from "@/components/draft2026/ChannelGrid2";
import { BasicHeroChannel2 } from "@/components/draft2026/BasicHeroChannel2";
import { createClient } from "@/utils/supabase/server";
import { LogOut, Sparkles, AlertCircle, CheckCircle2, Lock, Radio, ArrowDown } from "lucide-react";
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
        <div className="pt-[7rem] pb-32 min-h-screen relative w-full selection:bg-[#D8B2A3]/30">
            {/* Dynamic Background identico alla Home Page */}
            <div className="fixed inset-0 z-0 flex justify-center bg-zinc-950 pointer-events-none">
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

                {/* DYNAMIC WELCOME BANNER BASED ON PLAN */}
                {!isAdmin && profile?.plan_type && !isExpired && (
                    <div className="mb-6 p-4 rounded-xl border border-white/5 bg-zinc-900/50 flex items-center justify-center text-center shadow-md">
                        <div className="w-full">
                            {(profile.plan_type === 'free_trial' || profile.plan_type === 'basic') ? (
                                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                                    <h2 className="text-2xl md:text-4xl uppercase tracking-[0.15em] text-zinc-100 font-[family-name:var(--font-montserrat)] font-light flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                                        <span>BENVENUTA NEL TUO ACCOUNT</span>
                                        <div className="relative h-8 md:h-10 lg:h-12 w-32 md:w-40 mt-2 md:mt-0">
                                            <Image
                                                src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg"
                                                alt="BeautiFy Channel Logo"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </h2>
                                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                    <p className="text-zinc-300 font-medium text-xl tracking-wide leading-relaxed">
                                        <strong className="text-[#D8B2A3] font-black">GRAZIE PER LA FIDUCIA</strong> in BeautiFy Channel <strong className="text-[#D8B2A3] font-black">ORA</strong>, hai a disposizione il <strong className="text-[#D8B2A3] font-black">NUOVO</strong> e unico<br className="md:hidden" /> strumento di <strong className="text-[#D8B2A3] font-black">MARKETING SENSORIALE</strong> dedicato al settore, con le sue potenzialità.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                                    <h2 className="text-2xl md:text-4xl uppercase tracking-[0.15em] text-zinc-100 font-[family-name:var(--font-montserrat)] font-light flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                                        <span>BENVENUTA NEL TUO ACCOUNT</span>
                                        <div className="relative h-8 md:h-10 lg:h-12 w-32 md:w-40 mt-2 md:mt-0">
                                            <Image
                                                src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg"
                                                alt="BeautiFy Channel Logo"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </h2>
                                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                    <p className="text-zinc-300 font-medium text-lg tracking-wide leading-relaxed">
                                        Hai attivo il piano <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D8B2A3] to-[#D8B2A3] uppercase text-2xl px-1 tracking-wider">PREMIUM</span>. COMPLIMENTI! Hai a disposizione il <strong className="text-[#D8B2A3] font-black">TOP</strong> delle potenzialità di BeautiFy
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TRIAL OVERVIEW BANNER */}
                {profile?.plan_type === 'free_trial' && daysLeft > 0 && !isAdmin && (
                    <div className="bg-gradient-to-r from-[#AB7169] to-[#5D6676] text-white px-6 py-5 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center shadow-lg shadow-[#AB7169]/20 gap-4 border border-[#AB7169]/30 relative overflow-hidden max-w-3xl mx-auto w-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[30px] rounded-full mix-blend-screen -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                            <div className="p-2 bg-white/20 rounded-full backdrop-blur-md shrink-0">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-base md:text-lg leading-tight mb-1">La tua prova gratuita è attiva</h3>
                                <p className="text-[#fefefe] text-xs">Scade tra <strong className="text-[#D8B2A3] bg-black/20 px-1.5 py-0.5 rounded-sm mx-1">{daysLeft} giorni</strong>.</p>
                            </div>
                        </div>
                        <Link href="#upgrade-section" className="relative z-10 shrink-0 w-full md:w-auto bg-white text-zinc-950 px-5 py-2.5 rounded-lg font-bold text-sm tracking-wide hover:bg-zinc-100 transition-colors shadow-md text-center mt-3 md:mt-0">
                            SCEGLI UN PIANO
                        </Link>
                    </div>
                )}

                <div className="flex flex-col items-center justify-center gap-6 mb-12 border-b border-white/10 pb-8 mt-4">
                    <div className="flex flex-col items-center w-full text-center">
                        <h1 className="text-4xl md:text-5xl font-semibold font-[family-name:var(--font-montserrat)] text-white mb-3 tracking-tight flex items-center justify-center gap-3 w-full">
                            Area Riservata
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 mb-2">
                            <span className="text-lg font-medium text-white">
                                {profile?.salon_name || user.email}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 ${profile?.plan_type === 'premium' ? 'bg-[#D8B2A3]/10 text-[#D8B2A3]' :
                                profile?.plan_type === 'free_trial' ? 'bg-[#D8B2A3]/10 text-[#D8B2A3]' :
                                    profile?.plan_type === 'basic' ? 'bg-[#5D6676]/10 text-[#5D6676]' :
                                        'bg-zinc-800 text-zinc-400'
                                }`}>
                                Piano: {profile?.plan_type?.replace('_', ' ') || 'Free'}
                            </span>
                            {isAdmin && (
                                <span className="px-3 py-1 rounded-full bg-[#AB7169]/20 text-[#AB7169] text-xs font-bold uppercase tracking-widest border border-[#AB7169]/30">
                                    Admin Privileges
                                </span>
                            )}
                        </div>
                        {!isExpired || isAdmin ? null : (
                            <p className="text-[#AB7169] text-lg mt-2 font-medium">L'accesso ai canali è bloccato.</p>
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
                                    <h3 className={`text-xl md:text-2xl font-black text-transparent bg-clip-text uppercase mb-4 tracking-[0.15em] md:tracking-[0.2em] ${profile?.plan_type === 'premium' ? 'bg-gradient-to-r from-[#D8B2A3] to-[#D8B2A3] drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' :
                                        profile?.plan_type === 'basic' ? 'bg-gradient-to-r from-[#D8B2A3] to-[#5D6676] drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]' :
                                            'bg-gradient-to-r from-[#D8B2A3] to-[#AB7169] drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                                        }`}>
                                        QUESTO E' IL TUO CANALE AUDIO PRINCIPALE
                                    </h3>
                                    <div className={`p-3 rounded-full border animate-bounce ${profile?.plan_type === 'premium' ? 'bg-[#D8B2A3]/20 border-[#D8B2A3]/30 shadow-[0_0_15px_rgba(251,191,36,0.3)]' :
                                        profile?.plan_type === 'basic' ? 'bg-[#D8B2A3]/20 border-[#D8B2A3]/30 shadow-[0_0_15px_rgba(56,189,248,0.3)]' :
                                            'bg-[#D8B2A3]/20 border-[#D8B2A3]/30 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                                        }`}>
                                        <ArrowDown className={`w-6 h-6 md:w-8 md:h-8 ${profile?.plan_type === 'premium' ? 'text-[#D8B2A3]' :
                                            profile?.plan_type === 'basic' ? 'text-[#D8B2A3]' :
                                                'text-[#D8B2A3]'
                                            }`} />
                                    </div>
                                </div>
                                <BasicHeroChannel2
                                    planType={profile?.plan_type}
                                    channel={channels?.find((c: any) =>
                                        profile?.plan_type === 'premium'
                                            ? (c.name.toLowerCase().includes('premium') || c.name.toLowerCase() === 'beautify channel premium')
                                            : (c.name.toLowerCase().includes('basic') || c.name.toLowerCase() === 'beautify channel basic')
                                    ) || null}
                                />
                                {/* INFO BLOCK INNOVATIVO */}
                                <div id="welcome-pricing-banner" className="w-full max-w-6xl mx-auto mt-10 mb-12 relative">
                                    {/* Sfondo decorativo */}
                                    <div className={`absolute inset-0 bg-linear-to-b ${profile?.plan_type === 'free_trial' ? 'from-[#D8B2A3]/10 via-[#AB7169]/5' : 'from-[#AB7169]/10 via-[#5D6676]/5'} to-transparent rounded-[3rem] -z-10 blur-xl pointer-events-none`} />

                                    <div className={`border border-white/5 rounded-[35px] shadow-2xl p-6 md:p-10 relative overflow-hidden backdrop-blur-xl ${profile?.plan_type === 'free_trial' ? 'bg-gradient-to-br from-[#AB7169]/10 to-[#2e1d1b]' : 'bg-[#2b2730]'}`}>
                                        {/* Overlay di luce */}
                                        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none ${profile?.plan_type === 'free_trial' ? 'bg-[#D8B2A3]/10' : 'bg-[#AB7169]/10'}`} />
                                        <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none ${profile?.plan_type === 'free_trial' ? 'bg-[#AB7169]/10' : 'bg-[#5D6676]/10'}`} />

                                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                                            <div className="lg:col-span-5 space-y-5">
                                                <h2 className={`text-sm md:text-base font-black font-[family-name:var(--font-montserrat)] tracking-[0.3em] uppercase mb-2 ${profile?.plan_type === 'free_trial' ? 'text-[#D8B2A3]' : 'text-[#D8B2A3]'}`}>
                                                    Come Funziona
                                                </h2>
                                                <p className="text-xl md:text-2xl text-zinc-200 font-light leading-relaxed">
                                                    Nulla di più semplice! Collega il tuo pc / smartphone / tablet all'impianto audio del tuo istituto. Premi play sul canale principale qui sopra, imposta il giusto volume in salone e <strong className="font-semibold text-white">dimenticatene</strong>, il resto lo fa BeautiFy.
                                                </p>
                                                <div className={`pl-6 border-l-2 py-1 space-y-4 ${profile?.plan_type === 'free_trial' ? 'border-[#AB7169]/30' : 'border-[#5D6676]/30'}`}>
                                                    <p className="text-lg md:text-xl text-zinc-200 leading-relaxed font-light">
                                                        I nostri canali audio propongono una <strong className={`font-semibold ${profile?.plan_type === 'free_trial' ? 'text-[#D8B2A3]' : 'text-[#D8B2A3]'}`}>raffinata selezione di diversi generi musicali</strong>, intervallata da <strong className={`font-semibold ${profile?.plan_type === 'free_trial' ? 'text-[#D8B2A3]' : 'text-[#D8B2A3]'}`}>eleganti, delicati e generici</strong> <span className={`font-bold ${profile?.plan_type === 'free_trial' ? 'text-[#D8B2A3]' : 'text-[#D8B2A3]'}`}>suggerimenti vocali</span>.
                                                    </p>
                                                    <p className={`text-lg font-medium tracking-wide mt-2 ${profile?.plan_type === 'free_trial' ? 'text-[#D8B2A3]/90' : 'text-[#D8B2A3]/90'}`}>
                                                        Studiati per <strong className="text-white font-bold">stimolare la curiosità</strong> delle tue clienti e l'<strong className="text-white font-bold">acquisto dei tuoi servizi</strong>.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Divisore centrale su Desktop */}
                                            <div className="hidden lg:flex lg:col-span-2 justify-center items-center">
                                                <div className="w-[1px] h-32 bg-linear-to-b from-transparent via-white/20 to-transparent" />
                                            </div>

                                            {/* Colonna Destra: Altri Canali */}
                                            <div className="lg:col-span-5 space-y-5 bg-white/[0.02] p-6 md:p-8 rounded-[2rem] border border-white/5 relative group hover:bg-white/[0.04] transition-all duration-500 hover:border-[#5D6676]/20 shadow-xl">
                                                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#5D6676] to-[#5D6676] text-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl shadow-[#5D6676]/30 rotate-12 group-hover:rotate-6 transition-transform">
                                                    <span className="font-black text-2xl font-[family-name:var(--font-montserrat)]">+6</span>
                                                </div>
                                                <h3 className="text-2xl md:text-4xl font-semibold font-[family-name:var(--font-montserrat)] text-white flex items-center gap-3 drop-shadow-md leading-tight mb-2">
                                                    Cambia il tuo Mood
                                                </h3>
                                                <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
                                                    Qui sotto, hai a disposizione altri <strong className="text-[#5D6676] font-semibold">6 canali settoriali</strong>, per cambiare il tuo mood musicale in istituto durante la giornata.
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
                                                    <p className={`font-bold font-[family-name:var(--font-montserrat)] tracking-wider uppercase text-lg flex items-center gap-2 ${profile?.plan_type === 'free_trial' ? 'text-[#D8B2A3]' : 'text-[#D8B2A3]'}`}>
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

                        <div className="relative w-full py-20 -mx-4 px-4 sm:mx-0 sm:px-0 mt-8 mb-12" style={{ width: 'calc(100% + 2rem)' }}>
                            {/* Sfondo sfumato bianco dall'alto più visibile e diffuso */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none -z-10 rounded-[3rem]" />
                            {/* Bagliore alto */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-72 bg-white/5 blur-[100px] pointer-events-none -z-10" />
                            {/* Bagliore basso per diffonderlo in fondo */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] max-w-4xl h-72 bg-white/5 blur-[120px] pointer-events-none -z-10" />

                            <ChannelGrid2 initialChannels={channels || []} serverError={channelsError?.message} planType={profile?.plan_type} />
                        </div>

                        {/* Upgrade Form for Free Trial and Basic Users */}
                        {(profile?.plan_type === 'free_trial' || profile?.plan_type === 'basic') && !isAdmin && (
                            <div className="w-full max-w-4xl mx-auto mt-0 md:mt-16 border-t border-white/10 pt-4 md:pt-16">
                                {(profile?.plan_type === 'basic' || profile?.plan_type === 'free_trial') && (
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
