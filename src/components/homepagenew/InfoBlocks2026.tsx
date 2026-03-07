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
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(() => {
                    // Browser blocked or interrupted playback (e.g. autoplay policy)
                    setIsPlaying(false);
                });
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />
            <button
                onClick={togglePlay}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#5D6676] flex items-center justify-center text-[#5D6676] hover:scale-110 active:scale-95 transition-all bg-[#5D6676]/5 backdrop-blur-sm cursor-pointer group shadow-[0_0_20px_rgba(255,255,255,0.3),_0_15px_45px_rgba(0,0,0,0.1),_inset_0_2px_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.8),_0_20px_60px_rgba(93,102,118,0.2),_inset_0_2px_15px_rgba(255,255,255,0.3)]"
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
        <section className="bg-gradient-to-b from-[#FAFAFA] via-[#ECE0D4] to-[#AB7169] w-full pt-16 pb-8 md:pt-24 md:pb-10 px-6 md:px-12 overflow-hidden">
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
                                    className="bg-[#AB7169] hover:bg-[#5D6676] text-white font-bold tracking-wider uppercase px-8 md:px-12 py-3 md:py-4 h-auto text-sm md:text-lg rounded-[2.5rem] shadow-[0_8px_30px_rgba(171,113,105,0.4)] transition-all border-none"
                                >
                                    PROVA GRATUITA 7 GIORNI
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full flex justify-center"
                    >
                        <img
                            src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772733090547-nfq28.png"
                            alt="BeautiFy Channel Beauty Room"
                            className="w-full h-auto md:h-[450px] aspect-[16/10] md:aspect-auto object-cover rounded-[2.5rem] shadow-2xl"
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
                        <div className="pt-4 flex justify-center md:justify-start">
                            <Link href="#trial-form">
                                <Button
                                    className="bg-[#AB7169] hover:bg-[#5D6676] text-white font-bold tracking-wider uppercase px-8 md:px-12 py-3 md:py-4 h-auto text-sm md:text-lg rounded-[2.5rem] shadow-[0_8px_30px_rgba(171,113,105,0.4)] transition-all border-none"
                                >
                                    7 GIORNI DI TEST SENZA IMPEGNO
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full flex justify-center md:justify-start"
                    >
                        <div className="relative w-full">
                            <img
                                src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772727853683-sr1147.png"
                                alt="Assistente Tati"
                                className="w-full h-auto md:h-[450px] aspect-[16/10] md:aspect-auto object-cover rounded-[2.5rem] shadow-2xl"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Block 3: Modernized Philosophy and Pricing Block */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto py-8 md:py-24 space-y-12"
                >
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black text-[#5D6676] tracking-tighter uppercase">
                            COME?
                        </h2>
                        <p className="text-xl md:text-2xl text-[#5D6676]/80 font-medium leading-relaxed max-w-3xl mx-auto">
                            Con un semplice clic accedendo in modo semplice e <br className="hidden md:block" />
                            sicuro a BeautiFy Channel
                        </p>
                    </div>

                    {/* Glassmorphism Demo Card */}
                    <div className="relative w-full max-w-4xl p-[1px] rounded-[2.5rem] bg-gradient-to-br from-white/40 to-white/10 shadow-3xl">
                        <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 border border-white/20">
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <h3 className="text-[#5D6676] text-2xl md:text-3xl font-black leading-tight uppercase tracking-tight">
                                    Ascolta una demo<br />del Mood BeautiFy
                                </h3>
                                <p className="text-[#5D6676]/70 text-lg font-bold">
                                    La Tua Beauty Routine Sonora
                                </p>
                                <div className="pt-2 hidden md:block">
                                    <div className="inline-flex items-center gap-2 bg-[#AB7169] border border-[#AB7169]/20 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm hover:bg-[#5D6676] transition-all duration-300">
                                        <div className="text-white font-bold tracking-widest uppercase text-xs md:text-sm">
                                            CON UN SEMPLICE CLICK ;-)
                                        </div>
                                        <div className="h-px w-8 bg-white/30"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                {/* Pulse Effect Background */}
                                <div className="absolute inset-0 bg-[#AB7169]/20 rounded-full blur-3xl group-hover:bg-[#AB7169]/30 transition-all duration-500 animate-pulse"></div>
                                <AudioPlayerMinimal src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
                            </div>
                        </div>

                        {/* Decorative floating icon */}
                        <div className="absolute -top-6 -right-6 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center rotate-12 hidden md:flex">
                            <ArrowRight className="text-[#AB7169] w-6 h-6 rotate-[160deg]" />
                        </div>
                    </div>

                    {/* Refined Integrated Info Blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl py-16 mx-auto relative z-10">

                        {/* Block 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            whileHover={{ y: -5, scale: 1.01 }}
                            className="bg-[#FAFAF8] rounded-[2rem] p-8 md:p-10 shadow-xl border border-[#D8B2A3]/20 flex flex-col gap-6 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#5D6676] flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-md">
                                1
                            </div>
                            <p className="text-[#5D6676] text-lg md:text-xl font-medium leading-relaxed">
                                Nel corso di un intrattenimento musicale dal sound ricercato, l’assistente digitale <span className="text-[#AB7169] font-bold">BeautiFy</span> interviene, con dolcezza e professionalità, per offrire spunti generici legati al mondo della bellezza e del benessere.
                            </p>
                        </motion.div>

                        {/* Block 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            whileHover={{ y: -5, scale: 1.01 }}
                            className="bg-[#FAFAF8] rounded-[2rem] p-8 md:p-10 shadow-xl border border-[#D8B2A3]/20 flex flex-col gap-6 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#AB7169] flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-md">
                                2
                            </div>
                            <p className="text-[#5D6676] text-lg md:text-xl font-medium leading-relaxed">
                                Questo stimola efficacemente l’interesse delle clienti e sollecita la loro richiesta di informazioni su <span className="text-[#AB7169] font-bold">prodotti e trattamenti</span> proprio mentre sono nel tuo salone.
                            </p>
                        </motion.div>

                        {/* Block 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            whileHover={{ y: -5, scale: 1.01 }}
                            className="bg-[#FAFAF8] rounded-[2rem] p-8 md:p-10 shadow-xl border border-[#D8B2A3]/20 flex flex-col gap-6 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#AB7169] flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-md">
                                3
                            </div>
                            <p className="text-[#5D6676] text-lg md:text-xl font-medium leading-relaxed">
                                BeautiFy Channel è un <span className="text-[#AB7169] font-bold">supporto irrinunciabile</span> per la tua professione, perché ti consente di dedicarti pienamente al tuo lavoro senza preoccuparti della comunicazione interna.
                            </p>
                        </motion.div>

                        {/* Block 4 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            whileHover={{ y: -5, scale: 1.01 }}
                            className="bg-[#FAFAF8] rounded-[2rem] p-8 md:p-10 shadow-xl border border-[#D8B2A3]/20 flex flex-col gap-6 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#5D6676] flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-md">
                                4
                            </div>
                            <p className="text-[#5D6676] text-lg md:text-xl font-medium leading-relaxed">
                                Inoltre, BeautiFy Channel ti mette a disposizione altri <span className="text-[#AB7169] font-bold">6 canali audio</span> oltre al principale, per cambiare mood durante la giornata, sempre con il supporto dell’assistente digitale BeautiFy.
                            </p>
                        </motion.div>
                    </div>


                </motion.div>
            </div>
        </section>
    );
}
