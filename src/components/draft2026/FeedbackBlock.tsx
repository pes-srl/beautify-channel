"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, MessageSquareHeart } from "lucide-react";
import { Montserrat } from "next/font/google";
import { submitFeedback } from "@/app/actions/feedback-actions";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600"] });

interface FeedbackBlockProps {
    userEmail?: string;
}

const FEEDBACK_OPTIONS = [
    { id: "musica", label: "Musica" },
    { id: "promo", label: "Promo Sonore" },
    { id: "prezzo", label: "Prezzo" },
];

export function FeedbackBlock({ userEmail }: FeedbackBlockProps) {
    const [selected, setSelected] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleOption = (option: string) => {
        setSelected(prev => 
            prev.includes(option) 
            ? prev.filter(o => o !== option) 
            : [...prev, option]
        );
    };

    const handleSubmit = async () => {
        if (selected.length === 0) return;
        setIsSubmitting(true);
        
        try {
            // Send selected options as a comma-separated string
            await submitFeedback(selected.join(", "), userEmail);
            setSubmitted(true);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-10 px-6 animate-in fade-in zoom-in duration-700">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] flex flex-col items-center gap-4 text-center backdrop-blur-3xl shadow-2xl">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className={`text-2xl font-bold text-white uppercase tracking-wider ${montserrat.className}`}>
                        Grazie per il tuo feedback!
                    </h3>
                    <p className="text-zinc-400 max-w-sm">
                        La tua opinione è preziosa e ci aiuta a migliorare <br /> 
                        continuamente il servizio BeautiFy.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center mb-10">
                <MessageSquareHeart className="w-14 h-14 text-[#ff7393]/60 mx-auto mb-6" />
                <p className="text-zinc-400 text-xl md:text-2xl font-medium leading-relaxed">
                    In caso contrario, ci piacerebbe sapere cosa non ti ha convinta, perché i feedback sono sempre <span className="text-zinc-300 italic font-bold">super benvenuti</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {FEEDBACK_OPTIONS.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => toggleOption(option.label)}
                        disabled={isSubmitting}
                        className={`group relative flex flex-col items-center justify-center text-center gap-1 p-6 md:p-8 rounded-3xl border transition-all duration-500 ${
                            selected.includes(option.label) 
                            ? 'bg-white/10 border-[#ff7393]/50 shadow-[0_0_20px_rgba(255,115,147,0.2)]' 
                            : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                        } overflow-hidden min-h-[100px] md:min-h-[120px]`}
                    >
                        {/* Selected Indicator */}
                        <div className={`absolute top-0 right-0 p-3 transition-opacity duration-500 ${selected.includes(option.label) ? 'opacity-100' : 'opacity-0'}`}>
                            <CheckCircle2 className="w-5 h-5 text-[#ff7393]" />
                        </div>

                        <span className={`text-white font-bold text-lg md:text-xl tracking-tight ${montserrat.className}`}>
                            {option.label}
                        </span>

                        {/* Interactive Sparkle Effect on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#ff7393]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </button>
                ))}
            </div>

            {/* SEND BUTTON - Appears when something is selected */}
            <div className={`mt-10 flex justify-center transition-all duration-500 ${selected.length > 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || selected.length === 0}
                    className="group relative px-10 py-4 bg-gradient-to-r from-[#ff7393] to-rose-500 rounded-full text-white font-bold text-sm uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,115,147,0.3)] hover:scale-105 transition-all duration-500 active:scale-95 flex items-center gap-3 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>Invio in corso...</span>
                        </>
                    ) : (
                        <>
                            <span>Invia Feedback</span>
                            <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </>
                    )}
                </button>
            </div>

            <p className="text-center text-zinc-400 text-lg mt-8 italic">
                Puoi selezionare più opzioni e confermare con il pulsante.
            </p>
        </div>
    );
}
