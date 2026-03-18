"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Montserrat, Inter } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

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
        buttonClasses: "hover:brightness-110 shadow-xl shadow-[#5D6676]/20",
        buttonStyle: { background: 'linear-gradient(90deg, #AB7169 0%, #D8B2A3 100%)' },
        footerText: "Possibilità di abbonamento semestrale a 25,90 al mese.\nOfferta valida fino a 250mq\nPagamento in un’unica soluzione",
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
        <section id="pricing" className="bg-gradient-to-b from-[#AB7169] via-[#5D6676] to-[#1E0C31] pt-0 md:pt-24 pb-12 md:pb-16 px-6 md:px-12 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 space-y-4">
                    <h2 className={`text-4xl md:text-5xl lg:text-6xl font-semibold text-[#FAFAF8] leading-[1.1] tracking-tight ${montserrat.className}`}>
                        QUANTO MI COSTA?
                    </h2>
                    <h2 className={`text-3xl md:text-5xl font-semibold text-white leading-[1.1] tracking-tight drop-shadow-md ${montserrat.className}`}>
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
                            className={`flex flex-col lg:flex-row bg-[#FAFAF8] rounded-[35px] overflow-hidden shadow-2xl transition-all w-full
                                ${plan.highlight ? 'ring-4 ring-[#AB7169] ring-offset-4 ring-offset-[#1E0C31] scale-100 lg:scale-105 z-10' : 'scale-100'}`}
                        >
                            {/* Color Header */}
                            <div
                                className={`px-6 pt-10 pb-8 lg:p-12 text-center lg:text-left min-h-[170px] flex flex-col justify-center lg:w-1/3 shrink-0 bg-[#5D6676]`}
                            >
                                <h3 className={`text-4xl lg:text-5xl font-semibold uppercase tracking-wide mb-4 text-white ${montserrat.className}`}>
                                    {plan.name}
                                </h3>
                                {plan.subtitle && (
                                    <p className={`text-base md:text-lg lg:text-xl font-semibold leading-relaxed whitespace-pre-line text-white ${montserrat.className}`}>
                                        {plan.subtitle}
                                    </p>
                                )}
                            </div>

                            {/* White Body */}
                            <div className="p-6 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">

                                {/* Left Side on PC: Price + CTA */}
                                <div className="flex flex-col lg:w-1/3 shrink-0 lg:border-r border-[#ECE0D4] lg:pr-8">
                                    <div className="text-center mt-2 lg:mt-8 mb-6 lg:mb-8 min-h-[90px] flex items-center justify-center w-full">
                                        {plan.price && (
                                            <div className="flex flex-col items-center justify-center text-[#5D6676] font-black w-full text-center pr-6 lg:pr-0 lg:-translate-x-[9.5px]">
                                                <div className="flex items-start justify-center">
                                                    <span className="text-3xl mt-2 mr-1">€</span>
                                                    <span className="text-7xl leading-none tracking-tighter drop-shadow-sm">{plan.price}</span>
                                                </div>
                                                <span className="text-[#F8BBD0] text-lg md:text-md font-bold mt-1 uppercase tracking-wide block text-center w-full">{plan.period}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA Button & Footer */}
                                    <div className="mt-2 lg:mt-auto space-y-6">
                                        <div className="flex justify-center w-full">
                                            <a
                                                href="#trial-form"
                                                onClick={(e) => handleScrollTo(e, "#trial-form")}
                                                className="w-full lg:w-[124%] lg:-ml-[12%]"
                                            >
                                                <Button
                                                    className={`w-full rounded-[35px] h-auto py-5 sm:py-5 px-4 text-[14px] sm:text-[16px] font-semibold uppercase tracking-widest text-center whitespace-normal leading-[1.3] transition-all bg-gradient-to-r from-[#F8BBD0] to-[#DDA0DD] hover:from-[#F48FB1] hover:to-[#D48DD4] text-white ${plan.buttonClasses} ${montserrat.className}`}
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
                                                <div className={`mt-1.5 bg-gradient-to-r from-[#F8BBD0] to-[#DDA0DD] shadow-sm rounded-full shrink-0 flex items-center justify-center w-[15px] h-[15px]`}>
                                                    <Check className="w-[10px] h-[10px] text-white stroke-[3.5]" />
                                                </div>
                                                <span className={`text-[#5D6676] font-normal leading-[1.6] text-[16px] lg:text-[18px] ${inter.className}`}>
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



                {/* 2. Three Steps Guide */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="space-y-12 mt-12 md:mt-16"
                >
                    <h2 className={`text-2xl md:text-4xl font-semibold text-white text-center leading-snug tracking-wide px-4 ${montserrat.className}`}>
                        Accendi un'atmosfera innovativa nel tuo istituto in <br className="hidden md:block" />
                        3 passaggi
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            { step: "1", text: "Registrati in pochi secondi nel form qui sotto e inizia la prova gratuita!" },
                            { step: "2", text: "Accedi dal tuo dispositivo preferito (PC, Mac, smartphone, tablet)" },
                            { step: "3", text: "Premi Play sul canale che preferisci e lascia che BeautiFy faccia il resto" }
                        ].map((item) => (
                            <div key={item.step} className="bg-[#FAFAF8] rounded-[35px] p-8 text-center shadow-xl space-y-4">
                                <span className="block text-6xl font-black text-[#7B2CBF] mb-6 drop-shadow-sm">
                                    {item.step}
                                </span>
                                <p className={`text-[#5D6676] font-medium text-lg md:text-xl leading-snug ${inter.className}`}>
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>

                </motion.div>
            </div>
        </section>
    );
}
