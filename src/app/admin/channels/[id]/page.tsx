"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, CheckCircle2, AlertCircle, Settings, Users, Power, Check, Radio } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MediaLibraryModal } from "@/components/admin/MediaLibraryModal";

import { updateChannelAdmin } from "../actions";
import { getRecentListenersPerChannel } from "@/app/actions/analytics-actions";

interface ChannelData {
    id: string;
    name: string;
    stream_url_hls: string | null;
    stream_url_mp3: string | null;
    stream_url_mp3_mobile: string | null;
    subtitle: string | null;
    slug: string | null;
    card_image_url: string | null;
    is_active: boolean;
    is_default: boolean;
    created_at: string;
}

export default function SingleChannelAdminPage() {
    const params = useParams();
    const router = useRouter();
    const channelId = params.id as string;

    const [channel, setChannel] = useState<ChannelData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savedStatus, setSavedStatus] = useState<string | null>(null);
    const [errorStatus, setErrorStatus] = useState<string | null>(null);

    // Assignment Modal State
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [isSavingAssignments, setIsSavingAssignments] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Listeners State
    const [recentListeners, setRecentListeners] = useState<{ id: string, salon_name: string, email: string }[]>([]);

    const supabase = createClient();

    useEffect(() => {
        async function fetchChannel() {
            setIsLoading(true);
            try {
                // 1. Fetch channel details
                const { data: channelData, error: channelError } = await supabase
                    .from("radio_channels")
                    .select("*")
                    .eq("id", channelId)
                    .single();

                if (channelError) throw channelError;

                // 2. Fetch all profiles for the assignment list
                const { data: profilesData, error: profilesError } = await supabase
                    .from("profiles")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (profilesError) throw profilesError;

                // 3. Fetch current assignments for this channel
                const { data: assignmentsData, error: assignmentsError } = await supabase
                    .from("user_channels")
                    .select("profile_id")
                    .eq("channel_id", channelId);

                if (assignmentsError) throw assignmentsError;

                setChannel(channelData);

                // Populate Assignment State
                setAvailableUsers(profilesData || []);
                const currentlyAssignedIds = (assignmentsData || []).map(a => a.profile_id);
                setSelectedUserIds(currentlyAssignedIds);

                // 4. Fetch recent listeners
                const { listenersMap, error: lError } = await getRecentListenersPerChannel(7);
                if (!lError && listenersMap && listenersMap[channelId]) {
                    setRecentListeners(listenersMap[channelId]);
                }

            } catch (err: any) {
                console.error("Error fetching data:", err);
                setErrorStatus("Errore nel caricamento dei dati.");
            } finally {
                setIsLoading(false);
            }
        }

        if (channelId) fetchChannel();
    }, [channelId]);

    const handleInputChange = (field: keyof ChannelData, value: string) => {
        if (!channel) return;
        setChannel({ ...channel, [field]: value });
    };

    const handleToggleActive = async () => {
        if (!channel) return;
        const newStatus = !channel.is_active;

        // Optimistic UI update
        setChannel({ ...channel, is_active: newStatus });

        const { error } = await supabase
            .from("radio_channels")
            .update({ is_active: newStatus })
            .eq("id", channel.id);

        if (error) {
            console.error("Error toggling active status:", error);
            // Revert on error
            setChannel({ ...channel, is_active: !newStatus });
            setErrorStatus("Impossibile cambiare lo stato: " + error.message);
        }
    };

    const handleSave = async () => {
        if (!channel) return;
        setIsSaving(true);
        setSavedStatus(null);
        setErrorStatus(null);

        try {
            const result = await updateChannelAdmin(channel.id, {
                name: channel.name,
                slug: channel.slug,
                stream_url_hls: channel.stream_url_hls?.trim() || null,
                stream_url_mp3: channel.stream_url_mp3?.trim() || null,
                stream_url_mp3_mobile: channel.stream_url_mp3_mobile?.trim() || null,
                subtitle: channel.subtitle,
                is_default: channel.is_default,
                card_image_url: channel.card_image_url
            });

            if (result.error) {
                console.error("Error saving via server action:", result.error);
                setErrorStatus("Aggiornamento fallito: " + result.error);
                return;
            }

            setSavedStatus("Canale aggiornato con successo!");
            setTimeout(() => setSavedStatus(null), 3000);
        } catch (err: any) {
            console.error("Critical error saving channel:", err);
            setErrorStatus("Si è verificato un errore critico: " + (err.message || String(err)));
        } finally {
            setIsSaving(false);
        }
    };

    // --- Assignment Callbacks ---
    const handleToggleUserAssignment = (userId: string) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSaveAssignments = async () => {
        setIsSavingAssignments(true);
        try {
            // 1. Delete all existing assignments for this channel
            const { error: deleteError } = await supabase
                .from("user_channels")
                .delete()
                .eq("channel_id", channelId);

            if (deleteError) throw deleteError;

            // 2. Insert new ones if any were selected
            if (selectedUserIds.length > 0) {
                const newAssignments = selectedUserIds.map(userId => ({
                    channel_id: channelId,
                    profile_id: userId
                }));

                const { error: insertError } = await supabase
                    .from("user_channels")
                    .insert(newAssignments);

                if (insertError) throw insertError;
            }

            setSuccessMessage("Assegnazioni salvate con successo!");
            setTimeout(() => setSuccessMessage(""), 3000);
            setIsAssignmentModalOpen(false);
        } catch (err: any) {
            console.error("Assignment Error:", err);
            setErrorStatus(err.message || "Failed to save assignments.");
        } finally {
            setIsSavingAssignments(false);
        }
    };

    const handleDelete = async () => {
        if (!channel) return;
        if (!window.confirm(`Sei sicuro di voler estinare il canale "${channel.name}"? Questa azione è irreversibile.`)) {
            return;
        }

        setIsSaving(true);
        const { error } = await supabase
            .from("radio_channels")
            .delete()
            .eq("id", channel.id);

        setIsSaving(false);

        if (error) {
            console.error("Error deleting:", error);
            setErrorStatus("Errore durante l'eliminazione: " + error.message);
        } else {
            router.push('/admin/channels');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="max-w-4xl mx-auto py-12 text-center">
                <h2 className="text-xl text-zinc-300 mb-4">Canale non trovato o eliminato.</h2>
                <Link href="/admin/channels">
                    <Button variant="outline">Torna alla Lista</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
                <div className="flex flex-col gap-2">
                    <Link href="/admin/channels" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-fuchsia-400 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Torna all'elenco Canali
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                        <Settings className="w-7 h-7 text-fuchsia-400" />
                        Modifica: {channel.name}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                    >
                        Elimina Canale
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white gap-2"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Aggiorna Canale
                    </Button>
                </div>
            </div>

            {savedStatus && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    {savedStatus}
                </div>
            )}

            {successMessage && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonna Centrale: Form Dati */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-8 rounded-2xl bg-zinc-900 border border-white/5 shadow-xl">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white border-b border-white/10 pb-4">
                            Impostazioni Generali
                        </h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-zinc-300 font-medium">Nome Canale</Label>
                                    <Input
                                        id="name"
                                        value={channel.name || ""}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="bg-zinc-950 border-white/10 focus-visible:ring-fuchsia-500/50 text-white font-medium"
                                        placeholder="es. Radio Relax"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="card_image" className="text-zinc-300 font-medium whitespace-nowrap">Immagine Copertina</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="card_image"
                                            value={channel.card_image_url || ""}
                                            onChange={(e) => handleInputChange("card_image_url", e.target.value)}
                                            className="bg-zinc-950 border-white/10 focus-visible:ring-fuchsia-500/50 text-fuchsia-200 font-mono text-sm flex-1"
                                            placeholder="https://.../logo.png"
                                        />
                                        <MediaLibraryModal
                                            onSelectImage={(url) => handleInputChange("card_image_url", url)}
                                        />
                                    </div>
                                    {channel.card_image_url && (
                                        <div className="mt-2 w-16 h-16 rounded-md bg-black border border-white/10 overflow-hidden relative group">
                                            { }
                                            <img src={channel.card_image_url} alt="Cover Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-xs text-red-400 hover:text-red-300" onClick={() => handleInputChange("card_image_url", "")}>
                                                X
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hls" className="text-zinc-300 font-medium">Streaming (HLS) <span className="text-fuchsia-400 text-xs ml-2">Primario</span></Label>
                                <Input
                                    id="hls"
                                    value={channel.stream_url_hls || ""}
                                    onChange={(e) => handleInputChange("stream_url_hls", e.target.value)}
                                    className="bg-zinc-950 border-white/10 focus-visible:ring-fuchsia-500/50 text-fuchsia-200 font-mono text-sm"
                                    placeholder="https://.../live.m3u8"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mp3" className="text-zinc-300 font-medium">Streaming (MP3) <span className="text-zinc-500 text-xs ml-2">Fallback</span></Label>
                                <Input
                                    id="mp3"
                                    value={channel.stream_url_mp3 || ""}
                                    onChange={(e) => handleInputChange("stream_url_mp3", e.target.value)}
                                    className="bg-zinc-950 border-white/10 focus-visible:ring-fuchsia-500/50 text-zinc-300 font-mono text-sm"
                                    placeholder="https://.../radio.mp3"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Colonna Laterale: Meta e Utenti (Placeholder) */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4 text-white">Stato Pubblicazione</h2>
                        <div className="space-y-3 text-sm text-zinc-400">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span>Stato:</span>
                                <div className="flex items-center gap-3">
                                    {channel.is_active ? (
                                        <span className="text-green-400 font-medium">Attivo Pubblico</span>
                                    ) : (
                                        <span className="text-zinc-500 font-medium">Inattivo (Bozza)</span>
                                    )}
                                    <button
                                        onClick={handleToggleActive}
                                        className={`w-10 h-6 rounded-full transition-colors relative ${channel.is_active ? 'bg-green-500' : 'bg-zinc-700'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${channel.is_active ? 'left-5' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <div className="flex flex-col">
                                    <span>Canale di Default</span>
                                    <span className="text-[10px] text-zinc-500">Visibile a tutti in prova/attivi</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            const isTurningOff = channel.is_default;
                                            const isTurningOn = !channel.is_default;
                                            let confirmMessage = "";

                                            if (isTurningOff) {
                                                confirmMessage = "Sei sicuro di voler DISATTIVARE questo canale di Default? Scomparirà dalla vista base di tutti gli utenti in Prova e degli abbonati.";
                                            } else {
                                                confirmMessage = "Vuoi IMPOSTARE questo canale come Default? Diventerà automaticamente visibile a tutti gli utenti in Prova e a tutti gli abbonati.";
                                            }

                                            if (window.confirm(confirmMessage)) {
                                                handleInputChange('is_default', isTurningOn as any);
                                            }
                                        }}
                                        className={`w-10 h-6 rounded-full transition-colors relative ${channel.is_default ? 'bg-fuchsia-500' : 'bg-zinc-700'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${channel.is_default ? 'left-5' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span>Creato il:</span>
                                <span className="text-zinc-300">{format(new Date(channel.created_at), "dd MMM yyyy, HH:mm", { locale: it })}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span>Visibilità:</span>
                                <span className="text-zinc-300">Assegnazione Manuale</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-b from-fuchsia-900/20 to-zinc-900 border border-fuchsia-500/20 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Users className="w-24 h-24" />
                        </div>
                        <h2 className="text-lg font-semibold mb-2 text-white flex items-center gap-2 relative z-10">
                            <Users className="w-5 h-5 text-fuchsia-400" />
                            Utenti Assegnati
                        </h2>
                        <p className="text-sm text-zinc-400 mb-6 relative z-10">
                            Seleziona gli istituti che hanno il permesso di ascoltare questo canale. ({selectedUserIds.length} istituti attuali)
                        </p>

                        <Dialog open={isAssignmentModalOpen} onOpenChange={setIsAssignmentModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-white text-black hover:bg-zinc-200 relative z-10">
                                    Gestisci Assegnazioni
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-white/10 text-white">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">Assegna Istituti al Canale</DialogTitle>
                                    <DialogDescription className="text-zinc-400">
                                        Seleziona gli utenti che potranno vedere e riprodurre questo canale nella loro Area Riservata.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="py-4 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="space-y-2">
                                        {availableUsers.map((user) => {
                                            const isAssigned = selectedUserIds.includes(user.id);
                                            return (
                                                <div
                                                    key={user.id}
                                                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${isAssigned ? 'bg-fuchsia-500/10 border-fuchsia-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                                    onClick={() => handleToggleUserAssignment(user.id)}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm">
                                                            {user.salon_name || user.email || "Utente Sconosciuto"}
                                                        </span>
                                                        <span className="text-xs text-zinc-400">
                                                            {user.email || user.id.substring(0, 8)} • <Badge variant="outline" className="text-[10px] ml-1">{user.role || 'Free'}</Badge>
                                                        </span>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${isAssigned ? 'bg-fuchsia-500 border-fuchsia-500' : 'border-zinc-500'}`}>
                                                        {isAssigned && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {availableUsers.length === 0 && (
                                            <p className="text-center text-sm text-zinc-500 py-8">Nessun istituto trovato.</p>
                                        )}
                                    </div>
                                </div>

                                <DialogFooter className="sm:justify-between border-t border-white/10 pt-4">
                                    <div className="text-sm text-zinc-400 self-center">
                                        {selectedUserIds.length} selezionati
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="ghost" onClick={() => setIsAssignmentModalOpen(false)}>
                                            Annulla
                                        </Button>
                                        <Button
                                            type="button"
                                            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                                            onClick={handleSaveAssignments}
                                            disabled={isSavingAssignments}
                                        >
                                            {isSavingAssignments && <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                            Salva Assegnazioni
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Listeners degli ultimi 7 giorni */}
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Radio className="w-5 h-5 text-emerald-400" />
                                Ascoltatori (7 Giorni)
                            </div>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{recentListeners.length}</Badge>
                        </h2>

                        {recentListeners.length > 0 ? (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {recentListeners.map((user) => (
                                    <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                            {user.salon_name.substring(0, 1) || "U"}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-semibold text-white truncate">{user.salon_name}</span>
                                            <span className="text-xs text-zinc-500 truncate">{user.email}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-sm text-zinc-500 bg-black/20 rounded-xl border border-white/5 border-dashed">
                                Nessun ascolto in questi giorni.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
