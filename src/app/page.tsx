import { Outfit } from "next/font/google";
import { HeroNew } from "@/components/homepagenew/HeroNew";
import { InfoBlocks2026 } from "@/components/homepagenew/InfoBlocks2026";
import { Pricing2026 } from "@/components/homepagenew/Pricing2026";
import { BottomCTA2026 } from "@/components/homepagenew/BottomCTA2026";
import { createClient } from "@/utils/supabase/server";

const outfit = Outfit({ subsets: ["latin"] });

export default async function HomePageNew() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const hasSession = !!session;

    return (
        <main className={`min-h-screen bg-zinc-950 selection:bg-[#D8B2A3]/30 ${outfit.className}`}>
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 flex justify-center bg-zinc-950 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#AB7169]/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-[#5D6676]/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 w-full overflow-hidden">
                <HeroNew />
                <InfoBlocks2026 />
                <Pricing2026 />
                <BottomCTA2026 hasSession={hasSession} />
            </div>
        </main>
    );
}
