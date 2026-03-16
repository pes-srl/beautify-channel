"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UploadCloud, Image as ImageIcon, Copy, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface MediaFile {
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata?: Record<string, any>;
}

export default function MediaLibraryPage() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const supabase = createClient();
    const BUCKET_NAME = "bucket-assets";

    const fetchFiles = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (error) {
            toast.error("Errore nel caricamento delle immagini", { description: error.message });
        } else {
            setFiles((data?.filter(file => file.name !== ".emptyFolderPlaceholder").map(file => ({ ...file, id: file.id || crypto.randomUUID() })) as MediaFile[]) || []);
        }
        setIsLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith('image/')) {
            toast.error("Formato non valido", { description: "Puoi caricare solo immagini (JPG, PNG, WEBP, ecc.)" });
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("File troppo grande", { description: "La dimensione massima consentita è 5MB." });
            return;
        }

        setIsUploading(true);
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        toast.loading("Caricamento in corso...", { id: "upload" });

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, selectedFile, {
                cacheControl: '3600',
                upsert: false
            });

        setIsUploading(false);

        if (error) {
            toast.error("Errore durante il caricamento", { id: "upload", description: error.message });
        } else {
            toast.success("Immagine caricata con successo", { id: "upload" });
            fetchFiles();
        }
    };

    const [fileToDelete, setFileToDelete] = useState<string | null>(null);

    const executeDelete = async () => {
        if (!fileToDelete) return;

        toast.loading("Eliminazione in corso...", { id: `delete-${fileToDelete}` });

        const { error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .remove([fileToDelete]);

        if (error) {
            toast.error("Errore durante l'eliminazione", { id: `delete-${fileToDelete}`, description: error.message });
        } else {
            toast.success("Immagine eliminata", { id: `delete-${fileToDelete}` });
            setFiles(files.filter(f => f.name !== fileToDelete));
        }
        setFileToDelete(null);
    };

    const handleCopyUrl = (fileName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
        navigator.clipboard.writeText(data.publicUrl);
        toast.success("URL Copiato", { description: "L'url dell'immagine è stato copiato negli appunti." });
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                        <ImageIcon className="w-7 h-7 text-fuchsia-400" />
                        Libreria Media
                    </h1>
                    <p className="text-zinc-400 mt-2">Gestisci tutte le copertine dei canali e i loghi degli istituti.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[70vh]">
                {/* Left Panel: Upload Area */}
                <div className="w-full lg:w-72 bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
                    <h2 className="text-lg font-semibold text-white mb-2">Carica Immagine</h2>

                    <Label
                        htmlFor="media-upload"
                        className={`
                                flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors text-center
                                ${isUploading ? 'border-fuchsia-500/50 bg-fuchsia-500/5' : 'border-white/10 hover:border-fuchsia-400/50 hover:bg-white/5'}
                            `}
                    >
                        {isUploading ? (
                            <Loader2 className="w-10 h-10 text-fuchsia-400 animate-spin mb-4" />
                        ) : (
                            <UploadCloud className="w-10 h-10 text-zinc-400 mb-4" />
                        )}
                        <span className="text-sm font-medium text-white mb-2">
                            Seleziona dal Computer
                        </span>
                        <span className="text-xs text-zinc-500">
                            PNG, JPG fino a 5MB
                        </span>
                        <input
                            id="media-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                    </Label>

                    <div className="mt-8 text-xs text-zinc-500 bg-black/20 p-4 rounded-xl border border-white/5">
                        <h4 className="font-semibold text-zinc-300 mb-2">Informazioni Bucket</h4>
                        <p>Nome: <span className="font-mono text-fuchsia-300">{BUCKET_NAME}</span></p>
                        <p>Visibilità: <span className="text-green-400">Public</span></p>
                        <p className="mt-2 text-[10px] leading-tight opacity-70">
                            Immagini accessibili pubblicamente. Assicurati di non caricare dati sensibili.
                        </p>
                    </div>
                </div>

                {/* Right Panel: Gallery Grid */}
                <div className="flex-1 bg-zinc-900 border border-white/10 rounded-2xl p-6 overflow-y-auto custom-scrollbar shadow-xl relative">
                    <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-zinc-900 to-transparent z-10 pointer-events-none rounded-t-2xl" />

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-fuchsia-500" />
                            <p>Caricamento file multimediali...</p>
                        </div>
                    ) : files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                            <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium text-zinc-400">Nessun file presente</p>
                            <p className="text-sm">Inizia a caricare immagini per il tuo progetto.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
                            {files.map((file) => {
                                const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
                                const publicUrl = data.publicUrl;

                                return (
                                    <div
                                        key={file.id}
                                        className="group relative bg-zinc-950 border border-white/10 rounded-xl overflow-hidden hover:border-fuchsia-500 transition-all shadow-md"
                                    >
                                        <div className="aspect-square bg-black relative overflow-hidden flex items-center justify-center">
                                            { }
                                            <img
                                                src={publicUrl}
                                                alt={file.name}
                                                className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                                loading="lazy"
                                            />

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="bg-white/20 hover:bg-white text-white hover:text-black w-8 h-8 rounded-full"
                                                    onClick={(e) => handleCopyUrl(file.name, e)}
                                                    title="Copia URL"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    className="bg-red-500/80 hover:bg-red-500 text-white w-8 h-8 rounded-full"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFileToDelete(file.name);
                                                    }}
                                                    title="Elimina"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="p-3">
                                            <p className="text-xs font-medium text-zinc-300 truncate" title={file.name}>
                                                {file.name}
                                            </p>
                                            <div className="flex justify-between items-center mt-2 flex-wrap gap-1">
                                                <span className="text-[10px] text-zinc-500">
                                                    {format(new Date(file.created_at), "dd MMM yyyy", { locale: it })}
                                                </span>
                                                <span className="text-[10px] text-zinc-500 font-mono px-1.5 py-0.5 bg-white/5 rounded">
                                                    {formatBytes(file.metadata?.size || 0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
                <AlertDialogContent className="bg-zinc-950 border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sei sicuro di voler eliminare questa immagine?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            Questa azione non può essere annullata. Se l'immagine è usata in qualche canale o istituto, smetterà di essere visibile.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">Annulla</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={executeDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Elimina definitivamente
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
