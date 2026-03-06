"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Play, Pause, ArrowRight } from "lucide-react";

function AudioPlayerMinimal({ src }: { src: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />
            <button
                onClick={togglePlay}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#FAFAF8] flex items-center justify-center text-[#FAFAF8] hover:scale-110 active:scale-95 transition-all bg-[#FAFAF8]/5 backdrop-blur-sm cursor-pointer group shadow-[0_15px_45px_rgba(0,0,0,0.3),_inset_0_2px_10px_rgba(255,255,255,0.2)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.15),_inset_0_2px_15px_rgba(255,255,255,0.4)]"
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? (
                    <Pause size={48} strokeWidth={1.5} fill="none" className="transition-all" />
                ) : (
                    <Play size={48} strokeWidth={1.5} fill="none" className="ml-1 transition-all" />
                )}
            </button>
        </div>
    );
}

export function InfoBlocks2026() {
    return (
        <section className="bg-gradient-to-b from-[#FAFAF8] via-[#ECE0D4] to-[#AB7169] w-full pt-24 pb-2 md:pb-16 px-6 md:px-12 overflow-hidden">
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
                        <h2 className="text-3xl md:text-5xl font-bold text-[#5D6676] leading-[1.1] tracking-tight">
                            BeautiFy Channel<br />
                            La tua Beauty Routine Sonora
                        </h2>
                        <p className="text-zinc-700 text-lg md:text-xl leading-relaxed">
                            Finalmente anche in Italia un vero must have per gli istituti di bellezza: <br className="block md:hidden" />
                            <span className="whitespace-nowrap inline-block mt-1 md:mt-0">il <strong className="text-[#AB7169]">MARKETING SONORO</strong></span><br /><br />
                            Estremamente innovativo, straordinariamente utile, elegantemente coinvolgente. BeautiFy Channel è la soluzione innovativa di marketing sonoro ideata per aumentare le
                            vendite, la professionalità e la customer experience nel settore del beauty, inducendo una
                            piacevole sensazione di coinvolgimento
                        </p>
                        <div className="pt-4">
                            <Link href="#trial-form">
                                <Button
                                    className="bg-[#AB7169] hover:bg-[#5D6676] text-white font-bold tracking-wider uppercase px-8 md:px-12 py-3 md:py-4 h-auto text-sm md:text-lg rounded-full shadow-[0_8px_30px_rgba(171,113,105,0.4)] transition-all border-none"
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
                        className="flex-[1.2] w-full flex justify-center"
                    >
                        <img
                            src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772733090547-nfq28.png"
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
                        <h2 className="text-3xl md:text-5xl font-bold text-[#5D6676] leading-[1.1] tracking-tight">
                            Un'eccellenza nell’intrattenimento in istituto
                        </h2>
                        <p className="text-zinc-700 text-lg leading-relaxed">
                            In grado di arricchire un raffinato sottofondo
                            sonoro - scelto in perfetta coerenza con il settore - con efficaci input informativi e
                            promozionali.
                        </p>
                        <p className="text-zinc-700 text-lg leading-relaxed">
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
                                        className="bg-[#AB7169] hover:bg-[#5D6676] text-white font-bold tracking-wider uppercase px-8 md:px-12 py-3 md:py-4 h-auto text-sm md:text-lg rounded-full shadow-[0_8px_30px_rgba(171,113,105,0.4)] transition-all border-none"
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
                    className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto pt-8 md:pt-24 space-y-8"
                >
                    <h2
                        className="text-2xl md:text-3xl font-bold text-white leading-snug"
                        style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}
                    >
                        <span className="text-4xl md:text-5xl lg:text-6xl block mb-4 text-[#FAFAF8] font-black">COME?</span>
                        Con un semplice clic accedendo in modo semplice e <br className="hidden md:block" />
                        sicuro a BeautiFy Channel
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-10">
                        <div className="flex flex-col items-center md:items-end text-center md:text-right max-w-sm">
                            <p className="text-[#FAFAF8] text-lg md:text-2xl font-black tracking-widest leading-tight uppercase" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                                UN SEMPLICE CLICK ANCHE PER<br />ASCOLTARE UNA DEMO DEL MOOD BEAUTIFY
                            </p>
                            <ArrowRight className="text-[#FAFAF8] mt-4 w-8 h-8 rotate-90 md:rotate-0" strokeWidth={2.5} />
                        </div>
                        <AudioPlayerMinimal src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
                    </div>

                    {/* 4 Elegant Square Blocks */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-6xl pt-8 pb-12">
                        {/* Block 1 */}
                        <div className="bg-[#FAFAF8]/90 backdrop-blur-md border border-[#D8B2A3] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-start text-center h-full shadow-2xl transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-[#5D6676] flex items-center justify-center mb-4 sm:mb-6 text-white shrink-0">
                                <span className="text-xl font-bold">1</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <p className="text-[#5D6676] text-lg sm:text-xl font-medium leading-relaxed drop-shadow-sm">
                                    Nel corso di un intrattenimento musicale dal sound ricercato, l’assistente digitale BeautiFy
                                    interviene, con dolcezza e professionalità, per offrire spunti generici legati al mondo della
                                    bellezza e del benessere, regalando così una vera e propria beauty routine sonora
                                </p>
                            </div>
                        </div>

                        {/* Block 2 */}
                        <div className="bg-[#FAFAF8]/90 backdrop-blur-md border border-[#D8B2A3] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-start text-center h-full shadow-2xl hover:bg-white transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-[#5D6676] flex items-center justify-center mb-4 sm:mb-6 text-white shrink-0">
                                <span className="text-xl font-bold">2</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <p className="text-[#5D6676] text-lg sm:text-xl font-medium leading-relaxed drop-shadow-sm">
                                    Questo stimola efficacemente l’interesse delle clienti e sollecita la loro richiesta di informazioni
                                    su prodotti e trattamenti proprio mentre sono nel tuo salone, creando una percezione positiva
                                    dell’ambiente che ne aumenta la fidelizzazione
                                </p>
                            </div>
                        </div>

                        {/* Block 3 */}
                        <div className="bg-[#FAFAF8]/90 backdrop-blur-md border border-[#D8B2A3] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-start text-center h-full shadow-2xl hover:bg-white transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-[#5D6676] flex items-center justify-center mb-4 sm:mb-6 text-white shrink-0">
                                <span className="text-xl font-bold">3</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <p className="text-[#5D6676] text-lg sm:text-xl font-medium leading-relaxed drop-shadow-sm">
                                    BeautiFy Channel è un supporto irrinunciabile per la tua professione, perché ti consentirà di non
                                    preoccuparti più della comunicazione interna del tuo salone, ma di dedicarti e concentrarti
                                    pienamente sullo svolgimento del tuo lavoro
                                </p>
                            </div>
                        </div>

                        {/* Block 4 */}
                        <div className="bg-[#FAFAF8]/90 backdrop-blur-md border border-[#D8B2A3] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-start text-center h-full shadow-2xl transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-[#5D6676] flex items-center justify-center mb-4 sm:mb-6 text-white shrink-0">
                                <span className="text-xl font-bold">4</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <p className="text-[#5D6676] text-lg sm:text-xl font-medium leading-relaxed drop-shadow-sm">
                                    Inoltre, BeautiFy Channel ti mette a disposizione altri 6 canali audio oltre al canale principale, per cambiare mood durante la giornata, magari con DEEP SOFT nel weekend o Jazz nell'orario di chiusura, sempre con il supporto di suggerimenti audio dell’assistente digitale BeautiFy
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
