const fs = require('fs');

const path = '/Users/mirkodgz/Projects/criss-dell-orto/beautify-channel/src/app/api/webhooks/stripe/route.ts';
let content = fs.readFileSync(path, 'utf8');

// Import generatePdfContract
content = content.replace(
    'import { generatePdfCertificate } from "@/utils/generatePdfCertificate";',
    'import { generatePdfCertificate } from "@/utils/generatePdfCertificate";\nimport { generatePdfContract } from "@/utils/generatePdfContract";'
);

// Add Contract PDF Generation
const contractGenSnippet = `
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
                            "-", // SDI not natively in metadata, but they could add it to checkout later
                            metadata.email_richiedente || '-',
                            metadata.telefono || '-',
                            planType.toUpperCase(),
                            metadata.durata || '-',
                            new Date().toLocaleDateString('it-IT'),
                            expirationDate.toLocaleDateString('it-IT')
                        );

                        const sanitizedName = (metadata.nome_istituto || 'istituto').replace(/[^a-z0-9]/gi, '_').toLowerCase();
                        contractFileName = \`\${metadata.user_id}_\${sanitizedName}_contratto.pdf\`;

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

`;

content = content.replace(
    '// --- SEND EMAILS ---',
    contractGenSnippet + '                    // --- SEND EMAILS ---'
);

// Update attachments mapping pattern
const oldAtt = `const attachments = pdfBuffer && fileName ? [
                            {
                                filename: fileName,
                                content: pdfBuffer,
                            }
                        ] : [];`;

const newAtt = `const attachments = [];
                        if (pdfBuffer && fileName) {
                            attachments.push({ filename: fileName, content: pdfBuffer });
                        }
                        if (contractPdfBuffer && contractFileName) {
                            attachments.push({ filename: contractFileName, content: contractPdfBuffer });
                        }`;

content = content.replace(oldAtt, newAtt);

// Update email body to include the contract
content = content.replace(
    '<p>In allegato trovi il file PDF del tuo Certificato/Licenza Ufficiale relativo a questo abbonamento.</p>',
    '<p>In allegato trovi i file PDF del tuo <strong>Contratto di Abbonamento</strong> e del tuo <strong>Certificato/Licenza Ufficiale</strong> relativi a questo abbonamento.</p>'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Webhook updated via Node.js script');
