"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function BottomCTA2026() {
    const [fullName, setFullName] = useState("");
    const [salonName, setSalonName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

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

        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    plan_type: 'free_trial',
                    trial_ends_at: trialEndDate.toISOString(),
                    full_name: fullName,
                    salon_name: salonName.trim() !== "" ? salonName : fullName || email
                }
            }
        });

        if (error) {
            console.error("SUPABASE REGISTRATION ERROR:", error);
            setError(error.message);
        } else {
            if (data.session) {
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
        <section className="bg-[#1E0C31] pt-0 pb-24 px-6 md:px-12 overflow-hidden relative">
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
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
                                Inizia la tua Prova Gratuita
                            </h2>
                            <p className="text-[#ECE0D4] text-lg">
                                7 giorni di accesso completo. <br className="md:hidden" /> Nessuna carta di credito richiesta.
                            </p>
                        </div>

                        <form onSubmit={handleSignup} className="p-8 md:p-10 rounded-[2.5rem] bg-white/5 border border-[#5D6676]/30 backdrop-blur-xl shadow-2xl">
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
                                            className="h-14 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-[#AB7169]/50 rounded-[2.5rem] text-[15px]"
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
                                            className="h-14 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-[#AB7169]/50 rounded-[2.5rem] text-[15px]"
                                        />
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
                                            className="h-14 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-[#AB7169]/50 rounded-[2.5rem] text-[15px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-[#ECE0D4] font-medium ml-1">Crea una Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="h-14 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-[#AB7169]/50 rounded-[2.5rem] text-[15px]"
                                        />
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
                                    className="w-full h-16 mt-4 bg-[#AB7169] hover:bg-[#D8B2A3] text-white rounded-[2.5rem] font-bold text-sm md:text-base shadow-[0_8px_30px_rgba(171,113,105,0.4)] transition-all border-none tracking-wide"
                                >
                                    {isLoading ? "Creazione account in corso..." : "INIZIA SUBITO LA PROVA GRATUITA 🚀"}
                                </Button>
                            </div>
                        </form>

                        <p className="text-center text-[15px] text-[#ECE0D4] mt-8">
                            Hai già un account?{" "}
                            <Link href="/login" className="text-[#D8B2A3] hover:text-[#FAFAF8] font-semibold underline-offset-4 hover:underline">
                                Accedi qui
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
