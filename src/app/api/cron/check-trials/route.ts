import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Important: Next.js Cron jobs require an authorization header or a secret in production
// But for now we focus on the logic.
export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Needs service layer to bypass RLS
);

export async function GET(request: Request) {
    // SECURITY: Optional. Verify a cron secret token if you configure one in Vercel
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { return new Response('Unauthorized', { status: 401 }); }

    try {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // 1. DOWGRADE EXPIRED USERS (trial_ends_at < NOW() AND plan_type = 'free_trial')
        const { data: expiredUsers, error: expireError } = await supabase
            .from('profiles')
            .select('*')
            .eq('plan_type', 'free_trial')
            .lte('trial_ends_at', now.toISOString());

        if (expireError) throw expireError;

        if (expiredUsers && expiredUsers.length > 0) {
            // Update them to 'free'
            const expiredIds = expiredUsers.map(u => u.id);
            await supabase
                .from('profiles')
                .update({ plan_type: 'free' })
                .in('id', expiredIds);

            // Send Expiration Email
            for (const user of expiredUsers) {
                if (user.email) {
                    await resend.emails.send({
                        from: 'Beautify Channel <noreply@beautifychannel.com>',
                        to: user.email,
                        subject: 'La tua prova è scaduta ⚠️ Riattiva Beautify Channel',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333; padding: 20px;">
                                <h1 style="color: #ef4444;">La musica si è fermata!</h1>
                                <p>Ciao ${user.salon_name || 'Amico'}, ti informiamo che i tuoi 7 giorni di prova gratuita sono terminati.</p>
                                <p>L'accesso ai canali premium è stato sospeso. Per continuare ad offrire ai tuoi clienti la migliore atmosfera musicale, scegli uno dei nostri piani.</p>
                                <a href="https://beautifychannel.com/area-riservata#pricing" style="background-color: #ef4444; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 20px;">Riattiva ora</a>
                            </div>
                        `
                    });
                }
            }
        }

        // 2. SEND WARNINGS (trial_ends_at between NOW() and TOMORROW AND plan_type = 'free_trial')
        const { data: warningUsers, error: warningError } = await supabase
            .from('profiles')
            .select('*')
            .eq('plan_type', 'free_trial')
            .gt('trial_ends_at', now.toISOString())
            .lte('trial_ends_at', tomorrow.toISOString());

        if (warningError) throw warningError;

        if (warningUsers && warningUsers.length > 0) {
            for (const user of warningUsers) {
                if (user.email) {
                    await resend.emails.send({
                        from: 'Beautify Channel <noreply@beautifychannel.com>',
                        to: user.email,
                        subject: 'Manca 1 giorno alla scadenza della prova gratuita ⏰',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333; padding: 20px;">
                                <h1 style="color: #f59e0b;">Ultimo giorno di musica!</h1>
                                <p>Ciao ${user.salon_name || 'Amico'}, ti ricordiamo che la tua prova di 7 giorni per Beautify Channel scadrà a breve (domani).</p>
                                <p>Non lasciare il tuo salone in silenzio. Passa a un piano Premium per non interrompere il servizio.</p>
                                <a href="https://beautifychannel.com/area-riservata#pricing" style="background-color: #f59e0b; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 20px;">Scopri i Piani</a>
                            </div>
                        `
                    });
                }
            }
        }

        return NextResponse.json({
            success: true,
            expiredProcessed: expiredUsers?.length || 0,
            warnedProcessed: warningUsers?.length || 0
        });

    } catch (error: any) {
        console.error('CRON ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
