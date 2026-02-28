"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound } from "lucide-react";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // If there's an access_token in the URL hash, Supabase automatically establishes a session
        const handleHash = async () => {
            const hash = window.location.hash;
            if (hash && hash.includes("access_token") && hash.includes("type=recovery")) {
                // The session is established automatically by the supabase browser client
                // listening to auth state changes or reading the hash. We just need to prompt for new password.
            }
        };
        handleHash();
    }, []);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        if (password.length < 6) {
            setError("La password deve avere almeno 6 caratteri.");
            setIsLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Password aggiornata con successo! Ora puoi accedere.");
            setTimeout(() => {
                router.push("/area-cliente");
            }, 2000);
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
                        <KeyRound className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Nuova Password</h1>
                    <p className="text-zinc-400">Inserisci la tua nuova password e confermala</p>
                </div>

                <form onSubmit={handleReset} className="p-8 rounded-3xl bg-white/2 border border-white/10 backdrop-blur-xl shadow-2xl">
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
                            <Label htmlFor="password" className="text-zinc-300">Nuova Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-fuchsia-500/50 rounded-xl"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl font-medium shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all"
                        >
                            {isLoading ? "Salvataggio..." : "Salva Nuova Password"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
