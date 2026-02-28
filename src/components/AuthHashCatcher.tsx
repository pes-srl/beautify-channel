"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthHashCatcher() {
    const router = useRouter();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash && hash.includes("access_token")) {
            // Se è un recupero password, vai alla pagina Nuova Password
            if (hash.includes("type=recovery")) {
                router.push(`/reset-password${hash}`);
            }
            // Se è un vecchio magic link, o conferma registrazione, vai alla Dashboard
            else {
                router.push(`/area-cliente${hash}`);
            }
        }
    }, [router]);

    return null;
}
