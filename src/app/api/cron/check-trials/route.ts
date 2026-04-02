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
        const inTwoDays = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        const inThreeDays = new Date(now.getTime() + 72 * 60 * 60 * 1000);

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
                        from: process.env.RESEND_FROM_EMAIL || 'Beautify Channel <info@beautify-channel.com>',
                        to: user.email,
                        subject: 'La tua prova è scaduta ⚠️ Riattiva Beautify Channel',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333; background-color: #FAFAFA; padding: 0; border-radius: 12px; border: 1px solid #EAEAEA; overflow: hidden;">
                                <div style="background-color: #09090b; padding: 30px 20px; text-align: center;">
                                    <img src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg" alt="Beautify Channel" style="max-height: 40px; width: auto;" />
                                </div>
                                <div style="background-color: #FFFFFF; padding: 30px; border-radius: 0 0 12px 12px;">
                                    <p style="font-size: 16px; line-height: 1.6; color: #444;">Ciao, la tua prova gratuita BeautiFy Channel è scaduta!</p>
                                    <p style="font-size: 16px; line-height: 1.6; color: #444;">Ci piacerebbe rimanessi con noi, qui sotto puoi abbonarti al nostro piano BASIC!</p>
                                    <p style="font-size: 16px; line-height: 1.6; color: #444;">In caso contrario, ci piacerebbe sapere cosa non ti ha convinta, perché i feedback sono sempre super benvenuti.</p>
                                    
                                    <p style="font-size: 16px; line-height: 1.6; color: #444; margin-top: 20px;">Grazie, speriamo di sentirti presto.<br><b>Il Team BeautiFy</b></p>
                                    <a href="https://www.beautify-channel.com/area-riservata#pricing" style="background-color: #ef4444; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 20px;">Abbonati al piano BASIC</a>
                                </div>
                            </div>
                        `
                    });
                }
            }
        }

        // 1.5. DOWNGRADE EXPIRED SUBSCRIPTIONS (subscription_expiration <= NOW() AND plan_type IN ('basic', 'premium'))
        const { data: expiredSubs, error: subsError } = await supabase
            .from('profiles')
            .select('*')
            .in('plan_type', ['basic', 'premium'])
            .lte('subscription_expiration', now.toISOString());

        if (subsError) throw subsError;

        if (expiredSubs && expiredSubs.length > 0) {
            const expiredSubIds = expiredSubs.map(u => u.id);
            await supabase
                .from('profiles')
                .update({ plan_type: 'free', subscription_expiration: null })
                .in('id', expiredSubIds);

            // Send Expiration Email for Subscriptions
            for (const user of expiredSubs) {
                if (user.email) {
                    await resend.emails.send({
                        from: process.env.RESEND_FROM_EMAIL || 'Beautify Channel <info@beautify-channel.com>',
                        to: user.email,
                        subject: 'Il tuo abbonamento è scaduto ⚠️ Riattiva Beautify Channel',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333; background-color: #FAFAFA; padding: 0; border-radius: 12px; border: 1px solid #EAEAEA; overflow: hidden;">
                                <div style="background-color: #09090b; padding: 30px 20px; text-align: center;">
                                    <img src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg" alt="Beautify Channel" style="max-height: 40px; width: auto;" />
                                </div>
                                <div style="background-color: #FFFFFF; padding: 30px; border-radius: 0 0 12px 12px;">
                                    <h1 style="color: #ef4444; margin-top: 0;">Abbonamento Terminato!</h1>
                                    <p style="font-size: 16px; line-height: 1.6; color: #444;">Ciao ${user.salon_name || 'Amico'}, ti informiamo che il tuo abbonamento a Beautify Channel è terminato.</p>
                                    <p style="font-size: 16px; line-height: 1.6; color: #444;">L'accesso ai canali è stato sospeso e il tuo account è passato al piano Free. Rinnova subito per continuare ad offrire la migliore atmosfera al tuo istituto.</p>
                                    <a href="https://www.beautify-channel.com/area-riservata#pricing" style="background-color: #ef4444; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 20px;">Rinnova ora</a>
                                </div>
                            </div>
                        `
                    });
                }
            }
        }


        // 3. SEND WARNINGS: 2 DAYS LEFT ON FREE TRIAL
        const { data: twoDaysTrialUsers, error: twoDaysTrialError } = await supabase
            .from('profiles')
            .select('*')
            .eq('plan_type', 'free_trial')
            .gt('trial_ends_at', inTwoDays.toISOString())
            .lte('trial_ends_at', inThreeDays.toISOString());

        if (twoDaysTrialError) throw twoDaysTrialError;

        if (twoDaysTrialUsers && twoDaysTrialUsers.length > 0) {
            for (const user of twoDaysTrialUsers) {
                if (user.email) {
                    await resend.emails.send({
                        from: process.env.RESEND_FROM_EMAIL || 'Beautify Channel <info@beautify-channel.com>',
                        to: user.email,
                        subject: 'Mancano 2 giorni alla scadenza della prova gratuita ⏳',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333; background-color: #FAFAFA; padding: 0; border-radius: 12px; border: 1px solid #EAEAEA; overflow: hidden;">
                                <div style="background-color: #09090b; padding: 30px 20px; text-align: center;">
                                    <img src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg" alt="Beautify Channel" style="max-height: 40px; width: auto;" />
                                </div>
                                <div style="background-color: #FFFFFF; padding: 30px; border-radius: 0 0 12px 12px;">
                                    <p style="font-size: 16px; line-height: 1.6; color: #444;">
                                        Ciao, ti sta piacendo l'esperienza BeautiFy Channel?<br>
                                        Come ti stai trovando?
                                    </p>
                                    <p style="font-size: 16px; line-height: 1.6; color: #444;">
                                        Ti ricordiamo che tra 2 giorni scadrà la prova gratuita.<br>
                                        Dopo la scadenza potrai scegliere il nostro piano BASIC, ma intanto...
                                    </p>
                                    
                                    <h3 style="font-size: 18px; color: #f59e0b; margin-top: 20px;">Continua a goderti BeautiFy Channel!</h3>
                                    <p style="font-size: 16px; line-height: 1.6; color: #444; font-weight: bold;">Il Team BeautiFy</p>
                                    <a href="https://www.beautify-channel.com/area-riservata#pricing" style="background-color: #f59e0b; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 20px;">Scopri i Piani</a>
                                </div>
                            </div>
                        `
                    });
                }
            }
        }
        
        // 4. SEND WARNINGS: 2 DAYS LEFT SULL'ABBONAMENTO (BASIC/PREMIUM)
        const { data: twoDaysSubUsers, error: twoDaysSubError } = await supabase
            .from('profiles')
            .select('*')
            .in('plan_type', ['basic', 'premium'])
            .gt('subscription_expiration', inTwoDays.toISOString())
            .lte('subscription_expiration', inThreeDays.toISOString());

        if (twoDaysSubError) throw twoDaysSubError;

        if (twoDaysSubUsers && twoDaysSubUsers.length > 0) {
            for (const user of twoDaysSubUsers) {
                if (user.email) {
                    await resend.emails.send({
                        from: process.env.RESEND_FROM_EMAIL || 'Beautify Channel <info@beautify-channel.com>',
                        to: user.email,
                        subject: 'Il tuo abbonamento scade tra 2 giorni ⏳ Rinnovo richiesto',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333; background-color: #FAFAFA; padding: 0; border-radius: 12px; border: 1px solid #EAEAEA; overflow: hidden;">
                                <div style="background-color: #09090b; padding: 30px 20px; text-align: center;">
                                    <img src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg" alt="Beautify Channel" style="max-height: 40px; width: auto;" />
                                </div>
                                <div style="background-color: #FFFFFF; padding: 30px; border-radius: 0 0 12px 12px;">
                                    <h1 style="color: #f59e0b; margin-top: 0;">Rinnovo in arrivo!</h1>
                                    <p style="font-size: 16px; line-height: 1.6; color: #444;">Ciao ${user.salon_name || 'Amico'}, l'abbonamento a Beautify Channel del tuo istituto terminerà tra 2 giorni.</p>
                                    <p style="font-size: 16px; line-height: 1.6; color: #444;">Per evitare l'interruzione del servizio e mantenere l'accesso esclusivo ai canali musicali premium che i tuoi clienti amano, per favore rinnova la sottoscrizione.</p>
                                    <a href="https://www.beautify-channel.com/area-riservata#pricing" style="background-color: #f59e0b; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 20px;">Rinnova Ora</a>
                                </div>
                            </div>
                        `
                    });
                }
            }
        }

        return NextResponse.json({
            success: true,
            expiredProcessed: expiredUsers?.length || 0,
            expiredSubsProcessed: expiredSubs?.length || 0,
            warned2DaysTrialProcessed: twoDaysTrialUsers?.length || 0,
            warned2DaysSubProcessed: twoDaysSubUsers?.length || 0
        });

    } catch (error: any) {
        console.error('CRON ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
