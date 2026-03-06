import { Montserrat } from "next/font/google";
import { Hero2026_03 } from "@/components/homepagenew/Hero2026_03";
import { InfoBlocks2026_03 } from "@/components/homepagenew/InfoBlocks2026_03";
import { Pricing2026_03 } from "@/components/homepagenew/Pricing2026_03";
import { BottomCTA2026_03 } from "@/components/homepagenew/BottomCTA2026_03";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function HomePage2026_03() {
    return (
        <main className={`min-h-screen bg-black selection:bg-[#7E415F]/30 ${montserrat.className}`}>
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 flex justify-center bg-black pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#7E415F]/10 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-[#D4AF37]/10 blur-[150px] rounded-full mix-blend-screen" />
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 w-full overflow-hidden">
                <Hero2026_03 />
                <InfoBlocks2026_03 />
                <Pricing2026_03 />
                <BottomCTA2026_03 />
            </div>
        </main>
    );
}
