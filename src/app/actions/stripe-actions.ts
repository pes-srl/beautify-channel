'use server'

import { stripe } from '@/utils/stripe/server';
import { createClient } from '@/utils/supabase/server';

export async function createCheckoutSession(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Non autorizzato. Devi effettuare il login.' };
    }

    const requested_plan = formData.get('requested_plan') as string;
    const durataAbbonamento = formData.get('durataAbbonamento') as string || '6 mesi';
    const emailContatto = formData.get('emailContatto') as string || user.email;

    // Retrieve all fields for Webhook processing later
    const ragioneSociale = formData.get('ragioneSociale') as string;
    const partitaIva = formData.get('partitaIva') as string;
    const indirizzoIstituto = formData.get('indirizzoIstituto') as string;
    const nomeIstituto = formData.get('nomeIstituto') as string;
    const metriQuadriRadio = formData.get('metriQuadriRadio') as string;
    const responsabileIstituto = formData.get('responsabileIstituto') as string;
    const telefono = formData.get('telefono') as string;
    const signatureBase64 = formData.get('signatureBase64') as string | null;

    // Combine metadata (Stripe accepts max 50 keys, up to 500 characters each)
    const extraMetadata = {
        ragione_sociale: ragioneSociale?.substring(0, 500) || '',
        partita_iva: partitaIva?.substring(0, 500) || '',
        indirizzo: indirizzoIstituto?.substring(0, 500) || '',
        nome_istituto: nomeIstituto?.substring(0, 500) || '',
        metri_quadri: metriQuadriRadio === 'oltre' ? 'Oltre' : '0-250 mq',
        responsabile: responsabileIstituto?.substring(0, 500) || '',
        telefono: telefono?.substring(0, 500) || '',
        email_richiedente: emailContatto?.substring(0, 500) || '',
        // We will *not* pass the full base64 signature here because it's too large for Stripe metadata!
        // The signature is already saved in the PDF / DB via submitUpgradeRequest which runs immediately prior!
    };

    if (!requested_plan) {
        return { error: 'Piano non specificato.' };
    }

    // Determine price
    let unitAmount = 0; // in cents
    let productName = '';

    if (requested_plan === 'basic') {
        if (durataAbbonamento === '6 mesi') {
            unitAmount = 25.90 * 6 * 100; // 15540
            productName = 'Piano Basic - 6 Mesi (Unica Soluzione)';
        } else {
            unitAmount = 20.90 * 12 * 100; // 25080
            productName = 'Piano Basic - 12 Mesi (Unica Soluzione)';
        }
    } else if (requested_plan === 'premium') {
        if (durataAbbonamento === '6 mesi') {
            unitAmount = 43.90 * 6 * 100; // 26340
            productName = 'Piano Premium - 6 Mesi (Unica Soluzione)';
        } else {
            unitAmount = 38.90 * 12 * 100; // 46680
            productName = 'Piano Premium - 12 Mesi (Unica Soluzione)';
        }
    } else {
        return { error: 'Piano non valido.' };
    }

    try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                        (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000');

        // Construct metadata from formData to store the request details if needed, 
        // or we can rely on catching the webhook to fulfill the upgrade
        
        // We will create the Checkout Session here
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: emailContatto,
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: productName,
                            description: 'Beautify Channel Subscription',
                        },
                        unit_amount: Math.round(unitAmount),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${siteUrl}/area-riservata?upgrade=success`,
            cancel_url: `${siteUrl}/area-riservata?upgrade=cancel`,
            metadata: {
                user_id: user.id,
                requested_plan: requested_plan,
                durata: durataAbbonamento,
                ...extraMetadata
            }
        });

        if (!session.url) {
            return { error: 'Impossibile creare la sessione di pagamento.' };
        }

        return { url: session.url };
    } catch (error: any) {
        console.error('Stripe Checkout error:', error);
        return { error: error.message || 'Errore durante la creazione del pagamento.' };
    }
}
