'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Download, FileText, Loader2 } from 'lucide-react';

export function MyLicense({ userId, salonName }: { userId: string, salonName: string }) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchLicense() {
            try {
                // The expected filename from our generation script
                const sanitizedName = salonName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const expectedFileName = `${userId}_${sanitizedName}_licenza.pdf`;

                // Let's list files in the bucket for this user, or just try to get the public URL directly
                // If the bucket is public, getPublicUrl always returns a string, even if the file doesn't exist.
                // To check if it exists, we can try to download it or list the bucket.
                
                const { data, error } = await supabase
                    .storage
                    .from('Licenza-PDF')
                    .list('', {
                        limit: 100,
                        search: userId // Search for files starting with this user's ID
                    });

                if (error) {
                    console.error("Error listing files:", error);
                    return;
                }

                if (data && data.length > 0) {
                    // Find the exact file or the first match for this user
                    const file = data.find(f => f.name.includes(userId) && f.name.endsWith('.pdf')) || data[0];
                    if (file) {
                        const { data: urlData } = supabase
                            .storage
                            .from('Licenza-PDF')
                            .getPublicUrl(file.name);
                        
                        setPdfUrl(urlData.publicUrl);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch license:", err);
            } finally {
                setLoading(false);
            }
        }

        if (userId && salonName) {
            fetchLicense();
        } else {
            setLoading(false);
        }
    }, [userId, salonName, supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 bg-white/5 rounded-3xl border border-white/10 animate-pulse">
                <Loader2 className="w-8 h-8 text-[#C69C85] animate-spin" />
                <span className="ml-3 text-white font-medium">Verifica licenza in corso...</span>
            </div>
        );
    }

    if (!pdfUrl) {
        return (
            <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-zinc-900/50 rounded-3xl border border-white/5 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                    <FileText className="w-8 h-8 text-zinc-500" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-montserrat)]">Licenza Non Disponibile</h4>
                <p className="text-zinc-400 max-w-md">La tua licenza ufficiale non è ancora stata generata o il tuo piano non lo prevede. Se hai richiesto un upgrade da poco, potrebbe volerci qualche istante.</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-[#FAFAFA]/10 to-transparent p-6 md:p-8 rounded-[2.5rem] border border-white/10 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D8B2A3]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D8B2A3]/20 to-[#C69C85]/20 flex items-center justify-center shrink-0 shadow-inner border border-[#D8B2A3]/30">
                        <FileText className="w-8 h-8 text-[#D8B2A3]" />
                    </div>
                    <div className="text-left">
                        <h4 className="text-xl md:text-2xl font-bold text-white font-[family-name:var(--font-montserrat)] tracking-wide mb-1">
                            La Mia Licenza Ufficiale
                        </h4>
                        <p className="text-[#C69C85] font-medium text-sm md:text-base">
                            Certificato Epidemic Sound In-Store Music
                        </p>
                    </div>
                </div>
                
                <a 
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#C69C85] text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#D8B2A3] transition-colors duration-300 shadow-lg shadow-[#C69C85]/20 w-full md:w-auto shrink-0"
                >
                    <Download className="w-5 h-5" />
                    <span>Scarica PDF</span>
                </a>
            </div>
        </div>
    );
}
