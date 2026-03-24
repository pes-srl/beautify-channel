"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useId } from "react";
import { Play, Pause } from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600"] });

function HeroAudioPlayer({ src }: { src: string }) {
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
        <div className="flex flex-col items-start justify-center">
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
            <div className="flex flex-col items-center w-fit">
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full p-[2px] bg-gradient-to-r from-[#F8BBD0] to-[#DDA0DD] hover:scale-110 active:scale-95 transition-all cursor-pointer group shadow-[0_0_30px_rgba(248,187,208,0.6),_0_15px_45px_rgba(248,187,208,0.3),_inset_0_2px_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(248,187,208,0.8),_0_20px_60px_rgba(248,187,208,0.4),_inset_0_2px_15px_rgba(255,255,255,0.3)] flex mt-2 md:mt-4 lg:mt-6">
                    <button
                        onClick={togglePlay}
                        className="flex-1 rounded-full flex flex-col items-center justify-center text-[#5D6676] bg-white bg-opacity-90 backdrop-blur-sm w-full h-full"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying && duration > 0 ? (
                            <>
                                <div className="flex items-center justify-center mt-2">
                                    <Pause size={64} strokeWidth={1.5} fill="none" className="transition-all" />
                                </div>
                                <div className="h-6 mt-1 flex items-center justify-center">
                                    <span className="text-[11px] md:text-xs lg:text-sm font-bold tracking-widest opacity-80 uppercase tabular-nums">
                                        -{formatTime(remainingTime)}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center">
                                <Play size={64} strokeWidth={1.5} fill="none" className="ml-2 transition-all" />
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function HeroNew() {
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
        <section
            className="relative w-full min-h-[60vh] md:min-h-[85vh] flex items-end py-12 md:py-24 flex-col justify-end overflow-hidden px-6 md:px-12"
        >
            {/* Optimized Background Image */}
            <Image
                src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772477085817-oajaaf.png"
                alt="BeautiFy Background Hero"
                fill
                priority
                className="object-cover object-center -z-10"
                sizes="100vw"
            />

            {/* Dark overlay to make text readable on the background (minimal 3% opacity) */}
            <div className="absolute inset-0 bg-black/3 w-full h-full -z-10"></div>

            {/* Bottom fade to white – softens transition to next section */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAFA] to-transparent pointer-events-none -z-10"></div>

            {/* Container for Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto">

                {/* Left Side: Text and Buttons */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full md:w-1/2 max-w-2xl mt-32 md:mt-48 lg:mt-64"
                >
                    <h1
                        className={`text-4xl md:text-5xl lg:text-7xl font-semibold bg-linear-to-r from-blue-500 to-fuchsia-500 bg-clip-text text-white leading-[1.1] mb-2 md:mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] tracking-tight ${montserrat.className}`}
                    >
                        COME FAI SENZA BEAUTIFY?
                    </h1>

                    <HeroAudioPlayer src="/audio/beautify-demo.mp3" />
                </motion.div>
            </div>
        </section >
    );
}
