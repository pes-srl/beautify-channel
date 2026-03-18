"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerTrialAccount } from "@/app/actions/trial-actions";
import { Button } from "@/components/ui/button";
import { Montserrat, Inter } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function BottomCTA2026({ hasSession }: { hasSession?: boolean }) {
    const [fullName, setFullName] = useState("");
    const [salonName, setSalonName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [partitaIva, setPartitaIva] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        if (!termsAccepted) {
            setError("Devi accettare i Termini e Condizioni per proseguire.");
            setIsLoading(false);
            return;
        }

        const isValidPartitaIva = (pi: string) => {
            if (process.env.NODE_ENV === 'development' || pi === '00000000000' || pi === '11111111111' || pi === '23232323232') return true;
            if (!/^[0-9]{11}$/.test(pi)) return false;
            let s = 0;
            for (let i = 0; i < 10; i++) {
                let c = parseInt(pi.charAt(i), 10);
                if ((i + 1) % 2 === 0) {
                    c *= 2;
                    if (c > 9) c -= 9;
                }
                s += c;
            }
            const check = (10 - (s % 10)) % 10;
            return check === parseInt(pi.charAt(10), 10);
        };

        if (!isValidPartitaIva(partitaIva)) {
            setError("La Partita IVA inserita non è valida. Controlla e riprova.");
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("fullName", fullName);
        formData.append("salonName", salonName);
        formData.append("partitaIva", partitaIva);
        formData.append("termsAccepted", String(termsAccepted));

        const result = await registerTrialAccount(formData);

        if (result.error) {
            console.error("REGISTRATION ERROR:", result.error);
            setError(result.error);
        } else {
            // Trigger Welcome Email
            try {
                fetch("/api/send-welcome", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, full_name: fullName })
                });
            } catch (err) {
                console.error("Failed to trigger welcome email:", err);
            }

            if (result.hasSession) {
                setMessage("Attivazione Prova Gratuita in corso...");
                router.push("/area-riservata");
            } else {
                setMessage("Prova attivata! Controlla la tua email per il riepilogo.");
                setTimeout(() => {
                    router.push("/area-riservata");
                }, 2000);
            }
        }
        setIsLoading(false);
    };

    return (
        <section className="bg-[#1E0C31] pt-0 pb-16 md:py-16 px-6 md:px-12 overflow-hidden relative">
            <div className="max-w-6xl mx-auto space-y-12 border-t border-white/5 pt-4 md:pt-8 mt-[-6rem] md:mt-[-8rem]">
                {/* 3. Registration Form (Imported from provagratis) */}
                <motion.div
                    id="trial-form"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="pt-8 flex justify-center w-full"
                >
                    <div className="w-full max-w-4xl relative z-10">
                        <div className="text-center mb-10">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D8B2A3]/10 border border-[#D8B2A3]/20 backdrop-blur-md mb-6 shadow-[0_0_30px_rgba(216,178,163,0.2)]">
                                <Sparkles className="w-8 h-8 text-[#D8B2A3]" />
                            </div>
                            <h2 className={`text-3xl md:text-5xl lg:text-6xl font-semibold text-white mb-3 tracking-tight ${montserrat.className}`}>
                                Inizia la tua Prova Gratuita
                            </h2>
                            <p className="text-[#ECE0D4] text-lg">
                                7 giorni di accesso completo. <br className="md:hidden" /> Nessuna carta di credito richiesta.
                            </p>
                        </div>

                        {hasSession ? (
                            <div className="p-8 md:p-12 rounded-[35px] bg-white/5 border border-[#5D6676]/30 backdrop-blur-xl shadow-2xl text-center flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6 shadow-inner border border-green-500/30">
                                    <Sparkles className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">Sei già autenticata!</h3>
                                <p className="text-zinc-300 text-lg max-w-lg mb-8 leading-relaxed">
                                    La tua postazione è configurata. Accedi direttamente alla tua area riservata per gestire canali o aggiungere servizi personalizzati.
                                </p>
                                <Link href="/area-riservata" className="w-full sm:w-auto">
                                    <Button className="h-14 px-8 w-full bg-linear-to-r from-[#D8B2A3]/80 to-[#AB7169]/80 hover:from-[#D8B2A3] hover:to-[#AB7169] text-white text-lg font-semibold rounded-[35px] tracking-wider transition-all shadow-lg hover:shadow-xl hover:shadow-[#D8B2A3]/20 border-none">
                                        VAI ALL'AREA RISERVATA
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <form onSubmit={handleSignup} className="p-8 md:p-10 rounded-[35px] bg-white/5 border border-[#5D6676]/30 backdrop-blur-xl shadow-2xl">
                                    {error && (
                                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
                                            {error}
                                        </div>
                                    )}

                                    {message && (
                                        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-200 text-sm text-center">
                                            {message}
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName" className="text-[#ECE0D4] font-medium ml-1">Nome Completo</Label>
                                                <Input
                                                    id="fullName"
                                                    type="text"
                                                    placeholder="Es. Mario Rossi"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    required
                                                    className="h-14 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-[#AB7169]/50 rounded-[35px] text-[15px]"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="salonName" className="text-[#ECE0D4] font-medium ml-1">Nome Istituto</Label>
                                                <Input
                                                    id="salonName"
                                                    type="text"
                                                    placeholder="Es. Beauty Spa Milano"
                                                    value={salonName}
                                                    onChange={(e) => setSalonName(e.target.value)}
                                                    required
                                                    className="h-14 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-[#AB7169]/50 rounded-[35px] text-[15px]"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="partitaIva" className="text-[#ECE0D4] font-medium ml-1">Partita IVA</Label>
                                                <Input
                                                    id="partitaIva"
                                                    type="text"
                                                    placeholder="Es. 01234567890"
                                                    value={partitaIva}
                                                    onChange={(e) => setPartitaIva(e.target.value.replace(/\D/g, '').substring(0, 11))}
                                                    required
                                                    maxLength={11}
                                                    className="h-14 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-[#AB7169]/50 rounded-[35px] text-[15px]"
                                                />
                                                <p className="text-xs text-zinc-400 ml-1 mt-1">
                                                    Obbligatorio per convalidare la conformità della registrazione.
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-[#ECE0D4] font-medium ml-1">Indirizzo Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="tuo@istituto.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    className="h-14 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-[#AB7169]/50 rounded-[35px] text-[15px]"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="text-[#ECE0D4] font-medium ml-1">Crea una Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        className="h-14 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-[#AB7169]/50 rounded-[35px] text-[15px] pr-12"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 pt-4 px-1">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                className="mt-1 h-5 w-5 rounded border-white/20 bg-black/40 text-[#AB7169] focus:ring-[#AB7169] focus:ring-offset-zinc-950 shrink-0"
                                            />
                                            <Label htmlFor="terms" className="text-sm text-[#ECE0D4] font-normal leading-relaxed cursor-pointer select-none">
                                                Accetto i <Link href="/termini" className="text-[#D8B2A3] hover:text-[#FAFAF8] underline font-medium">Termini e Condizioni</Link> e la <Link href="/privacy" className="text-[#D8B2A3] hover:text-[#FAFAF8] underline font-medium">Privacy Policy</Link> di BeautiFy Channel.
                                            </Label>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full h-16 mt-4 bg-white/10 hover:bg-white/20 text-white text-sm md:text-lg transition-all border border-white/30 rounded-[35px] tracking-wide"
                                        >
                                            {isLoading ? "Creazione account in corso..." : "INIZIA SUBITO LA PROVA GRATUITA"}
                                        </Button>
                                    </div>
                                </form>

                                <p className="text-center text-[15px] text-[#ECE0D4] mt-8">
                                    Hai già un account?{" "}
                                    <Link href="/login" className="text-[#D8B2A3] hover:text-[#FAFAF8] font-semibold underline-offset-4 hover:underline">
                                        Accedi qui
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* WhatsApp CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="py-16 flex flex-col items-center justify-center text-center space-y-6 border-t border-white/10"
                >
                    <h2 className={`text-2xl md:text-4xl lg:text-5xl font-semibold text-white tracking-wide ${montserrat.className}`}>
                        HAI BISOGNO DI ALTRE INFO?
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full items-center justify-center">
                        <a
                            href="https://wa.link/5apci9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg md:text-xl rounded-[35px] px-8 py-4 md:px-10 shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all hover:scale-105 gap-3 shrink-0"
                        >
                            Scrivici su WhatsApp
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        </a>
                        <a
                            href="mailto:info@beautify-channel.com"
                            className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border-2 border-[#D8B2A3]/50 hover:border-[#D8B2A3] text-white font-bold text-lg md:text-xl rounded-[35px] px-8 py-4 md:px-10 backdrop-blur-md shadow-[0_0_20px_rgba(216,178,163,0.15)] transition-all hover:scale-105 gap-3 shrink-0"
                        >
                            Contattaci
                            <Mail size={24} className="text-fuchsia-400 shadow-sm drop-shadow-sm" />
                        </a>
                    </div>
                </motion.div>

                {/* Delicate Fashion Stay Tuned Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className="pt-12 pb-10 w-full flex items-center justify-center relative px-4"
                >
                    <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
                        <div className="px-6 py-8 md:px-10 md:py-12 flex flex-col items-center justify-center text-center">
                            
                            <motion.h3 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className={`text-fuchsia-300 font-normal uppercase tracking-[0.4em] text-xl md:text-3xl lg:text-4xl mb-6 md:mb-8 ${montserrat.className}`}
                            >
                                Stay Tuned
                            </motion.h3>

                            <motion.p 
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className={`text-white text-lg md:text-2xl lg:text-3xl font-light leading-relaxed max-w-2xl mb-6 md:mb-8 ${montserrat.className}`}
                            >
                                I servizi e le opportunità BeautiFy <br className="hidden md:block"/>
                                <span className="italic text-zinc-400">sono in continuo ampliamento.</span>
                            </motion.p>

                            <motion.p 
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className={`text-zinc-300 text-lg md:text-2xl lg:text-3xl font-light leading-relaxed ${inter.className}`}
                            >
                                Prossimamente in arrivo
                                <span className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                                    <span className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/20 text-fuchsia-50 font-normal text-xs md:text-sm tracking-wide shadow-inner">
                                        Laser Channel
                                    </span>
                                    <span className="hidden sm:inline-block text-zinc-300 font-light italic text-sm md:text-base">e</span>
                                    <span className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/20 text-fuchsia-50 font-normal text-xs md:text-sm tracking-wide shadow-inner">
                                        Cosmetic Channel
                                    </span>
                                </span>
                            </motion.p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
