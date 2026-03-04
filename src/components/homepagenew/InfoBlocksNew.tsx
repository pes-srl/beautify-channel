"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function InfoBlocksNew() {
    return (
        <section className="bg-[#1E0C31] w-full py-24 px-6 md:px-12 overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-32">

                {/* Block 1: Text Left, Image Right */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 space-y-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight font-sans">
                            BeautiFy Channel<br />
                            La tua Beauty Routine Sonora
                        </h2>
                        <p className="text-zinc-300 text-lg leading-relaxed">
                            Finalmente anche in Italia lo strumento di vendita, comunicazione e promozione pensato per il tuo istituto di bellezza! Un'esperienza immersiva e personalizzata per il tuo settore!
                        </p>
                        <div className="pt-4">
                            <Link href="#trial-form">
                                <Button className="bg-linear-to-r from-fuchsia-500 to-fuchsia-400 hover:from-fuchsia-400 hover:to-fuchsia-300 text-white font-bold rounded-full px-8 py-3 h-auto shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all">
                                    PROVAMI GRATIS 7 GIORNI
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full"
                    >
                        <img
                            src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772628409173-tt0cy7.jpeg"
                            alt="BeautiFy Channel Beauty Room"
                            className="w-full h-auto rounded-xl shadow-2xl"
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
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight font-sans">
                            La tua assistente BeautiFy suggerisce elegantemente alle tue clienti, servizi e trattamenti!
                        </h2>
                        <p className="text-zinc-300 text-lg leading-relaxed">
                            Efficaci suggerimenti vocali e armonie musicali perfettamente contestualizzate, una combo adatta ad informare, fidelizzare e aiutarti ad aumentare le vendite!
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full flex justify-center md:justify-start"
                    >
                        <div className="relative">
                            <img
                                src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772628443079-ouyhi3.png"
                                alt="Assistente Tati"
                                className="w-full max-w-sm h-auto object-contain drop-shadow-2xl"
                            />
                            {/* Absolute Button matching the mockup layout */}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full flex justify-center">
                                <Link href="#trial-form">
                                    <Button className="bg-linear-to-r from-blue-500 to-fuchsia-500 hover:from-blue-400 hover:to-fuchsia-400 text-white font-bold rounded-full px-8 py-3 h-auto shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all uppercase whitespace-nowrap">
                                        PROVAMI GRATIS 7 GIORNI
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Block 3: Centered Philosophy and Pricing Block */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto pt-16 space-y-8"
                >
                    <h2 className="text-2xl md:text-4xl font-bold text-white leading-snug">
                        Comunicazione e armonie musicali, studiate per rendere innovativa l'esperienza nel tuo istituto!
                    </h2>

                    <div className="space-y-2">
                        <p className="text-white text-xl font-medium tracking-wide">QUANTO MI COSTA?</p>
                        <p className="text-white text-2xl font-bold">Probabilmente ti costa di più non averlo</p>
                    </div>

                    <div className="py-8">
                        <img
                            src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772477157202-gueksp.png"
                            alt="BeautiFy Gift"
                            className="w-48 md:w-64 h-auto object-contain"
                        />
                    </div>

                    <div className="space-y-6 text-zinc-300 text-lg font-medium leading-relaxed max-w-3xl">
                        <p>
                            BeautiFy suona musica adeguata e propone eleganti soluzioni finalizzate a promuovere trattamenti di tecnologie, trattamenti viso e corpo e qualsiasi cosa ti serva comunicare del tuo istituto!<br />
                            <span className="text-[#FFA5D0]">Un supporto ai tuoi banner e flyer, non dovrai più preoccuparti della comunicazione interna</span>
                        </p>

                        <p>
                            Nella versione Basic, oltre a BeautiFy Channel, avrai a disposizione altri 6 canali audio:<br />
                            <span className="text-[#FFA5D0]">Relax, Lounge, Jazz, Massage, Acoustic Vocal e Deep Soft</span>
                        </p>

                        <p>
                            Nelle versione Premium, si aggiungono<br />
                            <span className="text-[#FFA5D0]">Laser Channel e Cosmetic Channel</span>
                        </p>

                        <p>
                            Canali dedicati a tecnologia e cosmetica per quando vuoi promuovere servizi specifici nel tuo istituto
                        </p>
                    </div>

                    <div className="pt-12 pb-8">
                        <img
                            src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772628778770-04iqoa.webp"
                            alt="BeautiFy Channels Devices"
                            className="w-full max-w-lg md:max-w-2xl h-auto object-contain drop-shadow-2xl"
                        />
                    </div>
                </motion.div>

                {/* Block 4: Advantages Comparison */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="pt-16 space-y-12"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white text-center leading-tight tracking-tight">
                        Alcuni vantaggi rispetto ai classici servizi streaming<br className="hidden lg:block" /> tradizionali
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto h-auto lg:h-[450px]">

                        {/* Pros Card */}
                        <div className="bg-[#FAF5FF] rounded-2xl p-8 shadow-xl flex flex-col justify-center space-y-8 h-full">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-green-500 rounded-[4px] p-0.5 shrink-0 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <p className="text-zinc-800 font-medium text-[15px] leading-snug">
                                    Dimentica la gestione della musica in istituto grazie alle nostre Beauty Routine Sonore
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-green-500 rounded-[4px] p-0.5 shrink-0 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <p className="text-zinc-800 font-medium text-[15px] leading-snug">
                                    Ti aiuta ad incrementare le vendite grazie ad eleganti suggerimenti vocali
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-green-500 rounded-[4px] p-0.5 shrink-0 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <p className="text-zinc-800 font-medium text-[15px] leading-snug">
                                    Suggerimenti vocali personalizzati per promuovere i tuoi pacchetti, servizi e promozioni
                                </p>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="rounded-2xl overflow-hidden shadow-xl h-64 lg:h-full">
                            <img
                                src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772477138781-nxz25k.jpg"
                                alt="Streaming Audio Device"
                                className="w-full h-full object-cover object-center"
                            />
                        </div>

                        {/* Cons Card */}
                        <div className="bg-[#FAF5FF] rounded-2xl p-8 shadow-xl flex flex-col justify-between h-full">
                            <div>
                                <h3 className="text-[22px] font-bold text-zinc-950 mb-6 leading-tight">
                                    Mentre gli abituali servizi di streaming...
                                </h3>
                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 text-red-500 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </div>
                                        <p className="text-zinc-800 font-medium text-[14px] leading-snug">
                                            Non fanno crescere il tuo istituto
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 text-red-500 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </div>
                                        <p className="text-zinc-800 font-medium text-[14px] leading-snug">
                                            Non sono personalizzati e non ti aiutano a vendere!
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 text-red-500 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </div>
                                        <p className="text-zinc-800 font-medium text-[14px] leading-snug">
                                            Non sono utilizzabili per legge nelle attività commerciali e propongono pubblicità <strong>non adeguate</strong> al tuo business!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <Link href="#trial-form">
                                    <Button className="w-full sm:w-auto bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold rounded-[8px] px-8 py-5 text-sm shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all uppercase tracking-wide">
                                        PROVA GRATUITA
                                    </Button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </motion.div>

                {/* Block 5: The "Soluzione" Box and WhatsApp CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="pt-24 space-y-12"
                >
                    <h2 className="text-2xl md:text-4xl font-black text-white text-center leading-tight tracking-wide uppercase px-4">
                        Potenzia la tua comunicazione interna!
                    </h2>

                    <div className="max-w-5xl mx-auto bg-[#FDF9FF] rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(217,70,239,0.15)] flex flex-col md:flex-row items-center gap-12 relative overflow-hidden border-2 border-fuchsia-100">
                        {/* Left Side: Solution Text */}
                        <div className="flex-1 space-y-8 relative z-10 w-full">
                            <h3 className="text-xl font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
                                Soluzione <span className="text-yellow-400 text-2xl">★</span>
                            </h3>
                            <h4 className="text-3xl md:text-4xl font-bold text-zinc-900 leading-tight">
                                Scegli un servizio che parla di te e del tuo settore per soli 20,90€
                            </h4>

                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 text-emerald-500 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <p className="text-zinc-700 text-[15px] leading-relaxed">
                                        <strong className="text-indigo-900">Atmosfere sonore adeguate</strong>, 7 canali audio tra cui BeautiFy Channel, per un'esperienza immersiva su misura.
                                    </p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 text-emerald-500 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <p className="text-zinc-700 text-[15px] leading-relaxed">
                                        <strong className="text-indigo-900">Comunicazione personalizzata</strong> Messaggi eleganti e dedicati al tuo settore per valorizzare il tuo istituto.
                                    </p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 text-emerald-500 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <p className="text-zinc-700 text-[15px] leading-relaxed">
                                        <strong className="text-indigo-900">Strumento di vendita e promozione</strong> Aumenta le opportunità di Business con un sistema innovativo.
                                    </p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 text-emerald-500 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <p className="text-zinc-700 text-[15px] leading-relaxed">
                                        <strong className="text-indigo-900">Incremento delle vendite</strong> Migliora l'esperienza del cliente e stimola l'acquisto con una strategia elegante, efficace!
                                    </p>
                                </li>
                            </ul>

                            <p className="text-indigo-900 font-bold uppercase tracking-wide text-[15px] pt-4">
                                UN'ESPERIENZA IMMERSIVA E PERSONALIZZATA PER IL TUO SETTORE!
                            </p>
                        </div>

                        {/* Right Side: Image and Float Button */}
                        <div className="flex-1 relative w-full flex flex-col items-center justify-center">
                            {/* Decorative background mandala shape (subtle) */}
                            <div className="absolute inset-0 bg-[url('https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772477157202-gueksp.png')] bg-contain bg-center bg-no-repeat opacity-10 blur-[2px] scale-150"></div>

                            <img
                                src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772628936421-5gqve.webp"
                                alt="Ragazza Zen Beautify"
                                className="w-full max-w-[400px] h-auto object-contain relative z-10 drop-shadow-2xl"
                            />

                            <div className="relative z-20 -mt-10 md:-mt-16 w-full flex justify-center">
                                <Link href="#trial-form">
                                    <Button className="bg-linear-to-r from-blue-500 to-fuchsia-500 hover:from-blue-400 hover:to-fuchsia-400 text-white font-bold rounded-full px-8 py-3 h-auto shadow-2xl transition-all uppercase whitespace-nowrap text-[13px] md:text-sm">
                                        Prova Gratuita Senza Impegno
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp CTA */}
                    <div className="pt-16 pb-8 flex flex-col items-center justify-center text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                            CHIEDICI ALTRE INFO
                        </h2>
                        <a
                            href="https://wa.link/5apci9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg md:text-xl rounded-full px-10 py-4 shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all hover:scale-105 gap-3"
                        >
                            Scrivici su WhatsApp
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        </a>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
