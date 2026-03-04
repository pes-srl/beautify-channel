'use server'

import { createClient } from '@/utils/supabase/server'
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
        telefono: telefono
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

    // Send Emails via Resend
    try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
            // Import dynamically to avoid top-level issues if resend is not installed or used elsewhere
            const { Resend } = await import('resend');
            const resend = new Resend(resendApiKey);

            // 1. Email to Admin
            await resend.emails.send({
                from: 'Beautify Channel <onboarding@resend.dev>', // Update this to your verified domain later: e.g. 'hola@beautifychannel.com'
                to: 'mirkocata@gmail.com', // Your admin email
                subject: `🔔 NUOVA RICHIESTA DI UPGRADE - ${user.email}`,
                html: `
          <h2>Nuova Richiesta di Upgrade</h2>
          <p>L'utente <strong>${user.email}</strong> ha richiesto di passare al piano <strong>${requested_plan.toUpperCase()}</strong>.</p>
          <h3>Dati del Modulo:</h3>
          <ul>
            <li><strong>Ragione Sociale:</strong> ${ragioneSociale}</li>
            <li><strong>Partita IVA:</strong> ${partitaIva}</li>
            <li><strong>Indirizzo istituto:</strong> ${indirizzoIstituto}</li>
            <li><strong>Nome istituto:</strong> ${nomeIstituto}</li>
            <li><strong>Metri quadri istituto:</strong> ${metriQuadri}</li>
            <li><strong>Durata abbonamento richiesta:</strong> ${durataAbbonamento}</li>
            <li><strong>Responsabile istituto:</strong> ${responsabileIstituto}</li>
            <li><strong>Email di contatto:</strong> ${emailContatto}</li>
            <li><strong>Telefono:</strong> ${telefono}</li>
          </ul>
          <p>Per favore, contatta il cliente per gestire il pagamento e poi attiva il suo piano dal pannello di amministrazione.</p>
        `
            });

            // 2. Email to User (Confirmation)
            if (user.email) {
                await resend.emails.send({
                    from: 'Beautify Channel <onboarding@resend.dev>', // Update this to your verified domain later
                    to: user.email,
                    subject: `Abbiamo ricevuto la tua richiesta per passare a ${requested_plan.toUpperCase()} 🌟`,
                    html: `
            <h2>Ciao!</h2>
            <p>Abbiamo ricevuto correttamente i tuoi dati per effettuare l'upgrade al piano <strong>${requested_plan.toUpperCase()}</strong>.</p>
            <p>Il nostro team sta esaminando la tua richiesta e ti contatterà al più presto con le istruzioni di pagamento e i dettagli per procedere.</p>
            <p>Non preoccuparti, il tuo canale di prova continua a funzionare nel frattempo!</p>
            <br/>
            <p>Il team di Beautify Channel</p>
            `
                });
            }
            // We don't return an error to the user if the email fails, since the DB insert succeeded.
        } else {
            console.warn("RESEND_API_KEY no está configurada. Los correos no se enviaron.");
        }
    } catch (emailError) {
        console.error('Error sending upgrade emails:', emailError)
        // We don't return an error to the user if the email fails, since the DB insert succeeded.
    }

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
            const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
            const supabaseAdmin = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
                console.error('Error updating user profile upon approval:', profileError);
                return { error: 'Errore durante l\'aggiornamento del profilo utente.' };
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
