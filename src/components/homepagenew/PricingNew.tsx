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
            "Atmosfere musicali dedicate al mondo Beauty",
            "Eleganti suggerimenti vocali di settore per informare e promuovere le vendite",
            "Oltre al canale principale hai a disposizione altri 6 canali: Relax, Lounge, Jazz, Ambient Massage, Vocal e Deep",
        ],
        buttonText: "PROVA GRATUITA 7 GIORNI",
        buttonClasses: "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-purple-500/20",
        footerText: "Possibilità di abbonamento semestrale a 25,90 mese\nOfferta valida fino a 250mq di Istituto\nPagamento unica soluzione",
        highlight: false,
    },
    {
        name: "Premium",
        headerColor: "bg-[#DF3745]",
        headerTextColor: "text-white",
        subtitle: "Tutto il Basic + l'inserimento delle tue nuove promozioni, offerte speciali per Natale, promo estive e qualsiasi messaggio desideri condividere con le tue clienti.",
        price: "38,90",
        period: "/mese",
        features: [
            "Licenza di diffusione musica per l'istituto",
            "Assistenza legale per diritti d'autore musicali",
            "Atmosfere musicali dedicate al mondo Beauty",
            "Eleganti suggerimenti vocali istituzionali (social, sito o shop online)",
            "2 suggerimenti\\promozioni personalizzati al mese per il tuo istituto (non cumulabili) e utilizzabili anche come reel su instagram, facebook o tuoi canali whatsapp",
            "Accesso a pacchetti aggiuntivi di suggerimenti vocali personalizzati per il tuo istituto",
            "Promozione dei social tramite suggerimenti vocali",
            "Oltre al canale principale hai a disposizione altri 6 canali: Relax, Lounge, Jazz, Ambient Massage, Vocal e Deep, inoltre avrai accesso anche a...",
            "LASER CHANNEL, canale dedicato al Laser*",
            "COSMETIC CHANNEL, canale dedicato alla Cosmetica**",
        ],
        buttonText: "PROVA GRATUITA 7 GIORNI",
        buttonClasses: "bg-[#DF3745] hover:bg-[#c62837] text-white shadow-xl shadow-red-500/20",
        footerText: "Possibilità di abbonamento semestrale a 43,90 mese\nOfferta valida fino a 250mq di Istituto\nPagamento unica soluzione",
        highlight: true,
    },
    {
        name: "Gold",
        headerColor: "bg-[#FBD44C]",
        headerTextColor: "text-zinc-900",
        subtitle: "",
        price: null,
        period: null,
        goldTitle: "CHIEDICI INFO",
        features: [
            "Con il piano GOLD hai accesso al massimo livello di personalizzazione del canale!",
            "La radio viene prodotta completamente su misura per il tuo istituto a partire dal nome",
            "Comunicazione completamente personalizzata",
            "Il tuo canale audio con tutte le tue comunicazioni e promozioni che ritieni importanti",
            "Potrai chiederci di inserire le nuove promozioni dell'istituto, offerte speciali per Natale, promozioni estive e qualsiasi messaggio che desideri condividere!",
        ],
        buttonText: "Scrivici su WhatsApp",
        buttonClasses: "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-green-500/20",
        buttonLink: "https://wa.link/5apci9",
        footerText: "Offerta valida fino a 250mq di Istituto\nPagamento unica soluzione",
        highlight: false,
    },
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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            className={`flex flex-col bg-white rounded-3xl overflow-hidden shadow-2xl transition-all
                                ${plan.highlight ? 'ring-4 ring-[#DF3745] ring-offset-4 ring-offset-[#1E0C31] scale-100 lg:scale-105 z-10' : 'scale-100'}`}
                        >
                            {/* Color Header */}
                            <div className={`${plan.headerColor} px-6 pt-10 pb-8 text-center min-h-[170px] flex flex-col justify-center`}>
                                <h3 className={`text-3xl font-black uppercase tracking-wide mb-3 ${plan.headerTextColor}`}>
                                    {plan.name}
                                </h3>
                                {plan.subtitle && (
                                    <p className={`text-sm md:text-[15px] font-medium leading-snug whitespace-pre-line ${plan.headerTextColor} ${plan.name === 'Basic' ? 'opacity-90' : 'opacity-100'} px-2`}>
                                        {plan.subtitle}
                                    </p>
                                )}
                            </div>

                            {/* White Body */}
                            <div className="p-6 md:p-8 flex flex-col">

                                {/* Price block (if available, Gold relies on custom title) */}
                                <div className="text-center mb-8 min-h-[90px] flex items-center justify-center">
                                    {plan.price ? (
                                        <div className="flex items-start justify-center text-[#9F00FF] font-black">
                                            <span className={`text-2xl mt-2 mr-1 ${plan.name === 'Premium' ? 'text-[#DF3745]' : ''}`}>€</span>
                                            <span className={`text-7xl leading-none tracking-tighter ${plan.name === 'Premium' ? 'text-[#DF3745]' : ''}`}>{plan.price}</span>
                                            <span className="text-zinc-400 text-lg font-medium self-end mb-2 ml-1">{plan.period}</span>
                                        </div>
                                    ) : (
                                        <h4 className="text-[#FBD44C] text-4xl md:text-5xl font-black uppercase tracking-tight drop-shadow-sm">
                                            {plan.goldTitle}
                                        </h4>
                                    )}
                                </div>

                                {/* Features List */}
                                <ul className="space-y-5 mb-10">
                                    {plan.features.map((feat, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className={`mt-1 bg-white border border-zinc-200 shadow-sm rounded-full shrink-0 flex items-center justify-center
                                                ${plan.name === 'Gold' ? 'w-0 h-0 invisible' : 'w-5 h-5'}`}>
                                                {plan.name !== 'Gold' && (
                                                    <CheckCircle2 className="w-4 h-4 text-zinc-800" />
                                                )}
                                            </div>
                                            <span className={`text-[#333333] font-medium leading-[1.6] ${plan.name === 'Gold' ? 'text-center w-full text-[15px]' : 'text-[14px]'}`}>
                                                {feat}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button & Footer */}
                                <div className="mt-auto space-y-6 pt-6 border-t border-zinc-100">
                                    <div className="flex justify-center">
                                        {plan.buttonLink ? (
                                            <a href={plan.buttonLink} target="_blank" rel="noopener noreferrer" className="w-full">
                                                <Button className={`w-full rounded-md h-14 text-[16px] md:text-lg font-bold uppercase tracking-wide transition-all ${plan.buttonClasses}`}>
                                                    {plan.buttonText}
                                                </Button>
                                            </a>
                                        ) : (
                                            <Link href="#trial-form" className="w-full">
                                                <Button className={`w-full rounded-md h-14 text-[16px] md:text-lg font-bold uppercase tracking-wide transition-all ${plan.buttonClasses}`}>
                                                    {plan.buttonText}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>

                                    <p className="text-center text-xs text-zinc-600 font-medium whitespace-pre-line leading-relaxed pb-2">
                                        {plan.footerText}
                                    </p>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
