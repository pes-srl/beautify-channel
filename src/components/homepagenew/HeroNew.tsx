"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroNew() {
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
            <div className="absolute inset-0 bg-black/40 md:bg-black/30 w-full h-full"></div>

            {/* Container for Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto">

                {/* Left Side: Text and Buttons */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full md:w-1/2 max-w-2xl"
                >
                    <h1
                        className="text-4xl md:text-5xl lg:text-7xl font-black bg-linear-to-r from-blue-500 to-fuchsia-500 bg-clip-text text-white leading-[1.1] mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] tracking-tight"
                    >
                        COME FAI SENZA BEAUTIFY?
                    </h1>

                    <Link href="#pricing">
                        <Button
                            className="hover:brightness-110 text-white font-bold tracking-wider uppercase px-12 py-7 text-xl rounded-full shadow-[0_8px_30px_rgba(45,10,78,0.4)] transition-all border-none"
                            style={{ background: 'linear-gradient(90deg, #2D0A4E 0%, #7B2CBF 50%, #F5F3F7 100%)' }}
                        >
                            Scoprici
                        </Button>
                    </Link>
                </motion.div>



            </div>
        </section >
    );
}
