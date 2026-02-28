"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";

export function FooterNew() {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/admin") || pathname?.startsWith("/area-riservata");

    if (isDashboard) return null;

    return (
        <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10 px-6 overflow-hidden relative">
            {/* Background embellishments */}
            <div className="absolute top-0 right-[-10%] w-[30%] h-[50%] bg-fuchsia-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <img
                            src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/Logo-BeautiFyChannel.svg"
                            alt="Beautify Channel Logo"
                            className="h-12 w-auto mb-6 grayscale hover:grayscale-0 transition-all duration-300"
                        />
                        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                            La tua radio in-store dedicata. Un vero strumento di marketing per il tuo istituto, studiato per rendere innovativa l'esperienza nel tuo Istituto.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-all">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Esplora</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Vantaggi</Link></li>
                            <li><Link href="#pricing" className="text-zinc-400 hover:text-white transition-colors text-sm">Listino Prezzi</Link></li>
                            <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Domande Frequenti (FAQ)</Link></li>
                            <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Testimonianze</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Legale</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Cookie Policy</Link></li>
                            <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Termini e Condizioni</Link></li>
                            <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Trattamento Dati Personali</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Contattaci</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-zinc-400 text-sm">
                                <Phone size={18} className="text-fuchsia-400 shrink-0" />
                                <span>Contattaci su WhatsApp per info rapide</span>
                            </li>
                            <li className="flex items-start gap-3 text-zinc-400 text-sm">
                                <Mail size={18} className="text-fuchsia-400 shrink-0" />
                                <span>info@beautifychannel.it</span>
                            </li>
                            <li className="flex items-start gap-3 text-zinc-400 text-sm">
                                <MapPin size={18} className="text-fuchsia-400 shrink-0" />
                                <span>Via Roma 123, 00100 Roma (RM), Italia</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-zinc-500 text-sm text-center md:text-left">
                        &copy; 2026 Beautify Channel. Tutti i diritti riservati.
                    </p>
                    <p className="text-zinc-600 text-xs flex items-center gap-1">
                        Made with <span className="text-red-500">♥</span> in Italy
                    </p>
                </div>
            </div>
        </footer>
    );
}
