"use client";

import { useState } from "react";
import { Lock, CheckCircle2, CreditCard, Mail, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaywallProps {
    salonName: string;
}

export function Paywall({ salonName }: PaywallProps) {
    const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(null);

    const handleSelectPlan = (plan: 'basic' | 'premium') => {
        setSelectedPlan(plan);
    };

    const getEmailHref = (plan: 'basic' | 'premium') => {
        const subject = encodeURIComponent(`Upgrade ${plan.toUpperCase()} - ${salonName}`);
        const body = encodeURIComponent(
            `Ciao Team di Beautify Channel,\n\nIn allegato trovate la distinta del bonifico per l'attivazione dell'abbonamento ${plan.toUpperCase()} per il salone "${salonName}".\n\nResto in attesa dell'attivazione dei canali.\n\nGrazie!`
        );
        return `mailto:info@beautifychannel.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className="bg-zinc-900 border border-red-500/20 rounded-3xl p-8 md:p-12 text-center relative shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Header */}
                {!selectedPlan ? (
                    <>
                        <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-10 h-10 text-red-400" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">La tua prova è scaduta</h2>
                        <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
                            Non lasciare il tuo salone in silenzio. Scegli un piano per riattivare immediatamente l'accesso a tutti i canali radio musicali profilati per te.
                        </p>

                        {/* Pricing Cards */}
                        <div className="grid md:grid-cols-2 gap-6 text-left">
                            {/* Basic Plan */}
                            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition-all flex flex-col h-full">
                                <h3 className="text-xl font-bold text-white mb-1">Piano Basic</h3>
                                <div className="text-3xl font-extrabold text-indigo-400 mb-6">€ 19<span className="text-lg text-zinc-500 font-normal">/mese</span></div>
                                <ul className="space-y-3 mb-8 flex-grow">
                                    <li className="flex items-start gap-2 text-zinc-300 text-sm leading-tight"><CheckCircle2 className="w-5 h-5 shrink-0 text-indigo-500 mt-0.5" /> Accesso a 5 canali tematici</li>
                                    <li className="flex items-start gap-2 text-zinc-300 text-sm leading-tight"><CheckCircle2 className="w-5 h-5 shrink-0 text-indigo-500 mt-0.5" /> Licenza inclusa nel prezzo</li>
                                    <li className="flex items-start gap-2 text-zinc-300 text-sm leading-tight"><CheckCircle2 className="w-5 h-5 shrink-0 text-indigo-500 mt-0.5" /> Qualità streaming standard</li>
                                </ul>
                                <Button
                                    onClick={() => handleSelectPlan('basic')}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-bold mb-0 mt-auto"
                                >
                                    Passa a Basic
                                </Button>
                            </div>

                            {/* Premium Plan */}
                            <div className="bg-gradient-to-b from-fuchsia-900/40 to-zinc-950 border border-fuchsia-500/50 rounded-2xl p-6 relative flex flex-col h-full">
                                <div className="absolute top-0 right-6 -translate-y-1/2 bg-fuchsia-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Il più scelto</div>
                                <h3 className="text-xl font-bold text-white mb-1">Piano Premium</h3>
                                <div className="text-3xl font-extrabold text-fuchsia-400 mb-6">€ 49<span className="text-lg text-zinc-500 font-normal">/mese</span></div>
                                <ul className="space-y-3 mb-8 flex-grow">
                                    <li className="flex items-start gap-2 text-zinc-300 text-sm leading-tight"><CheckCircle2 className="w-5 h-5 shrink-0 text-fuchsia-500 mt-0.5" /> Accesso <strong>illimitato</strong> ai canali</li>
                                    <li className="flex items-start gap-2 text-zinc-300 text-sm leading-tight"><CheckCircle2 className="w-5 h-5 shrink-0 text-fuchsia-500 mt-0.5" /> Nessuno stress legale SIAE</li>
                                    <li className="flex items-start gap-2 text-zinc-300 text-sm leading-tight"><CheckCircle2 className="w-5 h-5 shrink-0 text-fuchsia-500 mt-0.5" /> Qualità Audio Alta Risoluzione HD</li>
                                </ul>
                                <Button
                                    onClick={() => handleSelectPlan('premium')}
                                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl h-12 font-bold shadow-[0_0_20px_rgba(217,70,239,0.3)] mb-0 mt-auto"
                                >
                                    Passa a Premium
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Bank Transfer Instructions UI */
                    <div className="max-w-2xl mx-auto text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={() => setSelectedPlan(null)}
                            className="text-zinc-400 hover:text-white mb-6 text-sm font-medium transition-colors"
                        >
                            &larr; Torna alla scelta dei piani
                        </button>

                        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-fuchsia-500/10 rounded-xl">
                                    <Building className="w-8 h-8 text-fuchsia-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Attivazione Manuale</h3>
                                    <p className="text-zinc-400">Piano selezionato: <strong className="text-fuchsia-400 uppercase">{selectedPlan}</strong> - € {selectedPlan === 'basic' ? '19' : '49'}/mese</p>
                                </div>
                            </div>

                            <p className="text-zinc-300 mb-6 leading-relaxed">
                                Per attivare o rinnovare il tuo abbonamento, effettua un bonifico bancario utilizzando le coordinate qui sotto. L'attivazione avverrà non appena riceveremo la contabile.
                            </p>

                            <div className="bg-black/40 border border-white/5 rounded-xl p-5 mb-8 space-y-4 font-mono text-sm">
                                <div>
                                    <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Intestatario</div>
                                    <div className="text-white font-medium text-base">Zvenia SRLS</div>
                                </div>
                                <div>
                                    <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">IBAN</div>
                                    <div className="text-fuchsia-300 font-bold text-lg select-all">IT00 A000 0000 0000 0000 0000 000</div>
                                </div>
                                <div>
                                    <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Banca</div>
                                    <div className="text-white">Banca Sella</div>
                                </div>
                                <div>
                                    <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Causale <span className="text-fuchsia-400 font-bold ml-1">*Importante</span></div>
                                    <div className="text-white font-medium select-all">Upgrade {selectedPlan.toUpperCase()} - {salonName}</div>
                                </div>
                            </div>

                            <div className="bg-fuchsia-500/10 p-5 rounded-xl border border-fuchsia-500/20">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-fuchsia-400" />
                                    Ultimo Step: Inviaci la Distinta
                                </h4>
                                <p className="text-sm text-fuchsia-200/80 mb-5">
                                    Per accelerare l'autenticazione, inviaci una email allegando la ricevuta del bonifico. Attiveremo il tuo piano in giornata!
                                </p>
                                <a
                                    href={getEmailHref(selectedPlan)}
                                    className="flex w-full items-center justify-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
                                >
                                    <Mail className="w-5 h-5" />
                                    Invia Distinta via Email
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
