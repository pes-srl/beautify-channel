"use client";

import { useState } from "react";
import { Play, Radio, Sparkles, Lock, ChevronDown, Lightbulb, Clock, Music } from "lucide-react";
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
                                {(profile?.plan_type === 'basic' || profile?.plan_type === 'free_trial') ? (
                                    <Lightbulb className={`w-5 h-5 ${openSection === 'potenzia' ? (profile?.plan_type === 'basic' ? 'text-[#ff7393]' : 'text-purple-400') : `text-zinc-400 ${profile?.plan_type === 'basic' ? 'group-hover:text-[#ff7393]' : 'group-hover:text-purple-400'}`}`} />
                                ) : (
                                    <Sparkles className={`w-5 h-5 ${openSection === 'potenzia' ? 'text-purple-400' : 'text-zinc-400 group-hover:text-purple-400'}`} />
                                )}
                                <span className={`text-lg md:text-xl font-medium tracking-wide transition-colors ${openSection === 'potenzia' ? (profile?.plan_type === 'basic' ? 'text-[#ff7393]' : 'text-purple-400') : `text-zinc-400 ${profile?.plan_type === 'basic' ? 'group-hover:text-[#ff7393]' : 'group-hover:text-purple-400'}`}`}>
                                    Come sfruttare pienamente il servizio BeautiFy
                                </span>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${openSection === 'potenzia' ? `rotate-180 ${profile?.plan_type === 'basic' ? 'text-[#ff7393]' : 'text-purple-400'}` : ''}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'potenzia' ? 'max-h-[2000px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                            <div className={`px-4 py-4 md:px-6 lg:px-12 md:py-8 bg-gradient-to-b ${profile?.plan_type === 'basic' ? 'from-[#ff7393]/[0.02]' : 'from-[#ff5a7e]/[0.02]'} to-transparent rounded-2xl border border-white/5 relative`}>
                                <div className={`${(profile?.plan_type === 'basic' || profile?.plan_type === 'free_trial') ? 'w-full' : 'grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16'}`}>
                                    {/* LEFT COLUMN: Atmosphere / Service Benefits */}
                                {(profile?.plan_type === 'free_trial' || profile?.plan_type === 'basic') ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 py-4">
                                        {/* Example 1: Crema Over 50 */}
                                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-500">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <Sparkles className="w-12 h-12 text-white" />
                                            </div>
                                            <div className="relative z-10">
                                                <span className={`inline-block px-3 py-1 rounded-full ${profile?.plan_type === 'basic' ? 'bg-[#ff7393]/20 text-[#ff7393]' : 'bg-purple-400/20 text-purple-400'} text-xs font-bold tracking-widest uppercase mb-4`}>Esempio Pratico</span>
                                                <h4 className="text-xl font-bold text-white mb-4 leading-snug">Promozione Crema Over 50</h4>
                                                <p className="text-zinc-400 text-sm md:text-base mb-6 font-light italic leading-relaxed">
                                                    Ti è appena arrivata una nuovissima crema per pelli over 50 e vorresti promuoverla in modo discreto ed elegante alle tue clienti mentre stanno facendo altri trattamenti…
                                                </p>
                                                <div className={`text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase ${profile?.plan_type === 'basic' ? 'text-[#ff7393]' : 'text-purple-400'} mb-4 ml-1`}>
                                                    PRENDI SPUNTO DALLE PROMO SONORE COME:
                                                </div>
                                                <div className={`bg-black/40 rounded-xl p-5 border-l-4 ${profile?.plan_type === 'basic' ? 'border-[#ff7393]/50' : 'border-purple-400/50'} mb-6 italic text-white/90 font-medium leading-relaxed`}>
                                                    “La tua pelle sembra spenta e opaca? I nostri trattamenti rivitalizzano e nutrono la pelle, restituendole freschezza e luminosità. Ideali per dare un boost di vitalità. Chiedi al nostro staff la migliore soluzione per te.”
                                                </div>
                                                <div className="flex items-center gap-3 text-xs md:text-sm text-zinc-500 font-medium uppercase tracking-tighter">
                                                    <Clock className={`w-4 h-4 ${profile?.plan_type === 'basic' ? 'text-[#ff7393]' : 'text-purple-400'}`} />
                                                    L'assistente BeautiFy interviene così, ogni 15-20 minuti.
                                                </div>
                                            </div>
                                        </div>

                                        {/* Example 2: Prodotti Solari */}
                                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-500">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <Music className="w-12 h-12 text-white" />
                                            </div>
                                            <div className="relative z-10">
                                                <span className={`inline-block px-3 py-1 rounded-full ${profile?.plan_type === 'basic' ? 'bg-[#ff7393]/20 text-[#ff7393]' : 'bg-purple-400/20 text-purple-400'} text-xs font-bold tracking-widest uppercase mb-4`}>Esempio Pratico</span>
                                                <h4 className="text-xl font-bold text-white mb-4 leading-snug">Spinta Vendita Solari</h4>
                                                <p className="text-zinc-400 text-sm md:text-base mb-6 font-light italic leading-relaxed">
                                                    Vorresti promuovere, senza risultare invadente, la tua esclusiva linea di prodotti solari per spingerne l’acquisto d’impulso in vista dell’estate…
                                                </p>
                                                <div className={`text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase ${profile?.plan_type === 'basic' ? 'text-[#ff7393]' : 'text-purple-400'} mb-4 ml-1`}>
                                                    PRENDI SPUNTO DALLE PROMO SONORE COME:
                                                </div>
                                                <div className={`bg-black/40 rounded-xl p-5 border-l-4 ${profile?.plan_type === 'basic' ? 'border-[#ff7393]/50' : 'border-purple-400/50'} mb-6 italic text-white/90 font-medium leading-relaxed`}>
                                                    “Il sole può essere un allyato, se la pelle è pronta ad accoglierlo. Idratazione profonda e trattamenti nutrienti sono il miglior punto di partenza. Chiedi info al nostro staff.”
                                                </div>
                                                <div className="flex items-center gap-3 text-xs md:text-sm text-zinc-500 font-medium uppercase tracking-tighter">
                                                    <Clock className={`w-4 h-4 ${profile?.plan_type === 'basic' ? 'text-[#ff7393]' : 'text-purple-400'}`} />
                                                    L'assistente BeautiFy interviene così, ogni 15-20 minuti.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-base md:text-lg font-light leading-relaxed text-zinc-300 flex flex-col justify-center max-w-2xl mx-auto py-8">
                                        {/* For Premium / Others if they ever open this */}
                                        <h3 className="text-xl md:text-2xl font-medium text-white mb-6">Il segreto di un'atmosfera perfetta</h3>
                                        <p className="mb-6">
                                            Con il servizio BeautiFy Channel, trasformi l'attesa e i trattamenti in una vera e propria esperienza sensoriale.
                                        </p>
                                    </div>
                                )}

                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* 4. AGGIORNA (ONLY FREE TRIAL) */}
                {(profile?.plan_type === 'free_trial') && (
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

                {/* STANDALONE STAY TUNED BLOCK FOR BASIC & FREE TRIAL USERS */}
                {(profile?.plan_type === 'basic' || profile?.plan_type === 'free_trial') && (
                    <div className="mt-8 mb-12 px-4 py-8 md:py-12 bg-gradient-to-br from-zinc-900/40 via-black/40 to-amber-500/5 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center overflow-hidden relative shadow-2xl">
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-amber-500/[0.03] blur-[80px] rounded-full pointer-events-none" />
                                        
                        <div className="relative z-10 max-w-2xl">
                            <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#F8BBD0] to-[#DDA0DD] mb-6 drop-shadow-2xl">
                                STAY TUNED!
                            </h3>

                            <p className="text-base md:text-xl text-zinc-300 font-medium leading-relaxed mb-10">
                                I servizi e le opportunità <span className="text-white font-bold">BeautiFy</span> sono in continuo ampliamento.
                            </p>

                            <div className="flex flex-col gap-4 items-center">
                                <div className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-lg text-sm md:text-base text-zinc-400 font-bold tracking-[0.2em] uppercase">
                                    Prossimamente in arrivo:
                                </div>
                                <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-2">
                                    <div className="flex flex-col items-center gap-1 group">
                                        <span className="text-xl md:text-3xl font-black text-white tracking-tight group-hover:text-amber-400 transition-colors">Laser Channel</span>
                                        <div className="w-12 h-0.5 bg-amber-500/50 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                                    </div>
                                    <div className="flex flex-col items-center gap-1 group">
                                        <span className="text-xl md:text-3xl font-black text-white tracking-tight group-hover:text-[#ff7393] transition-colors">Cosmetic Channel</span>
                                        <div className="w-12 h-0.5 bg-[#ff7393]/50 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
