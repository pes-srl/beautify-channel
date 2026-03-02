"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2, UserCog, ScrollText } from "lucide-react";
import { updateUserProfile, deleteUserAccount } from "./actions";
import { toast } from "sonner";

interface UserRowActionsProps {
    user: {
        id: string;
        role: string | null;
        plan_type: string | null;
        salon_name: string | null;
    };
}

export function UserRowActions({ user }: UserRowActionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async (field: 'role' | 'plan_type', value: string) => {
        setIsLoading(true);
        const result = await updateUserProfile(user.id, field, value);
        if (result.error) {
            toast.error("Errore di aggiornamento", {
                description: result.error
            });
        } else {
            toast.success("Profilo aggiornato", {
                description: `Il ${field === 'role' ? 'ruolo' : 'piano'} di ${user.salon_name || 'questo utente'} è stato modificato in ${value}.`
            });
        }
        setIsLoading(false);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Sei sicuro di voler eliminare DEFINITIVAMENTE l'account di ${user.salon_name || user.id}? Questa azione irrimediabile cancellerà anche il suo accesso e tutti i suoi dati collegati.`)) return;

        setIsLoading(true);
        toast.loading("Eliminazione in corso...", { id: `delete-${user.id}` });

        const result = await deleteUserAccount(user.id);

        if (result.error) {
            toast.error("Errore durante l'eliminazione", {
                id: `delete-${user.id}`,
                description: result.error
            });
            setIsLoading(false);
        } else {
            toast.success("Utente eliminato", {
                id: `delete-${user.id}`,
                description: "L'account e tutti i dati associati sono stati rimossi."
            });
            // The row will unmount automatically due to Next.js revalidatePath
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-white rounded-lg" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-white/10 relative z-50">
                <DropdownMenuLabel className="text-zinc-400">Azioni: {user.salon_name || "Utente"}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-zinc-200 focus:bg-white/10">
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>Cambia Ruolo</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-zinc-950 border-white/10">
                        <DropdownMenuRadioGroup value={user.role === 'Admin' ? 'Admin' : 'User'}>
                            <DropdownMenuRadioItem value="User" onSelect={(e) => { e.preventDefault(); handleUpdate('role', 'User'); }} className="text-zinc-200 focus:bg-white/10 cursor-pointer">User</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Admin" onSelect={(e) => { e.preventDefault(); handleUpdate('role', 'Admin'); }} className="focus:bg-white/10 cursor-pointer text-red-400">Admin</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-zinc-200 focus:bg-white/10">
                        <ScrollText className="mr-2 h-4 w-4" />
                        <span>Cambia Abbonamento</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-zinc-950 border-white/10">
                        <DropdownMenuRadioGroup value={user.plan_type || 'free'}>
                            <DropdownMenuRadioItem value="free" onSelect={(e) => { e.preventDefault(); handleUpdate('plan_type', 'free'); }} className="text-zinc-200 focus:bg-white/10 cursor-pointer">Free</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="free_trial" onSelect={(e) => { e.preventDefault(); handleUpdate('plan_type', 'free_trial'); }} className="text-emerald-400 focus:bg-white/10 cursor-pointer font-medium">Free Trial</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="basic" onSelect={(e) => { e.preventDefault(); handleUpdate('plan_type', 'basic'); }} className="text-indigo-400 focus:bg-white/10 cursor-pointer font-medium">Basic</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="premium" onSelect={(e) => { e.preventDefault(); handleUpdate('plan_type', 'premium'); }} className="text-fuchsia-400 focus:bg-white/10 cursor-pointer font-medium">Premium</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator className="bg-white/10" />

                <button
                    onClick={handleDelete}
                    className="w-full text-left px-2 py-1.5 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 rounded-sm outline-none transition-colors"
                    disabled={isLoading}
                >
                    Elimina Definitivamente
                </button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
