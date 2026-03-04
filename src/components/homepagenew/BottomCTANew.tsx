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

import { logActivity } from "@/app/actions/activity-actions";

export function BottomCTANew() {
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
            try {
                fetch("/api/send-welcome", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, full_name: fullName })
                });
            } catch (err) {
                console.error("Failed to trigger welcome email:", err);
            }

            if (data.user) {
                await logActivity(data.user.id, 'signup_freetrial');
            }

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
        <section className="bg-[#1E0C31] pt-12 pb-32 px-6 overflow-hidden relative">
            <div className="max-w-6xl mx-auto space-y-24">

                {/* 1. Laser and Cosmetic Channels Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Laser Channel - White */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-[24px] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden h-full flex flex-col justify-center border border-zinc-100"
                    >
                        {/* Faint background mandala icon */}
                        <div className="absolute inset-0 bg-[url('https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772477157202-gueksp.png')] bg-contain bg-center bg-no-repeat opacity-[0.03] scale-[1.8] pointer-events-none"></div>

                        <h3 className="text-2xl font-black text-zinc-900 tracking-wider mb-4 relative z-10">
                            LASER CHANNEL
                        </h3>
                        <p className="text-zinc-600 font-medium text-[15px] leading-relaxed relative z-10">
                            *Lo ottieni con il piano Premium.<br />
                            Lo puoi utilizzare quando vuoi promuovere i tuoi pacchetti dedicati a laser e tecnologie
                        </p>
                    </motion.div>

                    {/* Cosmetic Channel - Light Purple */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="bg-[#D3ADFF] rounded-[24px] p-8 md:p-12 text-center shadow-2xl shadow-purple-500/10 relative overflow-hidden h-full flex flex-col justify-center"
                    >
                        {/* Faint background mandala icon */}
                        <div className="absolute inset-0 bg-[url('https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772477157202-gueksp.png')] bg-contain bg-center bg-no-repeat opacity-10 blur-[1px] scale-[1.8] pointer-events-none mix-blend-overlay"></div>

                        <h3 className="text-2xl font-black text-white tracking-wider mb-4 relative z-10 drop-shadow-sm">
                            COSMETIC CHANNEL
                        </h3>
                        <p className="text-white/90 font-medium text-[15px] leading-relaxed relative z-10 drop-shadow-sm">
                            **Incluso nel piano Premium<br />
                            Lo puoi utilizzare in istituto quando vuoi promuovere servizi di cosmetica
                        </p>
                    </motion.div>
                </div>

                {/* 2. Three Steps Guide */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="space-y-12"
                >
                    <h2 className="text-2xl md:text-4xl font-black text-white text-center leading-snug tracking-wide">
                        Accedi un'atmosfera innovativa nel tuo istituto in 3<br className="hidden md:block" />
                        passaggi
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            { step: "1", text: "Registrati in pochi secondi nel form qui sotto e inizia la prova gratuita!" },
                            { step: "2", text: "Accedi dal tuo dispositivo preferito (PC, Mac, smartphone, tablet)" },
                            { step: "3", text: "Premi Play sul canale che preferisci e lascia che BeautiFy faccia il resto" }
                        ].map((item) => (
                            <div key={item.step} className="bg-white rounded-[20px] p-8 text-center shadow-xl space-y-4">
                                <span className="block text-6xl font-black text-[#9F00FF] mb-6 drop-shadow-sm">
                                    {item.step}
                                </span>
                                <p className="text-[#333333] font-bold text-[15px] leading-snug">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center pt-8">
                        <Link href="#trial-form">
                            <Button className="bg-[#DF27F1] hover:bg-[#c31dd6] text-white font-black text-sm md:text-base px-8 py-6 rounded-md uppercase tracking-wide shadow-[0_0_30px_rgba(223,39,241,0.4)] transition-all">
                                PROVA GRATUITA 7 GIORNI SENZA IMPEGNO
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* 3. Registration Form (Imported from provagratis) */}
                <motion.div
                    id="trial-form"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="pt-24 flex justify-center w-full"
                >
                    <div className="w-full max-w-lg relative z-10">
                        <div className="text-center mb-10">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 backdrop-blur-md mb-6 shadow-[0_0_30px_rgba(217,70,239,0.2)]">
                                <Sparkles className="w-8 h-8 text-fuchsia-400" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                                Inizia la Prova Gratuita
                            </h2>
                            <p className="text-zinc-400 text-lg">
                                7 giorni di accesso completo. Nessuna carta di credito richiesta.
                            </p>
                        </div>

                        <form onSubmit={handleSignup} className="p-8 md:p-10 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
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
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-zinc-300 font-medium ml-1">Nome Completo</Label>
                                        <Input
                                            id="fullName"
                                            type="text"
                                            placeholder="Es. Mario Rossi"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            className="h-14 bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-fuchsia-500/50 rounded-2xl text-[15px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="salonName" className="text-zinc-300 font-medium ml-1">Nome Salone / Istituto <span className="text-zinc-500 font-normal">(Opzionale)</span></Label>
                                        <Input
                                            id="salonName"
                                            type="text"
                                            placeholder="Es. Beauty Spa Milano"
                                            value={salonName}
                                            onChange={(e) => setSalonName(e.target.value)}
                                            className="h-14 bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-fuchsia-500/50 rounded-2xl text-[15px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-zinc-300 font-medium ml-1">Indirizzo Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="tuo@istituto.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="h-14 bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-fuchsia-500/50 rounded-2xl text-[15px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-zinc-300 font-medium ml-1">Crea una Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="h-14 bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-fuchsia-500/50 rounded-2xl text-[15px]"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 pt-4 px-1">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="mt-1 h-5 w-5 rounded border-white/20 bg-black/40 text-fuchsia-600 focus:ring-fuchsia-500 focus:ring-offset-zinc-950 shrink-0"
                                    />
                                    <Label htmlFor="terms" className="text-sm text-zinc-400 font-normal leading-relaxed cursor-pointer select-none">
                                        Accetto i <Link href="/termini" className="text-fuchsia-400 hover:text-fuchsia-300 underline font-medium">Termini e Condizioni</Link> e la <Link href="/privacy" className="text-fuchsia-400 hover:text-fuchsia-300 underline font-medium">Privacy Policy</Link> di Beautify Channel.
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-16 mt-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_25px_rgba(147,51,234,0.4)] transition-all tracking-wide"
                                >
                                    {isLoading ? "Creazione account in corso..." : "INIZIA SUBITO LA PROVA 🚀"}
                                </Button>
                            </div>
                        </form>

                        <p className="text-center text-[15px] text-zinc-400 mt-8">
                            Hai già un account?{" "}
                            <Link href="/login" className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold underline-offset-4 hover:underline">
                                Accedi qui
                            </Link>
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
