"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PricingNew } from "./PricingNew";

export function InfoBlocksNew() {
    return (
        <>
            <section className="bg-[#1E0C31] w-full py-24 px-6 md:px-12 overflow-hidden">
                <div className="max-w-7xl mx-auto space-y-24 md:space-y-32">

                    {/* Block 1: Text Left, Image Right */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 space-y-6"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight font-sans">
                                BeautiFy Channel<br />
                                La tua Beauty Routine Sonora
                            </h2>
                            <p className="text-zinc-300 text-lg md:text-xl leading-relaxed">
                                Finalmente anche in Italia un vero must have per gli istituti di bellezza: <br className="block md:hidden" />
                                <span className="whitespace-nowrap inline-block mt-1 md:mt-0">il <strong className="text-white">MARKETING SONORO</strong></span><br /><br />
                                Estremamente innovativo, straordinariamente utile, elegantemente coinvolgente. BeautiFy Channel è la soluzione innovativa di marketing sonoro ideata per aumentare le
                                vendite, la professionalità e la customer experience nel settore del beauty, inducendo una
                                piacevole sensazione di coinvolgimento
                            </p>
                            <div className="pt-4">
                                <Link href="#trial-form">
                                    <Button
                                        className="hover:brightness-110 text-white font-bold tracking-wider uppercase px-8 py-3 h-auto rounded-full shadow-[0_8px_30px_rgba(45,10,78,0.4)] transition-all border-none"
                                        style={{ background: 'linear-gradient(90deg, #2D0A4E 0%, #7B2CBF 50%, #F5F3F7 100%)' }}
                                    >
                                        PROVAMI GRATIS 7 GIORNI
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="flex-[1.2] w-full"
                        >
                            <img
                                src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772727863694-a5hng8.png"
                                alt="BeautiFy Channel Beauty Room"
                                className="w-full h-auto md:h-[450px] object-cover rounded-xl shadow-2xl"
                            />
                        </motion.div>
                    </div>

                    {/* Block 2: Image Left, Text Right */}
                    <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12 md:gap-20">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 space-y-6"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight font-sans">
                                Un'eccellenza nell’intrattenimento in istituto
                            </h2>
                            <p className="text-zinc-300 text-lg leading-relaxed">
                                In grado di arricchire un raffinato sottofondo
                                sonoro - scelto in perfetta coerenza con il settore - con efficaci input informativi e
                                promozionali.
                            </p>
                            <p className="text-zinc-300 text-lg leading-relaxed">
                                Una potente combo creata per regalare alle tue clienti momenti di immediate e coinvolgenti
                                sensazioni, aiutandoti ad aumentare le vendite in un modo mai così smart e godibile!
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 w-full flex justify-center md:justify-start"
                        >
                            <div className="relative">
                                <img
                                    src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772727853683-sr1147.png"
                                    alt="Assistente Tati"
                                    className="w-full h-auto md:h-[450px] object-cover rounded-xl shadow-2xl"
                                />
                                {/* Absolute Button matching the mockup layout */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full flex justify-center">
                                    <Link href="#trial-form">
                                        <Button
                                            className="hover:brightness-110 text-white font-bold tracking-wider uppercase px-8 py-3 h-auto rounded-full shadow-[0_8px_30px_rgba(45,10,78,0.4)] transition-all border-none"
                                            style={{ background: 'linear-gradient(90deg, #2D0A4E 0%, #7B2CBF 50%, #F5F3F7 100%)' }}
                                        >
                                            PROVAMI GRATIS 7 GIORNI
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Block 3: Centered Philosophy and Pricing Block */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto pt-24 space-y-8"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
                            <span className="text-4xl md:text-6xl block mb-4 text-white-400 font-black">Come?</span>
                            Con un semplice clic accedendo in modo semplice e <br className="hidden md:block" />
                            sicuro a BeautiFy Channel
                        </h2>

                        {/* 4 Elegant Square Blocks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl pt-8 pb-12">
                            {/* Block 1 */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-start text-center h-full shadow-2xl hover:bg-white/10 transition-all duration-300">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 sm:mb-6 text-[#2D0A4E] shrink-0">
                                    <span className="text-xl font-bold">1</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <p className="text-zinc-200 text-base leading-relaxed">
                                        Nel corso di un intrattenimento musicale dal sound ricercato, l’assistente digitale BeautiFy
                                        interviene, con dolcezza e professionalità, per offrire spunti generici legati al mondo della
                                        bellezza e del benessere, regalando così una vera e propria beauty routine sonora
                                    </p>
                                </div>
                            </div>

                            {/* Block 2 */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-start text-center h-full shadow-2xl hover:bg-white/10 transition-all duration-300">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 sm:mb-6 text-[#2D0A4E] shrink-0">
                                    <span className="text-xl font-bold">2</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <p className="text-zinc-200 text-base leading-relaxed">
                                        Questo stimola efficacemente l’interesse delle clienti e sollecita la loro richiesta di informazioni
                                        su prodotti e trattamenti proprio mentre sono nel tuo salone, creando una percezione positiva
                                        dell’ambiente che ne aumenta la fidelizzazione
                                    </p>
                                </div>
                            </div>

                            {/* Block 3 */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-start text-center h-full shadow-2xl hover:bg-white/10 transition-all duration-300">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 sm:mb-6 text-[#2D0A4E] shrink-0">
                                    <span className="text-xl font-bold">3</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <p className="text-zinc-200 text-base leading-relaxed">
                                        BeautiFy Channel è un supporto irrinunciabile per la tua professione, perché ti consentirà di non
                                        preoccuparti più della comunicazione interna del tuo salone, ma di dedicarti e concentrarti
                                        pienamente sullo svolgimento del tuo lavoro
                                    </p>
                                </div>
                            </div>

                            {/* Block 4 */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-start text-center h-full shadow-2xl hover:bg-white/10 transition-all duration-300">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 sm:mb-6 text-[#2D0A4E] shrink-0">
                                    <span className="text-xl font-bold">4</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <p className="text-zinc-200 text-base leading-relaxed">
                                        Inoltre, BeautiFy Channel ti mette a disposizione altri 6 canali audio oltre al canale principale, per cambiare mood durante la giornata, magari con DEEP SOFT nel weekend o Jazz nell'orario di chiusura, sempre con il supporto di suggerimenti audio dell’assistente digitale BeautiFy
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <PricingNew />


            <section className="bg-[#1E0C31] w-full py-24 px-6 md:px-12 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    {/* WhatsApp CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="pt-8 pb-8 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                            CHIEDICI ALTRE INFO
                        </h2>
                        <a
                            href="https://wa.link/5apci9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg md:text-xl rounded-full px-10 py-4 shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all hover:scale-105 gap-3"
                        >
                            Scrivici su WhatsApp
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        </a>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
