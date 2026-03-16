import { createClient } from '@/utils/supabase/server';
import { stripe } from '@/utils/stripe/server';

export async function getStripeCustomerPortalUrl() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        return { error: 'Non autorizzato' };
    }

    try {
        // Find Stripe Customer by email
        const customers = await stripe.customers.list({
            email: user.email,
            limit: 1
        });

        let customerId = '';

        if (customers.data.length > 0) {
            customerId = customers.data[0].id;
        } else {
            // Check by looking at their past upgrade_requests session_id
            const { data: requests } = await supabase
                .from('upgrade_requests')
                .select('billing_details')
                .eq('user_id', user.id)
                .eq('status', 'approved')
                .not('billing_details->stripe_session_id', 'is', null)
                .order('created_at', { ascending: false })
                .limit(1);

            if (requests && requests.length > 0) {
                const sessionId = requests[0].billing_details?.stripe_session_id;
                if (sessionId) {
                    const session = await stripe.checkout.sessions.retrieve(sessionId);
                    if (session.customer && typeof session.customer === 'string') {
                        customerId = session.customer;
                    }
                }
            }
        }

        if (!customerId) {
            return { error: 'Nessun account di fatturazione trovato. Non hai ancora effettuato ordini.' };
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${siteUrl}/area-riservata/ordini`,
        });

        return { url: portalSession.url };
    } catch (error: any) {
        console.error('Portal Error:', error);
        return { error: 'Si è verificato un errore durante la connessione al portale di fatturazione.' };
    }
}
