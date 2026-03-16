import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { FileText, Download, ShieldCheck, ArrowLeft, Stamp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DocumentiPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("salon_name, store_license_url, store_contract_url")
        .eq("id", user.id)
        .single();

    // If the user hasn't generated any documents yet, we redirect back
    if (!profile?.store_license_url && !profile?.store_contract_url) {
        redirect("/area-riservata");
    }

    return (
        <div className="min-h-screen bg-zinc-950 pt-28 pb-24 px-6 sm:px-12 md:px-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/area-riservata">
                        <Button variant="ghost" className="rounded-full w-10 h-10 p-0 hover:bg-white/10 text-zinc-400">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">I tuoi Documenti</h1>
                        <p className="text-zinc-400 mt-2">Scarica le licenze e i contratti legati all'abbonamento di <strong className="text-fuchsia-400">{profile.salon_name || 'tuo istituto'}</strong>.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    
                    {/* CARD 1: LICENZA */}
                    {profile.store_license_url && (
                        <div className="relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 p-8 flex flex-col justify-between hover:border-fuchsia-500/50 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                <ShieldCheck className="w-24 h-24 text-fuchsia-500" />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center mb-6 border border-fuchsia-500/20">
                                    <ShieldCheck className="w-6 h-6 text-fuchsia-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Licenza Musicale</h3>
                                <p className="text-sm text-zinc-400 mb-8 max-w-[90%]">
                                    Certificato ufficiale di esenzione SIAE e SCF, che autorizza la diffusione del catalogo Epidemic Sound nel tuo istituto.
                                </p>
                            </div>

                            <a href={profile.store_license_url} target="_blank" rel="noopener noreferrer" className="relative z-10">
                                <Button className="w-full bg-linear-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600 text-white font-semibold rounded-xl flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Visualizza e Scarica
                                </Button>
                            </a>
                        </div>
                    )}

                    {/* CARD 2: CONTRATTO */}
                    {profile.store_contract_url && (
                        <div className="relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 p-8 flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Stamp className="w-24 h-24 text-amber-500" />
                            </div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
                                    <FileText className="w-6 h-6 text-amber-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Contratto Abbonamento</h3>
                                <p className="text-sm text-zinc-400 mb-8 max-w-[90%]">
                                    Copia del contratto di compravendita del servizio streaming BeautiFy Channel, firmato digitalmente al momento del pagamento.
                                </p>
                            </div>

                            <a href={profile.store_contract_url} target="_blank" rel="noopener noreferrer" className="relative z-10">
                                <Button className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-bold rounded-xl flex items-center gap-2">
                                    <Download className="w-4 h-4 text-zinc-950" />
                                    Visualizza e Scarica
                                </Button>
                            </a>
                        </div>
                    )}

                </div>
                
                <div className="mt-12 text-center text-zinc-500 text-sm">
                    <p>I documenti sono strettamente riservati e legati in modo univoco al tuo istituto.</p>
                </div>
            </div>
        </div>
    );
}
