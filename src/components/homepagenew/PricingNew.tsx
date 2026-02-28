"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
    {
        name: "Basic",
        price: "€20,90",
        period: "/mese",
        description: "Perfetto per Iniziare. Tutto il potenziale della radio in-store per il tuo istituto.",
        features: [
            "Palinsesto di alta qualità 24h/7, no stop",
            "Spot personalizzati in base agli orari",
            "Nessuna interruzione pubblicitaria nazionale",
            "Nessun sponsor di altre aziende",
        ],
        highlight: false,
    },
    {
        name: "Premium",
        price: "€39,90",
        period: "/mese",
        description: "La scelta più completa per l'istituto che vuole offrire la massima esperienza.",
        features: [
            "Tutti i vantaggi del piano BASIC",
            "Fino a 3 spot al mese inclusi",
            "Integrazioni della Tua App e di Beautify",
            "Interviste e messaggi di benvenuto / compleanno",
            "Invio registrazioni chiavi in mano",
            "Spot extra a soli 10€",
        ],
        highlight: true,
    },
    {
        name: "Gold",
        price: "CHIEDI",
        period: "PREZZO",
        description: "Hai un franchising o più di 3 istituti? Preventivo personalizzato.",
        features: [
            "Analisi necessità del tuo brand",
            "Studio dell'offerta migliore",
            "Supporto dedicato",
            "Soluzioni scalabili su misura",
        ],
        highlight: false,
    },
];

export function PricingNew() {
    return (
        <section id="pricing" className="py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-zinc-100">
                        Trasforma i momenti di attesa
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Con Beautify acquisisci un potente, elegante strumento di vendita e promozione.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            className={`relative p-8 rounded-3xl ${plan.highlight
                                ? "bg-linear-to-b from-fuchsia-500/10 to-indigo-500/10 border-fuchsia-500/50 shadow-2xl shadow-fuchsia-500/10 h-[550px]"
                                : "bg-white/2 border-white/10 hover:border-white/20 h-[500px]"
                                } border backdrop-blur-sm transition-all flex flex-col`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-fuchsia-500 to-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                    Consigliato
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-2xl font-semibold text-zinc-100 mb-2">{plan.name}</h3>
                                <p className="text-sm text-zinc-400 min-h-[40px]">{plan.description}</p>
                            </div>

                            <div className="mb-6">
                                <span className={`font-bold text-white ${plan.name === "Gold" ? "text-4xl" : "text-5xl"}`}>{plan.price}</span>
                                <span className="text-zinc-500">{plan.period}</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-fuchsia-400' : 'text-zinc-600'}`} />
                                        <span className="text-zinc-300 text-sm">{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.highlight ? "default" : "outline"}
                                className={`w-full rounded-xl h-12 mt-auto ${plan.highlight
                                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                                    : "bg-transparent text-white border-white/20 hover:bg-white/5"
                                    }`}
                            >
                                {plan.name === "Gold" ? "Richiedi Info" : "Voglio Iniziare"}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
