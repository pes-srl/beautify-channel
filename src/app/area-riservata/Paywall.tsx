"use client";

import { useState } from "react";
import { Lock, Sparkles, ArrowRight, ChevronDown, ChevronUp, Music, ShieldCheck, Radio } from "lucide-react";
import { UpgradeCheckoutForm } from "@/components/draft2026/UpgradeCheckoutForm";
import { Montserrat } from "next/font/google";
import { FeedbackBlock } from "@/components/draft2026/FeedbackBlock";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600"] });

interface PaywallProps {
    salonName: string;
    userEmail?: string;
    isTrial?: boolean;
}

export function Paywall({ salonName, userEmail, isTrial = true }: PaywallProps) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="relative w-full overflow-hidden min-h-screen flex flex-col items-center">
            {/* Background Glows - Global Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-rose-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* FULL WIDTH HERO IMAGE (UNIVERSAL) */}
            <div className="w-full relative h-[40vh] md:h-[75vh] mb-12 flex justify-center border-b border-white/5">
                <img 
                    src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772477085817-oajaaf.png" 
                    alt="Beautify Channel Hero" 
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-0 left-0 w-full h-full flex items-end pb-12 md:pb-24 px-6 md:px-12 z-20">
                    <div className="w-full max-w-7xl mx-auto">
                        <h1 className={`text-4xl md:text-5xl lg:text-7xl font-semibold text-white leading-[1.1] mb-2 md:mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight ${montserrat.className} max-w-3xl animate-in fade-in slide-in-from-left-8 duration-1000`}>
                            COME FAI SENZA BEAUTIFY?
                        </h1>
                    </div>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-20 flex flex-col items-center">
                {/* Main Title Section */}
                <div className="text-center mb-16 relative">
                    <div className="inline-block relative animate-in fade-in slide-in-from-top-8 duration-1000">
                        <h2 className={`flex flex-col md:flex-row items-center gap-3 md:gap-8 text-white uppercase tracking-[0.3em] font-light text-sm md:text-base ${montserrat.className}`}>
                            {isTrial ? (
                                <>
                                    <span className="opacity-60 whitespace-nowrap">Ciao, la tua prova gratuita di 7 giorni</span>
                                    <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff7393] to-rose-400 tracking-tight text-2xl md:text-4xl lg:text-5xl h-auto flex items-center leading-none py-1">
                                        È SCADUTA!
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="opacity-60 whitespace-nowrap">Il tuo abbonamento</span>
                                    <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500 tracking-tighter text-2xl md:text-4xl lg:text-5xl h-auto flex items-center leading-none py-1">
                                        È SCADUTO
                                    </span>
                                </>
                            )}
                        </h2>
                    </div>
                    {!isTrial && (
                        <p className="text-red-500/60 font-black tracking-[0.5em] uppercase text-[10px] mt-8 animate-pulse">L'ACCESSO AI CANALI È BLOCCATO</p>
                    )}
                </div>

                {/* BLOCK 1: SUBSCRIPTION INVITATION */}
                <div className="max-w-4xl w-full mx-auto px-4 mb-16">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-500/5 via-fuchsia-500/5 to-rose-500/5 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        
                        <div className="relative bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent blur-xl pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-fuchsia-500/5 to-transparent blur-xl pointer-events-none" />

                            <div className="text-center relative z-10 flex flex-col gap-10">
                                <div className="space-y-4">
                                    <Sparkles className="w-8 h-8 text-[#ff7393]/60 mx-auto mb-2 animate-pulse" />
                                    {isTrial ? (
                                        <p className={`text-2xl md:text-4xl font-bold leading-[1.25] text-white tracking-tight ${montserrat.className}`}>
                                            Ci piacerebbe rimanessi con noi, <br />
                                            qui sotto puoi abbonarti al nostro piano <br className="md:hidden" />
                                            <span className="relative inline-block mt-2">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7393] to-fuchsia-400 font-black">BASIC</span>
                                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff7393] to-transparent opacity-50" />
                                            </span>
                                        </p>
                                    ) : (
                                        <span className={`text-2xl md:text-4xl font-bold leading-tight text-white tracking-tight italic ${montserrat.className}`}>
                                            "Non lasciare il tuo salone in silenzio..."
                                        </span>
                                    )}
                                </div>

                                <div className="w-full flex flex-col items-center gap-6 pt-4 border-t border-white/5">
                                    {!showForm ? (
                                        <button
                                            onClick={() => setShowForm(true)}
                                            className="group relative px-8 py-4 md:px-10 md:py-5 bg-white rounded-full text-zinc-950 font-bold text-sm md:text-lg uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(255,255,255,0.1)] hover:bg-zinc-100 hover:scale-105 transition-all duration-500 active:scale-95 flex items-center gap-4"
                                        >
                                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-fuchsia-600 animate-pulse" />
                                            <span>{isTrial ? 'Attiva BASIC' : 'Riattiva Ora il Servizio'}</span>
                                            <div className="w-7 h-7 md:w-8 md:h-8 bg-zinc-900 rounded-full flex items-center justify-center">
                                                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-white group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </button>
                                    ) : (
                                        <div className="w-full animate-in fade-in slide-in-from-bottom-12 duration-1000">
                                            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-1 md:p-2 backdrop-blur-3xl relative overflow-hidden shadow-2xl">
                                                <div className="absolute top-0 right-0 p-4 md:p-6 z-20">
                                                    <button 
                                                        onClick={() => setShowForm(false)}
                                                        className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/10"
                                                    >
                                                        Chiudi <ChevronUp className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="p-2 md:p-8">
                                                    <UpgradeCheckoutForm userEmail={userEmail} userSalonName={salonName} planType="basic" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIGN-OFF BLOCK BETWEEN CARDS */}
                <div className="w-full flex flex-col items-center gap-2 mb-16 animate-in fade-in duration-1000 delay-300">
                    <p className="text-zinc-500 text-lg md:text-xl italic font-light">
                        {isTrial ? 'Grazie, speriamo di sentirti presto.' : 'Speriamo di riaverti presto con noi.'}
                    </p>
                    <span className={`text-xl md:text-2xl font-semibold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600 uppercase ${montserrat.className}`}>
                        Il Team BeautiFy
                    </span>
                </div>

                {/* BLOCK 2: FEEDBACK (Only for Trial users) */}
                {isTrial && (
                    <div className="max-w-4xl w-full mx-auto px-4 mb-20 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        <div className="relative bg-white/[0.015] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden group">
                            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent blur-xl pointer-events-none" />
                            <div className="relative z-10">
                                <FeedbackBlock userEmail={userEmail} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Permanent Footer Content */}
                <div className="mt-10 w-full flex flex-col items-center gap-16 px-4">
                    <div className="text-center flex flex-col items-center pb-20">
                        <p className="text-zinc-400 text-[11px] md:text-[13px] uppercase tracking-[0.3em] font-light mb-6 opacity-80">
                            Hai bisogno di assistenza?
                        </p>
                        <a 
                            href="https://wa.me/393513364402" 
                            target="_blank" 
                            className="group relative px-6 py-3.5 md:px-8 md:py-4 bg-emerald-500/5 border border-emerald-500/20 rounded-full text-emerald-400 font-bold text-[11px] md:text-sm uppercase tracking-[0.2em] hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-500 flex items-center gap-3 overflow-hidden"
                        >
                            <span className="block whitespace-nowrap">Parla con un consulente su WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
