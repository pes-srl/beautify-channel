"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroNew() {
    return (
        <section
            className="relative w-full min-h-[60vh] md:min-h-screen flex items-end pb-10 md:pb-32 flex-col justify-end overflow-hidden"
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
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 w-full">

                {/* Left Side: Text and Buttons */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full md:w-1/2 max-w-2xl"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-8 drop-shadow-lg tracking-tight">
                        COME FAI SENZA BEAUTIFY?
                    </h1>

                    <Link href="#pricing">
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wider uppercase px-10 py-6 text-lg rounded-xl shadow-2xl transition-all border border-emerald-500/50"
                        >
                            Scoprimi
                        </Button>
                    </Link>
                </motion.div>



            </div>
        </section>
    );
}
