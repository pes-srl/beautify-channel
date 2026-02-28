import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Radio, LogOut } from "lucide-react";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch full profile mapping the roles
    let profile = null;
    const { data, error } = await supabase
        .from("profiles")
        .select("salon_name, category, role, plan_type")
        .eq("id", user.id)
        .single();

    profile = data;

    const headerProfileData = {
        salon_name: profile?.salon_name || null,
        role: profile?.role || "User",
        plan_type: profile?.plan_type || "Free",
        category: profile?.category || null,
        email: user.email || "utente@beautify.com"
    };

    // Strict Admin Shield: Kick non-admins out to the client area
    if (headerProfileData.role !== "Admin") {
        redirect("/area-riservata");
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex text-zinc-100 pt-16">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-zinc-950/50 hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16">
                <AdminSidebarNav />

                <div className="p-4 border-t border-white/10">
                    <form action="/auth/signout" method="post" className="w-full">
                        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-[calc(100vh-64px)] overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
