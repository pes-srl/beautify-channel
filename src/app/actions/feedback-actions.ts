"use server";

import { createClient } from "@/utils/supabase/server";

export async function submitFeedback(feedback: string, userEmail?: string) {
    console.log(`[FEEDBACK] Received from ${userEmail || 'Anonymous'}: ${feedback}`);
    
    try {
        const supabase = await createClient();
        
        // We attempt to save it to a 'user_feedbacks' table.
        // If it doesn't exist, we just log it.
        const { error } = await supabase
            .from('user_feedbacks') 
            .insert([
                { 
                    email: userEmail, 
                    feedback_text: feedback,
                    source: 'paywall_trial'
                }
            ]);

        if (error) {
            console.error('[FEEDBACK] Error saving to Supabase:', error.message);
            // We don't throw an error to the user, as the feedback is "non-critical"
            return { success: true, logged: false };
        }

        return { success: true, logged: true };
    } catch (err) {
        console.error('[FEEDBACK] Unexpected error:', err);
        return { success: true, logged: false };
    }
}
