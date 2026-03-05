import { getRecentActivity } from "@/app/actions/activity-actions";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { LogIn, LogOut, UserPlus, ArrowUpCircle, Activity } from "lucide-react";

export async function RecentActivityWidget() {
    const { logs, error } = await getRecentActivity(10); // Fetch latest 10 items

    return (
        <div className="p-8 rounded-2xl bg-[#17092b] border border-white/5 shadow-xl flex flex-col h-full max-h-[500px]">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Activity className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-lg text-white">Attività Recente</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {error || !logs ? (
                    <div className="text-zinc-500 text-sm text-center py-4">
                        Nessun log disponibile. Verifica DB SQL.
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-zinc-500 text-sm text-center py-4">
                        Nessuna attività registrata ancora.
                    </div>
                ) : (
                    logs.map((log: any) => {
                        let icon = <Activity className="w-4 h-4 text-zinc-400" />;
                        let colorClass = "bg-zinc-500/10 border-zinc-500/20";
                        let message = "Azione sconosciuta";

                        const email = log.profiles?.email || 'Utente';
                        const timeAgo = formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: it });

                        switch (log.action_type) {
                            case 'login':
                                icon = <LogIn className="w-4 h-4 text-emerald-400" />;
                                colorClass = "bg-emerald-500/10 border-emerald-500/20";
                                message = `${email} ha effettuato l'accesso.`;
                                break;
                            case 'logout':
                                icon = <LogOut className="w-4 h-4 text-zinc-400" />;
                                colorClass = "bg-zinc-500/10 border-zinc-500/20";
                                message = `${email} è uscito dal sistema.`;
                                break;
                            case 'signup_freetrial':
                                icon = <UserPlus className="w-4 h-4 text-fuchsia-400" />;
                                colorClass = "bg-fuchsia-500/10 border-fuchsia-500/20";
                                message = `Nuova Prova Gratuita attivata da ${email}.`;
                                break;
                            case 'upgrade_request':
                                icon = <ArrowUpCircle className="w-4 h-4 text-amber-400" />;
                                colorClass = "bg-amber-500/10 border-amber-500/20";
                                message = `${email} ha inviato una richiesta di Upgrade.`;
                                break;
                        }

                        return (
                            <div key={log.id} className="flex gap-4 items-start group">
                                <div className={`shrink-0 p-2 rounded-full border ${colorClass} mt-0.5 shadow-inner`}>
                                    {icon}
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">
                                        {message}
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-1 capitalize-first">
                                        {timeAgo}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
