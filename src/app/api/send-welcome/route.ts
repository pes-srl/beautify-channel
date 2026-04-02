import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, full_name, password } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Send the Welcome Email
        const data = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Beautify Channel <info@beautify-channel.com>', // We use the verified domain
            to: email,
            subject: 'Benvenuto su Beautify Channel! 🎵 La tua prova gratuita è attiva',
            html: `
                <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333; background-color: #FAFAFA; padding: 0; border-radius: 12px; border: 1px solid #EAEAEA; overflow: hidden;">
                    <!-- Header Scuro con Logo -->
                    <div style="background-color: #09090b; padding: 30px 20px; text-align: center;">
                        <img src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg" alt="Beautify Channel" style="max-height: 40px; width: auto;" />
                    </div>

                    <div style="background-color: #FFFFFF; padding: 30px; border-radius: 0 0 12px 12px;">
                        <h2 style="font-size: 20px; color: #111; margin-top: 0;">Ciao ${full_name || ''}</h2>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #444;">
                            Grazie per aver deciso di provare il nostro servizio!
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #444;">
                            Queste sono le credenziali per la tua area riservata:
                        </p>

                        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px dashed #d1d5db;">
                            <p style="margin: 0; font-size: 15px; color: #374151;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 10px 0 0 0; font-size: 15px; color: #374151;"><strong>Password:</strong> ${password || '********'}</p>
                        </div>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #444;">
                            La prova gratuita dura 7 giorni. Successivamente, se lo vorrai, potrai scegliere il nostro piano BASIC, ma intanto...
                        </p>
                        
                        <h3 style="font-size: 18px; color: #c026d3; margin-top: 20px;">BUONA ESPERIENZA CON BeautiFy Channel.</h3>
                        <p style="font-size: 16px; line-height: 1.6; color: #444; font-weight: bold;">Il Team BeautiFy</p>

                        <div style="background-color: #fdf4ff; border-left: 4px solid #c026d3; padding: 15px; margin: 25px 0;">
                            <p style="margin: 0; color: #444; line-height: 1.5; font-size: 14px;">
                                Si consiglia di collegare il device che utilizzerai per l'ascolto (pc, smartphone o tablet) direttamente al tuo impianto audio in istituto o alle casse bluetooth. Fallo il prima possibile, in modo da poter fare l'esperienza completa direttamente in istituto!
                            </p>
                        </div>

                        <div style="text-align: center; margin: 35px 0;">
                            <a href="https://www.beautify-channel.com/login" style="background-color: #c026d3; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(192, 38, 211, 0.3);">
                                Accedi all'Area Riservata
                            </a>
                        </div>
                    </div>

                    <p style="text-align: center; font-size: 12px; color: #999; margin-top: 30px; padding-bottom: 20px;">
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
