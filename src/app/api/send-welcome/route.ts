import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, full_name } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Send the Welcome Email
        const data = await resend.emails.send({
            from: 'Beautify Channel <noreply@beautifychannel.com>', // We use the noreply address requested by the user
            to: email,
            subject: 'Benvenuto su Beautify Channel! 🎵 La tua prova gratuita è attiva',
            html: `
                <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333; background-color: #FAFAFA; padding: 20px; border-radius: 12px; border: 1px solid #EAEAEA;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #c026d3; margin: 0; font-size: 28px; font-weight: 800;">Beautify Channel</h1>
                        <p style="color: #666; font-size: 14px; margin-top: 5px;">L'Atmosfera Perfetta per il tuo Salone</p>
                    </div>

                    <div style="background-color: #FFFFFF; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #EAEAEA;">
                        <h2 style="font-size: 20px; color: #111; margin-top: 0;">Ciao ${full_name || 'Amico'}, Benvenuto a bordo! 🎉</h2>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #444;">
                            Siamo felicissimi di averti con noi. La tua <strong>prova gratuita di 7 giorni</strong> è stata attivata con successo.
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #444;">
                            Da questo momento hai accesso immediato ai nostri migliori canali musicali curati appositamente per offrire un'esperienza premium nel tuo istituto.
                        </p>

                        <div style="background-color: #fdf4ff; border-left: 4px solid #c026d3; padding: 15px; margin: 25px 0;">
                            <strong style="color: #a21caf;">Cosa puoi fare adesso?</strong>
                            <ul style="margin-top: 10px; margin-bottom: 0; padding-left: 20px; color: #444; line-height: 1.5;">
                                <li>Accedi alla tua Area Riservata</li>
                                <li>Scegli uno dei 6 canali dedicati (es. Relax, Lounge, Jazz)</li>
                                <li>Alza il volume e goditi la musica senza interruzioni!</li>
                            </ul>
                        </div>

                        <div style="text-align: center; margin: 35px 0;">
                            <a href="https://beautifychannel.com/area-riservata" style="background-color: #c026d3; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(192, 38, 211, 0.3);">
                                Entra nell'Area Riservata
                            </a>
                        </div>
                    </div>

                    <p style="text-align: center; font-size: 12px; color: #999; margin-top: 30px;">
                        Se hai bisogno di assistenza, rispondi semplicemente a questa email.<br>
                        © ${new Date().getFullYear()} Beautify Channel. Tutti i diritti riservati.
                    </p>
                </div>
            `
        });

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('RESEND ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
