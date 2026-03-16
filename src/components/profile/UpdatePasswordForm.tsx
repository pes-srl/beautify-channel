"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateProfilePassword, sendPasswordResetEmail } from "@/app/actions/profile";
import { Loader2, CheckCircle2, KeyRound, Mail } from "lucide-react";

interface UpdatePasswordFormProps {
    email: string;
}

export function UpdatePasswordForm({ email }: UpdatePasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setErrorMsg("");
        setSuccess(false);
        setResetSuccess(false);

        try {
            const res = await updateProfilePassword(formData);
            if (res?.error) {
                setErrorMsg(res.error);
            } else {
                setSuccess(true);
                const form = document.getElementById("passwordForm") as HTMLFormElement;
                if (form) form.reset();
                setTimeout(() => setSuccess(false), 4000);
            }
        } catch (error: any) {
            setErrorMsg("Errore di rete. Riprova più tardi.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleForgotPassword() {
        const wantsToReset = window.confirm("Stiamo per inviarti un'email con le istruzioni per il recupero della password. Sei sicuro di voler procedere?");
        if (!wantsToReset) return;

        setIsResetting(true);
        setErrorMsg("");
        setSuccess(false);
        setResetSuccess(false);
        
        try {
            const res = await sendPasswordResetEmail(email);
            if (res?.error) {
                // If it is a rate limit error, provide a friendlier message
                if (res.error.includes("rate limit") || res.error.includes("Error sending recovery email")) {
                    setErrorMsg("Hai richiesto troppe email di recente. Riprova tra qualche minuto!");
                } else {
                    setErrorMsg(res.error);
                }
            } else {
                setResetSuccess(true);
                setTimeout(() => setResetSuccess(false), 5000);
            }
        } catch (error: any) {
            setErrorMsg("Errore di rete nell'invio dell'email.");
        } finally {
            setIsResetting(false);
        }
    }

    return (
        <form id="passwordForm" action={handleSubmit} className="space-y-6 bg-[#2b2730] p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden mt-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#AB7169] via-[#D8B2A3] to-[#5D6676]" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                    <div className="bg-[#AB7169]/20 p-2 rounded-lg text-[#D8B2A3]">
                        <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Sicurezza e Accesso</h3>
                        <p className="text-sm text-zinc-400">Aggiorna la password del tuo account.</p>
                    </div>
                </div>
                
                <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    disabled={isResetting}
                    className="text-sm text-[#D8B2A3] hover:text-white underline-offset-4 hover:underline transition-colors flex items-center gap-2 self-start md:self-auto"
                >
                    {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ho dimenticato la password"}
                </button>
            </div>

            {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm font-medium">
                    {errorMsg}
                </div>
            )}
            {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Password aggiornata con successo!
                </div>
            )}
            {resetSuccess && (
                <div className="bg-[#AB7169]/10 border border-[#AB7169]/30 text-[#D8B2A3] p-3 rounded-lg text-sm font-medium flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-0.5 min-w-5" />
                    <div>
                        <p className="font-bold">Email inviata!</p>
                        <p className="text-[#D8B2A3]/80">Controlla la tua casella di posta per le istruzioni su come reimpostare la password.</p>
                    </div>
                </div>
            )}

            <div className="space-y-2 mb-6 max-w-md">
                <label htmlFor="currentPassword" className="text-sm font-medium text-zinc-300">
                    Password Attuale
                </label>
                <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    required
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D8B2A3] focus:border-transparent transition-all"
                    placeholder="La tua password attuale"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium text-zinc-300">
                        Nuova Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        required
                        minLength={6}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D8B2A3] focus:border-transparent transition-all"
                        placeholder="Minimo 6 caratteri"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="confPassword" className="text-sm font-medium text-zinc-300">
                        Conferma Nuova Password
                    </label>
                    <input
                        type="password"
                        id="confPassword"
                        name="confPassword"
                        required
                        minLength={6}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D8B2A3] focus:border-transparent transition-all"
                        placeholder="Ripeti la nuova password"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-transparent border border-[#AB7169] text-[#D8B2A3] hover:bg-[#AB7169]/10 font-bold px-8 py-2.5 rounded-full transition-colors"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Aggiorna Password"}
                </Button>
            </div>
        </form>
    );
}
