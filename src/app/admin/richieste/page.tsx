import { createClient } from "@/utils/supabase/server";
import { HandCoins } from "lucide-react";
import { RichiesteClientList } from "@/components/admin/RichiesteClientList";

export const dynamic = "force-dynamic";

export default async function AdminRichiestePage() {
    const supabase = await createClient();

    // Fetch all upgrade requests ordered by the latest
    // Also joining the profiles table to get the user's current salon_name if available
    const { data: richieste, error } = await supabase
        .from("upgrade_requests")
        .select(`*`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching richieste:", error);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-fuchsia-500/10 rounded-xl">
                    <HandCoins className="w-6 h-6 text-fuchsia-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Richieste Upgrade</h1>
                    <p className="text-zinc-400 mt-1">Gestisci le richieste di passaggio a un piano a pagamento</p>
                </div>
            </div>

            {error ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                    Errore nel caricamento delle richieste. Assicurati che la tabella esista e le policy RLS siano corrette.
                </div>
            ) : (
                <RichiesteClientList initialRichieste={richieste || []} />
            )}
        </div>
    );
}
