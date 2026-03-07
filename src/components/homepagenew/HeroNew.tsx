"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
            style={{
                backgroundImage: `url('https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772477085817-oajaaf.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Dark overlay to make text readable on the background (minimal 3% opacity) */}
            <div className="absolute inset-0 bg-black/3 w-full h-full"></div>

            {/* Bottom fade to white – softens transition to next section */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAFA] to-transparent pointer-events-none"></div>

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

                    <a
                        href="#vantaggi"
                        onClick={(e) => handleScrollTo(e, "#vantaggi")}
                    >
                        <Button
                            className="bg-[#7B2CBF] hover:bg-[#6A25A3] text-white font-bold tracking-wider uppercase px-8 md:px-12 py-4 md:py-7 text-base md:text-xl rounded-[2.5rem] shadow-[0_8px_30px_rgba(45,10,78,0.4)] transition-all border-none"
                        >
                            Scoprici
                        </Button>
                    </a>
                </motion.div>
            </div>
        </section >
    );
}
