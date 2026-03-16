"use client";

import { useState } from "react";
import { submitUpgradeRequest } from "@/app/actions/upgrade-actions";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Heart, Sparkles } from "lucide-react";

type PlanType = "basic" | "premium";
type DurationType = "6 mesi" | "12 mesi";
type MetriQuadriType = "0-250" | "oltre";

export function UpgradeCheckoutForm({ userEmail, userVat, userSalonName, planType }: { userEmail?: string, userVat?: string, userSalonName?: string, planType?: string }) {
    const [selectedPlan, setSelectedPlan] = useState<PlanType>(planType === 'basic' ? "premium" : "basic");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [metriQuadriOption, setMetriQuadriOption] = useState<MetriQuadriType>("0-250");
    const [durataAbbonamento, setDurataAbbonamento] = useState<DurationType>("6 mesi");
    const [currentStep, setCurrentStep] = useState(1);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [status, setStatus] = useState<{
        type: "idle" | "success" | "error";
        message: string;
    }>({ type: "idle", message: "" });

    // Ora anche Basic ha lo step 3, quindi non limitiamo più lo step massimo.

    const getMonthlyPrice = () => {
        if (selectedPlan === "basic") {
            return durataAbbonamento === "6 mesi" ? 25.90 : 20.90;
        } else {
            return durataAbbonamento === "6 mesi" ? 43.90 : 38.90;
        }
    };

    const getMonths = () => {
        return durataAbbonamento === "6 mesi" ? 6 : 12;
    };

    const totalPrice = (getMonthlyPrice() * getMonths()).toFixed(2).replace('.', ',');

    async function handleSubmit(formData: FormData) {
        if (!acceptedTerms || !acceptedPrivacy) {
            setStatus({ type: "error", message: "Per favore, conferma di aver letto e accettato le Condizioni e la Privacy Policy per proseguire." });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: "idle", message: "" });

        // Forza il piano selezionato
        formData.append("requested_plan", selectedPlan);

        // Combina i campi dell'indirizzo
        const via = formData.get('indirizzoVia');
        const civico = formData.get('indirizzoCivico');
        const cap = formData.get('indirizzoCap');
        const citta = formData.get('indirizzoCitta');
        const pr = formData.get('indirizzoProvincia');
        if (via && civico && cap && citta && pr) {
            formData.append('indirizzoIstituto', `${via} ${civico}, ${cap} ${citta} (${pr})`);
        }

        // 1. Salva la richiesta (Supabase, PDF, Email)
        const result = await submitUpgradeRequest(formData);

        if (result.error) {
            setStatus({ type: "error", message: result.error });
            setIsSubmitting(false);
            return;
        }

        // ========================================================
        // STRIPE INTEGRATION:
        // ========================================================
        
        // 2. Genera sessione Stripe Checkout
        const { createCheckoutSession } = await import('@/app/actions/stripe-actions');
        const checkoutResult = await createCheckoutSession(formData);
        
        if (checkoutResult.error) {
            setStatus({ type: "error", message: checkoutResult.error });
            setIsSubmitting(false);
            return;
        }

        if (checkoutResult.url) {
            // 3. Reindirizza a Stripe
            window.location.href = checkoutResult.url;
        } else {
            setStatus({ type: "success", message: "Richiesta inviata con successo!" });
            setIsSubmitting(false);
        }
    }

    const validateStep1 = () => {
        const container = document.getElementById("step-1-container-unified");
        if (container) {
            const inputs = container.querySelectorAll<HTMLInputElement>("input[required]");
            for (let i = 0; i < inputs.length; i++) {
                if (!inputs[i].checkValidity()) {
                    inputs[i].reportValidity();
                    return false;
                }
            }
        }
        return true;
    };

    const validateStep2 = () => {
        const container = document.getElementById("step-2-container-unified");
        if (container) {
            const inputs = container.querySelectorAll<HTMLInputElement>("input[required]");
            for (let i = 0; i < inputs.length; i++) {
                if (!inputs[i].checkValidity()) {
                    inputs[i].reportValidity();
                    return false;
                }
            }
        }
        return true;
    };

    const handleNextStep1 = (e: React.MouseEvent) => {
        e.preventDefault();
        if (validateStep1()) setCurrentStep(2);
    };

    const handleNextStep2 = (e: React.MouseEvent) => {
        e.preventDefault();
        if (validateStep2()) setCurrentStep(3);
    };

    const handlePrevStep = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentStep((prev) => Math.max(1, prev - 1));
    };

    const themeColors = {
        bgFrom: selectedPlan === "basic" ? "from-fuchsia-900/10" : "from-fuchsia-900/20",
        bgVia: selectedPlan === "basic" ? "via-purple-900/10" : "via-purple-900/20",
        bgTo: selectedPlan === "basic" ? "to-pink-900/10" : "to-pink-900/20",
        border: selectedPlan === "basic" ? "border-[pink-300]/30" : "border-purple-500/30",
        accent: selectedPlan === "basic" ? "text-[pink-300]" : "text-purple-400",
        accentHover: selectedPlan === "basic" ? "hover:text-[pink-200]" : "hover:text-purple-300",
        bgAccent: selectedPlan === "basic" ? "bg-[pink-300]/20" : "bg-purple-600/20",
        btnGradientFrom: selectedPlan === "basic" ? "from-[fuchsia-500]" : "from-purple-500",
        btnGradientTo: selectedPlan === "basic" ? "to-[pink-300]" : "to-purple-300",
        ring: selectedPlan === "basic" ? "ring-[pink-300]" : "ring-purple-500",
        glow: selectedPlan === "basic" ? "shadow-[0_0_15px_rgba(216,178,163,0.3)]" : "shadow-[0_0_15px_rgba(192,38,211,0.3)]",
    };

    if (status.type === "success") {
        return (
            <div className={`border rounded-2xl p-8 text-center mt-6 ${selectedPlan === "premium" ? "bg-emerald-900/30 border-emerald-500/50" : "bg-[pink-300]/30 border-[pink-300]/50"}`}>
                <CheckCircle2 className={`w-12 h-12 mx-auto mb-4 ${selectedPlan === "premium" ? "text-emerald-400" : "text-[pink-300]"}`} />
                <h3 className="text-2xl font-bold text-white mb-2">Richiesta Ricevuta!</h3>
                <p className={selectedPlan === "premium" ? "text-emerald-100" : "text-[pink-300]"}>{status.message}</p>
                <p className={`text-sm mt-4 lg:w-3/4 mx-auto ${selectedPlan === "premium" ? "text-emerald-200/70" : "text-[pink-300]/70"}`}>
                    Il nostro team esaminerà i tuoi dati e ti invierà al più presto un'e-mail con il contratto e il link per il pagamento sicuro.
                </p>
            </div>
        );
    }

    return (
        <div id="upgrade-section" className={`bg-gradient-to-br transition-all duration-700 ${themeColors.bgFrom} ${themeColors.bgVia} ${themeColors.bgTo} backdrop-blur-md border ${themeColors.border} rounded-3xl p-6 md:p-10 my-16 shadow-2xl relative overflow-hidden font-[family-name:var(--font-montserrat)]`}>
            {/* Ambient Lights */}
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-colors duration-700 ${selectedPlan === "basic" ? "bg-[pink-300]/10" : "bg-purple-600/10"}`} />

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-semibold text-white mb-3 uppercase tracking-wide">
                        SCEGLI IL TUO PIANO E MIGLIORA IL SERVIZIO
                    </h2>
                    <p className="text-zinc-300 font-light mt-2 leading-relaxed max-w-2xl mx-auto">
                        Personalizza la tua esperienza musicale scegliendo l'abbonamento che si adatta alle tue esigenze.
                    </p>
                </div>

                {/* Plan Selector */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 bg-black/20 p-2 md:p-3 rounded-2xl border border-white/5">
                    {planType !== 'basic' && (
                        <button
                            type="button"
                            onClick={() => { setSelectedPlan("basic"); setCurrentStep(1); }}
                            className={`w-full relative overflow-hidden p-6 rounded-xl border text-left transition-all duration-500 flex flex-col items-start bg-white/10 border-[pink-300]/50 shadow-[0_0_20px_rgba(216,178,163,0.15)] cursor-pointer`}
                        >
                            <div className="flex justify-between items-center w-full mb-2 mt-1">
                                <h3 className="text-xl font-bold text-white tracking-widest uppercase">Basic</h3>
                                <CheckCircle2 className="w-6 h-6 text-[pink-300]" />
                            </div>
                            <p className="text-sm text-zinc-400 font-light mb-4 text-center md:text-left">La soluzione ideale per la giusta atmosfera nel tuo salone.</p>
                            <div className="mt-auto flex w-full justify-between items-end">
                                <div>
                                    <span className="text-2xl md:text-3xl font-black text-white">€ 20,90</span><span className="text-zinc-500 text-sm md:text-base"> / mese</span>
                                </div>
                            </div>
                        </button>
                    )}

                    {planType === 'basic' && (
                        <button
                            type="button"
                            onClick={() => { setSelectedPlan("premium"); setCurrentStep(1); }}
                            className={`w-full relative overflow-hidden p-6 rounded-xl border text-left transition-all duration-500 flex flex-col items-start bg-white/10 border-purple-500/50 shadow-[0_0_20px_rgba(192,38,211,0.15)] cursor-pointer`}
                        >
                            <div className="absolute top-0 right-0 bg-purple-500 text-xs font-bold text-white px-3 py-1 rounded-bl-lg uppercase">
                                + Promo Sonore
                            </div>
                            <div className="flex justify-between items-center w-full mb-2">
                                <h3 className="text-xl font-bold text-white tracking-widest uppercase flex items-center gap-2">Premium <Sparkles className="w-5 h-5 text-purple-400" /></h3>
                                <CheckCircle2 className="w-6 h-6 text-purple-400" />
                            </div>
                            <p className="text-sm text-zinc-400 font-light mb-4 text-center md:text-left">Tutta la libreria musicale, più spot sonori personalizzati e creati su misura per te.</p>
                            <div className="mt-auto flex w-full justify-between items-end">
                                <div>
                                    <span className="text-2xl md:text-3xl font-black text-white">€ 38,90</span><span className="text-zinc-500 text-sm md:text-base"> / mese</span>
                                </div>
                            </div>
                        </button>
                    )}
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="space-y-6 bg-black/30 p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden shadow-inner" noValidate>
                    {/* Stepper Dots Indicator & Title */}
                    <div className="flex flex-col items-center justify-center mb-10 w-full relative">
                        {/* Progress Bar Background */}
                        <div className="absolute top-1/2 left-1/4 right-1/4 h-1 bg-white/10 -z-10 rounded-full" />
                        
                        <div className="flex justify-between w-1/2 relative z-10 px-8">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-md ${currentStep >= 1 ? `${themeColors.bgAccent} text-white shadow-[#D8B2A3]/30` : "bg-white/10 text-zinc-500"}`}>
                                1
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-md ${currentStep >= 2 ? `${themeColors.bgAccent} text-white shadow-[#D8B2A3]/30` : "bg-white/10 text-zinc-500"}`}>
                                2
                            </div>
                            {true && (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-md ${currentStep >= 3 ? `${themeColors.bgAccent} text-white shadow-[#D8B2A3]/30` : "bg-white/10 text-zinc-500"}`}>
                                    3
                                </div>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <h3 className={`text-lg md:text-xl font-bold uppercase tracking-widest ${themeColors.accent}`}>
                                {currentStep === 1 && "Dati Abbonamento & Istituto"}
                                {currentStep === 2 && "Dati di Fatturazione"}
                                {currentStep === 3 && "Firma Contratto"}
                            </h3>
                            <p className="text-sm text-zinc-400 mt-1">
                                {currentStep === 1 && "Passo 1 di " + (selectedPlan === "premium" ? "3" : "2")}
                                {currentStep === 2 && "Passo 2 di " + (selectedPlan === "premium" ? "3" : "2")}
                                {currentStep === 3 && "Passo 3 di 3"}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden relative w-full">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: currentStep === 1 ? 'translateX(0)' : currentStep === 2 ? 'translateX(-100%)' : 'translateX(-200%)' }}
                        >
                            {/* ========================================================== */}
                            {/* STEP 1: Dati Istituto */}
                            {/* ========================================================== */}
                            <div id="step-1-container-unified" className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-semibold text-zinc-300">Durata abbonamento*</label>
                                    <div className="flex flex-col sm:flex-row gap-4 mb-2">
                                        {(["6 mesi", "12 mesi"] as DurationType[]).map((dur) => (
                                            <label key={dur} className={`flex-1 flex flex-col items-start gap-1 p-4 rounded-xl border cursor-pointer transition-all ${durataAbbonamento === dur ? `${themeColors.bgAccent} ${themeColors.border} ${themeColors.glow}` : "bg-black/40 border-white/10 hover:bg-white/5"}`}>
                                                <div className="flex items-center gap-2 text-white font-bold text-lg w-full">
                                                    <input
                                                        type="radio"
                                                        name="durataAbbonamento"
                                                        value={dur}
                                                        checked={durataAbbonamento === dur}
                                                        onChange={() => setDurataAbbonamento(dur)}
                                                        className={`w-4 h-4 text-purple-500 focus:${themeColors.ring} bg-white/10 border-white/20`}
                                                    />
                                                    {dur}
                                                </div>
                                                <div className={`text-base pl-6 text-white font-medium`}>
                                                    € {(selectedPlan === "basic" ? (dur === "6 mesi" ? 25.90 : 20.90) : (dur === "6 mesi" ? 43.90 : 38.90)).toFixed(2).replace('.', ',')} / mese
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="nomeIstituto" className="block text-sm font-semibold text-zinc-300">Nome istituto*</label>
                                    <input id="nomeIstituto" name="nomeIstituto" type="text" required defaultValue={userSalonName || ""} className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:${themeColors.ring} transition-all`} />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-semibold text-zinc-300">Indirizzo istituto*</label>
                                    <div className="grid grid-cols-12 gap-3">
                                        <div className="col-span-12 md:col-span-9">
                                            <input name="indirizzoVia" type="text" placeholder="Via/Piazza" required className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:${themeColors.ring}`} />
                                        </div>
                                        <div className="col-span-6 md:col-span-3">
                                            <input name="indirizzoCivico" type="text" placeholder="N°" required className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:${themeColors.ring}`} />
                                        </div>
                                        <div className="col-span-6 md:col-span-3">
                                            <input name="indirizzoCap" type="text" placeholder="CAP" required className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:${themeColors.ring}`} />
                                        </div>
                                        <div className="col-span-8 md:col-span-6">
                                            <input name="indirizzoCitta" type="text" placeholder="Città" required className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:${themeColors.ring}`} />
                                        </div>
                                        <div className="col-span-4 md:col-span-3">
                                            <input name="indirizzoProvincia" type="text" placeholder="Pr(Mi)" maxLength={2} required className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:${themeColors.ring} uppercase`} />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-semibold text-zinc-300">Metri quadri istituto*</label>
                                    <div className="flex flex-col sm:flex-row gap-4 mb-2">
                                        {(["0-250", "oltre"] as MetriQuadriType[]).map((mq) => (
                                            <label key={mq} className={`flex items-center gap-2 text-white cursor-pointer bg-black/40 px-4 py-3 rounded-xl border transition-colors ${metriQuadriOption === mq ? 'border-white/30 bg-white/5' : 'border-white/10 hover:bg-white/5'}`}>
                                                <input
                                                    type="radio"
                                                    name="metriQuadriRadio"
                                                    value={mq}
                                                    checked={metriQuadriOption === mq}
                                                    onChange={() => setMetriQuadriOption(mq)}
                                                    className="w-4 h-4"
                                                />
                                                {mq === "0-250" ? "0-250 mq" : "Oltre 250 mq"}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label htmlFor="responsabileIstituto" className="block text-sm font-semibold text-zinc-300">Responsabile istituto*</label>
                                    <input id="responsabileIstituto" name="responsabileIstituto" type="text" required className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:${themeColors.ring}`} />
                                </div>

                                <div className="md:col-span-2 pt-6 flex flex-col gap-4">
                                    {status.type === "error" && (
                                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <p className="text-sm font-medium">{status.message}</p>
                                        </div>
                                    )}
                                    <div className="flex justify-end">
                                        <Button type="button" onClick={handleNextStep1} className={`bg-gradient-to-r ${themeColors.btnGradientFrom} ${themeColors.btnGradientTo} text-white font-bold py-6 px-10 rounded-xl transition-all border-none text-lg`}>
                                            Vai allo Step 2 (Fatturazione) &rarr;
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* ========================================================== */}
                            {/* STEP 2: Fatturazione & Totale */}
                            {/* ========================================================== */}
                            <div id="step-2-container-unified" className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
                                <div className="md:col-span-2 space-y-2">
                                    <label htmlFor="ragioneSociale" className="block text-sm font-semibold text-zinc-300">Ragione Sociale*</label>
                                    <input id="ragioneSociale" name="ragioneSociale" type="text" required className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:${themeColors.ring}`} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="partitaIva" className="block text-sm font-semibold text-zinc-300">CF - Partita IVA*</label>
                                    <input id="partitaIva" name="partitaIva" type="text" required defaultValue={userVat || ""} className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:${themeColors.ring}`} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="codiceSdi" className="block text-sm font-semibold text-zinc-300">Codice Destinatario/SDI</label>
                                    <input id="codiceSdi" name="codiceSdi" type="text" className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:${themeColors.ring}`} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="emailContatto" className="block text-sm font-semibold text-zinc-300">La tua email*</label>
                                    <input id="emailContatto" name="emailContatto" type="email" required readOnly defaultValue={userEmail || ""} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="telefono" className="block text-sm font-semibold text-zinc-300">Il Tuo telefono*</label>
                                    <input id="telefono" name="telefono" type="tel" required className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:${themeColors.ring}`} />
                                </div>

                                <div className="md:col-span-2 mt-6 mb-2 flex justify-center">
                                    <div className={`bg-black/40 border ${themeColors.border} rounded-3xl p-6 md:p-8 w-full max-w-lg ${themeColors.glow} text-center`}>
                                        <p className="text-zinc-400 font-semibold mb-1 uppercase tracking-wider text-xs">Riepilogo Abbonamento</p>
                                        <p className={`font-black uppercase tracking-widest text-lg ${themeColors.accent}`}>Piano {selectedPlan}</p>
                                        <div className="flex items-center justify-center mt-2 mb-4">
                                            <span className={`text-5xl font-black ${themeColors.accent}`}>€{totalPrice}</span>
                                        </div>
                                        <p className="text-sm text-zinc-300 font-medium">*{getMonths()} mesi (Fatturazione in un'unica soluzione)</p>
                                        <p className="text-xs text-zinc-500 mt-2 italic">I prezzi sono da considerarsi IVA esclusa</p>
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-4 flex flex-col gap-4">
                                    {status.type === "error" && (
                                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <p className="text-sm font-medium">{status.message}</p>
                                        </div>
                                    )}
                                    <div className="flex flex-col-reverse md:flex-row justify-between w-full gap-4">
                                        <Button type="button" onClick={handlePrevStep} className="bg-transparent hover:bg-white/5 text-white font-semibold py-6 px-10 rounded-xl transition-all border border-white/10">
                                            &larr; Indietro
                                        </Button>
                                        
                                        <Button type="button" onClick={handleNextStep2} className={`bg-gradient-to-r ${themeColors.btnGradientFrom} ${themeColors.btnGradientTo} text-white font-bold py-6 px-10 rounded-xl transition-all border-none flex-1 md:flex-none text-lg`}>
                                            Vai allo Step 3 (Firma) &rarr;
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* ========================================================== */}
                            {/* STEP 3: Firma Elettronica (Entrambi i piani) */}
                            {/* ========================================================== */}
                            {true && (
                                <div id="step-3-container-unified" className="w-full shrink-0 flex flex-col gap-6 p-1">
                                    <div className="text-center mb-4">
                                        <h3 className="text-xl font-bold text-white mb-2">Termini e Firma del Contratto</h3>
                                        <p className="text-zinc-400 text-sm">Leggi attentamente le condizioni dell'abbonamento e firma nel riquadro in basso per accettazione.</p>
                                    </div>

                                    {/* Scrollable Contract Box */}
                                    <div className="bg-black/60 border border-white/10 rounded-xl p-4 h-48 overflow-y-auto text-left text-sm text-zinc-300 custom-scrollbar shadow-inner">
                                        <h4 className="font-bold text-white mb-3 text-base">CONTRATTO DI ABBONAMENTO BeautiFy Channel</h4>
                                        
                                        <p className="font-bold text-white mt-4 mb-1">1. OGGETTO DEL SERVIZIO</p>
                                        <p className="mb-2">PES fornisce al Cliente il servizio BeautiFy Channel, piattaforma di streaming audio professionale accessibile tramite il sito beautify-channel.com. Il servizio consente la diffusione sonora di palinsesti musicali e comunicazioni audio progettate per istituti di bellezza. Il servizio è destinato esclusivamente alla diffusione sonora all'interno dell'istituto indicato nel form precedente.</p>

                                        <p className="font-bold text-white mt-4 mb-1">2. DURATA E RINNOVO</p>
                                        <p className="mb-2">Il servizio BeautiFy Channel rimane attivo per il periodo indicato al momento dell'acquisto (6 o 12 mesi). Alla scadenza dell'abbonamento il servizio terminerà automaticamente, salvo eventuale rinnovo effettuato dal Cliente tramite la piattaforma BeautiFy Channel.</p>

                                        <p className="font-bold text-white mt-4 mb-1">3. PAGAMENTO</p>
                                        <p className="mb-2">Il Cliente sottoscrive il piano di abbonamento selezionato. Il pagamento del servizio viene effettuato anticipatamente tramite il sistema di pagamento Stripe all'interno della piattaforma. La generazione del contratto definitivo avverrà a seguito dell'avvenuto incasso del medesimo.</p>

                                        <p className="font-bold text-white mt-4 mb-1">4. UTILIZZO DEL SERVIZIO</p>
                                        <p className="mb-2">Il Cliente si impegna a utilizzare il servizio esclusivamente per la diffusione sonora all'interno dell'istituto indicato. Il Cliente è responsabile delle apparecchiature e della connessione internet necessarie alla fruizione del servizio.</p>

                                        <p className="font-bold text-white mt-4 mb-1">5. UTILIZZO LIMITATO DEL SERVIZIO</p>
                                        <p className="mb-2">L'abbonamento BeautiFy Channel è associato esclusivamente all'istituto del Cliente. Il servizio non può essere condiviso, trasferito o utilizzato contemporaneamente in sedi o istituti diversi senza preventiva autorizzazione scritta da parte di PES.</p>

                                        <p className="font-bold text-white mt-4 mb-1">6. LICENZE MUSICALI</p>
                                        <p className="mb-2">I contenuti musicali diffusi da BeautiFy Channel provengono da repertori per i quali PES dispone delle autorizzazioni. A seguito dell'attivazione, il Cliente riceve la propria licenza di utilizzo personalizzata. Il Cliente si impegna a non registrare, copiare o redistribuire i contenuti trasmessi dal servizio.</p>

                                        <p className="font-bold text-white mt-4 mb-1">7. PRIVACY</p>
                                        <p className="mb-2">I dati personali forniti tramite il form di registrazione sono trattati da PES nel rispetto del Regolamento UE 2016/679 (GDPR) esclusivamente per la gestione del servizio.</p>

                                        <p className="font-bold text-white mt-4 mb-1">8. LEGGE APPLICABILE</p>
                                        <p className="mb-2">Il presente contratto è regolato dalla legge italiana. Per qualsiasi controversia relativa al presente contratto è competente in via esclusiva il Foro di Milano.</p>
                                        
                                        <p className="font-bold text-white mt-4 mb-1">9. GENERAZIONE AUTOMATICA</p>
                                        <p className="mb-2 pb-4">Il presente documento è integrato nel sistema BeautiFy Channel. Proseguendo l'acquisto, confermi di aver letto, compreso e accettato integralmente le suddette clausole che compariranno nel PDF definitivo.</p>
                                    </div>

                                    {/* Agreement Checkboxes */}
                                    <div className="flex flex-col gap-4 mt-2">
                                        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-black/40 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
                                            <div className="relative flex items-center pt-1">
                                                <input 
                                                    type="checkbox" 
                                                    checked={acceptedTerms} 
                                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                    className={`w-5 h-5 focus:${themeColors.ring} bg-white/10 border-white/20 rounded cursor-pointer`}
                                                    required
                                                />
                                            </div>
                                            <span className="text-sm text-zinc-300 leading-tight">
                                                Ho letto accuratamente e accetto senza riserve tutte le <strong>Condizioni del Contratto di Abbonamento BeautiFy Channel</strong> riportate qui sopra.*
                                            </span>
                                        </label>

                                        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-black/40 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
                                            <div className="relative flex items-center pt-1">
                                                <input 
                                                    type="checkbox" 
                                                    checked={acceptedPrivacy} 
                                                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                                                    className={`w-5 h-5 focus:${themeColors.ring} bg-white/10 border-white/20 rounded cursor-pointer`}
                                                    required
                                                />
                                            </div>
                                            <span className="text-sm text-zinc-300 leading-tight">
                                                Ho letto e accetto l'<strong>Informativa sulla Privacy</strong> riguardante il trattamento dei miei dati personali.*
                                            </span>
                                        </label>
                                    </div>

                                    <div className="pt-4 flex flex-col gap-4 mt-auto">
                                        {status.type === "error" && (
                                            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
                                                <AlertCircle className="w-5 h-5 shrink-0" />
                                                <p className="text-sm font-medium">{status.message}</p>
                                            </div>
                                        )}
                                        <div className="flex flex-col-reverse md:flex-row justify-between w-full gap-4">
                                            <Button type="button" onClick={handlePrevStep} className="bg-transparent hover:bg-white/5 text-white font-semibold py-6 px-10 rounded-xl transition-all border border-white/10">
                                                &larr; Dati
                                            </Button>
                                            <Button type="submit" disabled={isSubmitting} className={`bg-gradient-to-r ${themeColors.btnGradientFrom} ${themeColors.btnGradientTo} text-white font-bold py-6 px-10 rounded-xl transition-all disabled:opacity-50 border-none flex-1 md:flex-none text-lg`}>
                                                {isSubmitting ? "Invio in corso..." : "Procedi al Pagamento Sicuro"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                {/* GRAZIE Section */}
                <div className="mt-16 text-center relative flex flex-col items-center justify-center">
                    <h3 className={`text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${themeColors.btnGradientFrom} ${themeColors.btnGradientTo} tracking-[0.2em] md:tracking-[0.4em] uppercase mb-2 relative z-10`}>
                        GRAZIE
                    </h3>
                    <p className="text-white text-sm md:text-base flex items-center justify-center gap-2 relative z-10 font-medium">
                        <Heart className={`w-4 h-4 ${themeColors.accent} fill-current opacity-70`} />
                        Il giusto mood fa la differenza in istituto
                        <Heart className={`w-4 h-4 ${themeColors.accent} fill-current opacity-70`} />
                    </p>
                </div>
            </div>
        </div>
    );
}
