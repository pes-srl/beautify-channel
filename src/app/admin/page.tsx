import { Users, UserPlus, Crown, UserCheck } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { TopChannelsWidget } from "@/components/admin/TopChannelsWidget";
import { RecentActivityWidget } from "@/components/admin/RecentActivityWidget";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
    const supabase = await createClient();
    const now = new Date();

    // Fetch all profiles to calculate dynamic stats based on dates
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, plan_type, trial_ends_at, subscription_expiration');

    let activeFreeTrial = 0;
    let activeBasic = 0;
    let activePremiumManual = 0;
    let expiredOrFree = 0;

    profiles?.forEach(user => {
        let isExpired = false;
        const pType = user.plan_type;

        if (pType === 'free_trial') {
            if (user.trial_ends_at && new Date(user.trial_ends_at) < now) {
                isExpired = true;
            } else {
                activeFreeTrial++;
            }
        } else if (pType === 'basic' || pType === 'premium' || pType === 'premiumcustomizzato') {
            if (user.subscription_expiration && new Date(user.subscription_expiration) < now) {
                isExpired = true;
            } else {
                if (pType === 'basic') activeBasic++;
                else activePremiumManual++;
            }
        } else {
            // Plan is 'free' or null
            isExpired = true;
        }

        if (isExpired) {
            expiredOrFree++;
        }
    });

    const stats = [
        { label: "In Prova 7 Giorni", value: activeFreeTrial.toString(), trend: "Account Attivi", icon: Users, color: "text-amber-400" },
        { label: "Utenti Basic", value: activeBasic.toString(), trend: "Abbonati Attivi", icon: UserCheck, color: "text-[#ff7393]" },
        { label: "Utenti Premium", value: activePremiumManual.toString(), trend: "Abbonati Attivi", icon: Crown, color: "text-fuchsia-400" },
        { label: "Prova Scaduta", value: expiredOrFree.toString(), trend: "Account Inattivi", icon: UserPlus, color: "text-red-400" },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-[#17092b] border border-white/5 shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-zinc-400 mb-1">{stat.label}</p>
                            <h3 className="text-4xl font-black text-white mb-2">{stat.value}</h3>
                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{stat.trend}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <TopChannelsWidget />
                <RecentActivityWidget />
            </div>
        </div>
    );
}
