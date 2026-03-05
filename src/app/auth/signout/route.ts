import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { logActivity } from "@/app/actions/activity-actions";

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        await logActivity(user.id, 'logout');

        // Bypass RLS locally to forcefully set the user offline
        try {
            const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
            const supabaseAdmin = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
                { auth: { autoRefreshToken: false, persistSession: false } }
            );

            const { error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({
                    is_online: false,
                    last_seen: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) {
                console.error("Error setting user offline in DB:", updateError);
            }
        } catch (adminErr) {
            console.error("Critical error setting offline state:", adminErr);
        }

        await supabase.auth.signOut();
    }

    revalidatePath("/", "layout");
    return NextResponse.redirect(new URL("/login", req.url), {
        status: 302,
    });
}
