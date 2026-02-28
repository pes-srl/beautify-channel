"use client";

import { useState } from "react";
import { LogOut, User, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
    profile: {
        salon_name: string | null;
        role?: string;
        plan_type?: string;
        category: string | null;
        email: string;
    };
}

export function AdminHeader({ profile }: AdminHeaderProps) {
    const getInitials = (name: string | null, email: string) => {
        if (!name) return email.substring(0, 2).toUpperCase() || 'U';
        const parts = name.split(" ").filter(w => w.trim().length > 0);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        } else if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return "??";
    };

    const initials = getInitials(profile.salon_name, profile.email);
    const displayName = profile.salon_name || profile.email;

    const renderRoleBadge = (size: "large" | "small" = "large") => {
        const isSmall = size === "small";
        const baseClass = isSmall ? "h-5 px-2 text-[10px] uppercase font-bold tracking-wider" : "font-bold h-6 px-3";
        const roleStr = profile.role || "User";
        const planStr = profile.plan_type || "Free";

        if (roleStr === 'Admin') {
            return <Badge variant="destructive" className={`bg-red-600 hover:bg-red-700 text-white ${baseClass}`}>Admin</Badge>;
        }

        switch (planStr?.toLowerCase()) {
            case 'premiumcustomizzato':
            case 'ultra':
                return <Badge className={`bg-amber-500 hover:bg-amber-600 text-black ${baseClass}`}>Ultra</Badge>;
            case 'premium':
                return <Badge className={`bg-fuchsia-600 hover:bg-fuchsia-700 text-white ${baseClass}`}>Premium</Badge>;
            case 'basic':
                return <Badge className={`bg-indigo-600 hover:bg-indigo-700 text-white ${baseClass}`}>Basic</Badge>;
            case 'free_trial':
                return <Badge className={`bg-emerald-500 hover:bg-emerald-600 text-black ${baseClass}`}>Trial</Badge>;
            case 'free':
            default:
                return <Badge variant="secondary" className={`bg-zinc-800 text-zinc-300 ${baseClass}`}>Free</Badge>;
        }
    };

    return (
        <header className="h-16 flex items-center justify-end px-8 py-2 border-b border-white/10 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-4">

                {/* Dropdown Menu via Shadcn */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-center hover:bg-white/5 p-1 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500">
                        {/* Circle Avatar */}
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-zinc-950 font-bold flex items-center justify-center text-sm uppercase shadow-inner">
                            {initials}
                        </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-64 bg-zinc-900 border-white/10 text-white mt-2 p-2 shadow-2xl rounded-xl">
                        {/* Account Label mimicking the screenshot */}
                        <DropdownMenuLabel className="font-normal px-2 py-3">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm">Il mio account</span>
                                {renderRoleBadge("small")}
                            </div>
                            <div className="text-xs text-zinc-400 truncate mt-1">
                                {profile.email}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10 my-1" />

                        {/* Links */}
                        <div className="py-1">
                            <Link href="/">
                                <DropdownMenuItem className="cursor-pointer gap-3 focus:bg-white/10 py-2.5 rounded-md">
                                    <User className="h-4 w-4 text-zinc-400" />
                                    <span>Area riservata</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/admin/channels">
                                <DropdownMenuItem className="cursor-pointer gap-3 focus:bg-white/10 py-2.5 rounded-md">
                                    <LayoutDashboard className="h-4 w-4 text-zinc-400" />
                                    <span>Gestione Canali</span>
                                </DropdownMenuItem>
                            </Link>
                        </div>

                        <DropdownMenuSeparator className="bg-white/10 my-1" />

                        {/* Logout Form Action using the built server action if we had one, or a client link to an API.
                            For now, we'll link to an API endpoint or use a form action standard for Supabase SSR */}
                        <div className="py-1">
                            <form action="/auth/signout" method="post">
                                <button type="submit" className="w-full text-left">
                                    <DropdownMenuItem className="cursor-pointer gap-3 focus:bg-white/10 py-2.5 rounded-md">
                                        <LogOut className="h-4 w-4 text-zinc-400" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </button>
                            </form>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </header>
    );
}
