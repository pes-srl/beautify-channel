import { Users, Radio, Headphones, Activity } from "lucide-react";

export default function AdminOverview() {
    const stats = [
        { label: "Istituti Attivi", value: "142", trend: "+12% this month", icon: Users },
        { label: "Active Channels", value: "8", trend: "0 offline", icon: Radio },
        { label: "Concurrent Listeners", value: "3,405", trend: "+450 today", icon: Headphones },
        { label: "Total Voice Spots", value: "24", trend: "Playing normally", icon: Activity },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/2 border border-white/10">
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                                <stat.icon className="w-5 h-5 text-fuchsia-400" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-400 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                            <p className="text-xs text-zinc-500">{stat.trend}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-8 rounded-2xl bg-white/2 border border-white/10 h-96 flex flex-col">
                    <h3 className="font-semibold text-lg mb-6">Concurrent Streams (Real-time)</h3>
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
                        <p className="text-zinc-500">Analytics Chart Placeholder</p>
                    </div>
                </div>

                <div className="p-8 rounded-2xl bg-white/2 border border-white/10 flex flex-col">
                    <h3 className="font-semibold text-lg mb-6">Recent Activity</h3>
                    <div className="flex-1 space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-fuchsia-500 mt-2 shrink-0" />
                                <div>
                                    <p className="text-sm text-zinc-300">Nuovo istituto "Beauty Lounge Milano" registrato.</p>
                                    <p className="text-xs text-zinc-500 mt-1">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
