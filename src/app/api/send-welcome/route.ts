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
            from: process.env.RESEND_FROM_EMAIL || 'Beautify Channel <info@beautify-channel.com>', // We use the verified domain
            to: email,
            subject: 'Benvenuto su Beautify Channel! 🎵 La tua prova gratuita è attiva',
            html: `
                <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333; background-color: #FAFAFA; padding: 20px; border-radius: 12px; border: 1px solid #EAEAEA;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #c026d3; margin: 0; font-size: 28px; font-weight: 800;">Beautify Channel</h1>
                        <p style="color: #666; font-size: 14px; margin-top: 5px;">L'Atmosfera Perfetta per il tuo Salone</p>
                    </div>

                    <div style="background-color: #FFFFFF; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #EAEAEA;">
                        <h2 style="font-size: 20px; color: #111; margin-top: 0;">Ciao ${full_name || ''}, Benvenuto a bordo! 🎉</h2>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #444;">
                            Grazie per aver deciso di provare il nostro servizio!
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #444;">
                            Queste sono le credenziali per la tua area riservata. La prova gratuita dura 7 giorni, successivamente se lo vorrai, potrai scegliere il nostro piano BASIC ma intanto...
                        </p>
                        
                        <h3 style="font-size: 18px; color: #c026d3; margin-top: 20px;">BUONA ESPERIENZA CON BeautiFy Channel.</h3>
                        <p style="font-size: 16px; line-height: 1.6; color: #444; font-weight: bold;">Il Team BeautiFy</p>

                        <div style="background-color: #fdf4ff; border-left: 4px solid #c026d3; padding: 15px; margin: 25px 0;">
                            <strong style="color: #a21caf;">P.S. Un piccolo consiglio:</strong>
                            <p style="margin-top: 10px; margin-bottom: 0; color: #444; line-height: 1.5; font-size: 14px;">
                                Si consiglia di collegare il device che utilizzerai per ascoltare (pc, smartphone o tablet) direttamente al tuo impianto audio in istituto o alle casse bluetooth. Fallo il prima possibile, in modo da poter fare l'esperienza completa direttamente in istituto!
                            </p>
                        </div>

                        <div style="text-align: center; margin: 35px 0;">
                            <a href="https://beautifychannel.com/login" style="background-color: #c026d3; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(192, 38, 211, 0.3);">
                                Accedi all'Area Riservata
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
