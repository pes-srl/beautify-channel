import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>;
}) {
    const { message } = await searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Se l'utente è già loggato, sbattilo fuori dalla pagina login
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role === "Admin") {
            redirect("/admin");
        } else {
            redirect("/area-riservata");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-30">
                <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/30 blur-[100px] rounded-full mix-blend-screen" />
                <div className="absolute w-[500px] h-[500px] bg-indigo-600/30 blur-[100px] rounded-full mix-blend-screen translate-x-32" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-2xl">
                        <Sparkles className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Accedi all'Area Cliente</h1>
                    <p className="text-zinc-400">Inserisci email e password per continuare</p>
                </div>

                <form action={login} className="p-8 rounded-3xl bg-white/2 border border-white/10 backdrop-blur-xl shadow-2xl">
                    {message && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
                            {message}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-300">Indirizzo Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="tuo.istituto@email.com"
                                    required
                                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-fuchsia-500/50 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-zinc-300">Password</Label>
                                    <Link href="/forgot-password" className="text-xs text-fuchsia-400 hover:text-fuchsia-300">
                                        Password dimenticata?
                                    </Link>
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-fuchsia-500/50 rounded-xl"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl font-medium shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all">
                            Accedi al Pannello
                        </Button>
                    </div>
                </form>
                <p className="text-center text-sm text-zinc-400 mt-8">
                    Non hai ancora un account?{" "}
                    <Link href="/register" className="text-fuchsia-400 hover:text-fuchsia-300 font-medium">
                        Registrati
                    </Link>
                </p>

                <p className="text-center text-xs text-zinc-600 mt-4">
                    Continuando, accetti i nostri Termini di Servizio e la Privacy Policy.
                </p>
            </div>
        </div>
    );
}
