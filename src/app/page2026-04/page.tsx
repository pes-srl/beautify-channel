import { Poppins } from "next/font/google";
import { Hero2026_04 } from "@/components/homepagenew/Hero2026_04";
import { InfoBlocks2026_04 } from "@/components/homepagenew/InfoBlocks2026_04";
import { Pricing2026_04 } from "@/components/homepagenew/Pricing2026_04";
import { BottomCTA2026_04 } from "@/components/homepagenew/BottomCTA2026_04";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
});

export default function Page2026_04() {
    return (
        <main className={`${poppins.variable} font-sans min-h-screen bg-white text-[#2D3E44]`}>
            {/* Soft Gradient Background across the whole page */}
            <div className="fixed inset-0 bg-gradient-to-br from-white via-[#FDF5E6]/40 to-[#FFF0F5]/40 -z-10 pointer-events-none" />

            <Hero2026_04 />
            <InfoBlocks2026_04 />
            <Pricing2026_04 />
            <BottomCTA2026_04 />
        </main>
    );
}
