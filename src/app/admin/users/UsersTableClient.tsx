"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { UserRowActions } from "./UserRowActions";
import { formatDistanceToNow, differenceInMinutes, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { Search } from "lucide-react";
import { format } from "date-fns";

export function UsersTableClient({ initialProfiles }: { initialProfiles: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const now = new Date();

    // Filter profiles based on searchTerm (checking salon_name and email)
    const filteredProfiles = initialProfiles.filter((user) => {
        const searchUpper = searchTerm.toUpperCase();
        const salonMatch = user.salon_name?.toUpperCase().includes(searchUpper);
        const emailMatch = user.email?.toUpperCase().includes(searchUpper);
        return salonMatch || emailMatch;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Cerca per istituto o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-fuchsia-500"
                    />
                </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-950/50">
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-zinc-400 font-medium">Nome Istituto</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Email</TableHead>
                            <TableHead className="hidden text-zinc-400 font-medium">Role</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Abbonamento</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Stato Abbonamento</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Scadenza</TableHead>
                            <TableHead className="text-zinc-400 font-medium">Ultimo Accesso</TableHead>
                            <TableHead className="text-right text-zinc-400 font-medium">Azioni</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProfiles.map((user) => {
                            // isOnline dipende direttamente dal DB
                            const isOnline = user.is_online === true;
                            let lastSeenText = "Mai connesso";

                            if (user.last_seen) {
                                const lastSeenDate = parseISO(user.last_seen);
                                lastSeenText = formatDistanceToNow(lastSeenDate, { addSuffix: true, locale: it });
                            }

                            // --- CALCOLO STATUS ABBONAMENTO ---
                            let isPlanActive = user.plan_status === 'active';
                            let displayStatus = user.plan_status || 'no active';

                            // Se l'utente è "free" (trial scaduto)
                            if (!user.plan_type || user.plan_type === 'free') {
                                isPlanActive = false;
                                displayStatus = 'no active';
                            }
                            // Se l'utente è "free_trial" ma la data di trial è passata
                            else if (user.plan_type === 'free_trial' && user.trial_ends_at && new Date(user.trial_ends_at) < now) {
                                isPlanActive = false;
                                displayStatus = 'no active';
                            }
                            // Se l'utente è "basic" o "premium" ma la data di scadenza è passata
                            else if ((user.plan_type === 'basic' || user.plan_type === 'premium' || user.plan_type === 'premiumcustomizzato') && user.subscription_expiration && new Date(user.subscription_expiration) < now) {
                                isPlanActive = false;
                                displayStatus = 'no active';
                            }

                            // Assicuriamoci che se non è attivo per qualsiasi motivo, e il testo è inattivo o null, stampi "no active"
                            if (!isPlanActive) {
                                displayStatus = 'no active';
                            }
                            // -----------------------------------

                            return (
                                <TableRow key={user.id} className="border-white/10 hover:bg-white/5 transition-colors">
                                    <TableCell className="font-medium text-zinc-100">{user.salon_name || "Senza Nome"}</TableCell>
                                    <TableCell className="text-zinc-400">{user.email}</TableCell>
                                    <TableCell className="hidden">
                                        <Badge variant="outline" className={user.role === 'Admin' ? 'text-red-400 border-red-400/50' : 'text-zinc-300 border-white/20'}>
                                            {user.role === 'Admin' ? 'Admin' : 'User'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            bg-transparent uppercase text-[10px] font-bold tracking-wider
                                            ${user.plan_type === 'premium' ? 'text-fuchsia-400 border-fuchsia-400/50' :
                                                user.plan_type === 'free_trial' ? 'text-emerald-400 border-emerald-400/50' :
                                                    user.plan_type === 'basic' ? 'text-indigo-400 border-indigo-400/50' :
                                                        'text-zinc-400 border-zinc-500/30'}
                                        `}>
                                            {user.plan_type ? user.plan_type.replace('_', ' ') : 'free'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 relative pl-4">
                                            <span className={`w-2 h-2 rounded-full absolute left-0 ${isPlanActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                                            <span className={isPlanActive ? 'text-zinc-300 capitalize' : 'text-zinc-500 capitalize'}>{displayStatus}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-zinc-300 text-sm whitespace-nowrap">
                                            {user.subscription_expiration
                                                ? format(parseISO(user.subscription_expiration), "dd MMM yyyy", { locale: it })
                                                : "-"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`relative flex h-2 w-2`}>
                                                    {isOnline && (
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    )}
                                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
                                                </span>
                                                <span className={`text-sm font-medium ${isOnline ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                                    {isOnline ? 'Online' : 'Offline'}
                                                </span>
                                            </div>
                                            {!isOnline && user.last_seen && (
                                                <span className="text-xs text-zinc-500 ml-4 truncate max-w-[150px]" title={new Date(user.last_seen).toLocaleString('it-IT')}>
                                                    {lastSeenText}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <UserRowActions user={{
                                            id: user.id,
                                            role: user.role,
                                            plan_type: user.plan_type,
                                            salon_name: user.salon_name,
                                            subscription_expiration: user.subscription_expiration
                                        }} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {filteredProfiles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                                    Nessun utente trovato corrispondente alla ricerca.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
