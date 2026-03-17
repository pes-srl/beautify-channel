"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600"] });

function HeroAudioPlayer({ src }: { src: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch((e) => {
                console.error("Playback failed", e);
                setIsPlaying(false);
            });
        }
    };

    return (
        <div className="flex flex-col items-start justify-center">
            <audio
                ref={audioRef}
                preload="auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
            >
                <source src={src} type="audio/mpeg" />
            </audio>
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-[2px] bg-gradient-to-r from-[#F8BBD0] to-[#DDA0DD] hover:scale-110 active:scale-95 transition-all cursor-pointer group shadow-[0_0_30px_rgba(248,187,208,0.6),_0_15px_45px_rgba(248,187,208,0.3),_inset_0_2px_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(248,187,208,0.8),_0_20px_60px_rgba(248,187,208,0.4),_inset_0_2px_15px_rgba(255,255,255,0.3)] flex mt-4">
                <button
                    onClick={togglePlay}
                    className="flex-1 rounded-full flex items-center justify-center text-[#5D6676] bg-white bg-opacity-90 backdrop-blur-sm w-full h-full"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <Pause size={54} strokeWidth={1.5} fill="none" className="transition-all" />
                    ) : (
                        <Play size={54} strokeWidth={1.5} fill="none" className="ml-1 transition-all" />
                    )}
                </button>
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
                        className={`text-4xl md:text-5xl lg:text-7xl font-semibold bg-linear-to-r from-blue-500 to-fuchsia-500 bg-clip-text text-white leading-[1.1] mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] tracking-tight ${montserrat.className}`}
                    >
                        COME FAI SENZA BEAUTIFY?
                    </h1>

                    <HeroAudioPlayer src="/audio/beautify-demo.mp3" />
                </motion.div>
            </div>
        </section >
    );
}
