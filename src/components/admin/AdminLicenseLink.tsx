"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FileDown, Loader2 } from "lucide-react";

export function AdminLicenseLink({ userId, salonName }: { userId: string, salonName: string }) {
    const [licenseUrl, setLicenseUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLicense = async () => {
            if (!userId || !salonName) {
                setLoading(false);
                return;
            }
            try {
                const supabase = createClient();
                const sanitizedName = salonName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const fileName = `${userId}_${sanitizedName}_licenza.pdf`;

                const { data } = await supabase.storage.from('Licenza-PDF').getPublicUrl(fileName);
                
                // Supabase getPublicUrl always returns a URL even if file doesn't exist, 
                // so we can't be 100% sure it exists just from this, but since it's an admin view,
                // we'll provide the link if the user has a salon.
                if (data && data.publicUrl) {
                    setLicenseUrl(data.publicUrl);
                }
            } catch (error) {
                console.error("Error fetching license URL:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLicense();
    }, [userId, salonName]);

    if (loading) {
        return <div className="text-zinc-500 flex items-center gap-2 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Verifica licenza...</div>;
    }

    if (!licenseUrl) {
        return <span className="text-zinc-500 text-sm">Non disponibile</span>;
    }

    return (
        <a 
            href={licenseUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/20 rounded-lg text-sm font-medium transition-colors"
        >
            <FileDown className="w-4 h-4" />
            Scarica Licenza
        </a>
    );
}
