"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerTrialAccount } from "@/app/actions/trial-actions";
import { Button } from "@/components/ui/button";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600"] });
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Eye, EyeOff } from "lucide-react";
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
        <section className="bg-[#1E0C31] pt-2 pb-16 md:py-16 px-6 md:px-12 overflow-hidden relative">
            <div className="max-w-6xl mx-auto space-y-12">
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
                                                <Label htmlFor="salonName" className="text-[#ECE0D4] font-medium ml-1">Nome Salone / Istituto <span className="text-zinc-500 font-normal">(Opzionale)</span></Label>
                                                <Input
                                                    id="salonName"
                                                    type="text"
                                                    placeholder="Es. Beauty Spa Milano"
                                                    value={salonName}
                                                    onChange={(e) => setSalonName(e.target.value)}
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
                                                Accetto i <Link href="/termini" className="text-[#D8B2A3] hover:text-[#FAFAF8] underline font-medium">Termini e Condizioni</Link> e la <Link href="/privacy" className="text-[#D8B2A3] hover:text-[#FAFAF8] underline font-medium">Privacy Policy</Link> di Beautify Channel.
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
            </div>
        </section>
    );
}
