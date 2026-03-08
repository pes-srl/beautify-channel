"use client";

import { Lock } from "lucide-react";
import { UpgradeFormTrial } from "@/components/UpgradeFormTrial";

interface PaywallProps {
    salonName: string;
    userEmail?: string;
}

export function Paywall({ salonName, userEmail }: PaywallProps) {
    return (
        <div className="bg-zinc-900 border border-red-500/20 rounded-3xl p-8 md:p-12 text-center relative shadow-2xl overflow-hidden mt-6 mb-16">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 rounded-2xl mb-8 flex flex-col md:flex-row justify-center items-center shadow-lg shadow-red-900/20 border border-red-400/30 gap-3">
                    <Lock className="w-6 h-6 md:w-8 md:h-8 shrink-0" />
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-center">L'ACCESSO AI CANALI È BLOCCATO</h2>
                </div>
                <p className="text-zinc-200 text-lg md:text-xl font-light mb-16 max-w-3xl mx-auto leading-relaxed">
                    <span className="block font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-fuchsia-400 mb-2 text-2xl md:text-3xl tracking-wide drop-shadow-sm">
                        Non lasciare il tuo salone in silenzio...
                    </span>
                    Scegli un piano per riattivare immediatamente l'accesso a tutti i <strong className="font-medium text-white border-b border-fuchsia-400/30 pb-0.5">canali musicali profilati per te</strong>.
                </p>

                <div className="max-w-4xl mx-auto text-left">
                    <UpgradeFormTrial userEmail={userEmail} />
                </div>
            </div>
        </div>
    );
}
