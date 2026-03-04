"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
    {
        name: "Basic",
        headerColor: "bg-[#9F00FF]",
        headerTextColor: "text-white",
        subtitle: "Il piano entry level che cambia l'atmosfera del tuo istituto.\nCompresi eleganti suggerimenti vocali per stimolare le vendite",
        price: "20,90",
        period: "/mese",
        features: [
            "Licenza di diffusione musicale per l'istituto",
            "Assistenza legale per diritti d'autore musicali",
            "Atmosfere musicali dedicate al mondo Beauty, fruibili anche con Alexa",
            "Eleganti suggerimenti vocali di settore per informare e promuovere le vendite",
            "Oltre al canale principale hai a disposizione altri 6 canali: Relax, Lounge, Jazz, Ambient Massage, Vocal e Deep",
        ],
        buttonText: "PROVA GRATUITA 7 GIORNI",
        buttonClasses: "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-purple-500/20",
        footerText: "Possibilità di abbonamento semestrale a 25,90 mese\nOfferta valida fino a 250mq di Istituto\nPagamento unica soluzione",
        highlight: false,
    }
];
export function PricingNew() {
    return (
        <section id="pricing" className="bg-[#1E0C31] py-32 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-6">
                    <h2 className="text-3xl md:text-5xl font-black mb-2 text-white leading-tight tracking-tight">
                        Con BeautiFy acquisisci un potente, elegante<br className="hidden md:block" />
                        strumento di vendita e promozione che...
                    </h2>
                    {/* Pink italic text imitating handwritten marker */}
                    <p className="text-[#FFA5D0] max-w-4xl mx-auto text-2xl md:text-4xl font-light italic tracking-wider drop-shadow-md">
                        TRASFORMA RADICALMENTE L'ATMOSFERA DEL TUO ISTITUTO!
                    </p>
                </div>

                <div className="flex justify-center max-w-sm lg:max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            className={`flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl transition-all w-full
                                ${plan.highlight ? 'ring-4 ring-[#DF3745] ring-offset-4 ring-offset-[#1E0C31] scale-100 lg:scale-105 z-10' : 'scale-100'}`}
                        >
                            {/* Color Header */}
                            <div className={`${plan.headerColor} px-6 pt-10 pb-8 lg:p-12 text-center lg:text-left min-h-[170px] flex flex-col justify-center lg:w-1/3 shrink-0`}>
                                <h3 className={`text-3xl lg:text-4xl font-black uppercase tracking-wide mb-4 ${plan.headerTextColor}`}>
                                    {plan.name}
                                </h3>
                                {plan.subtitle && (
                                    <p className={`text-sm md:text-base leading-snug whitespace-pre-line ${plan.headerTextColor} opacity-90`}>
                                        {plan.subtitle}
                                    </p>
                                )}
                            </div>

                            {/* White Body */}
                            <div className="p-6 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">

                                {/* Left Side on PC: Price + CTA */}
                                <div className="flex flex-col lg:w-1/3 shrink-0 lg:border-r border-zinc-200 lg:pr-8">
                                    {/* Price block */}
                                    <div className="text-center lg:text-left mb-8 min-h-[90px] flex items-center justify-center lg:justify-start">
                                        {plan.price && (
                                            <div className="flex items-start justify-center text-[#9F00FF] font-black">
                                                <span className={`text-2xl mt-2 mr-1 ${plan.name === 'Premium' ? 'text-[#DF3745]' : ''}`}>€</span>
                                                <span className={`text-7xl leading-none tracking-tighter ${plan.name === 'Premium' ? 'text-[#DF3745]' : ''}`}>{plan.price}</span>
                                                <span className="text-zinc-400 text-lg font-medium self-end mb-2 ml-1">{plan.period}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA Button & Footer */}
                                    <div className="mt-8 lg:mt-auto space-y-6">
                                        <div className="flex justify-center">
                                            <Link href="#trial-form" className="w-full">
                                                <Button className={`w-full rounded-md h-14 text-[16px] md:text-lg font-bold uppercase tracking-wide transition-all ${plan.buttonClasses}`}>
                                                    {plan.buttonText}
                                                </Button>
                                            </Link>
                                        </div>

                                        <p className="text-center lg:text-left text-xs text-zinc-600 font-medium whitespace-pre-line leading-relaxed pb-2">
                                            {plan.footerText}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side on PC: Features List */}
                                <div className="flex-1">
                                    <ul className="space-y-5">
                                        {plan.features.map((feat, idx) => (
                                            <li key={idx} className="flex items-start gap-4">
                                                <div className={`mt-1 bg-white border border-zinc-200 shadow-sm rounded-full shrink-0 flex items-center justify-center w-5 h-5`}>
                                                    <CheckCircle2 className="w-4 h-4 text-zinc-800" />
                                                </div>
                                                <span className="text-[#333333] font-medium leading-[1.6] text-[14px] lg:text-[15px]">
                                                    {feat}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stay Tuned Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-20 pt-16 border-t border-white/10 text-center max-w-2xl mx-auto"
                >
                    <p className="text-xl md:text-2xl font-black text-white tracking-widest uppercase mb-4 drop-shadow-md">
                        Stay Tuned!
                    </p>
                    <p className="text-zinc-400 text-lg md:text-xl italic">
                        Per te altri servizi e grandi opportunità prossimamente in arrivo...
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
