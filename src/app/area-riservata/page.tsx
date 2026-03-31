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
import { AreaRiservataTabs } from "@/components/draft2026/AreaRiservataTabs";
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
        .select("salon_name, role, plan_type, trial_ends_at, subscription_expiration")
        .eq("id", user.id)
        .single();

    let profile = dbProfile ? { ...dbProfile, partita_iva: user?.user_metadata?.partita_iva || null } : {
        salon_name: user?.user_metadata?.salon_name || null,
        role: 'User',
        plan_type: user?.user_metadata?.plan_type || 'free',
        trial_ends_at: user?.user_metadata?.trial_ends_at || null,
        subscription_expiration: user?.user_metadata?.subscription_expiration || null,
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

    let formattedBasicExpiration = null;
    if (profile?.plan_type === 'basic' && profile?.subscription_expiration) {
        const expDate = new Date(profile.subscription_expiration);
        // Format as DD/MM/YYYY
        formattedBasicExpiration = new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(expDate);
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
        <div className="pt-[7rem] pb-6 md:pb-32 min-h-screen relative w-full bg-[#0f0518] selection:bg-[#D8B2A3]/30">
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
                    <div className="w-full max-w-4xl mx-auto mt-4 md:mt-24 mb-12 md:mb-16 flex flex-col gap-6 items-center px-4">
                        {/* SLEEK HORIZONTAL WELCOME BANNER (NOW ONLY THE BADGE) */}
                        <div className="w-full sm:w-[550px] md:w-[650px] mx-auto bg-gradient-to-r from-[#0f0518]/80 via-[#2a1154]/60 to-[#ff5a7e]/10 border border-white/5 rounded-[2rem] p-6 md:p-10 text-left shadow-2xl flex flex-col items-center justify-center gap-6 backdrop-blur-xl relative overflow-hidden mt-0 md:mt-12">
                            {/* Decorative background glow */}
                            <div className="absolute inset-0 bg-[#ff5a7e]/5 blur-[80px] rounded-full pointer-events-none" />

                            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 relative z-10 w-full">
                                <div className="text-center sm:text-left flex-1">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                                        La tua formula Free Trial è stata attivata.
                                    </h3>
                                    <span className="text-zinc-400 text-sm md:text-base italic block mt-1 leading-tight">
                                        <span className="text-purple-400 font-bold text-lg md:text-xl">{daysLeft}</span> {daysLeft === 1 ? 'giorno' : 'giorni'} alla scadenza della tua prova gratuita
                                    </span>
                                </div>
                                <a
                                    href="#scegli-piano-section"
                                    className="bg-white text-black font-bold uppercase tracking-widest text-xs md:text-sm px-6 py-4 md:px-8 md:py-5 rounded-full hover:scale-105 transition-transform flex items-center justify-center shrink-0 w-full sm:w-auto mt-4 sm:mt-0 shadow-xl shadow-white/20 whitespace-nowrap"
                                >
                                    SCEGLI UN PIANO
                                </a>
                            </div>
                        </div>

                        {/* Elegant Divider */}
                        <div className="flex items-center justify-center w-full mt-8 md:mt-12 relative">
                            {/* Core line */}
                            <div className="w-[95%] max-w-6xl h-[2px] rounded-full z-10 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                            {/* Glow effect */}
                            <div className="absolute w-[95%] max-w-6xl h-[8px] blur-[6px] rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>

                        {/* QUESTO E IL TUO CANALE AUDIO PRINCIPALE */}
                        <div className="mt-16 mb-0 flex flex-col items-center">
                            <h3 className="text-zinc-400 font-medium tracking-tight text-center text-base md:text-xl lg:text-2xl mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] max-w-4xl mx-auto leading-relaxed">
                                QUESTO È IL TUO CANALE PRIMARIO (multitematico). <br className="hidden md:block" />
                                Ma in momenti particolari potrai utilizzare i 6 canali monotematici che trovi qui sotto, selezionando altri mood musicali.
                            </h3>
                            <div className="w-16 h-16 rounded-full border-2 border-zinc-400/50 flex items-center justify-center bg-zinc-400/10 backdrop-blur-md shadow-[0_0_40px_rgba(255,255,255,0.1)] animate-bounce">
                                <ArrowDown className="w-8 h-8 text-zinc-400" />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* HEADERS FOR BASIC USERS ONLY */}
                {!isAdmin && profile?.plan_type === 'basic' && !isExpired && (
                    <div className="w-full max-w-4xl mx-auto mt-4 md:mt-24 mb-12 md:mb-16 flex flex-col gap-6 items-center px-4">
                        
                        {/* SLEEK HORIZONTAL BANNER FOR BASIC */}
                        <div className="w-full sm:w-[550px] md:w-[650px] mx-auto bg-gradient-to-r from-[#0f0518]/80 via-zinc-900/60 to-[#ff7393]/10 border border-white/5 rounded-[2rem] p-6 md:p-10 text-left shadow-2xl flex flex-col items-center justify-center gap-6 backdrop-blur-xl relative overflow-hidden mt-0 md:mt-12">
                            {/* Decorative background glow */}
                            <div className="absolute inset-0 bg-[#ff7393]/5 blur-[80px] rounded-full pointer-events-none" />

                            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 relative z-10 w-full">
                                <div className="text-center sm:text-left flex-1">
                                    <span className="text-zinc-400 text-xs md:text-sm uppercase tracking-[0.2em] font-medium block mb-1">
                                        Il Tuo Piano
                                    </span>
                                    <h3 className="text-3xl md:text-5xl font-black text-[#ff7393] uppercase tracking-wider leading-none mb-2 drop-shadow-lg">
                                        BASIC
                                    </h3>
                                    <span className="text-[#ff7393]/80 text-sm md:text-base font-bold block mb-1">
                                        E' ATTIVO
                                    </span>
                                    {formattedBasicExpiration ? (
                                        <span className="text-zinc-400 text-sm md:text-base italic block mt-3 leading-tight">
                                            Scade il <span className="text-[#ff7393] font-bold text-lg md:text-xl">{formattedBasicExpiration}</span>
                                        </span>
                                    ) : (
                                        <span className="text-zinc-400 text-sm md:text-base italic block mt-3 leading-tight">
                                            Abbonamento in corso
                                        </span>
                                    )}
                                </div>
                                <a
                                    href="#scegli-piano-section"
                                    className="bg-white text-black font-bold uppercase tracking-widest text-xs md:text-sm px-6 py-4 md:px-8 md:py-5 rounded-full hover:scale-105 transition-transform flex items-center justify-center shrink-0 w-full sm:w-auto mt-4 sm:mt-0 shadow-xl shadow-white/20 whitespace-nowrap"
                                >
                                    Fai Upgrade a PREMIUM
                                </a>
                            </div>
                        </div>

                        {/* Elegant Divider */}
                        <div className="flex items-center justify-center w-full mt-8 md:mt-12 relative">
                            {/* Core line */}
                            <div className="w-[95%] max-w-6xl h-[2px] rounded-full z-10 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                            {/* Glow effect */}
                            <div className="absolute w-[95%] max-w-6xl h-[8px] blur-[6px] rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>

                        {/* QUESTO E IL TUO CANALE AUDIO PRINCIPALE */}
                        <div className="mt-16 mb-0 flex flex-col items-center">
                            <h3 className="text-zinc-400 font-medium tracking-tight text-center text-base md:text-xl lg:text-2xl mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] max-w-4xl mx-auto leading-relaxed">
                                QUESTO È IL TUO CANALE PRIMARIO (multitematico). <br className="hidden md:block" />
                                Ma in momenti particolari potrai utilizzare i 6 canali monotematici che trovi qui sotto, selezionando altri mood musicali.
                            </h3>
                            <div className="w-16 h-16 rounded-full border-2 border-zinc-400/50 flex items-center justify-center bg-zinc-400/10 backdrop-blur-md shadow-[0_0_40px_rgba(255,255,255,0.1)] animate-bounce">
                                <ArrowDown className="w-8 h-8 text-zinc-400" />
                            </div>
                        </div>
                    </div>
                )}

                {/* GRAZIE BANNER FOR PREMIUM USERS (AND NOT BASIC NOW, BECAUSE BASIC SEES THE NEW HEADER) */}
                {!isAdmin && profile?.plan_type === 'premium' && !isExpired && (
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
                {profile?.plan_type === 'pending_sepa' ? (
                    <div className="w-full mt-24 mb-32 flex flex-col items-center justify-center text-center px-4 relative z-20">
                        <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-amber-900/20">
                            <svg className="w-10 h-10 text-amber-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-amber-500 uppercase tracking-tight mb-4 drop-shadow-lg">
                            MANDATO SEPA RICEVUTO
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed mb-8">
                            Grazie per aver completato la tua richiesta di addebito. Essendo un bonifico bancario (SEPA), la rete interbancaria impiegherà dai <strong>2 ai 5 giorni lavorativi</strong> per confermare il primo trasferimento.
                        </p>
                        
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-left max-w-lg w-full backdrop-blur-sm shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none" />
                            <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                Cosa succede adesso?
                            </h3>
                            <ul className="text-zinc-400 space-y-4 text-sm md:text-base font-medium">
                                <li className="flex gap-3"><span className="text-amber-500 shrink-0">1.</span> La tua banca sta verificando il mandato SEPA.</li>
                                <li className="flex gap-3"><span className="text-amber-500 shrink-0">2.</span> I fondi verranno approvati e trasferiti a Beautify.</li>
                                <li className="flex gap-3"><span className="text-amber-500 shrink-0">3.</span> Riceverai un'email con Licenza e Contratto in PDF.</li>
                                <li className="flex gap-3"><span className="text-amber-500 shrink-0">4.</span> Il canale si sbloccherà automaticamente in questa pagina.</li>
                            </ul>
                        </div>
                    </div>
                ) : (!isExpired || isAdmin) ? (
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

                        {/* DOWN ARROW */}
                        <div className="mt-4 mb-20 flex justify-center">
                            <div className="w-16 h-16 rounded-full border-2 border-zinc-500/30 flex items-center justify-center bg-zinc-500/10 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.05)] animate-bounce cursor-default">
                                <ArrowDown className="w-8 h-8 text-zinc-400" />
                            </div>
                        </div>

                        {/* TABS CONTAINER */}
                        <AreaRiservataTabs profile={profile} channels={channels} channelsError={channelsError} user={user} isAdmin={isAdmin} />
                        {/* END TABS CONTAINER */}

                        <AudioPlayer />
                    </>
                ) : (
                    <Paywall salonName={profile?.salon_name || user.email || 'Utente'} userEmail={user.email} />
                )}
            </div>
        </div>
    );
}
