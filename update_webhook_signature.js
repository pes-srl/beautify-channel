const fs = require('fs');

const path = '/Users/mirkodgz/Projects/criss-dell-orto/beautify-channel/src/app/api/webhooks/stripe/route.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Fetch existing signature before update
const oldUpdateChunk = `                // Update upgrade_requests status to approved and enrich billing_details with Stripe info
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
                    importo_pagato_eur: session.amount_total ? session.amount_total / 100 : 0
                };`;

const newUpdateChunk = `                // Fetch existing pending request to get signature_base64
                const { data: pendingRequest } = await supabaseAdmin
                    .from('upgrade_requests')
                    .select('billing_details')
                    .eq('user_id', metadata.user_id)
                    .eq('requested_plan', planType)
                    .eq('status', 'pending');
                    
                const existingSignature = (pendingRequest && pendingRequest.length > 0) ? pendingRequest[0].billing_details?.signature_base64 : null;

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
                    signature_base64: existingSignature
                };`;

content = content.replace(oldUpdateChunk, newUpdateChunk);

// 2. Pass existingSignature to generatePdfContract and generatePdfCertificate
content = content.replace(
    /null \/\/ signature/g,
    'existingSignature // signature'
);

content = content.replace(
    "expirationDate.toLocaleDateString('it-IT')",
    "expirationDate.toLocaleDateString('it-IT'),\n                            existingSignature"
);

fs.writeFileSync(path, content, 'utf8');
console.log('Webhook signature logic updated.');
