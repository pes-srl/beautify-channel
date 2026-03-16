import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/server';
import { createClient } from '@supabase/supabase-js';
import { generatePdfCertificate } from '@/utils/generatePdfCertificate';
import { generatePdfContract } from '@/utils/generatePdfContract';
import { Resend } from 'resend';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('Stripe webhook secret is missing in ENV variables.');
        return new NextResponse('Internal Server Error', { status: 500 });
    }

    if (!signature) {
        return new NextResponse('Missing signature', { status: 400 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const metadata = session.metadata;

        if (metadata?.user_id && metadata?.requested_plan) {
            const planType = metadata.requested_plan.toLowerCase();
            const duration = metadata.durata === '12 mesi' ? 12 : 6;
            
            // Calculate expiration date
            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + duration);

            // Access Supabase securely with Server Role Key
            try {
                if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
                    throw new Error("Mancano le variabili d'ambiente SUPABASE per l'Admin Client.");
                }

                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL,
                    process.env.SUPABASE_SERVICE_ROLE_KEY,
                    { auth: { autoRefreshToken: false, persistSession: false } }
                );

                console.log(`Aggiornando il piano dell'utente ${metadata.user_id} a ${planType} fino al ${expirationDate.toISOString()}`);

                // Update Profile
                const { error: profileError } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        plan_type: planType,
                        subscription_expiration: expirationDate.toISOString(),
                    })
                    .eq('id', metadata.user_id);

                if (profileError) {
                    console.error('Errore webhook - aggiornamento profilo Supabase:', profileError);
                    throw profileError;
                }

                // Fetch existing pending request to get codice_sdi
                const { data: pendingRequest } = await supabaseAdmin
                    .from('upgrade_requests')
                    .select('billing_details')
                    .eq('user_id', metadata.user_id)
                    .eq('requested_plan', planType)
                    .eq('status', 'pending');
                    
                const existingSdi = (pendingRequest && pendingRequest.length > 0) ? pendingRequest[0].billing_details?.codice_sdi : null;

                // Update upgrade_requests status to approved and enrich billing_details with Stripe info
                const updatedBilling = {
                    ragione_sociale: metadata.ragione_sociale || '',
                    partita_iva: metadata.partita_iva || '',
                    indirizzo_istituto: metadata.indirizzo || '',
                    nome_istituto: metadata.nome_istituto || '',
                    metri_quadri: metadata.metri_quadri || '',
                    durata_abbonamento: metadata.durata || '',
                    responsabile_istituto: metadata.responsabile || '',
                    email_contatto: metadata.email_richiedente || '',
                    telefono: metadata.telefono || '',
                    stripe_session_id: session.id,
                    importo_pagato_eur: session.amount_total ? session.amount_total / 100 : 0,
                    codice_sdi: metadata.codice_sdi || existingSdi || ''
                };

                const { error: requestError } = await supabaseAdmin
                    .from('upgrade_requests')
                    .update({ 
                        status: 'approved',
                        billing_details: updatedBilling
                    })
                    .eq('user_id', metadata.user_id)
                    .eq('requested_plan', planType)
                    .eq('status', 'pending');
                
                if (requestError) {
                   console.log('Nessuna richiesta pending trovata da aggiornare o errore:', requestError);
                } else {
                   console.log('Stato della richiesta di upgrade aggiornato a approved con dettagli Stripe salvati.');
                }

                // ==========================================
                // 3. GENERATE PDF LICENSE & SEND EMAILS
                // ==========================================
                console.log("Generating Post-Payment PDF Certificate for", metadata.nome_istituto);
                let finalLicenseUrl = null;
                let pdfBuffer = null;
                let fileName = null;

                try {
                    // Generate PDF (Without signature as it's too big for Stripe Metadata, 
                    // or keep it empty. The payment itself acts as the digital agreement).
                    pdfBuffer = await generatePdfCertificate(
                        metadata.nome_istituto || 'Istituto Sconosciuto', // salonName
                        metadata.indirizzo || '-', // address
                        metadata.responsabile || '-', // fullName
                        metadata.partita_iva || '-', // vat
                        expirationDate.toLocaleDateString('it-IT') // expirationDate
                    );

                    const sanitizedName = (metadata.nome_istituto || 'istituto').replace(/[^a-z0-9]/gi, '_').toLowerCase();
                    fileName = `${metadata.user_id}_${sanitizedName}_licenza.pdf`;

                    const { error: uploadError } = await supabaseAdmin
                        .storage
                        .from('Licenza-PDF')
                        .upload(fileName, pdfBuffer, {
                            contentType: 'application/pdf',
                            upsert: true
                        });

                    if (!uploadError) {
                        const { data: urlData } = supabaseAdmin
                            .storage
                            .from('Licenza-PDF')
                            .getPublicUrl(fileName);
                        finalLicenseUrl = urlData.publicUrl;
                        console.log("Post-Payment PDF uploaded successfully:", finalLicenseUrl);

                        // Save the URL to the user profile
                        const { error: profileUrlError } = await supabaseAdmin
                            .from('profiles')
                            .update({ store_license_url: finalLicenseUrl })
                            .eq('id', metadata.user_id);
                            
                        if (profileUrlError) {
                            console.error("Failed to save PDF URL to profile:", profileUrlError);
                        }
                    }
                } catch (pdfErr) {
                    console.error("Failed to generate/upload PDF in Webhook:", pdfErr);
                }

                
                    // ==========================================
                    // 4. GENERATE CONTRACT PDF
                    // ==========================================
                    console.log("Generating Post-Payment Contract PDF for", metadata.nome_istituto);
                    let finalContractUrl = null;
                    let contractPdfBuffer = null;
                    let contractFileName = null;

                    try {
                        contractPdfBuffer = await generatePdfContract(
                            metadata.nome_istituto || 'Istituto Sconosciuto',
                            metadata.indirizzo || '-',
                            metadata.metri_quadri || '-',
                            metadata.responsabile || '-',
                            metadata.ragione_sociale || '-',
                            metadata.partita_iva || '-',
                            metadata.codice_sdi || existingSdi || '-', // Codice SDI
                            metadata.email_richiedente || '-',
                            metadata.telefono || '-',
                            planType.toUpperCase(),
                            metadata.durata || '-',
                            new Date().toLocaleDateString('it-IT'),
                            expirationDate.toLocaleDateString('it-IT')
                        );

                        const sanitizedName = (metadata.nome_istituto || 'istituto').replace(/[^a-z0-9]/gi, '_').toLowerCase();
                        contractFileName = `${metadata.user_id}_${sanitizedName}_contratto.pdf`;

                        const { error: uploadContractError } = await supabaseAdmin
                            .storage
                            .from('Contratti-PDF')
                            .upload(contractFileName, contractPdfBuffer, {
                                contentType: 'application/pdf',
                                upsert: true
                            });

                        if (!uploadContractError) {
                            const { data: contractUrlData } = supabaseAdmin
                                .storage
                                .from('Contratti-PDF')
                                .getPublicUrl(contractFileName);
                            finalContractUrl = contractUrlData.publicUrl;
                            console.log("Post-Payment Contract PDF uploaded successfully:", finalContractUrl);

                            // Save the URL to the user profile
                            const { error: profileContractUrlError } = await supabaseAdmin
                                .from('profiles')
                                .update({ store_contract_url: finalContractUrl })
                                .eq('id', metadata.user_id);
                                
                            if (profileContractUrlError) {
                                console.error("Failed to save Contract PDF URL to profile:", profileContractUrlError);
                            }
                        } else {
                            console.error("Failed to upload Contract PDF to Storage:", uploadContractError);
                        }
                    } catch (contractErr) {
                        console.error("Failed to generate/upload Contract PDF in Webhook:", contractErr);
                    }

                    // --- SEND EMAILS ---
                const resendApiKey = process.env.RESEND_API_KEY;
                if (resendApiKey) {
                    const resend = new Resend(resendApiKey);

                    // A. Email to Admin
                    await resend.emails.send({
                        from: process.env.RESEND_FROM_EMAIL || 'Beautify Channel <info@beautify-channel.com>',
                        to: process.env.RESEND_FROM_EMAIL || 'info@beautify-channel.com', // Admin email
                        subject: `🟢 PAGAMENTO RICEVUTO - Nuovo ${planType.toUpperCase()} da ${metadata.email_richiedente || 'Cliente'}`,
                        html: `
                          <h2>Nuovo Pagamento Completato tramite Stripe</h2>
                          <p>L'utente ha completato il pagamento su Stripe e il piano <strong>${planType.toUpperCase()}</strong> è stato attivato automaticamente.</p>
                          <h3>Dati del Cliente:</h3>
                          <ul>
                            <li><strong>Sessione Stripe ID:</strong> ${session.id}</li>
                            <li><strong>Email Richiedente:</strong> ${metadata.email_richiedente}</li>
                            <li><strong>Ragione Sociale:</strong> ${metadata.ragione_sociale}</li>
                            <li><strong>Partita IVA:</strong> ${metadata.partita_iva}</li>
                            <li><strong>Indirizzo istituto:</strong> ${metadata.indirizzo}</li>
                            <li><strong>Nome istituto:</strong> ${metadata.nome_istituto}</li>
                            <li><strong>Metri quadri:</strong> ${metadata.metri_quadri}</li>
                            <li><strong>Durata abbonamento:</strong> ${metadata.durata}</li>
                            <li><strong>Responsabile:</strong> ${metadata.responsabile}</li>
                            <li><strong>Telefono:</strong> ${metadata.telefono}</li>
                          </ul>
                          <p>Nessuna azione richiesta. Il canale è già attivo.</p>
                        `
                    });

                    // B. Email to User
                    const userEmail = session.customer_details?.email || session.customer_email || metadata.email_richiedente;
                    if (userEmail) {
                        const attachments = [];
                        if (pdfBuffer && fileName) {
                            attachments.push({ filename: fileName, content: pdfBuffer });
                        }
                        if (contractPdfBuffer && contractFileName) {
                            attachments.push({ filename: contractFileName, content: contractPdfBuffer });
                        }

                        await resend.emails.send({
                            from: process.env.RESEND_FROM_EMAIL || 'Beautify Channel <info@beautify-channel.com>', 
                            to: userEmail,
                            subject: `🎉 Pagamento Confermato! Benvenuto in ${planType.toUpperCase()} 🌟`,
                            html: `
                            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333; background-color: #FAFAFA; padding: 0; border-radius: 12px; border: 1px solid #EAEAEA; overflow: hidden;">
                                <div style="background-color: #09090b; padding: 30px 20px; text-align: center;">
                                    <img src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg" alt="Beautify Channel" style="max-height: 40px; width: auto;" />
                                </div>
                                <div style="background-color: #FFFFFF; padding: 30px; border-radius: 0 0 12px 12px;">
                                    <p style="font-size: 16px; line-height: 1.6; color: #444;">Sei dei nostri, significa che hai capito le potenzialità del servizio!<br>Grazie!</p>
                                    <p style="font-size: 16px; line-height: 1.6; color: #444;">Il tuo abbonamento attuale è il <strong>${planType.toUpperCase()}</strong> e scadrà il <strong>${expirationDate.toLocaleDateString('it-IT')}</strong>.</p>
                                    <p style="font-size: 16px; line-height: 1.6; color: #444;">Nell'area riservata troverai anche una sezione documenti contenente: Pagamento - Contratto - Licenza di diffusione musicale (da tenere sempre in reception in caso di controlli della SIAE)</p>
                                    <p style="font-size: 16px; line-height: 1.6; color: #444;">Esatto, utilizzando il nostro servizio puoi fare disdetta alla SIAE non pagandola più perchè con noi i diritti musicali sono già compresi!</p>
                                    <p style="font-size: 16px; line-height: 1.6; color: #444; margin-top: 20px;">Per qualsiasi info puoi scriverci su whatsapp o mandarci una email a info@beautify-channel.com<br><b>Grazie per aver scelto BeautiFy!</b></p>
                                </div>
                            </div>
                            `,
                            attachments: attachments
                        });
                    }
                } else {
                    console.warn("RESEND_API_KEY missing in Webhook. Emails not sent.");
                }

            } catch (err: any) {
                console.error('Errore critico durante aggiornamento da Webhook:', err);
                return new NextResponse('Errore aggiornamento DB', { status: 500 });
            }
        }
    }

    return new NextResponse('Success', { status: 200 });
}
