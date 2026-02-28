"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailQuestion } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Abbiamo inviato le istruzioni per il recupero al tuo indirizzo email.");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-30">
                <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/30 blur-[100px] rounded-full mix-blend-screen" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-2xl">
                        <MailQuestion className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Recupera Password</h1>
                    <p className="text-zinc-400">Inserisci la tua email per ricevere il link di reset</p>
                </div>

                <form onSubmit={handleResetRequest} className="p-8 rounded-3xl bg-white/2 border border-white/10 backdrop-blur-xl shadow-2xl">
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
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-300">Indirizzo Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tuo.istituto@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-fuchsia-500/50 rounded-xl"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !!message}
                            className="w-full h-12 bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl font-medium shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all"
                        >
                            {isLoading ? "Invio in corso..." : "Invia Link di Recupero"}
                        </Button>
                    </div>
                </form>

                <p className="text-center text-sm text-zinc-400 mt-8">
                    Ti sei ricordato la password?{" "}
                    <Link href="/login" className="text-fuchsia-400 hover:text-fuchsia-300 font-medium">
                        Torna al Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
