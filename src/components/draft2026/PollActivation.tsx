"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function PollActivation() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const interval = setInterval(async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("plan_type")
                    .eq("id", user.id)
                    .single();
                    
                if (data && data.plan_type !== "free_trial" && data.plan_type !== "free") {
                    window.location.href = "/area-riservata"; // Force full reload to clean URL and state
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return null;
}
