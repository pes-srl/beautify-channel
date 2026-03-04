"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroNew() {
    return (
        <section
            className="relative w-full h-[60vh] min-h-[500px] flex items-center overflow-hidden"
            style={{
                backgroundImage: `url('https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/hero-assistente-tati-webp.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Dark overlay to make text readable on the background */}
            <div className="absolute inset-0 bg-black/40 md:bg-black/30 w-full h-full"></div>

            {/* Container for Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center h-full">

                {/* Left Side: Text and Buttons */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full md:w-1/2 max-w-2xl pt-20 md:pt-0"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 drop-shadow-lg tracking-tight">
                        Ciao sono Tati, la tua assistente digitale BeautiFy
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-100 font-medium mb-10 drop-shadow-md">
                        Scopri come posso esserti utile nel tuo istituto di bellezza!
                    </p>

                    <Link href="#pricing">
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wider uppercase px-10 py-6 text-lg rounded-xl shadow-2xl transition-all border border-emerald-500/50"
                        >
                            Scoprimi
                        </Button>
                    </Link>
                </motion.div>

                {/* Right Side: Absolute Positioned Cutout Character */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="absolute bottom-0 right-0 md:right-10 w-[70%] sm:w-[50%] md:w-[45%] lg:w-[35%] max-w-[600px] pointer-events-none"
                >
                    <img
                        src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772627761288-rotgha.png"
                        alt="Tati Assistente Digitale"
                        className="w-full h-auto object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    />
                </motion.div>

            </div>
        </section>
    );
}
