"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateProfileInfo } from "@/app/actions/profile";
import { Loader2, CheckCircle2 } from "lucide-react";

interface ProfileSettingsFormProps {
    fullName: string;
    salonName: string;
    partitaIva: string;
    email: string;
}

export function ProfileSettingsForm({ fullName, salonName, partitaIva, email }: ProfileSettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setErrorMsg("");
        setSuccess(false);

        try {
            const res = await updateProfileInfo(formData);
            if (res?.error) {
                setErrorMsg(res.error);
            } else {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error: any) {
            setErrorMsg("Errore di rete. Riprova più tardi.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 bg-[#2b2730] p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#AB7169] via-[#D8B2A3] to-[#5D6676]" />
            
            <div>
                <h3 className="text-xl font-bold text-white mb-2">Informazioni Personali e Aziendali</h3>
                <p className="text-sm text-zinc-400">Aggiorna il nome del tuo salone, i tuoi riferimenti e la partita IVA per le ricevute.</p>
            </div>

            {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm font-medium">
                    {errorMsg}
                </div>
            )}
            {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Profilo aggiornato con successo!
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-zinc-300">
                        Nome Completo
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        defaultValue={fullName}
                        required
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D8B2A3] focus:border-transparent transition-all"
                        placeholder="Es. Mario Rossi"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="salonName" className="text-sm font-medium text-zinc-300">
                        Nome Salone / Istituto
                    </label>
                    <input
                        type="text"
                        id="salonName"
                        name="salonName"
                        defaultValue={salonName}
                        required
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D8B2A3] focus:border-transparent transition-all"
                        placeholder="Es. Beauty Spa Milano"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="partitaIva" className="text-sm font-medium text-zinc-300">
                        Partita IVA
                    </label>
                    <input
                        type="text"
                        id="partitaIva"
                        name="partitaIva"
                        defaultValue={partitaIva}
                        required
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D8B2A3] focus:border-transparent transition-all"
                        placeholder="Es. 01234567890"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                        Indirizzo Email <span className="text-xs text-zinc-500 font-normal ml-2">(Sola lettura)</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        defaultValue={email}
                        disabled
                        className="w-full bg-zinc-950 border border-white/5 rounded-lg px-4 py-3 text-zinc-400 cursor-not-allowed opacity-70"
                        title="Contatta l'assistenza per modificare l'indirizzo email del tuo account"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-white text-black hover:bg-zinc-200 font-bold px-8 py-2.5 rounded-full transition-colors"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salva Modifiche"}
                </Button>
            </div>
        </form>
    );
}
