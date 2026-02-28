"use client";

import { motion } from "framer-motion";
import { Headphones, Sparkles, Radio, Star, CalendarClock, Volume2 } from "lucide-react";

export function FeaturesNew() {
    const features = [
        {
            title: "La tua Beauty Routing Sonora",
            description: "Una radio in-store che non è solo musica, ma un vero strumento di marketing per il tuo istituto. Crea palinsesti su misura e comunica promozioni e servizi.",
            icon: Radio,
        },
        {
            title: "Assistente Beautify",
            description: "Prenderà gli appuntamenti delle tue clienti senza farle attendere. Nessuna chiamata persa, risponde sempre con cortesia.",
            icon: CalendarClock,
        },
        {
            title: "Musica No-Stop",
            description: "Fino a 3 ore di intrattenimento senza interruzioni pubblicitarie nazionali o sponsor di aziende terze. Solo il tuo istituto.",
            icon: Headphones,
        },
        {
            title: "Aggiornamenti Giornalieri",
            description: "Le ultime Hit del momento sempre aggiornate per offrire un'atmosfera moderna e premium alle tue clienti.",
            icon: Sparkles,
        },
        {
            title: "Spot e Voci Professionali",
            description: "Testi e voci registrate da speaker radiofonici professionisti per i tuoi spot ogni 15, 20 o 30 minuti.",
            icon: Volume2,
        },
        {
            title: "Tutto in un'unica APP!",
            description: "Inserimento di 3 spot al mese, messaggi di benvenuto o auguri di compleanno per far sentire speciale la tua cliente.",
            icon: Star,
        },
    ];

    return (
        <section className="py-32 px-6 bg-zinc-950/50 border-y border-white/5 relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-zinc-100">
                        Comunicazione e palinsesti musicali su misura
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Studiati per rendere innovativa l'esperienza nel tuo Istituto! Alcuni vantaggi esclusivi che non troverai nello streaming tradizionale.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 hover:border-white/10 transition-all group"
                        >
                            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-fuchsia-500/20 to-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-fuchsia-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-zinc-200 mb-3">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Highlight CTA Box */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-linear-to-r from-fuchsia-500/10 to-indigo-500/10 border border-fuchsia-500/20 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto"
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Nessuna interruzione pubblicitaria</h3>
                    <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">
                        Nessuna pubblicità nazionale, Nessuna pubblicità di terzi. <br />Solo ed esclusivamente il tuo centro!
                    </p>
                    <button className="px-8 py-4 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-full font-medium transition-colors">
                        Voglio Iniziare Ora
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
