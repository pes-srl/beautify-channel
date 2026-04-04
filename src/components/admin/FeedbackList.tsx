"use client";

import { useState } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Search, Filter, MessageSquare, Calendar, User, Info } from "lucide-react";

interface Feedback {
    id: string;
    created_at: string;
    email: string;
    feedback_text: string;
    source: string;
}

interface FeedbackListProps {
    initialFeedbacks: Feedback[];
}

export function FeedbackList({ initialFeedbacks }: FeedbackListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [feedbacks] = useState<Feedback[]>(initialFeedbacks);

    const filteredFeedbacks = feedbacks.filter(f => 
        f.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.feedback_text?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Cerca per email o contenuto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
            </div>

            {/* Feedbacks Table */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Data</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Utente</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Feedback Selezionati</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Sorgente</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredFeedbacks.length > 0 ? (
                                filteredFeedbacks.map((f) => (
                                    <tr key={f.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-zinc-300">
                                                <Calendar className="w-4 h-4 text-zinc-500" />
                                                {format(new Date(f.created_at), "dd MMM yyyy HH:mm", { locale: it })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm font-medium text-white">
                                                <User className="w-4 h-4 text-zinc-500" />
                                                {f.email || "Anonimo"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {f.feedback_text.split(',').map((tag, idx) => (
                                                    <span 
                                                        key={`${f.id}-${idx}`}
                                                        className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                                    >
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <Info className="w-3.5 h-3.5" />
                                                {f.source || "Sconosciuta"}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                        Nessun feedback trovato.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
