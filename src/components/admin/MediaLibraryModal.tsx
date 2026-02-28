"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { UploadCloud, Image as ImageIcon, CheckCircle2, Copy, Loader2, Trash2 } from "lucide-react";
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
    metadata?: Record<string, any>; // Adjusted to match Supabase FileObject
}

interface MediaLibraryModalProps {
    onSelectImage: (url: string) => void;
    triggerButton?: React.ReactNode;
}

export function MediaLibraryModal({ onSelectImage, triggerButton }: MediaLibraryModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
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
            // Filter out empty folder placeholders if any
            setFiles(data?.filter(file => file.name !== ".emptyFolderPlaceholder") || []);
        }
        setIsLoading(false);
    }, [supabase]);

    useEffect(() => {
        if (isOpen) {
            fetchFiles();
        }
    }, [isOpen, fetchFiles]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Basic validation
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

        const { data, error } = await supabase.storage
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
            fetchFiles(); // Refresh the list
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

    const handleSelect = (fileName: string) => {
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
        onSelectImage(data.publicUrl);
        setIsOpen(false);
        toast.success("Immagine selezionata", { description: "L'URL è stato inserito nel form." });
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    {triggerButton || (
                        <Button variant="outline" className="bg-zinc-900 border-white/10 hover:bg-white/5">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Sfoglia Libreria
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-zinc-950 border-white/10 text-white h-[80vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b border-white/10 bg-zinc-900/50">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <ImageIcon className="w-6 h-6 text-fuchsia-400" />
                            Libreria Media
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Gestisci le immagini per i loghi e le carátulas. Seleziona un'immagine per usarla.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                        {/* Left Panel: Upload Area */}
                        <div className="w-full md:w-64 border-r border-white/10 bg-zinc-900/30 p-6 flex flex-col gap-4">
                            <div className="text-sm font-medium text-zinc-300">Carica Nuova</div>

                            <Label
                                htmlFor="media-upload"
                                className={`
                                flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors text-center
                                ${isUploading ? 'border-fuchsia-500/50 bg-fuchsia-500/5' : 'border-white/10 hover:border-fuchsia-400/50 hover:bg-white/5'}
                            `}
                            >
                                {isUploading ? (
                                    <Loader2 className="w-8 h-8 text-fuchsia-400 animate-spin mb-3" />
                                ) : (
                                    <UploadCloud className="w-8 h-8 text-zinc-400 mb-3" />
                                )}
                                <span className="text-sm font-medium text-white mb-1">
                                    Clicca per espolorare
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

                            <div className="mt-8 text-xs text-zinc-500 bg-black/20 p-4 rounded-lg">
                                <h4 className="font-semibold text-zinc-300 mb-2">Informazioni Bucket</h4>
                                <p>Nome: <span className="font-mono text-fuchsia-300">{BUCKET_NAME}</span></p>
                                <p>Visibilità: <span className="text-green-400">Public</span></p>
                                <p className="mt-2 text-[10px] leading-tight opacity-70">
                                    Le immagini caricate qui sono visibili pubblicamente tramite URL e non protette da RLS.
                                </p>
                            </div>
                        </div>

                        {/* Right Panel: Gallery Grid */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-black/20">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-fuchsia-500" />
                                    <p>Caricamento libreria...</p>
                                </div>
                            ) : files.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                                    <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-lg font-medium text-zinc-400">Nessuna immagine trovata</p>
                                    <p className="text-sm">Usa il pannello a sinistra per caricare la prima.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {files.map((file) => {
                                        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
                                        const publicUrl = data.publicUrl;

                                        return (
                                            <div
                                                key={file.id}
                                                className="group relative bg-zinc-900 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-fuchsia-500 transition-all focus-within:ring-2 focus-within:ring-fuchsia-500"
                                                onClick={() => handleSelect(file.name)}
                                                tabIndex={0}
                                            >
                                                <div className="aspect-square bg-black relative overflow-hidden flex items-center justify-center">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={publicUrl}
                                                        alt={file.name}
                                                        className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                                        loading="lazy"
                                                    />

                                                    {/* Hover Overlay */}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            className="pointer-events-none bg-white text-black"
                                                        >
                                                            Seleziona
                                                        </Button>
                                                    </div>

                                                    {/* Delete Action (Top Right) */}
                                                    <button
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFileToDelete(file.name);
                                                        }}
                                                        title="Elimina Immagine"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <div className="p-3 bg-zinc-950">
                                                    <p className="text-xs font-medium text-zinc-300 truncate" title={file.name}>
                                                        {file.name}
                                                    </p>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <p className="text-[10px] text-zinc-500">
                                                            {format(new Date(file.created_at), "dd MMM yyyy", { locale: it })}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-500 font-mono">
                                                            {formatBytes(file.metadata?.size || 0)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

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
                            Elimina डेफinitivamente
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
