"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useId } from "react";
import { Play, Pause, ArrowRight } from "lucide-react";
import { Montserrat, Inter } from "next/font/google";
import Image from "next/image";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "600"] });

function AudioPlayerMinimal({ src }: { src: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playerId = useId();

    useEffect(() => {
        const handleGlobalPlay = (e: CustomEvent) => {
            if (e.detail.id !== playerId) {
                const audio = audioRef.current;
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
                setIsPlaying(false);
            }
        };

        window.addEventListener("globalAudioPlay", handleGlobalPlay as EventListener);
        return () => window.removeEventListener("globalAudioPlay", handleGlobalPlay as EventListener);
    }, [playerId]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        setHasInteracted(true);

        if (isPlaying) {
            audio.pause();
        } else {
            window.dispatchEvent(new CustomEvent("globalAudioPlay", { detail: { id: playerId } }));
            audio.play().catch((e) => {
                console.error("Playback failed", e);
                setIsPlaying(false);
            });
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const remainingTime = duration - currentTime;
    const formatTime = (time: number) => {
        if (!time || isNaN(time) || time < 0) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <audio
                ref={audioRef}
                preload="auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
            >
                <source src={src} type="audio/mpeg" />
            </audio>
            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full p-[2px] bg-gradient-to-r from-[#F8BBD0] to-[#DDA0DD] hover:scale-110 active:scale-95 transition-all cursor-pointer group shadow-[0_0_30px_rgba(248,187,208,0.6),_0_15px_45px_rgba(248,187,208,0.3),_inset_0_2px_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(248,187,208,0.8),_0_20px_60px_rgba(248,187,208,0.4),_inset_0_2px_15px_rgba(255,255,255,0.3)] flex">
                <button
                    onClick={togglePlay}
                    className="flex-1 rounded-full flex items-center justify-center text-[#5D6676] bg-white bg-opacity-90 backdrop-blur-sm w-full h-full"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <Pause size={64} strokeWidth={1.5} fill="none" className="transition-all" />
                    ) : (
                        <Play size={64} strokeWidth={1.5} fill="none" className="ml-1 transition-all" />
                    )}
                </button>
            </div>
            {isPlaying && duration > 0 && (
                <div className="mt-4 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium text-sm md:text-base tabular-nums shadow-lg tracking-wider">
                    -{formatTime(remainingTime)}
                </div>
            )}
        </div>
    );
}

export function InfoBlocks2026() {
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
                        <h2 className={`text-4xl md:text-6xl font-semibold text-[#5D6676] leading-[1.1] tracking-tight ${montserrat.className}`}>
                            BeautiFy Channel<br />
                            <span className="text-2xl md:text-4xl">La tua Beauty Routine Sonora</span>
                        </h2>

                        <p className={`text-xl md:text-2xl leading-relaxed font-light text-zinc-700 ${inter.className}`}>
                            Finalmente anche in Italia un vero must have per gli istituti di bellezza: <br className="block md:hidden" />
                            <span className="whitespace-nowrap inline-block mt-1 md:mt-0">il <strong className="text-[#DDA0DD] font-semibold">MARKETING SONORO</strong></span><br /><br />
                            Estremamente innovativo, straordinariamente utile, elegantemente coinvolgente. BeautiFy Channel è l’avanzata soluzione di marketing sonoro ideata per aumentare le
                            vendite, la professionalità e la customer experience nel settore del beauty, inducendo una
                            piacevole sensazione di benessere
                        </p>
                        <div className="pt-4">
                            <a
                                href="#trial-form"
                                onClick={(e) => handleScrollTo(e, "#trial-form")}
                            >
                                <Button
                                    className={`bg-gradient-to-r from-[#F8BBD0] to-[#DDA0DD] hover:from-[#F48FB1] hover:to-[#D48DD4] text-white font-semibold tracking-wider uppercase px-8 md:px-12 py-3 md:py-4 h-auto text-sm md:text-lg rounded-[35px] shadow-[0_8px_30px_rgba(248,187,208,0.4)] transition-all border-none ${montserrat.className}`}
                                >
                                    PROVA GRATUITA 7 GIORNI
                                </Button>
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full flex justify-center relative h-[300px] md:h-[400px] lg:h-[450px]"
                    >
                        <Image
                            src="/relax-sensoriale.png"
                            alt="BeautiFy Channel Beauty Room Relax Sensoriale"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover rounded-[33px] shadow-2xl"
                        />
                    </motion.div>
                </div>

                {/* Block 2: Image Left, Text Right */}
                <div id="servizio" className="flex flex-col md:flex-row-reverse items-center justify-between gap-12 md:gap-20 scroll-mt-24">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 space-y-6"
                    >
                        <h2 className={`text-3xl md:text-5xl font-semibold text-[#5D6676] leading-[1.1] tracking-tight ${montserrat.className}`}>
                            Tutto in un canale unico!
                        </h2>
                        <p className={`text-zinc-700 text-xl md:text-2xl leading-relaxed font-light ${inter.className}`}>
                            BeautiFy Channel è un’eccellenza nell’intrattenimento in istituto, in grado di arricchire un raffinato sottofondo
                            sonoro - scelto in perfetta coerenza con il settore - con efficaci input informativi e
                            promozionali.
                        </p>
                        <p className={`text-zinc-700 text-xl md:text-2xl leading-relaxed font-light ${inter.className}`}>
                            Una potente combo creata per regalare alle tue clienti momenti di immediate e coinvolgenti
                            sensazioni, aiutandoti ad aumentare le vendite in un modo mai così smart e godibile!
                        </p>
                        <div className="pt-4 flex justify-center md:justify-start">
                            <a
                                href="#trial-form"
                                onClick={(e) => handleScrollTo(e, "#trial-form")}
                            >
                                <Button
                                    className="bg-gradient-to-r from-[#DDA0DD] to-[#F8BBD0] hover:from-[#D48DD4] hover:to-[#F48FB1] text-white font-bold tracking-wider uppercase px-8 md:px-12 py-3 md:py-4 h-auto text-sm md:text-lg rounded-[35px] shadow-[0_8px_30px_rgba(248,187,208,0.4)] transition-all border-none"
                                >
                                    7 GIORNI DI TEST SENZA IMPEGNO
                                </Button>
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full flex justify-center md:justify-start"
                    >
                        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px]">
                            <Image
                                src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772727853683-sr1147.png"
                                alt="Assistente Tati"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover rounded-[33px] shadow-2xl"
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
                    className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto -mt-8 md:-mt-12 py-8 md:py-24 space-y-12"
                >
                    <div className="space-y-4">
                        <h2 className={`text-4xl md:text-6xl font-semibold text-[#5D6676] tracking-tighter uppercase ${montserrat.className}`}>
                            COME?
                        </h2>
                        <p className={`text-xl md:text-2xl text-[#5D6676]/80 font-normal leading-relaxed max-w-3xl mx-auto ${inter.className}`}>
                            Con un semplice clic per accendere BeautiFy Channel!
                        </p>
                    </div>

                    {/* Glassmorphism Demo Card */}
                    <div className="relative w-full max-w-4xl p-[1px] rounded-[35px] bg-gradient-to-br from-white/40 to-white/10 shadow-3xl">
                        <div className="bg-white/10 backdrop-blur-2xl rounded-[35px] p-8 md:p-12 flex flex-col items-center justify-between gap-8 border border-white/20">
                            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-10">
                                <div className="flex-1 text-center space-y-4">
                                    <h3 className={`text-[#5D6676] text-2xl md:text-3xl font-semibold leading-tight uppercase tracking-tight ${montserrat.className}`}>
                                        Ascolta una demo<br />del Mood BeautiFy
                                    </h3>
                                    <p className={`text-[#5D6676]/70 text-lg font-normal ${inter.className}`}>
                                        Goditi l’atmosfera della Beauty Routine Sonora.
                                    </p>
                                </div>

                                <div className="relative group mt-6 md:mt-0">
                                    {/* Pulse Effect Background */}
                                    <div className="absolute inset-0 bg-[#AB7169]/20 rounded-full blur-3xl group-hover:bg-[#AB7169]/30 transition-all duration-500 animate-pulse"></div>
                                    <AudioPlayerMinimal src="/audio/beautify-demo.mp3" />
                                </div>
                            </div>
                            <p className={`text-xs md:text-sm text-[#5D6676] font-semibold italic text-center max-w-3xl mt-2 ${inter.className}`}>
                                *In questa demo audio, le canzoni sono state accorciate e le promo sonore sono più presenti per offrirti una panoramica immediata. Nel servizio reale, si inseriscono in modo discreto ed elegante ogni 15–20 minuti.
                            </p>
                        </div>

                        {/* Decorative floating icon */}
                        <div className="absolute -top-6 -right-6 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center rotate-12 hidden md:flex">
                            <ArrowRight className="text-[#AB7169] w-6 h-6 rotate-[160deg]" />
                        </div>
                    </div>

                    {/* Refined Integrated Info Blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl pt-32 md:pt-48 pb-0 mx-auto relative z-10">

                        {/* Block 1 */}
                        <motion.div
                            id="vantaggi"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            whileHover={{ y: -5, scale: 1.01 }}
                            className="bg-[#FAFAF8] rounded-[2rem] p-8 md:p-10 shadow-xl border border-[#D8B2A3]/20 flex flex-col items-center justify-center text-center gap-6 transition-all duration-300 min-h-[180px]"
                        >
                            <p className={`text-[#5D6676] text-xl md:text-2xl font-light leading-relaxed ${inter.className}`}>
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
                            className="bg-[#FAFAF8] rounded-[2rem] p-8 md:p-10 shadow-xl border border-[#D8B2A3]/20 flex flex-col items-center justify-center text-center gap-6 transition-all duration-300 min-h-[180px]"
                        >
                            <p className={`text-[#5D6676] text-xl md:text-2xl font-light leading-relaxed ${inter.className}`}>
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
                            className="bg-[#FAFAF8] rounded-[2rem] p-8 md:p-10 shadow-xl border border-[#D8B2A3]/20 flex flex-col items-center justify-center text-center gap-6 transition-all duration-300 min-h-[180px]"
                        >
                            <p className={`text-[#5D6676] text-xl md:text-2xl font-light leading-relaxed ${inter.className}`}>
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
                            className="bg-[#FAFAF8] rounded-[2rem] p-8 md:p-10 shadow-xl border border-[#D8B2A3]/20 flex flex-col items-center justify-center text-center gap-6 transition-all duration-300 min-h-[180px]"
                        >
                            <p className={`text-[#5D6676] text-xl md:text-2xl font-light leading-relaxed ${inter.className}`}>
                                Inoltre, BeautiFy Channel ti mette a disposizione altri <span className="text-[#AB7169] font-bold">6 canali audio</span> oltre al principale, per cambiare mood durante la giornata, sempre con il supporto dell’assistente digitale BeautiFy.
                            </p>
                        </motion.div>
                    </div>


                </motion.div>
            </div>
        </section>
    );
}
