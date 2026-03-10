"use client";

import { useState } from "react";
import { submitUpgradeRequest } from "@/app/actions/upgrade-actions";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Heart, ArrowLeft } from "lucide-react";

export function UpgradeFormBasic({ userEmail, onBack }: { userEmail?: string, onBack?: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [metriQuadriOption, setMetriQuadriOption] = useState<'0-250' | 'oltre'>('0-250');
    const [durataAbbonamento, setDurataAbbonamento] = useState<'6 mesi' | '12 mesi'>('6 mesi');
    const [status, setStatus] = useState<{
        type: "idle" | "success" | "error";
        message: string;
    }>({ type: "idle", message: "" });

    const getMonthlyPrice = () => {
        return durataAbbonamento === '6 mesi' ? 43.90 : 38.90;
    };

    const getMonths = () => {
        return durataAbbonamento === '6 mesi' ? 6 : 12;
    };

    const totalPrice = (getMonthlyPrice() * getMonths()).toFixed(2).replace('.', ',');

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setStatus({ type: "idle", message: "" });

        // Forziamo il piano richiesto a PREMIUM
        formData.append('requested_plan', 'premium');

        const result = await submitUpgradeRequest(formData);

        if (result.error) {
            setStatus({ type: "error", message: result.error });
        } else {
            setStatus({
                type: "success",
                message: result.message || "Richiesta inviata con successo.",
            });
        }

        setIsSubmitting(false);
    }

    if (status.type === "success") {
        return (
            <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-2xl p-8 text-center mt-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                    Richiesta Ricevuta!
                </h3>
                <p className="text-emerald-100">{status.message}</p>
                <p className="text-emerald-200/70 text-sm mt-4">
                    Il nostro team esaminerà i tuoi dati e ti invierà al più presto
                    un'e-mail con il contratto e il link per il pagamento sicuro.
                </p>
            </div>
        );
    }

    return (
        <div
            id="upgrade-section"
            className="bg-[#1f1604] border border-amber-500/30 rounded-3xl p-6 md:p-10 my-16 shadow-2xl relative overflow-hidden text-left"
        >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
                {onBack && (
                    <button 
                        onClick={onBack}
                        className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group text-sm font-medium tracking-widest uppercase font-[family-name:var(--font-montserrat)]"
                        type="button"
                    >
                        <ArrowLeft className="w-4 h-4 stroke-[3] group-hover:-translate-x-1 transition-transform" />
                        Torna al BASIC
                    </button>
                )}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-semibold font-[family-name:var(--font-montserrat)] text-white mb-3 uppercase tracking-wide">
                        MIGLIORA IL TUO PIANO
                    </h2>
                    <p className="text-zinc-300 font-normal font-[family-name:var(--font-montserrat)] mt-2 leading-relaxed">
                        Sei attualmente nel piano Basic. Compila questo modulo per fare l'upgrade al Piano Premium. Nessuna carta di credito, nessun addebito, verrai contattata da un nostro responsabile per la finalizzazione dell'abbonamento scelto, grazie!<br /><br />
                        BeautiFy Staff
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    {status.type === "error" && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{status.message}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Plan Selection (Fixed to Premium) */}
                        <div className="md:col-span-2 mb-2">
                            <label className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-white mb-2">
                                Passa a
                            </label>
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 w-full mb-2">
                                <label className="flex-1 relative cursor-default text-center">
                                    <div className="py-2.5 px-4 rounded-lg font-bold text-sm bg-amber-500 text-zinc-950 shadow-md">
                                        Premium
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Ragione Sociale */}
                        <div className="space-y-2">
                            <label
                                htmlFor="ragioneSociale"
                                className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                            >
                                Ragione Sociale<span className="text-amber-500">*</span>
                            </label>
                            <input
                                id="ragioneSociale"
                                name="ragioneSociale"
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                        </div>

                        {/* Partita IVA */}
                        <div className="space-y-2">
                            <label
                                htmlFor="partitaIva"
                                className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                            >
                                Partita IVA*
                            </label>
                            <input
                                id="partitaIva"
                                name="partitaIva"
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                        </div>

                        {/* Indirizzo istituto */}
                        <div className="space-y-2">
                            <label
                                htmlFor="indirizzoIstituto"
                                className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                            >
                                Indirizzo istituto*
                            </label>
                            <input
                                id="indirizzoIstituto"
                                name="indirizzoIstituto"
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                        </div>

                        {/* Nome istituto */}
                        <div className="space-y-2">
                            <label
                                htmlFor="nomeIstituto"
                                className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                            >
                                Nome istituto*
                            </label>
                            <input
                                id="nomeIstituto"
                                name="nomeIstituto"
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                        </div>

                        {/* Metri quadri istituto */}
                        <div className="md:col-span-1 space-y-2">
                            <label className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300">
                                Metri quadri istituto*
                            </label>
                            <div className="flex flex-col sm:flex-row gap-4 mb-2">
                                <label className="flex items-center gap-2 text-white cursor-pointer bg-black/40 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                                    <input
                                        type="radio"
                                        name="metriQuadriRadio"
                                        value="0-250"
                                        checked={metriQuadriOption === '0-250'}
                                        onChange={() => setMetriQuadriOption('0-250')}
                                        className="text-amber-600 focus:ring-amber-500 bg-white/10 border-white/20 w-4 h-4"
                                    />
                                    0-250
                                </label>
                                <label className="flex items-center gap-2 text-white cursor-pointer bg-black/40 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                                    <input
                                        type="radio"
                                        name="metriQuadriRadio"
                                        value="oltre"
                                        checked={metriQuadriOption === 'oltre'}
                                        onChange={() => setMetriQuadriOption('oltre')}
                                        className="text-amber-600 focus:ring-amber-500 bg-white/10 border-white/20 w-4 h-4"
                                    />
                                    Oltre
                                </label>
                            </div>
                        </div>

                        {/* Durata abbonamento */}
                        <div className="md:col-span-1 space-y-2">
                            <label className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300">
                                Durata abbonamento*
                            </label>
                            <div className="flex flex-col sm:flex-row gap-4 mb-2">
                                <label className={`flex-1 flex flex-col items-start gap-1 p-4 rounded-xl border cursor-pointer transition-colors ${durataAbbonamento === '6 mesi' ? 'bg-amber-600/20 border-amber-500/50 shadow-[0_0_15px_rgba(192,38,211,0.2)]' : 'bg-black/40 border-white/10 hover:bg-white/5'}`}>
                                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                                        <input
                                            type="radio"
                                            name="durataAbbonamento"
                                            value="6 mesi"
                                            checked={durataAbbonamento === '6 mesi'}
                                            onChange={() => setDurataAbbonamento('6 mesi')}
                                            className="text-amber-600 focus:ring-amber-500 bg-white/10 border-white/20 w-4 h-4"
                                        />
                                        6 mesi
                                    </div>
                                    <div className={`text-xs sm:text-sm pl-6 format-cost ${durataAbbonamento === '6 mesi' ? 'text-white font-medium' : 'text-zinc-300'}`}>
                                        € 43,90 / mese
                                        <br />
                                        <span className="text-[10px] sm:text-[11px] font-normal leading-tight text-white mt-1 block">
                                            Unica Soluzione
                                        </span>
                                    </div>
                                </label>

                                <label className={`flex-1 flex flex-col items-start gap-1 p-4 rounded-xl border cursor-pointer transition-colors ${durataAbbonamento === '12 mesi' ? 'bg-amber-600/20 border-amber-500/50 shadow-[0_0_15px_rgba(192,38,211,0.2)]' : 'bg-black/40 border-white/10 hover:bg-white/5'}`}>
                                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                                        <input
                                            type="radio"
                                            name="durataAbbonamento"
                                            value="12 mesi"
                                            checked={durataAbbonamento === '12 mesi'}
                                            onChange={() => setDurataAbbonamento('12 mesi')}
                                            className="text-amber-600 focus:ring-amber-500 bg-white/10 border-white/20 w-4 h-4"
                                        />
                                        12 mesi
                                    </div>
                                    <div className={`text-xs sm:text-sm pl-6 format-cost ${durataAbbonamento === '12 mesi' ? 'text-white font-medium' : 'text-zinc-300'}`}>
                                        € 38,90 / mese
                                        <br />
                                        <span className="text-[10px] sm:text-[11px] font-normal leading-tight text-white mt-1 block">
                                            Unica Soluzione
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Box Totale da saldare */}
                        <div className="md:col-span-2 mt-4 mb-2 flex justify-center text-center">
                            <div className="bg-black/30 border border-amber-500/20 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_15px_rgba(192,38,211,0.1)]">
                                <p className="text-white font-semibold mb-1 uppercase tracking-wider text-sm font-[family-name:var(--font-montserrat)]">Totale complessivo anno</p>
                                <p className={`font-bold mb-3 uppercase tracking-wide text-amber-400`}>Piano Premium</p>
                                <p className={`text-4xl font-bold font-[family-name:var(--font-montserrat)] text-amber-400`}><span className="text-3xl font-medium pr-1">€</span>{totalPrice}</p>
                                <p className="text-base text-white mt-3 font-semibold">*{getMonths()} mesi a € {getMonthlyPrice().toFixed(2).replace('.', ',')} / mese</p>
                            </div>
                        </div>

                        {/* Responsabile istituto */}
                        <div className="md:col-span-2 space-y-2">
                            <label
                                htmlFor="responsabileIstituto"
                                className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                            >
                                Responsabile istituto*
                            </label>
                            <input
                                id="responsabileIstituto"
                                name="responsabileIstituto"
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                        </div>

                        {/* La tua email */}
                        <div className="md:col-span-2 space-y-2">
                            <label
                                htmlFor="emailContatto"
                                className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                            >
                                La tua email*
                            </label>
                            <input
                                id="emailContatto"
                                name="emailContatto"
                                type="email"
                                required
                                readOnly
                                defaultValue={userEmail || ""}
                                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed focus:outline-none transition-all"
                            />
                        </div>

                        {/* Il Tuo telefono */}
                        <div className="md:col-span-2 space-y-2">
                            <label
                                htmlFor="telefono"
                                className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                            >
                                Il Tuo telefono*
                            </label>
                            <input
                                id="telefono"
                                name="telefono"
                                type="tel"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-center w-full">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-amber-500 to-amber-300 hover:from-amber-400 hover:to-amber-200 text-amber-950 font-bold font-[family-name:var(--font-montserrat)] py-6 px-10 rounded-xl text-lg shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50 border-none"
                        >
                            {isSubmitting
                                ? "Invio richiesta in corso..."
                                : "Richiedi Upgrade Premium"}
                        </Button>
                    </div>
                </form>

                {/* GRAZIE Section */}
                <div className="mt-16 text-center relative flex flex-col items-center justify-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-600/20 blur-[50px] rounded-full pointer-events-none" />
                    <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 font-[family-name:var(--font-montserrat)] tracking-[0.2em] md:tracking-[0.4em] uppercase mb-2 relative z-10">
                        GRAZIE
                    </h3>
                    <p className="text-amber-200/50 text-sm md:text-base flex items-center justify-center gap-2 relative z-10 font-medium">
                        <Heart className="w-4 h-4 text-amber-400/70 fill-amber-400/20" />
                        Il giusto mood fa la differenza in istituto
                        <Heart className="w-4 h-4 text-amber-400/70 fill-amber-400/20" />
                    </p>
                </div>
            </div>
        </div>
    );
}
