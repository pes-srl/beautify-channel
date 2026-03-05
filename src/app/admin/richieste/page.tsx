import { createClient } from "@/utils/supabase/server";
import { HandCoins } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { StatusUpdater } from "@/components/admin/StatusUpdater";

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
                <div className="grid gap-4">
                    {!richieste || richieste.length === 0 ? (
                        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 text-center">
                            <p className="text-zinc-400">Nessuna richiesta ricevuta finora.</p>
                        </div>
                    ) : (
                        richieste.map((req: any) => (
                            <div key={req.id} className="bg-[#17092b] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-fuchsia-500/30 transition-colors">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-fuchsia-600/10 transition-colors pointer-events-none" />

                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4 pb-4 border-b border-white/5 relative z-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-lg text-white">
                                                {req.billing_details?.nome_istituto || req.billing_details?.email_contatto || 'Istituto Sconosciuto'}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20' :
                                                req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                                                    'bg-red-500/20 text-red-400 border border-red-500/20'
                                                }`}>
                                                {req.status}
                                            </span>
                                            <span className="px-2 py-0.5 bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/20 rounded text-xs font-bold uppercase">
                                                {req.requested_plan}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-400">
                                            Inviata il: {format(new Date(req.created_at), "dd MMMM yyyy, HH:mm", { locale: it })}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 relative z-10">
                                    <div>
                                        <p className="text-xs font-bold uppercase text-zinc-500 mb-1">Ragione Sociale</p>
                                        <p className="text-zinc-200 font-medium">{req.billing_details?.ragione_sociale || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-zinc-500 mb-1">Partita IVA</p>
                                        <p className="text-zinc-200 font-medium">{req.billing_details?.partita_iva || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-zinc-500 mb-1">Nome Istituto</p>
                                        <p className="text-zinc-200 font-medium">{req.billing_details?.nome_istituto || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-zinc-500 mb-1">Indirizzo Istituto</p>
                                        <p className="text-zinc-200 font-medium">{req.billing_details?.indirizzo_istituto || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-zinc-500 mb-1">Responsabile</p>
                                        <p className="text-zinc-200 font-medium">{req.billing_details?.responsabile_istituto || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-zinc-500 mb-1">Metri Quadri</p>
                                        <p className="text-zinc-200 font-medium">{req.billing_details?.metri_quadri || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-zinc-500 mb-1">Durata Abbonamento</p>
                                        <p className="text-zinc-200 font-medium">{req.billing_details?.durata_abbonamento || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-zinc-500 mb-1">Email di Contatto</p>
                                        <p className="text-zinc-200 font-medium">{req.billing_details?.email_contatto || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-zinc-500 mb-1">Telefono</p>
                                        <p className="text-zinc-200 font-medium">{req.billing_details?.telefono || '-'}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/5 flex gap-3 relative z-10 items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-zinc-400 font-medium">Aggiorna Stato:</span>
                                        <StatusUpdater requestId={req.id} currentStatus={req.status} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
