"use client";

import { useState } from "react";
import { Lock, Sparkles, ArrowRight, ChevronDown, ChevronUp, Music, ShieldCheck } from "lucide-react";
import { UpgradeCheckoutForm } from "@/components/draft2026/UpgradeCheckoutForm";

interface PaywallProps {
    salonName: string;
    userEmail?: string;
    isTrial?: boolean;
}

export function Paywall({ salonName, userEmail, isTrial = true }: PaywallProps) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="relative w-full max-w-5xl mx-auto px-4 py-12 md:py-20 overflow-hidden min-h-[600px] flex flex-col items-center justify-center">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-fuchsia-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
                {/* Main Title Section */}
                <div className="text-center mb-0 relative">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-rose-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(225,29,72,0.3)] border border-red-400/30 group hover:scale-110 transition-transform duration-500">
                            <Lock className="w-10 h-10 text-white animate-pulse" />
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
                        {isTrial ? (
                            <>LA TUA PROVA GRATUITA DI <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-fuchsia-500 text-3xl md:text-7xl">7 GIORNI E' SCADUTA</span></>
                        ) : (
                            <>IL TUO ABBONAMENTO <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-fuchsia-500 text-3xl md:text-7xl">È SCADUTO</span></>
                        )}
                    </h2>
                    {!isTrial && (
                        <p className="text-red-500/80 font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-8 animate-pulse">L'ACCESSO AI CANALI È BLOCCATO</p>
                    )}
                </div>

                {/* Persuasive Text */}
                <div className="max-w-4xl text-center mb-16">
                    <p className="text-zinc-200 text-lg md:text-2xl font-light leading-relaxed">
                        {isTrial ? (
                            <>
                                <span className="text-zinc-100 font-bold italic mr-1 block mb-2 text-2xl md:text-3xl">Ci piacerebbe rimanessi con noi!</span>
                                Non lasciare il tuo istituto in silenzio, <br className="hidden md:block" /> scegli il piano <span className="text-[#ff7393] font-black underline decoration-fuchsia-500/30 underline-offset-4 uppercase">BASIC</span> da <span className="text-white font-black">20,90 al mese</span> per riattivare immediatamente l'accesso a tutti i canali musicali e alle promo sonore per il tuo istituto.
                            </>
                        ) : (
                            <>
                                <span className="text-rose-500 font-bold italic mr-1">"Non lasciare il tuo salone in silenzio..."</span>
                                Scegli un piano per riattivare immediatamente l'accesso a tutti i <span className="text-white font-bold border-b-2 border-rose-500/50">canali musicali profilati</span> e alle promozioni sonore per il tuo istituto.
                            </>
                        )}
                    </p>
                </div>

                {/* CTA Area */}
                <div className="w-full flex flex-col items-center gap-8">
                    {!showForm ? (
                        <div className="flex flex-col items-center gap-12">
                            <button
                                onClick={() => setShowForm(true)}
                                className={`group relative px-10 py-6 ${isTrial ? 'bg-[#ff7393] shadow-[0_20px_40px_rgba(255,115,147,0.3)] hover:shadow-[0_25px_50px_rgba(255,115,147,0.4)]' : 'bg-gradient-to-r from-red-600 to-rose-600 shadow-[0_20px_40px_rgba(225,29,72,0.3)] hover:shadow-[0_25px_50px_rgba(225,29,72,0.4)]'} rounded-2xl text-white font-black text-xl uppercase tracking-widest hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 border border-white/10`}
                            >
                                <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform opacity-70" />
                                {isTrial ? 'Attiva Ora il Servizio' : 'Riattiva Ora il Servizio'}
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-1 md:p-2 backdrop-blur-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <button 
                                        onClick={() => setShowForm(false)}
                                        className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5"
                                    >
                                        Chiudi <ChevronUp className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-4 md:p-8">
                                    <div className="mb-0">
                                        <UpgradeCheckoutForm userEmail={userEmail} userSalonName={salonName} planType="basic" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Permanent Footer Content: Trust Signals + Support */}
                <div className="mt-16 w-full flex flex-col items-center gap-12">
                    {/* Trust Signals */}
                    <div className="flex items-center gap-6 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Music className="w-4 h-4" /> 7 Mood Musicali</span>
                        <span className="h-4 w-[1px] bg-white/10"></span>
                        <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Licenza Inclusa</span>
                    </div>

                    {/* WhatsApp Support Always Visible */}
                    <div className="text-center flex flex-col items-center">
                        <p className="text-zinc-500 text-sm uppercase tracking-[0.2em] font-bold mb-4">Hai bisogno di assistenza?</p>
                        <a 
                            href="https://wa.me/393513364402" 
                            target="_blank" 
                            className="group relative flex items-center gap-3 px-8 py-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-2xl transition-all duration-300 backdrop-blur-sm overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[#25D366]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <svg className="w-6 h-6 text-[#25D366] fill-current animate-pulse" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            <span className="text-[#25D366] text-sm font-black uppercase tracking-widest group-hover:tracking-[0.15em] transition-all">
                                Parla con un consulente su WhatsApp
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
