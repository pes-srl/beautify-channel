"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function ProvaGratisPage() {
    const [salonName, setSalonName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

        // This triggers the handle_new_user SQL function with new.raw_user_meta_data variables
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    is_trial: true,
                    salon_name: salonName.trim() !== "" ? salonName : email
                }
            }
        });

        if (error) {
            setError(error.message);
        } else {
            // Se l'email confirmation è spenta su Supabase, entra subito
            if (data.session) {
                setMessage("Attivazione Prova Gratuita in corso...");
                router.push("/area-riservata");
            } else {
                setMessage("Prova attivata! (Disattiva 'Confirm Email' su Supabase per entrare subito)");
                setTimeout(() => {
                    router.push("/area-riservata");
                }, 2000);
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-30">
                <div className="absolute w-[600px] h-[600px] bg-fuchsia-600/20 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 backdrop-blur-md mb-6 shadow-[0_0_30px_rgba(217,70,239,0.2)]">
                        <Sparkles className="w-8 h-8 text-fuchsia-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                        Prova Gratuita
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        7 giorni di accesso completo. Nessuna carta di credito richiesta.
                    </p>
                </div>

                <form onSubmit={handleSignup} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
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
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="salonName" className="text-zinc-300">Nome Salone / Istituto <span className="text-zinc-500 font-normal">(Opzionale)</span></Label>
                                <Input
                                    id="salonName"
                                    type="text"
                                    placeholder="Es. Beauty Spa Milano"
                                    value={salonName}
                                    onChange={(e) => setSalonName(e.target.value)}
                                    className="h-12 bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-fuchsia-500/50 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-300">Indirizzo Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tuo@istituto.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-fuchsia-500/50 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-zinc-300">Crea una Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-12 bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-fuchsia-500/50 rounded-xl"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all"
                        >
                            {isLoading ? "Creazione account..." : "Inizia Subito la Prova 🚀"}
                        </Button>
                    </div>
                </form>

                <p className="text-center text-sm text-zinc-400 mt-8">
                    Hai già un account?{" "}
                    <Link href="/login" className="text-fuchsia-400 hover:text-fuchsia-300 font-medium">
                        Accedi qui
                    </Link>
                </p>
            </div>
        </div>
    );
}
