"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero2026_03() {
    return (
        <section
            className="relative w-full min-h-[60vh] md:min-h-[85vh] flex items-end pb-12 md:pb-24 flex-col justify-end overflow-hidden px-6 md:px-12"
            style={{
                backgroundImage: `url('https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772477085817-oajaaf.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Dark overlay to make text readable on the background */}
            <div className="absolute inset-0 bg-black/60 md:bg-black/50 w-full h-full"></div>

            {/* Container for Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto">

                {/* Left Side: Text and Buttons */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full md:w-1/2 max-w-2xl"
                >
                    <Link href="#pricing">
                        <Button
                            className="bg-[#7E415F] hover:bg-[#D1A1AE] text-[#F3F1ED] hover:text-[#38231F] font-bold tracking-wider uppercase px-8 md:px-12 py-4 md:py-7 text-base md:text-xl rounded-full shadow-[0_8px_30px_rgba(126,65,95,0.5)] transition-all border-none"
                        >
                            Scoprici
                        </Button>
                    </Link>
                </motion.div>

            </div>
        </section >
    );
}
