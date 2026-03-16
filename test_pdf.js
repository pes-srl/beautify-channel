import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function mapPdfCoordinates() {
    console.log("Fetching PDF template...");
    
    // Fetch the PDF from the provided URL
    const pdfUrl = "https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/Licenza-PDF/TEMPLATE%20Licenze%20Epidemic.pdf";
    const response = await fetch(pdfUrl);
    const pdfBuffer = await response.arrayBuffer();

    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    console.log(`Page dimensions: width ${width}, height ${height}`);

    // Get a standard font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const color = rgb(0, 0, 0);

    // The PDF is loaded, (0,0) is bottom-left. Height is ~842.
    // In the previous attempt, text was too low (y = height - 212 = ~630).
    // The box seems to be around y=600 to y=650, let's adjust based on the image:
    const leftX = 150;
    const startY = 600; // Let's try 600, going down by 18px per line
    const lineSpacing = 18;

    // 1. Name of the Store
    firstPage.drawText('BEAUTY SPA MILANO S.R.L.', { x: leftX, y: startY, size: fontSize, font, color });

    // 2. Address
    firstPage.drawText('Via Roma 10, Milano (MI)', { x: leftX, y: startY - lineSpacing, size: fontSize, font, color });

    // 3. Managed by
    firstPage.drawText('Mario Rossi', { x: leftX, y: startY - (lineSpacing * 2), size: fontSize, font, color });

    // 4. VAT
    firstPage.drawText('IT12345678901', { x: leftX, y: startY - (lineSpacing * 3), size: fontSize, font, color });

    // 5. Validity period (At the bottom)
    // Was at 425, let's move it to 200 (further down the page)
    firstPage.drawText('01/01/2026 - 01/01/2027', { x: 130, y: 220, size: fontSize, font, color });


    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('./TEST_CERTIFICATE.pdf', pdfBytes);
    
    console.log("PDF saved as TEST_CERTIFICATE.pdf");
}

mapPdfCoordinates().catch(console.error);
