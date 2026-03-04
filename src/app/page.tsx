import { HeroNew } from "@/components/homepagenew/HeroNew";
import { InfoBlocksNew } from "@/components/homepagenew/InfoBlocksNew";
import { TestimonialsNew } from "@/components/homepagenew/TestimonialsNew";
import { BottomCTANew } from "@/components/homepagenew/BottomCTANew";

export default function HomePageNew() {
    return (
        <main className="min-h-screen bg-zinc-950 selection:bg-fuchsia-500/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 flex justify-center bg-zinc-950 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 w-full overflow-hidden">
                <HeroNew />
                <InfoBlocksNew />
                <TestimonialsNew />
                <BottomCTANew />
            </div>
        </main>
    );
}
