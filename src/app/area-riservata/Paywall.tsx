"use client";

import { useState } from "react";
import { Lock, Sparkles, ArrowRight, ChevronDown, ChevronUp, Music, ShieldCheck, Radio } from "lucide-react";
import { UpgradeCheckoutForm } from "@/components/draft2026/UpgradeCheckoutForm";
import { Montserrat } from "next/font/google";

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
                {/* Artistic Overlay for transition */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                {/* Text Overlay matching Homepage position */}
                <div className="absolute bottom-0 left-0 w-full h-full flex items-end pb-12 md:pb-24 px-6 md:px-12 z-20">
                    <div className="w-full max-w-7xl mx-auto">
                        <h1 className={`text-4xl md:text-5xl lg:text-7xl font-semibold text-white leading-[1.1] mb-2 md:mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight ${montserrat.className} max-w-3xl animate-in fade-in slide-in-from-left-8 duration-1000`}>
                            COME FAI SENZA BEAUTIFY?
                        </h1>
                    </div>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-20 flex flex-col items-center">

                {/* Main Title Section - Redesigned for Elegance matching the card */}
                <div className="text-center mb-16 relative">
                    <div className="inline-block relative group animate-in fade-in slide-in-from-top-8 duration-1000">
                        {/* Subtle glow behind the title badge */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-red-500/10 to-rose-500/10 blur-xl rounded-full opacity-50 block" />
                        
                        <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 px-8 md:px-12 py-5 md:py-6 rounded-full shadow-2xl">
                            <h2 className={`flex flex-col md:flex-row items-center gap-2 md:gap-4 text-white uppercase tracking-[0.2em] font-light text-sm md:text-base ${montserrat.className}`}>
                                {isTrial ? (
                                    <>
                                        <span className="opacity-70">Ciao, la tua prova gratuita</span>
                                        <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff7393] to-rose-400 tracking-tighter text-xl md:text-2xl h-8 flex items-center">
                                            BeautiFy Channel è scaduta!
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="opacity-70">Il tuo abbonamento</span>
                                        <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500 tracking-tighter text-xl md:text-2xl h-8 flex items-center">
                                            È SCADUTO
                                        </span>
                                    </>
                                )}
                            </h2>
                        </div>
                    </div>

                    {!isTrial && (
                        <p className="text-red-500/60 font-black tracking-[0.5em] uppercase text-[10px] mt-8 animate-pulse">L'ACCESSO AI CANALI È BLOCCATO</p>
                    )}
                </div>

                {/* Persuasive Text Section - Redesigned for Elegance */}
                <div className="max-w-4xl w-full mx-auto px-4 mb-20">
                    <div className="relative group">
                        {/* Decorative Background Glow for the Card */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-500/5 via-fuchsia-500/5 to-rose-500/5 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        
                        <div className="relative bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-2xl overflow-hidden">
                            {/* Subtle Corner Accents */}
                            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent blur-xl pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-fuchsia-500/5 to-transparent blur-xl pointer-events-none" />

                            <div className="text-center relative z-10">
                                {isTrial ? (
                                    <div className="flex flex-col gap-10">
                                        <div className="space-y-4">
                                            <Sparkles className="w-8 h-8 text-[#ff7393]/60 mx-auto mb-2 animate-pulse" />
                                            <p className={`text-2xl md:text-4xl font-bold leading-[1.25] text-white tracking-tight ${montserrat.className}`}>
                                                Ci piacerebbe rimanessi con noi, <br />
                                                qui sotto puoi abbonarti al nostro piano <br className="md:hidden" />
                                                <span className="relative inline-block mt-2">
                                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7393] to-fuchsia-400 font-black">BASIC</span>
                                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff7393] to-transparent opacity-50" />
                                                </span>
                                            </p>
                                        </div>

                                        <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed border-t border-white/5 pt-10">
                                            In caso contrario, ci piacerebbe sapere cosa non ti ha convinta, <br className="hidden md:block" /> 
                                            perché i feedback sono sempre <span className="text-zinc-300 italic">super benvenuti</span>.
                                        </p>

                                        <div className="pt-4 flex flex-col items-center gap-2">
                                            <p className="text-zinc-500 text-lg md:text-xl italic font-light">
                                                Grazie, speriamo di sentirti presto.
                                            </p>
                                            <span className={`text-xl md:text-2xl font-semibold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600 uppercase ${montserrat.className}`}>
                                                Il Team BeautiFy
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-10">
                                        <div className="space-y-4">
                                            <Sparkles className="w-8 h-8 text-[#ff7393]/60 mx-auto mb-2 animate-pulse" />
                                            <span className={`text-2xl md:text-4xl font-bold leading-tight text-white tracking-tight italic ${montserrat.className}`}>
                                                "Non lasciare il tuo salone in silenzio..."
                                            </span>
                                        </div>

                                        <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed border-t border-white/5 pt-10">
                                            Riattiva il piano <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7393] to-red-500 font-black uppercase underline decoration-fuchsia-500/20 underline-offset-8">BASIC</span> per utilizzare tutti i <br className="hidden md:block" /> 
                                            <span className="text-white font-bold border-b border-rose-500/30">canali musicali profilati</span> e le promozioni sonore per il tuo istituto.
                                        </p>

                                        <div className="pt-4 flex flex-col items-center gap-2">
                                            <p className="text-zinc-500 text-lg md:text-xl italic font-light">
                                                Speriamo di riaverti presto con noi.
                                            </p>
                                            <span className={`text-xl md:text-2xl font-semibold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600 uppercase ${montserrat.className}`}>
                                                Il Team BeautiFy
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center gap-10">
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="group relative px-8 py-4 md:px-10 md:py-5 bg-white rounded-full text-zinc-950 font-bold text-sm md:text-lg uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(255,255,255,0.1)] hover:bg-zinc-100 hover:scale-105 transition-all duration-500 active:scale-95 flex items-center gap-4"
                        >
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-fuchsia-600 animate-pulse" />
                            <span>{isTrial ? 'Attiva Ora il Servizio' : 'Riattiva Ora il Servizio'}</span>
                            <div className="w-7 h-7 md:w-8 md:h-8 bg-zinc-900 rounded-full flex items-center justify-center">
                                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-white group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    ) : (
                        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
                            <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-1 md:p-3 backdrop-blur-3xl relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-8 z-20">
                                    <button 
                                        onClick={() => setShowForm(false)}
                                        className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-full border border-white/10"
                                    >
                                        Chiudi <ChevronUp className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-4 md:p-10">
                                    <div className="mb-0">
                                        <UpgradeCheckoutForm userEmail={userEmail} userSalonName={salonName} planType="basic" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Permanent Footer Content: Elegant Minimalist Trust Signals + Support */}
                <div className="mt-20 w-full flex flex-col items-center gap-16 px-4">
                    {/* Minimalist Trust Signals */}
                    <div className="flex flex-wrap justify-center items-center gap-y-6 gap-x-8 md:gap-x-12 text-zinc-400 text-[10px] md:text-xs lg:text-sm font-bold uppercase tracking-[0.3em] max-w-5xl mx-auto">
                        <span className="flex items-center gap-2 md:gap-3 whitespace-nowrap"><Music className="w-4 h-4 md:w-5 md:h-5 text-zinc-500" /> 7 Mood Musicali</span>
                        <span className="hidden md:block h-5 w-[1px] bg-white/10"></span>
                        <span className="flex items-center gap-2 md:gap-3 whitespace-nowrap"><Radio className="w-4 h-4 md:w-5 md:h-5 text-zinc-500" /> Promo Sonore <span className="hidden lg:inline text-zinc-500 font-medium lowercase tracking-normal ml-1">per incentivare le vendite</span></span>
                        <span className="hidden md:block h-5 w-[1px] bg-white/10"></span>
                        <span className="flex items-center gap-2 md:gap-3 whitespace-nowrap"><ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-zinc-500" /> Licenza Musicale Inclusa</span>
                    </div>

                    {/* WhatsApp Support - Elegant Outline Style */}
                    <div className="text-center flex flex-col items-center pb-20">
                        <p className="text-zinc-400 text-[11px] md:text-[13px] uppercase tracking-[0.3em] font-light mb-6 opacity-80">
                            Hai bisogno di assistenza?
                        </p>
                        <a 
                            href="https://wa.me/393513364402" 
                            target="_blank" 
                            className="group relative px-6 py-3.5 md:px-8 md:py-4 bg-emerald-500/5 border border-emerald-500/20 rounded-full text-emerald-400 font-bold text-[11px] md:text-sm uppercase tracking-[0.2em] hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-500 flex items-center gap-3 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                            <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.335-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            <span className="block whitespace-nowrap">Parla con un consulente su WhatsApp</span>
                        </a>
                    </div>
                </div>


            </div>
        </div>
    );
}
