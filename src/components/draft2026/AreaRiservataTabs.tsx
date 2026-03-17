"use client";

import { useState } from "react";
import { Play, Radio, Sparkles, Lock } from "lucide-react";
import { ChannelGrid2 } from "@/components/draft2026/ChannelGrid2";
import { UpgradeCheckoutForm } from "@/components/draft2026/UpgradeCheckoutForm";

interface AreaRiservataTabsProps {
    profile: any;
    channels: any[];
    channelsError?: any;
    user: any;
    isAdmin: boolean;
}

export function AreaRiservataTabs({ profile, channels, channelsError, user, isAdmin }: AreaRiservataTabsProps) {
    const [activeTab, setActiveTab] = useState("canali");

    return (
        <div className="w-full max-w-6xl mx-auto mt-6 mb-24 px-4">
            {/* TABS HEADER */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
                {/* TAB: COME FUNZIONA */}
                <button
                    onClick={() => setActiveTab("funziona")}
                    className={`flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm transition-all duration-300 border ${
                        activeTab === "funziona" 
                        ? (profile?.plan_type === 'premium' ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]" : "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]")
                        : "bg-white/[0.02] text-zinc-400 border-white/5 hover:bg-white/[0.05] hover:text-white"
                    }`}
                >
                    <Play className={`w-4 h-4 md:w-5 md:h-5 ${activeTab === "funziona" ? "fill-black" : "fill-transparent stroke-[2]"}`} />
                    Come Funziona
                </button>

                {/* TAB: ALTRI CANALI */}
                <button
                    onClick={() => setActiveTab("canali")}
                    className={`flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm transition-all duration-300 border ${
                        activeTab === "canali" 
                        ? (profile?.plan_type === 'premium' ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]" : profile?.plan_type === 'free_trial' ? "bg-fuchsia-500 text-white border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.3)]" : "bg-indigo-500 text-white border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]")
                        : "bg-white/[0.02] text-zinc-400 border-white/5 hover:bg-white/[0.05] hover:text-white"
                    }`}
                >
                    <Radio className="w-4 h-4 md:w-5 md:h-5" />
                    Altri Canali
                </button>

                {/* TAB: POTENZIA (ONLY FREE TRIAL) */}
                {profile?.plan_type === 'free_trial' && (
                    <button
                        onClick={() => setActiveTab("potenzia")}
                        className={`flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm transition-all duration-300 border ${
                            activeTab === "potenzia" 
                            ? "bg-[#ff5a7e] text-white border-[#ff5a7e] shadow-[0_0_20px_rgba(255,90,126,0.5)]"
                            : "bg-white/[0.02] text-zinc-400 border-white/5 hover:bg-white/[0.05] hover:text-white"
                        }`}
                    >
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                        Potenzia il Servizio
                    </button>
                )}

                {/* TAB: AGGIORNA (ONLY FREE TRIAL) */}
                {profile?.plan_type === 'free_trial' && (
                    <button
                        onClick={() => setActiveTab("aggiorna")}
                        className={`flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm transition-all duration-300 border ${
                            activeTab === "aggiorna" 
                            ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                            : "bg-white/[0.02] text-zinc-400 border-white/5 hover:bg-white/[0.05] hover:text-white"
                        }`}
                    >
                        <Lock className="w-4 h-4 md:w-5 md:h-5" />
                        Aggiorna L'Esperienza
                    </button>
                )}
            </div>

            {/* TAB CONTENT AREA */}
            <div className="relative w-full">
                
                {/* 1. COME FUNZIONA CONTENT */}
                {activeTab === "funziona" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full xl:w-5/6 mx-auto">
                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                                {/* LEFT COLUMN */}
                                <div className="text-lg md:text-xl font-light leading-relaxed text-zinc-300 flex flex-col justify-center">
                                    <p className="mb-6">Nulla di più semplice!<br />
                                    Collega il tuo pc / smartphone / tablet all'<strong className="text-white">impianto audio</strong> del tuo istituto o a delle <strong className="text-white">casse Bluetooth</strong>.</p>
                                    
                                    <p className="mb-8">Premi play sul canale principale qui sopra, imposta il giusto volume in salone e <strong className="text-white">dimenticatene</strong>, il resto lo fa <strong className="text-white">BeautiFy</strong>.</p>
                                    
                                    <div className={`pl-5 md:pl-6 border-l-2 ${profile?.plan_type === 'premium' ? 'border-amber-500/30' : 'border-purple-500/40'} py-1`}>
                                        <p>I nostri canali audio propongono una <strong className="text-white">raffinata selezione di diversi generi musicali</strong>, intervallata da <strong className="text-white">eleganti, delicati e generici suggerimenti vocali</strong>.</p>
                                        <p className="mt-4">Studiati per <strong className="text-white">stimolare la curiosità</strong> delle tue clienti e l'<strong className="text-white">acquisto dei tuoi servizi</strong>.</p>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN */}
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
                )}

                {/* 2. ALTRI CANALI CONTENT */}
                {activeTab === "canali" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full xl:w-[90%] mx-auto">
                        <div className="relative w-full py-12 md:py-20 -mx-4 px-4 sm:mx-0 sm:px-0 mt-2 mb-6" style={{ width: 'calc(100% + 2rem)' }}>
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none -z-10 rounded-[3rem]" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-72 bg-white/5 blur-[100px] pointer-events-none -z-10" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] max-w-4xl h-72 bg-white/5 blur-[120px] pointer-events-none -z-10" />
                            
                            <ChannelGrid2 initialChannels={channels || []} serverError={channelsError?.message} planType={profile?.plan_type} />
                        </div>
                    </div>
                )}

                {/* 3. POTENZIA CONTENT */}
                {activeTab === "potenzia" && profile?.plan_type === 'free_trial' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full xl:w-5/6 mx-auto">
                        <div className="bg-[#ff5a7e]/[0.02] backdrop-blur-xl border border-[#ff5a7e]/20 rounded-[2rem] p-6 md:p-10 shadow-[0_0_30px_rgba(255,90,126,0.05)]">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                                {/* LEFT COLUMN */}
                                <div className="text-lg md:text-xl font-light leading-relaxed text-zinc-300 flex flex-col justify-center">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Il segreto di un'atmosfera perfetta</h3>
                                    <p className="mb-6">
                                        Con il <strong className="text-white">Piano Basic</strong> di BeautiFy Channel, trasformi l'attesa e i trattamenti in una vera e propria esperienza sensoriale. Non dovrai più preoccuparti di scegliere la musica giusta: i nostri palinsesti sono <strong className="text-white">curati da esperti del settore</strong> per accompagnare ogni momento della giornata nel tuo salone.
                                    </p>
                                    
                                    <ul className="mb-8 space-y-4">
                                        <li className="flex items-start gap-3">
                                            <Radio className="w-6 h-6 text-[#ff5a7e] shrink-0 mt-1" />
                                            <span><strong className="text-white">Musica Ininterrotta e Senza Annunci:</strong> Niente stacchi di radio locali o pubblicità esterne che spezzano la magia.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Radio className="w-6 h-6 text-[#ff5a7e] shrink-0 mt-1" />
                                            <span><strong className="text-white">7 Canali Tematici:</strong> L'atmosfera perfetta per ogni momento e trattamento, che potrai cambiare con un click.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Radio className="w-6 h-6 text-[#ff5a7e] shrink-0 mt-1" />
                                            <span><strong className="text-white">Suggerimenti Vocali Generici:</strong> Delicate e professionali voci fuoricampo che valorizzano i benefici dei trattamenti estetici per ispirare le clienti.</span>
                                        </li>
                                    </ul>
                                    
                                    <div className={`pl-5 md:pl-6 border-l-2 border-[#ff5a7e]/40 py-1`}>
                                        <p className="italic text-zinc-400">Eleva la percezione del tuo istituto fin dal primo ascolto, rendendo ogni permanenza memorabile e rilassante.</p>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN */}
                                <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 md:p-8 relative shadow-[0_0_30px_rgba(251,191,36,0.05)] overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                                    
                                    <div className="flex items-center gap-3 mb-6 relative z-10">
                                        <Sparkles className="w-8 h-8 text-amber-400" />
                                        <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">Premium</h3>
                                    </div>
                                    
                                    <h4 className="text-xl text-amber-300 font-semibold mb-4 relative z-10">
                                        Il Tuo Suono, Le Tue Promozioni
                                    </h4>
                                    
                                    <p className="text-base md:text-lg text-zinc-300 font-light mb-6 leading-relaxed relative z-10">
                                        Pianifichi offerte mensili, pacchetti esclusivi o nuovi trattamenti? Fai in modo che tutte le tue clienti <strong className="text-white">lo scoprano nel modo più elegante possibile</strong>, mentre sono comodamente sedute nel tuo istituto.
                                    </p>
                                    
                                    <div className="bg-black/40 p-5 rounded-[1.25rem] border border-amber-500/20 mb-6 relative z-10">
                                        <ul className="space-y-4">
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                                                <span className="text-zinc-200">
                                                    <strong className="text-white">Messaggi Promozionali Personalizzati:</strong> Inviaci i testi delle tue promo, i nostri speaker professionisti li registreranno per te!
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                                                <span className="text-zinc-200">
                                                    <strong className="text-white">Trasmissione Automatica:</strong> Le tue promozioni verranno inserite in rotazione direttamente nel canale musicale principale.
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    <div className="pt-2 relative z-10">
                                        <p className="text-sm font-medium text-amber-500 uppercase tracking-widest">
                                            LA RADIO UFFICIALE DEL TUO SALONE
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. AGGIORNA CONTENT */}
                {activeTab === "aggiorna" && profile?.plan_type === 'free_trial' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full md:w-3/4 mx-auto" id="scegli-piano-section">
                        <div className="bg-emerald-500/[0.02] backdrop-blur-xl border border-emerald-500/20 rounded-[2rem] p-6 md:p-10 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                            <UpgradeCheckoutForm userEmail={user?.email} userVat={profile?.partita_iva} userSalonName={profile?.salon_name as string} planType={profile?.plan_type} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
