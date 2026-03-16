import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Generates a PDF Contract for a user upgrading their account.
 */
export async function generatePdfContract(
    storeName: string,
    address: string,
    mq: string,
    managedBy: string,
    ragioneSociale: string,
    vat: string,
    sdi: string,
    email: string,
    phone: string,
    planType: string,
    duration: string,
    activationDate: string,
    expirationDate: string
): Promise<Buffer> {
    
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const black = rgb(0, 0, 0);
    const darkGray = rgb(0.2, 0.2, 0.2);
    
    let currentY = height - 50;
    const margin = 50;
    const maxTextWidth = width - 100;

    // Helper to check and add new page if needed
    const checkFormNewPage = (neededSpace: number) => {
        if (currentY - neededSpace < margin) {
            page = pdfDoc.addPage([595.28, 841.89]);
            currentY = height - margin;
        }
    };

    // Title
    page.drawText("CONTRATTO DI ABBONAMENTO", { x: margin, y: currentY, size: 14, font: fontBold, color: black });
    currentY -= 15;
    page.drawText("BeautiFy Channel – Servizio Streaming Audio Professionale", { x: margin, y: currentY, size: 10, font: fontRegular, color: darkGray });
    currentY -= 30;

    const labelFontSize = 9;
    const valueFontSize = 10;
    const lineSpacing = 14;

    const fillData = (title: string, fields: {label: string, value: string}[]) => {
        const boxHeight = (fields.length * lineSpacing) + 15;
        checkFormNewPage(boxHeight + 20);

        page.drawText(title, { x: margin, y: currentY, size: 11, font: fontBold, color: black });
        currentY -= 15;
        
        fields.forEach(f => {
            page.drawText(f.label + ":", { x: margin, y: currentY, size: labelFontSize, font: fontRegular, color: darkGray });
            page.drawText(f.value || "-", { x: 220, y: currentY, size: valueFontSize, font: fontBold, color: black });
            currentY -= lineSpacing;
        });
        currentY -= 15;
    };

    fillData("DATI ISTITUTO E FATTURAZIONE", [
        { label: "Nome istituto", value: storeName },
        { label: "Indirizzo completo", value: address },
        { label: "Metri quadri istituto", value: mq },
        { label: "Responsabile istituto", value: managedBy },
        { label: "Ragione Sociale", value: ragioneSociale },
        { label: "P.IVA / CF", value: vat },
        { label: "Codice Destinatario/SDI", value: sdi },
        { label: "Telefono", value: phone },
        { label: "Email", value: email }
    ]);

    fillData("CONDIZIONI DELL'ABBONAMENTO", [
        { label: "Tipo abbonamento", value: `${planType} (BeautiFy Channel)` },
        { label: "Periodo di fatturazione", value: duration },
        { label: "Data attivazione", value: activationDate },
        { label: "Data scadenza", value: expirationDate }
    ]);

    checkFormNewPage(80);
    page.drawText("FORNITORE DEL SERVIZIO:", { x: margin, y: currentY, size: 10, font: fontBold, color: black });
    currentY -= 15;
    page.drawText("PES S.r.l. - Via Norvegia 23, 20093 Cologno Monzese (MI)", { x: margin, y: currentY, size: 9, font: fontRegular, color: black });
    currentY -= 12;
    page.drawText("P.IVA 06241330965", { x: margin, y: currentY, size: 9, font: fontRegular, color: black });
    currentY -= 12;
    page.drawText("Rappresentata da Cristian Dell’Orto (di seguito “PES”)", { x: margin, y: currentY, size: 9, font: fontRegular, color: black });
    currentY -= 25;

    page.drawLine({
        start: { x: margin, y: currentY },
        end: { x: width - margin, y: currentY },
        thickness: 0.5,
        color: darkGray
    });
    currentY -= 20;

    const drawParagraph = (text: string) => {
        const words = text.split(' ');
        let line = '';
        for (const word of words) {
            const testLine = line + word + ' ';
            const testWidth = fontRegular.widthOfTextAtSize(testLine, 9);
            if (testWidth > maxTextWidth) {
                checkFormNewPage(12);
                page.drawText(line, { x: margin, y: currentY, size: 9, font: fontRegular, color: black });
                line = word + ' ';
                currentY -= 12;
            } else {
                line = testLine;
            }
        }
        if (line.trim()) {
            checkFormNewPage(12);
            page.drawText(line, { x: margin, y: currentY, size: 9, font: fontRegular, color: black });
            currentY -= 12;
        }
    };

    const clauses = [
        ["1. OGGETTO DEL SERVIZIO", "PES fornisce al Cliente il servizio BeautiFy Channel, piattaforma di streaming audio professionale accessibile tramite il sito beautify-channel.com. Il servizio consente la diffusione sonora di palinsesti musicali e comunicazioni audio progettate per istituti di bellezza. Il servizio è destinato esclusivamente alla diffusione sonora all’interno dell’istituto indicato nel presente contratto."],
        ["2. DURATA E RINNOVO", "Il servizio BeautiFy Channel rimane attivo per il periodo indicato nella sezione Durata abbonamento, con decorrenza dalla Data attivazione e scadenza alla Data scadenza indicate nel presente contratto. Alla scadenza dell’abbonamento il servizio terminerà automaticamente, salvo eventuale rinnovo effettuato dal Cliente tramite la piattaforma BeautiFy Channel."],
        ["3. PAGAMENTO", "Il Cliente ha sottoscritto il piano di abbonamento indicato nella sezione Durata abbonamento, acquistato tramite la piattaforma online BeautiFy Channel. Il pagamento del servizio è stato effettuato anticipatamente al momento della registrazione tramite il sistema di pagamento integrato nella piattaforma. Con la generazione del presente contratto PES conferma che il corrispettivo relativo al servizio risulta integralmente saldato."],
        ["4. UTILIZZO DEL SERVIZIO", "Il Cliente si impegna a utilizzare il servizio esclusivamente per la diffusione sonora all’interno dell’istituto indicato nel presente contratto. Il Cliente è responsabile delle apparecchiature e della connessione internet necessarie alla fruizione del servizio."],
        ["5. UTILIZZO LIMITATO DEL SERVIZIO", "L’abbonamento BeautiFy Channel è associato esclusivamente all’istituto indicato nella sezione Nome istituto e all’indirizzo riportato nel presente contratto. Il servizio non può essere condiviso, trasferito o utilizzato contemporaneamente in sedi o istituti diversi senza preventiva autorizzazione scritta da parte di PES."],
        ["6. LICENZE MUSICALI", "I contenuti musicali diffusi tramite il servizio BeautiFy Channel provengono da repertori per i quali PES dispone delle necessarie autorizzazioni alla comunicazione al pubblico in streaming. A seguito dell’attivazione del servizio, il Cliente riceve una licenza di utilizzo personalizzata associata al proprio abbonamento, che attesta l’utilizzo del servizio BeautiFy Channel all’interno dell’istituto indicato nel presente contratto. Il Cliente è autorizzato a diffondere esclusivamente il flusso audio fornito dalla piattaforma BeautiFy Channel e si impegna a non registrare, copiare o redistribuire i contenuti trasmessi dal servizio."],
        ["7. PRIVACY", "I dati personali forniti tramite il form di registrazione sono trattati da PES nel rispetto del Regolamento UE 2016/679 (GDPR) esclusivamente per la gestione del servizio."],
        ["8. LEGGE APPLICABILE", "Il presente contratto è regolato dalla legge italiana. Per qualsiasi controversia relativa al presente contratto è competente in via esclusiva il Foro di Milano."],
        ["9. GENERAZIONE AUTOMATICA", "Il presente documento è generato automaticamente dal sistema BeautiFy Channel a seguito della sottoscrizione online del servizio e costituisce riepilogo delle condizioni accettate dal Cliente durante la procedura di acquisto digitale."]
    ];

    for (const clause of clauses) {
        checkFormNewPage(35);
        page.drawText(clause[0], { x: margin, y: currentY, size: 10, font: fontBold, color: black });
        currentY -= 14;
        drawParagraph(clause[1]);
        currentY -= 10;
    }

    checkFormNewPage(80);
    currentY -= 10;
    page.drawText(`Data: ${activationDate}`, { x: margin, y: currentY, size: 9, font: fontRegular, color: black });
    currentY -= 40;
    
    page.drawText("Cristian Dell’Orto", { x: margin, y: currentY, size: 10, font: fontBold, color: black });
    page.drawText("PES S.r.l.", { x: margin, y: currentY - 12, size: 9, font: fontRegular, color: black });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}
