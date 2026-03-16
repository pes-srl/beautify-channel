'use server'

import { createClient } from '@/utils/supabase/server'
import { generatePdfCertificate } from '@/utils/generatePdfCertificate'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/app/actions/activity-actions'

export async function submitUpgradeRequest(formData: FormData) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Non autorizzato. Devi effettuare il login.' }
    }

    const requested_plan = formData.get('requested_plan') as string
    const ragioneSociale = formData.get('ragioneSociale') as string
    const partitaIva = formData.get('partitaIva') as string
    const indirizzoIstituto = formData.get('indirizzoIstituto') as string
    const nomeIstituto = formData.get('nomeIstituto') as string

    const metriQuadriRadio = formData.get('metriQuadriRadio') as string
    const metriQuadri = metriQuadriRadio === 'oltre'
        ? 'Oltre'
        : '0-250 metri quadri'

    const rDuration = formData.get('durataAbbonamento') as string
    const durataAbbonamento = rDuration || '6 mesi'

    const responsabileIstituto = formData.get('responsabileIstituto') as string
    const emailContatto = formData.get('emailContatto') as string
    const telefono = formData.get('telefono') as string
    const codiceSdi = formData.get('codiceSdi') as string || ''

    // Simple validation
    if (!requested_plan || !ragioneSociale || !partitaIva || !indirizzoIstituto || !nomeIstituto || !metriQuadri || !responsabileIstituto || !emailContatto || !telefono) {
        return { error: 'Per favore, compila tutti i campi obbligatori.' }
    }

    const billing_details = {
        ragione_sociale: ragioneSociale,
        partita_iva: partitaIva,
        indirizzo_istituto: indirizzoIstituto,
        nome_istituto: nomeIstituto,
        metri_quadri: metriQuadri,
        durata_abbonamento: durataAbbonamento,
        responsabile_istituto: responsabileIstituto,
        email_contatto: emailContatto,
        telefono: telefono,
        codice_sdi: codiceSdi
    }

    // Insert the upgrade request
    const { error: insertError } = await supabase
        .from('upgrade_requests')
        .insert({
            user_id: user.id,
            requested_plan,
            billing_details
        })

    if (insertError) {
        console.error('Error in submitUpgradeRequest:', insertError)
        if (insertError.code === '42P01') {
            return { error: 'La tabella delle richieste non esiste. Esegui la migrazione SQL su Supabase.' }
        }
        return { error: 'Si è verificato un errore durante l\'invio della richiesta. Riprova.' }
    }

    // Log the event for the dashboard Recent Activity
    await logActivity(user.id, 'upgrade_request', { plan: requested_plan });

    // --- LE EMAIL E LA GENERAZIONE DEL PDF SONO STATI SPOSTATI NEL WEBHOOK DI STRIPE ---
    // (src/app/api/webhooks/stripe/route.ts)
    // Non generiamo più PDF né inviamo email prima che il cliente abbia effettivamente pagato.

    // Update the user's profile with the submitted information and the license URL
    // This part is commented out as the original instruction's snippet was for a different context
    // and the current \`submitUpgradeRequest\` does not update the user's profile directly
    // with these specific fields (full_name, salon_name, etc.) but rather inserts an upgrade request.
    // If a profile update is desired here, the schema and fields would need to be confirmed.

    // Example of how you might update the profile if a 'store_license_url' column existed:
    // if (finalLicenseUrl) {
    //     const { error: profileUpdateError } = await supabase
    //         .from('profiles')
    //         .update({ store_license_url: finalLicenseUrl })
    //         .eq('id', user.id);
    //     if (profileUpdateError) {
    //         console.error('Error updating user profile with license URL:', profileUpdateError);
    //     }
    // }


    revalidatePath('/area-riservata')
    return { success: true, message: 'La tua richiesta è stata inviata con successo! Ti contatteremo presto con i dettagli per il pagamento.' }
}

export async function updateUpgradeRequestStatus(requestId: string, newStatus: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Non autorizzato' }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'Admin') {
        return { error: 'Azione consentita solo agli amministratori' }
    }

    // Determine the requested plan and duration if the request is approved
    let expirationDate = null;
    let requestedPlanStr = null;
    if (newStatus === 'approved') {
        const { data: requestData } = await supabase
            .from('upgrade_requests')
            .select('requested_plan, user_id, billing_details')
            .eq('id', requestId)
            .single();

        if (requestData) {
            requestedPlanStr = requestData.requested_plan;
            const duration = requestData.billing_details?.durata_abbonamento === '12 mesi' ? 12 : 6;
            const targetDate = new Date();
            targetDate.setMonth(targetDate.getMonth() + duration);
            expirationDate = targetDate.toISOString();

            // Bypass RLS to update profile
            try {
                const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');

                if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
                    throw new Error("Mancano le variabili d'ambiente SUPABASE per l'Admin Client.");
                }

                const supabaseAdmin = createSupabaseClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL,
                    process.env.SUPABASE_SERVICE_ROLE_KEY,
                    { auth: { autoRefreshToken: false, persistSession: false } }
                );

                const { error: profileError } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        plan_type: requestedPlanStr.toLowerCase(),
                        subscription_expiration: expirationDate
                    })
                    .eq('id', requestData.user_id);

                if (profileError) {
                    console.error('SERVER LOG - Error updating profile in Supabase:', profileError);
                    return { error: `Errore database: ${profileError.message || JSON.stringify(profileError)}` };
                }
            } catch (err: any) {
                console.error("Critical error instantiating Supabase Admin or updating:", err);
                return { error: `Errore Critico Server: ${err.message || 'Manca la chiave Service Role, assicurati di aver messo SUPABASE_SERVICE_ROLE_KEY e NEXT_PUBLIC_SUPABASE_URL in Vercel e .env'}` };
            }
        }
    }

    const { error } = await supabase
        .from('upgrade_requests')
        .update({ status: newStatus })
        .eq('id', requestId)

    if (error) {
        console.error('Error updating status:', error)
        return { error: 'Errore durante l\'aggiornamento dello stato' }
    }

    revalidatePath('/admin/richieste')
    revalidatePath('/area-riservata/le-mie-richieste')

    return { success: true }
}
