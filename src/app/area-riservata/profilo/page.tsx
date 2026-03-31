import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProfileSettingsForm } from "@/components/profile/ProfileSettingsForm";
import { UpdatePasswordForm } from "@/components/profile/UpdatePasswordForm";
import { User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfiloPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: dbProfile } = await supabase
        .from("profiles")
        .select("salon_name, partita_iva, full_name")
        .eq("id", user.id)
        .single();

    // Fallback to user_metadata se i dati non sono in profiles
    const fullName = dbProfile?.full_name || user.user_metadata?.full_name || "";
    const salonName = dbProfile?.salon_name || user.user_metadata?.salon_name || "";
    const partitaIva = dbProfile?.partita_iva || user.user_metadata?.partita_iva || "";
    const email = user.email || "";

    return (
        <div className="pt-[7rem] pb-32 min-h-[100dvh] relative w-full bg-[#0f0518] selection:bg-[#D8B2A3]/30">
            {/* Dynamic Background identico alla Home Page */}
            <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#AB7169]/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-[#5D6676]/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 text-white w-full max-w-4xl mx-auto px-4">
                
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#AB7169] to-[#D8B2A3] flex items-center justify-center shadow-lg shadow-[#AB7169]/20">
                        <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-montserrat)] text-white tracking-tight">
                            Il Mio Profilo
                        </h1>
                        <p className="text-zinc-400 mt-1 font-medium">Gestisci le informazioni del tuo account e le preferenze di sicurezza.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <ProfileSettingsForm 
                        fullName={fullName}
                        salonName={salonName}
                        partitaIva={partitaIva}
                        email={email}
                    />

                    <UpdatePasswordForm email={email} />
                </div>

            </div>
        </div>
    );
}
