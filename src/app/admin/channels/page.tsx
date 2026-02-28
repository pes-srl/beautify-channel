"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Radio, Plus, MoreHorizontal, Pencil, Trash2, Link as LinkIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface ChannelConfig {
    id: string;
    name: string;
    stream_url_hls: string | null;
    is_active: boolean;
    created_at: string;
    subtitle?: string | null; // Added for cloning
    stream_url_mp3?: string | null; // Added for cloning
    stream_url_mp3_mobile?: string | null; // Added for cloning
}

export default function AdminChannelsListPage() {
    const router = useRouter();
    const [channels, setChannels] = useState<ChannelConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorStatus, setErrorStatus] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null); // Traccia id in clonazione/eliminazione
    const [isCreating, setIsCreating] = useState(false);

    const supabase = createClient();

    const handleCreateNew = async () => {
        setIsCreating(true);
        const randomId = Math.random().toString(36).substring(2, 8);
        const { data, error } = await supabase
            .from("radio_channels")
            .insert([{
                name: "Nuovo Canale Bozza",
                slug: `nuovo-canale-bozza-${randomId}`,
                is_active: false,
                stream_url_hls: "",
                stream_url_mp3: "",
                stream_url_mp3_mobile: "",
                subtitle: ""
            }])
            .select()
            .single();

        if (error) {
            console.error("Error creating channel:", error);
            alert("Errore durante la creazione del canale: " + error.message);
            setIsCreating(false);
        } else if (data) {
            router.push(`/admin/channels/${data.id}`);
        }
    };

    useEffect(() => {
        fetchChannels();
    }, []);

    async function fetchChannels() {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("radio_channels")
            .select("*") // Fetching all columns to make cloning easier if we need subtitle/mp3 later, though we only strictly need some for the list
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching channels:", error);
            setErrorStatus("Errore nel caricamento dei canali.");
        } else if (data) {
            setChannels(data);
        }
        setIsLoading(false);
    }

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Sei sicuro di voler estinare il canale "${name}"? Questa azione è irreversibile.`)) {
            return;
        }

        setProcessingId(id);
        const { error } = await supabase
            .from("radio_channels")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting:", error);
            alert("Errore durante l'eliminazione: " + error.message);
        } else {
            // Aggiorna UI localmente svuotano il canale eliminato
            setChannels(channels.filter(ch => ch.id !== id));
        }
        setProcessingId(null);
    };

    const handleClone = async (channelIdToClone: string) => {
        setProcessingId(channelIdToClone);

        // 1. Fetch intero canale da clonare (per prendere anche subtitle e urls)
        const { data: originalChannel, error: fetchError } = await supabase
            .from("radio_channels")
            .select("*")
            .eq("id", channelIdToClone)
            .single();

        if (fetchError || !originalChannel) {
            alert("Errore nel recupero del canale da clonare.");
            setProcessingId(null);
            return;
        }

        const randomId = Math.random().toString(36).substring(2, 8);
        // 2. Prepara nuovo oggetto senza id o created_at originali, e con nome modificato
        const newChannel = {
            name: `${originalChannel.name} (Copia)`,
            slug: `${originalChannel.slug || 'canale'}-copia-${randomId}`,
            subtitle: originalChannel.subtitle,
            stream_url_hls: originalChannel.stream_url_hls,
            stream_url_mp3: originalChannel.stream_url_mp3,
            stream_url_mp3_mobile: originalChannel.stream_url_mp3_mobile,
            is_active: false // Di default creiamo il clone come bozza inattiva
        };

        // 3. Inserisci in DB e chiedi di tornare il record appena creato
        const { data: insertedChannel, error: insertError } = await supabase
            .from("radio_channels")
            .insert([newChannel])
            .select()
            .single();

        if (insertError) {
            console.error("Error cloning:", insertError);
            alert("Errore durante la clonazione: " + insertError.message);
        } else if (insertedChannel) {
            // Aggiorna UI localmente
            setChannels([...channels, insertedChannel]);
        }
        setProcessingId(null);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Radio className="w-8 h-8 text-fuchsia-400" />
                        Canali Radio (CPT)
                    </h1>
                    <p className="text-zinc-400 mt-2">Gestisci tutti i tuoi flussi audio come un Custom Post Type.</p>
                </div>
                <Button
                    onClick={handleCreateNew}
                    disabled={isCreating}
                    className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white gap-2 w-full md:w-auto overflow-hidden transition-all duration-300"
                >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {isCreating ? "Creazione..." : "Crea Nuovo Canale"}
                </Button>
            </div>

            {errorStatus && (
                <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                    {errorStatus}
                </div>
            )}

            {/* WordPress Style Table */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-zinc-400">
                                <th className="p-4 font-semibold w-1/3">Nome Canale</th>
                                <th className="p-4 font-semibold w-1/3">Sorgente Primaria</th>
                                <th className="p-4 font-semibold text-center w-32">Stato</th>
                                <th className="p-4 font-semibold text-right w-40">Data Creazione</th>
                                <th className="p-4 font-semibold text-right w-24">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {channels.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                                        Nessun canale trovato.
                                    </td>
                                </tr>
                            ) : (
                                channels.map((channel) => (
                                    <tr key={channel.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-semibold text-white group-hover:text-fuchsia-400 transition-colors flex items-center gap-2">
                                                {channel.name}
                                                {processingId === channel.id && <Loader2 className="w-3 h-3 animate-spin text-fuchsia-400" />}
                                            </div>
                                            <div className="text-xs text-zinc-500 mt-1 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/channels/${channel.id}`} className="text-fuchsia-400 hover:underline">Modifica</Link>
                                                <span className="text-zinc-600">|</span>
                                                <button
                                                    onClick={() => handleDelete(channel.id, channel.name)}
                                                    disabled={processingId === channel.id}
                                                    className="text-red-400 hover:underline disabled:opacity-50"
                                                >
                                                    Cestina
                                                </button>
                                                <span className="text-zinc-600">|</span>
                                                <button
                                                    onClick={() => handleClone(channel.id)}
                                                    disabled={processingId === channel.id}
                                                    className="hover:underline disabled:opacity-50"
                                                >
                                                    Clona
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {channel.stream_url_hls ? (
                                                <div className="flex items-center gap-2 text-xs font-mono text-fuchsia-300/80 bg-fuchsia-500/10 px-2 py-1 rounded inline-flex truncate max-w-[250px]">
                                                    <LinkIcon className="w-3 h-3 shrink-0" />
                                                    <span className="truncate">{channel.stream_url_hls.split('/').pop()}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-zinc-500 italic">HLS mancante</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {channel.is_active ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                                    Attivo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                                                    Inattivo (Bozza)
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right text-sm text-zinc-400">
                                            {format(new Date(channel.created_at), "dd MMM yyyy", { locale: it })}
                                        </td>
                                        <td className="p-4 text-right cursor-pointer">
                                            <Link href={`/admin/channels/${channel.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="text-xs text-zinc-500 mt-4 text-center">
                Nota: Passa il mouse sul nome del canale per visualizzare le azioni rapide (Modifica, Cestina, Clona).
            </p>
        </div>
    );
}
