"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, Instagram, Facebook } from "lucide-react";

export function FooterNew() {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/admin");

    if (isDashboard) return null;

    return (
        <footer className="bg-zinc-950 border-t border-white/5 py-16 px-6 overflow-hidden relative">
            {/* Background embellishments */}
            <div className="absolute top-0 right-[-10%] w-[30%] h-[50%] bg-fuchsia-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 relative z-10">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <img
                            src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg"
                            alt="Beautify Channel Logo"
                            className="h-12 w-auto mb-6 transition-all duration-300"
                        />
                        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                            Un vero strumento di audio marketing per il tuo settore, studiato per rendere innovativa l'esperienza nel tuo Istituto.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://www.instagram.com/beautify_channel/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=100086563991138" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-all">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Legale</h4>
                        <ul className="space-y-4">
                            <li><a href="https://www.iubenda.com/privacy-policy/66648110" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                            <li><a href="https://www.iubenda.com/privacy-policy/66648110/cookie-policy" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
                            <li><Link href="/termini" className="text-zinc-400 hover:text-white transition-colors text-sm">Termini e Condizioni</Link></li>
                            <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Trattamento Dati Personali</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Contattaci</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-zinc-400 text-sm">
                                <Phone size={18} className="text-fuchsia-400 shrink-0 mt-0.5" />
                                <a href="https://wa.link/5apci9" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    Contattaci su WhatsApp per info rapide
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-zinc-400 text-sm">
                                <Mail size={18} className="text-fuchsia-400 shrink-0" />
                                <a href="mailto:info@beautify-channel.it" className="hover:text-white transition-colors">info@beautify-channel.it</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-zinc-500 text-sm text-center md:text-left">
                        &copy; 2026 BeautiFy Channel è un progetto di <a href="https://www.pes-srl.it/" target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors font-medium">PES S.r.l.</a> Tutti i diritti riservati.
                    </p>
                    <p className="text-zinc-600 text-xs flex items-center gap-1">
                        Made with <span className="text-red-500">♥</span> in Italy
                    </p>
                </div>
            </div>
        </footer>
    );
}
