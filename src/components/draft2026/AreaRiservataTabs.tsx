"use client";

import { useState } from "react";
import { Play, Radio, Sparkles, Lock, ChevronDown } from "lucide-react";
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
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const activeColor = profile?.plan_type === 'free_trial' ? 'text-purple-400' : 'text-white';
    const activeFillColor = profile?.plan_type === 'free_trial' ? 'text-purple-400 fill-purple-400' : 'text-white fill-white';
    const hoverColor = profile?.plan_type === 'free_trial' ? 'group-hover:text-purple-400' : 'group-hover:text-white';

    return (
        <div className="w-full max-w-4xl mx-auto mt-6 mb-4 md:mb-24 px-4 overflow-x-hidden">
            <div className="flex flex-col border-t border-white/10">

                {/* 1. COME FUNZIONA */}
                <div className="border-b border-white/10">
                    <button
                        onClick={() => toggleSection('funziona')}
                        className="w-full py-6 flex items-center justify-between text-left group transition-colors hover:bg-white/[0.02]"
                    >
                        <div className="flex items-center gap-4">
                            <Play className={`w-5 h-5 ${openSection === 'funziona' ? activeFillColor : `text-zinc-400 ${hoverColor}`}`} />
                            <span className={`text-lg md:text-xl font-medium tracking-wide transition-colors ${openSection === 'funziona' ? activeColor : `text-zinc-400 ${hoverColor}`}`}>
                                Come Funziona
                            </span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${openSection === 'funziona' ? `rotate-180 ${activeColor}` : ''}`} />
                    </button>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'funziona' ? 'max-h-[2000px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                        <div className="px-4 py-4 md:px-6 lg:px-12 md:py-8 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl border border-white/5 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                                {/* LEFT COLUMN */}
                                <div className="text-base md:text-lg font-light leading-relaxed text-zinc-300 flex flex-col justify-center">
                                    <p className="mb-6">Nulla di più semplice!<br />
                                        Collega il tuo dispositivo all'<strong className="text-white">impianto audio</strong> o a delle <strong className="text-white">casse Bluetooth</strong>.</p>

                                    <p className="mb-8">Premi play sul canale primario qui sopra, imposta il giusto volume in salone e <strong className="text-white">dimenticatene</strong>, il resto lo fa <strong className="text-white">BeautiFy</strong>.</p>

                                    <div className={`pl-4 border-l ${profile?.plan_type === 'premium' ? 'border-amber-500/30' : 'border-white/20'} py-1`}>
                                    <p className="mb-6">
                                        I nostri canali propongono una raffinata selezione musicale, intervallata da eleganti suggerimenti vocali studiati per stimolare la curiosità delle clienti e l'acquisto.
                                    </p>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN */}
                                <div className="bg-black/20 rounded-xl p-6 md:p-8 relative border border-white/5">
                                    <h3 className="text-xl md:text-2xl font-medium text-white mb-2">Cambia il tuo Mood</h3>
                                    <p className="text-sm md:text-base text-zinc-400 font-light mb-6">
                                        Hai a disposizione altri 6 canali monotematici, per cambiare il genere musicale durante la giornata.
                                    </p>
                                    <div className="space-y-4 mb-6 text-zinc-300 text-sm font-light">
                                        <p>Prova <strong>DEEP SOFT</strong> nel weekend o <strong>JAZZ</strong> nel tardo pomeriggio oppure i temi <strong>RELAX</strong> e <strong>MASSAGE</strong>.</p>
                                    </div>
                                    <div className="pt-2 flex items-center gap-2">
                                        <Radio className="w-4 h-4 text-white/50" />
                                        <p className="font-medium tracking-widest uppercase text-xs text-white/50">
                                            BUON ASCOLTO
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. ALTRI CANALI */}
                <div className="border-b border-white/10">
                    <button
                        onClick={() => toggleSection('canali')}
                        className="w-full py-6 flex items-center justify-between text-left group transition-colors hover:bg-white/[0.02]"
                    >
                        <div className="flex items-center gap-4">
                            <Radio className={`w-5 h-5 ${openSection === 'canali' ? activeColor : `text-zinc-400 ${hoverColor}`}`} />
                            <span className={`text-lg md:text-xl font-medium tracking-wide transition-colors ${openSection === 'canali' ? activeColor : `text-zinc-400 ${hoverColor}`}`}>
                                Altri Canali
                            </span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${openSection === 'canali' ? `rotate-180 ${activeColor}` : ''}`} />
                    </button>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'canali' ? 'max-h-[2000px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                        <div className="pt-4 pb-8 relative w-full">
                            {/* Minimal subtile glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-32 bg-white/[0.03] blur-[50px] pointer-events-none -z-10" />
                            <ChannelGrid2 initialChannels={channels || []} serverError={channelsError?.message} planType={profile?.plan_type} />
                        </div>
                    </div>
                </div>

                {/* 3. POTENZIA (FREE TRIAL & BASIC) */}
                {(profile?.plan_type === 'free_trial' || profile?.plan_type === 'basic') && (
                    <div className="border-b border-white/10">
                        <button
                            onClick={() => toggleSection('potenzia')}
                            className="w-full py-6 flex items-center justify-between text-left group transition-colors hover:bg-white/[0.02]"
                        >
                            <div className="flex items-center gap-4">
                                <Sparkles className={`w-5 h-5 ${openSection === 'potenzia' ? 'text-purple-400' : 'text-zinc-400 group-hover:text-purple-400'}`} />
                                <span className={`text-lg md:text-xl font-medium tracking-wide transition-colors ${openSection === 'potenzia' ? 'text-purple-400' : 'text-zinc-400 group-hover:text-purple-400'}`}>
                                    Potenzia il Servizio
                                </span>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${openSection === 'potenzia' ? 'rotate-180 text-purple-400' : ''}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'potenzia' ? 'max-h-[2000px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                            <div className="px-4 py-4 md:px-6 lg:px-12 md:py-8 bg-gradient-to-b from-[#ff5a7e]/[0.02] to-transparent rounded-2xl border border-white/5 relative">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                                    {/* LEFT COLUMN */}
                                    <div className="text-base md:text-lg font-light leading-relaxed text-zinc-300 flex flex-col justify-center">
                                        <h3 className="text-xl md:text-2xl font-medium text-white mb-6">Il segreto di un'atmosfera perfetta</h3>
                                        <p className="mb-6">
                                            Con il <strong className="text-white">Piano Basic</strong> di BeautiFy Channel, trasformi l'attesa e i trattamenti in una vera e propria esperienza sensoriale, curata da esperti del settore.
                                        </p>

                                        <ul className="mb-8 space-y-4 text-sm md:text-base">
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                                                <span><strong className="text-white">Ininterrotta e Senza Annunci:</strong> Niente stacchi di radio locali o pubblicità.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                                                <span><strong className="text-white">6 Canali Tematici:</strong> L'atmosfera perfetta per ogni momento.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                                                <span><strong className="text-white">Suggerimenti Vocali Generici:</strong> Delicate voci fuoricampo che ispirano le clienti.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* RIGHT COLUMN */}
                                    <div className="bg-gradient-to-br from-zinc-900/40 to-black/40 rounded-xl p-6 md:p-10 relative border border-white/5 flex flex-col items-center justify-center text-center overflow-hidden min-h-[300px]">
                                        {/* Background Glow */}
                                        <div className="absolute inset-0 bg-amber-500/5 blur-[60px] rounded-full pointer-events-none" />
                                        
                                        <div className="relative z-10">
                                            <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#F8BBD0] to-[#DDA0DD] mb-6 drop-shadow-2xl">
                                                STAY TUNED!
                                            </h3>

                                            <p className="text-base md:text-xl text-zinc-300 font-medium leading-relaxed max-w-sm mx-auto mb-8">
                                                I servizi e le opportunità <span className="text-white font-bold">BeautiFy</span> sono in continuo ampliamento.
                                            </p>

                                            <div className="flex flex-col gap-3 items-center">
                                                <div className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm md:text-base text-zinc-400 font-semibold tracking-wide uppercase">
                                                    Prossimamente in arrivo:
                                                </div>
                                                <div className="flex flex-wrap justify-center gap-4 mt-2">
                                                    <span className="text-lg md:text-xl font-bold text-white tracking-tight">Laser Channel</span>
                                                    <span className="text-lg md:text-xl font-bold text-white tracking-tight">Cosmetic Channel</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. AGGIORNA (FREE TRIAL & BASIC) */}
                {(profile?.plan_type === 'free_trial' || profile?.plan_type === 'basic') && (
                    <div className="border-b border-white/10">
                        <button
                            onClick={() => toggleSection('aggiorna')}
                            className="w-full py-6 flex items-center justify-between text-left group transition-colors hover:bg-white/[0.02]"
                        >
                            <div className="flex items-center gap-4">
                                <Lock className={`w-5 h-5 ${openSection === 'aggiorna' ? 'text-purple-400' : 'text-zinc-400 group-hover:text-purple-400'}`} />
                                <span className={`text-lg md:text-xl font-medium tracking-wide transition-colors ${openSection === 'aggiorna' ? 'text-purple-400' : 'text-zinc-400 group-hover:text-purple-400'}`}>
                                    Aggiorna L'Esperienza
                                </span>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${openSection === 'aggiorna' ? 'rotate-180 text-purple-400' : ''}`} />
                        </button>

                        <div id="scegli-piano-section" className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'aggiorna' ? 'max-h-[3000px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                            <div className="px-0 py-4">
                                <UpgradeCheckoutForm userEmail={user?.email} userVat={profile?.partita_iva} userSalonName={profile?.salon_name as string} planType={profile?.plan_type} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
