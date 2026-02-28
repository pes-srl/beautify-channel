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
import { updateUserProfile } from "./actions";

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
            alert("Errore durante l'aggiornamento: " + result.error);
        }
        setIsLoading(false);
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
                        <DropdownMenuRadioGroup value={user.role || 'User'} onValueChange={(val) => handleUpdate('role', val)}>
                            <DropdownMenuRadioItem value="User" className="text-zinc-200 focus:bg-white/10 cursor-pointer">User</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Admin" className="focus:bg-white/10 cursor-pointer text-red-400">Admin</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-zinc-200 focus:bg-white/10">
                        <ScrollText className="mr-2 h-4 w-4" />
                        <span>Cambia Abbonamento</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-zinc-950 border-white/10">
                        <DropdownMenuRadioGroup value={user.plan_type || 'free'} onValueChange={(val) => handleUpdate('plan_type', val)}>
                            <DropdownMenuRadioItem value="free" className="text-zinc-200 focus:bg-white/10 cursor-pointer">Free</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="free_trial" className="text-emerald-400 focus:bg-white/10 cursor-pointer font-medium">Free Trial</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="basic" className="text-indigo-400 focus:bg-white/10 cursor-pointer font-medium">Basic</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="premium" className="text-fuchsia-400 focus:bg-white/10 cursor-pointer font-medium">Premium</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
