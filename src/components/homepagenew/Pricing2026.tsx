"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
    {
        name: "Basic",
        headerColor: "bg-[#5D6676]",
        headerTextColor: "text-white",
        subtitle: "Il piano entry level che cambia l'atmosfera del tuo istituto.\nCompresi eleganti suggerimenti vocali per stimolare le vendite",
        price: "20,90",
        period: "/mese",
        features: [
            "Licenza di diffusione musicale",
            "Assistenza legale per diritti d'autore musicali",
            "Atmosfere musicali dedicate al mondo Beauty",
            "Eleganti suggerimenti vocali di settore per informare e promuovere le vendite",
            "Oltre al canale principale hai a disposizione altri 6 canali: Relax, Lounge, Jazz, Ambient Massage, Vocal e Deep",
        ],
        buttonText: "PROVA GRATUITA 7 GIORNI",
        buttonClasses: "hover:brightness-110 text-white shadow-xl shadow-[#5D6676]/20",
        buttonStyle: { background: 'linear-gradient(90deg, #AB7169 0%, #D8B2A3 100%)' },
        footerText: "Possibilità di abbonamento semestrale a 25,90 mese\nOfferta valida fino a 250mq\nPagamento unica soluzione",
        highlight: false,
    }
];

export function Pricing2026() {
    const handleScrollTo = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        const id = href.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            window.history.pushState(null, "", href);
        }
    };

    return (
        <section id="pricing" className="bg-gradient-to-b from-[#AB7169] via-[#5D6676] to-[#1E0C31] pt-0 md:pt-24 pb-2 md:pb-24 px-6 md:px-12 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 space-y-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#FAFAF8] leading-[1.1] tracking-tight">
                        QUANTO MI COSTA?
                    </h2>
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-md">
                        Probabilmente ti costa di più non averlo
                    </h2>
                </div>

                <div className="flex justify-center max-w-sm lg:max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            className={`flex flex-col lg:flex-row bg-[#FAFAF8] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all w-full
                                ${plan.highlight ? 'ring-4 ring-[#AB7169] ring-offset-4 ring-offset-[#1E0C31] scale-100 lg:scale-105 z-10' : 'scale-100'}`}
                        >
                            {/* Color Header */}
                            <div
                                className={`px-6 pt-10 pb-8 lg:p-12 text-center lg:text-left min-h-[170px] flex flex-col justify-center lg:w-1/3 shrink-0 bg-[#5D6676]`}
                            >
                                <h3 className={`text-4xl lg:text-5xl font-black uppercase tracking-wide mb-4 text-white`}>
                                    {plan.name}
                                </h3>
                                {plan.subtitle && (
                                    <p className={`text-base md:text-lg lg:text-xl font-medium leading-relaxed whitespace-pre-line text-white`}>
                                        {plan.subtitle}
                                    </p>
                                )}
                            </div>

                            {/* White Body */}
                            <div className="p-6 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">

                                {/* Left Side on PC: Price + CTA */}
                                <div className="flex flex-col lg:w-1/3 shrink-0 lg:border-r border-[#ECE0D4] lg:pr-8">
                                    <div className="text-center mb-6 lg:mb-8 min-h-[90px] flex items-center justify-center w-full">
                                        {plan.price && (
                                            <div className="flex flex-col items-center justify-center text-[#5D6676] font-black w-full text-center pr-6 lg:pr-0">
                                                <div className="flex items-start justify-center">
                                                    <span className="text-3xl mt-2 mr-1">€</span>
                                                    <span className="text-7xl leading-none tracking-tighter drop-shadow-sm">{plan.price}</span>
                                                </div>
                                                <span className="text-[#AB7169] text-lg md:text-md font-bold mt-1 uppercase tracking-wide block text-center w-full">{plan.period}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA Button & Footer */}
                                    <div className="mt-8 lg:mt-auto space-y-6">
                                        <div className="flex justify-center w-full">
                                            <a
                                                href="#trial-form"
                                                onClick={(e) => handleScrollTo(e, "#trial-form")}
                                                className="w-full"
                                            >
                                                <Button
                                                    className={`w-full rounded-[2.5rem] h-auto py-5 sm:py-5 px-4 text-[14px] sm:text-[16px] font-black uppercase tracking-widest text-center whitespace-normal leading-[1.3] transition-all bg-[#AB7169] hover:bg-[#D8B2A3] ${plan.buttonClasses}`}
                                                >
                                                    {plan.buttonText}
                                                </Button>
                                            </a>
                                        </div>

                                        <p className="text-center lg:text-left text-xs text-zinc-600 font-medium whitespace-pre-line leading-relaxed pb-2">
                                            {plan.footerText}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side on PC: Features List */}
                                <div className="flex-1 flex flex-col justify-center lg:py-4">
                                    <ul className="space-y-6 my-auto">
                                        {plan.features.map((feat, idx) => (
                                            <li key={idx} className="flex items-start gap-4">
                                                <div className={`mt-1.5 bg-[#5D6676] shadow-sm rounded-full shrink-0 flex items-center justify-center w-[15px] h-[15px]`}>
                                                    <Check className="w-[10px] h-[10px] text-white stroke-[3.5]" />
                                                </div>
                                                <span className="text-[#5D6676] font-medium leading-[1.6] text-[14px] lg:text-[15px]">
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

                {/* Laser & Cosmetic Channel Boxes */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    className="mt-12 mb-4 w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-4 px-2"
                >
                    {/* LASER CHANNEL */}
                    <div className="flex-1 bg-gradient-to-b from-[#A66E64] to-[#8B5A52] rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center shadow-xl relative overflow-hidden border border-white/10">
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.1] pointer-events-none">
                            <div className="w-64 h-64 border-[8px] border-white rotate-45 rounded-3xl"></div>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide mb-3 relative z-10 uppercase drop-shadow-sm">
                            LASER CHANNEL
                        </h3>
                        <p className="text-white text-[15px] md:text-lg font-medium leading-snug relative z-10 transition-all drop-shadow-sm">
                            *Incluso nel piano <span className="text-white font-bold underline decoration-[#D8B2A3]">Premium</span>.<br />
                            Puoi utilizzare il canale dedicato al laser quando vuoi promuovere servizi e pacchetti.
                        </p>
                    </div>

                    {/* COSMETIC CHANNEL */}
                    <div className="flex-1 bg-gradient-to-b from-[#5D6676] to-[#1E0C31] rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center shadow-xl relative overflow-hidden border border-white/10">
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
                            <div className="w-64 h-64 border-[8px] border-[#FAFAF8] rotate-45 rounded-3xl"></div>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide mb-3 drop-shadow-md relative z-10 uppercase">
                            COSMETIC CHANNEL
                        </h3>
                        <p className="text-[#ECE0D4] text-[15px] md:text-lg font-medium leading-snug drop-shadow-sm relative z-10 transition-all">
                            **Incluso nel piano <span className="text-white font-bold">Premium</span>.<br />
                            Puoi utilizzare il canale dedicato alla cosmetica, quando vuoi promuovere servizi di cosmetica.
                        </p>
                    </div>
                </motion.div>

                {/* 2. Three Steps Guide */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="space-y-12 mt-12 md:mt-16"
                >
                    <h2 className="text-2xl md:text-4xl font-black text-white text-center leading-snug tracking-wide px-4">
                        Accendi un'atmosfera innovativa nel tuo istituto in <br className="hidden md:block" />
                        3 passaggi
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            { step: "1", text: "Registrati in pochi secondi nel form qui sotto e inizia la prova gratuita!" },
                            { step: "2", text: "Accedi dal tuo dispositivo preferito (PC, Mac, smartphone, tablet)" },
                            { step: "3", text: "Premi Play sul canale che preferisci e lascia che BeautiFy faccia il resto" }
                        ].map((item) => (
                            <div key={item.step} className="bg-[#FAFAF8] rounded-[2.5rem] p-8 text-center shadow-xl space-y-4">
                                <span className="block text-6xl font-black text-[#AB7169] mb-6 drop-shadow-sm">
                                    {item.step}
                                </span>
                                <p className="text-[#5D6676] font-bold text-lg md:text-xl leading-snug">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center pt-8">
                        <a
                            href="#trial-form"
                            onClick={(e) => handleScrollTo(e, "#trial-form")}
                        >
                            <Button
                                className="bg-[#AB7169] hover:bg-[#D8B2A3] text-white font-black text-sm md:text-base px-8 py-6 rounded-[2.5rem] uppercase tracking-wide shadow-[0_8px_30px_rgba(171,113,105,0.4)] transition-all border-none"
                            >
                                PROVA GRATUITA 7 GIORNI SENZA IMPEGNO
                            </Button>
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16 mb-16 space-y-6"
                >
                    <h2 className="text-3xl md:text-5xl font-black mb-2 text-white leading-tight tracking-tight">
                        Con BeautiFy acquisisci un potente, elegante <br className="hidden md:block" />
                        strumento di vendita e promozione che...
                    </h2>
                    <p className="text-[#25D366] max-w-4xl mx-auto text-2xl md:text-4xl font-light italic tracking-wider drop-shadow-md">
                        TRASFORMA RADICALMENTE L'ATMOSFERA DEL TUO ISTITUTO!
                    </p>
                </motion.div>

                {/* WhatsApp CTA - Moved here */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="py-16 flex flex-col items-center justify-center text-center space-y-6 border-t border-white/10"
                >
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide">
                        CHIEDICI ALTRE INFO
                    </h2>
                    <a
                        href="https://wa.link/5apci9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg md:text-xl rounded-[2.5rem] px-10 py-4 shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all hover:scale-105 gap-3"
                    >
                        Scrivici su WhatsApp
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
