"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Radio, Settings, Image as ImageIcon } from "lucide-react";

export function AdminSidebarNav() {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Overview",
            href: "/admin",
            icon: LayoutDashboard
        },
        {
            name: "Istituti & Utenti",
            href: "/admin/users",
            icon: Users
        },
        {
            name: "Channel Manager",
            href: "/admin/channels",
            icon: Radio
        },
        {
            name: "Media Library",
            href: "/admin/media",
            icon: ImageIcon
        }
    ];

    return (
        <nav className="flex-1 p-4 flex flex-col gap-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                            ? "bg-white/5 text-fuchsia-400"
                            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                            }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
