import { createClient } from "@/utils/supabase/server";
import { MessageSquare } from "lucide-react";
import { FeedbackList } from "@/components/admin/FeedbackList";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
    const supabase = await createClient();

    // Fetch all feedback ordered by the latest
    const { data: feedbacks, error } = await supabase
        .from("user_feedbacks")
        .select(`*`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching feedback:", error);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Feedback Utenti</h1>
                    <p className="text-zinc-400 mt-1">Analizza le risposte degli utenti alla paywall e le loro obiezioni</p>
                </div>
            </div>

            {error ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                    <p className="font-bold mb-1">Errore nel caricamento dei feedback:</p>
                    <p className="text-sm opacity-80">{error.message} (Codice: {error.code})</p>
                    <p className="mt-4 text-xs">Verifica che la tabella `user_feedbacks` esista in Supabase e che le policy RLS siano corrette.</p>
                </div>
            ) : (
                <FeedbackList initialFeedbacks={feedbacks || []} />
            )}
        </div>
    );
}
