"use client";

import { motion } from "framer-motion";
import { ArrowRight, Music, RadioTower, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroNew() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl mx-auto text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse"></span>
                    <span className="text-sm font-medium text-zinc-300">Assistente Digitale per Beauty & Hair</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-linear-to-r from-zinc-100 via-zinc-300 to-zinc-500 text-transparent bg-clip-text">
                    Ciao sono Tati, <br className="hidden md:block" />
                    <span className="bg-linear-to-r from-fuchsia-400 to-indigo-500 text-transparent bg-clip-text">la tua assistente Beautify</span>
                </h1>

                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Dall'accoglienza alla cassa, ti aiuto a gestire le attività del tuo istituto. Offri un'esperienza premium senza chiamate perse e clienti in attesa.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/login">
                        <Button size="lg" className="h-14 px-8 text-base bg-white text-zinc-950 hover:bg-zinc-200 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all rounded-full">
                            Voglio Iniziare <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="#pricing" className="group flex items-center gap-2 h-14 px-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-md text-zinc-300">
                        Scopri i Piani
                    </Link>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="mt-24 w-full max-w-5xl mx-auto relative"
            >
                {/* Visual placeholder for the smiling receptionist / assistant */}
                <div className="aspect-video rounded-2xl md:rounded-[2rem] border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl relative overflow-hidden flex items-center justify-center group overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-fuchsia-500/10 via-transparent to-indigo-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="flex flex-col items-center justify-center p-8 text-center relative z-10 w-full hover:scale-105 transition-transform duration-700">
                        {/* Avatar simulation */}
                        <div className="h-32 w-32 rounded-full border border-fuchsia-500/30 overflow-hidden relative shadow-[0_0_30px_rgba(217,70,239,0.2)] mb-6">
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" alt="Tati Assistant" className="object-cover w-full h-full opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all" />
                        </div>
                        <div className="h-2 w-48 bg-white/10 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-linear-to-r from-fuchsia-500 to-indigo-500 w-1/2 animate-[pulse_2s_ease-in-out_infinite]" />
                        </div>
                        <div className="h-2 w-32 bg-white/5 rounded-full" />
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
