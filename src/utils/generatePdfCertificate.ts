import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Generates a PDF Certificate for a user upgrading their account.
 * 
 * @param storeName The name of the store (e.g., "Beauty Spa Milano S.R.L.")
 * @param address The address of the store (e.g., "Via Roma 10, Milano (MI)")
 * @param managedBy The name of the person managing the store
 * @param vat The VAT number (Partita IVA)
 * @returns A Buffer containing the generated PDF
 */
export async function generatePdfCertificate(
    storeName: string,
    address: string,
    managedBy: string,
    vat: string,
    expirationDate: string
): Promise<Buffer> {
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const black = rgb(0, 0, 0);
    const darkGray = rgb(0.2, 0.2, 0.2);
    
    // ------------------------------------------------------------------------
    // 1. HEADER (Logo + Title)
    // ------------------------------------------------------------------------
    
    try {
        // Read from the public folder (works in Next.js Server Actions if path is resolved correctly)
        const logoPath = path.join(process.cwd(), 'public', 'ES-Logo-Header.webp');
        const logoBytes = fs.readFileSync(logoPath);
        const logoImage = await pdfDoc.embedPng(logoBytes);
        const logoDims = logoImage.scale(0.09);
        
        page.drawImage(logoImage, {
            x: 50,
            y: height - 40 - logoDims.height,
            width: logoDims.width,
            height: logoDims.height,
        });
    } catch (e: any) {
        console.error("Could not load logo:", e.message);
    }

    // Certificate Title
    const titleText = "EPIDEMIC SOUND IN-STORE MUSIC PARTNER CERTIFICATE";
    const titleFontSize = 10;
    const titleWidth = fontBold.widthOfTextAtSize(titleText, titleFontSize);
    page.drawText(titleText, {
        x: width - 50 - titleWidth,
        y: height - 90,
        size: titleFontSize,
        font: fontBold,
        color: black,
    });
    
    // ------------------------------------------------------------------------
    // 2. USER DETAILS RECTANGLE
    // ------------------------------------------------------------------------
    
    const boxY = height - 120;
    const boxHeight = 80;
    
    page.drawRectangle({
        x: 50,
        y: boxY - boxHeight,
        width: width - 100,
        height: boxHeight,
        borderColor: darkGray,
        borderWidth: 0.5,
    });

    const labelX = 55;
    const valueX = 200;
    const lineSpacing = 16;
    const startTextY = boxY - 20;
    const labelFontSize = 10;
    const valueFontSize = 11;

    // Use placeholder text if data is missing
    const safeStoreName = storeName || "_______________________";
    const safeAddress = address || "_______________________";
    const safeManagedBy = managedBy || "_______________________";
    const safeVat = vat || "_______________________";

    page.drawText('Name of the Store:', { x: labelX, y: startTextY, size: labelFontSize, font: fontRegular, color: black });
    page.drawText(safeStoreName, { x: valueX, y: startTextY, size: valueFontSize, font: fontRegular, color: black });

    page.drawText('Address:', { x: labelX, y: startTextY - lineSpacing, size: labelFontSize, font: fontRegular, color: black });
    page.drawText(safeAddress, { x: valueX, y: startTextY - lineSpacing, size: valueFontSize, font: fontRegular, color: black });

    page.drawText('Managed by:', { x: labelX, y: startTextY - lineSpacing * 2, size: labelFontSize, font: fontRegular, color: black });
    page.drawText(safeManagedBy, { x: valueX, y: startTextY - lineSpacing * 2, size: valueFontSize, font: fontRegular, color: black });

    page.drawText('VAT:', { x: labelX, y: startTextY - lineSpacing * 3, size: labelFontSize, font: fontRegular, color: black });
    page.drawText(safeVat, { x: valueX, y: startTextY - lineSpacing * 3, size: valueFontSize, font: fontRegular, color: black });

    // ------------------------------------------------------------------------
    // 3. LEGAL TEXT (English)
    // ------------------------------------------------------------------------
    
    const paragraphFontSize = 10;
    const pLineHeight = 13;
    const textMaxWidth = width - 100;
    let currentY = boxY - boxHeight - 20;

    function drawLine(pdfPage: any, words: string[], font: any, fontSize: number, startX: number, y: number, maxWidth: number, justify: boolean) {
        if (words.length === 1 || !justify) {
            pdfPage.drawText(words.join(' '), { x: startX, y, size: fontSize, font, color: black });
            return;
        }

        const textWithoutSpaces = words.join('');
        const textWidth = font.widthOfTextAtSize(textWithoutSpaces, fontSize);
        const totalSpaceAvailable = maxWidth - textWidth;
        const spaceWidth = totalSpaceAvailable / (words.length - 1);

        let currentX = startX;
        for (let i = 0; i < words.length; i++) {
            pdfPage.drawText(words[i], { x: currentX, y, size: fontSize, font, color: black });
            currentX += font.widthOfTextAtSize(words[i], fontSize) + spaceWidth;
        }
    }

    function drawParagraph(pdfPage: any, text: string, font: any, fontSize: number, startX: number, startY: number, maxWidth: number, lineHeight: number, justify: boolean = true) {
        const paragraphs = text.split('\n\n');
        let y = startY;

        for (const paragraph of paragraphs) {
            const words = paragraph.split(/\s+/);
            let currentLine: string[] = [];
            let currentLineWidth = 0;
            const spaceWidth = font.widthOfTextAtSize(' ', fontSize);

            for (const word of words) {
                const wordWidth = font.widthOfTextAtSize(word, fontSize);
                if (currentLine.length === 0) {
                    currentLine.push(word);
                    currentLineWidth = wordWidth;
                } else {
                    if (currentLineWidth + spaceWidth + wordWidth > maxWidth) {
                        drawLine(pdfPage, currentLine, font, fontSize, startX, y, maxWidth, justify);
                        y -= lineHeight;
                        currentLine = [word];
                        currentLineWidth = wordWidth;
                    } else {
                        currentLine.push(word);
                        currentLineWidth += spaceWidth + wordWidth;
                    }
                }
            }
            if (currentLine.length > 0) {
                drawLine(pdfPage, currentLine, font, fontSize, startX, y, maxWidth, false);
                y -= lineHeight;
            }
            y -= lineHeight * 0.5;
        }
        return y;
    }

    const textEnglish = `Epidemic Sound AB, Västgötagatan 2, 118 27 Stockholm Sweden (“Epidemic Sound”) is the sole owner of all rights to the Epidemic Sound music provided within the Service, such as to the so called "master rights" to the recording, the so called neighbouring/performer rights that may accrue to those who perform on the recording, and the rights to the musical composition that is embodied on the recording. Hence, Epidemic Sound is the sole owner of all economic rights to each music piece in its catalogue and all creators have received direct payment from Epidemic Sound for each musical work.

Epidemic Sound is not a member of any collective management organization such as collecting societies or performance rights organisations (“CMO”). Likewise, none of the creators of the Epidemic Sound music, such as songwriters, performing artists, or producers, were members of any CMO at the time of transfer of rights to Epidemic Sound. Neither Epidemic Sound nor any creators of the Epidemic Sound music licensed in connection with the Service, have transferred any administration rights relating to the Epidemic Sound music provided within in the Service to any CMO.

You have acquired a license to use Epidemic Sound music for in-store/background music purposes`;

    currentY = drawParagraph(page, textEnglish, fontRegular, paragraphFontSize, 50, currentY, textMaxWidth, pLineHeight, true);

    currentY -= 10;
    
    // Validity Period
    page.drawText(`Validity period: until ${expirationDate}`, { x: 50, y: currentY, size: paragraphFontSize, font: fontRegular, color: black });

    // ------------------------------------------------------------------------
    // 4. DIVIDER AND ITALIAN TEXT
    // ------------------------------------------------------------------------
    
    currentY -= 30;
    page.drawText(`*******`, { x: 50, y: currentY, size: paragraphFontSize, font: fontRegular, color: black });
    currentY -= 20;

    const textItalian = `Epidemic Sound AB, Västgötagatan 2, 118 27 Stoccolma Svezia ("Epidemic Sound") è l'unico titolare di tutti i diritti sulla musica di Epidemic Sound fornita all'interno del Servizio, quali i cosiddetti "diritti connessi" sulla registrazione e i diritti d’autore sulla composizione musicale che è incorporata nella registrazione. Pertanto, Epidemic Sound è l'unico proprietario di tutti i diritti d’autore e diritti connessi a carattere economico su ciascun brano musicale del suo catalogo e tutti i titolari dei diritti hanno ricevuto un pagamento diretto da Epidemic Sound per ogni opera musicale.

Epidemic Sound non è membro di alcuna organismo di gestione collettiva o entità di gestione indipendente ("OGC" o “EGI”). Allo stesso modo, né Epidemic Sound, né alcuno dei titolari dei diritti d’autore e dei diritti connessi, come autori, compositori, cantanti, artisti o produttori era membro di OGC o EGI al momento del trasferimento dei diritti a Epidemic Sound.

Il presente certificato attesa l’acquisizione di una licenza per utilizzare la musica di Epidemic Sound come musica di sottofondo all’interno dell’esercizio commerciale.`;

    currentY = drawParagraph(page, textItalian, fontRegular, paragraphFontSize, 50, currentY, textMaxWidth, pLineHeight, true);

    currentY -= 10;
    page.drawText(`Periodo di validità: fino al ${expirationDate}`, { x: 50, y: currentY, size: paragraphFontSize, font: fontRegular, color: black });

    currentY -= 30;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    page.drawText(`Stockholm ${formattedDate}`, { x: 50, y: currentY, size: paragraphFontSize, font: fontRegular, color: black });

    // ------------------------------------------------------------------------
    // 5. SIGNATURE FOOTER
    currentY -= 50;
    const signatureY = currentY; // Store base Y for both signatures

    // --- LEFT: Epidemic Sound Signature ---
    try {
        const signaturePath = path.join(process.cwd(), 'public', 'signature-es.png');
        const signatureBytes = fs.readFileSync(signaturePath);
        const signatureImage = await pdfDoc.embedPng(signatureBytes);
        const signatureDims = signatureImage.scale(0.25);
        
        page.drawImage(signatureImage, {
            x: 50,
            y: signatureY - signatureDims.height + 10,
            width: signatureDims.width,
            height: signatureDims.height,
        });
        currentY = signatureY - signatureDims.height;
    } catch (e: any) {
        console.error("Could not load signature Image:", e.message);
    }
    
    page.drawText(`Elisabet Ström`, { x: 50, y: currentY - 5, size: 10, font: fontRegular, color: black });
    page.drawText(`Legal Counsel`, { x: 50, y: currentY - 17, size: 10, font: fontRegular, color: black });
    page.drawText(`Epidemic Sound`, { x: 50, y: currentY - 29, size: 10, font: fontRegular, color: black });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}
