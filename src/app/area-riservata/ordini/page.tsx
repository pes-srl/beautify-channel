import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ShoppingBag, AlertCircle, FileText, ArrowRight, CheckCircle2, Clock, CalendarDays, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStripeCustomerPortalUrl } from '@/app/actions/stripe-portal';

export default async function OrdiniPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('plan_type')
        .eq('id', user.id)
        .single();

    // Fetch user upgrade requests for order history
    const { data: ordersData } = await supabase
        .from('upgrade_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    const orders = ordersData || [];
    const hasOrders = orders.length > 0;

    // Try to get portal URL (this will fail gracefully if no customer exists)
    const portalRes = await getStripeCustomerPortalUrl();
    const portalUrl = portalRes?.url;

    return (
        <div className="pt-[7rem] pb-32 min-h-[100dvh] relative w-full bg-[#0f0518] selection:bg-[#D8B2A3]/30">
            {/* Dynamic Background identico alla Home Page */}
            <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#AB7169]/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-[#5D6676]/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 text-white w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold font-['Montserrat'] tracking-tight mb-4">
                                I Miei <span className="text-amber-500">Ordini</span>
                            </h1>
                            <p className="text-zinc-400 text-lg">
                                Storico e dettagli dei tuoi abbonamenti e pagamenti.
                            </p>
                        </div>
                        {portalUrl && (
                            <a href={portalUrl} target="_blank" rel="noreferrer" className="hidden sm:block">
                                <Button className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white rounded-xl">
                                    Portale Fatturazione
                                    <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
                                </Button>
                            </a>
                        )}
                    </div>

                    {!hasOrders ? (
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8">
                            <div className="flex flex-col items-center text-center space-y-6 py-8">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    <AlertCircle className="w-10 h-10 text-zinc-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-2">
                                        Nessun Ordine Trovato
                                    </h2>
                                    <p className="text-zinc-400">
                                        Non risulta ancora nessun acquisto o abbonamento sul tuo account.
                                    </p>
                                </div>
                                {profile?.plan_type !== 'premium' && profile?.plan_type !== 'basic' && (
                                    <a href="/area-riservata/#upgrade-section" className="mt-4 block">
                                        <Button className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-8 py-6 rounded-2xl">
                                            Scopri i Piani
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => {
                                const details = order.billing_details || {};
                                const isApproved = order.status === 'approved';
                                const importo = details?.importo_pagato_eur || 0;
                                const date = new Date(order.created_at).toLocaleDateString('it-IT', {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                });

                                return (
                                    <div key={order.id} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-6 transition-all hover:bg-white/10">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl font-bold uppercase tracking-wider text-amber-500">
                                                        PIANO {order.requested_plan}
                                                    </span>
                                                    {isApproved ? (
                                                        <span className="flex items-center text-sm text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Pagato e Attivo
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center text-sm text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                                                            <Clock className="w-4 h-4 mr-1.5" /> In elaborazione / Annullato
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-zinc-400 text-sm gap-4">
                                                    <div className="flex items-center">
                                                        <CalendarDays className="w-4 h-4 mr-1.5 opacity-70" />
                                                        {date}
                                                    </div>
                                                    {details.durata_abbonamento && (
                                                        <div>Durata: <span className="text-zinc-300">{details.durata_abbonamento}</span></div>
                                                    )}
                                                </div>
                                                <div className="text-xs text-zinc-500 font-mono mt-1">
                                                    Ordine ID: {order.id.split('-')[0]}...
                                                </div>
                                            </div>

                                            <div className="text-left sm:text-right">
                                                <div className="text-3xl font-light text-white">
                                                    {importo > 0 ? `€${importo.toFixed(2)}` : '--'}
                                                </div>
                                                {details.stripe_session_id && (
                                                    <div className="text-xs text-zinc-500 mt-1" title={details.stripe_session_id}>
                                                        Transazione Stripe registrata
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {portalUrl && (
                                <div className="mt-8 bg-black/40 border border-amber-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-amber-500">Hai bisogno della fattura ufficiale o vuoi cambiare carta?</h3>
                                        <p className="text-zinc-400 text-sm mt-1">Stripe genera in automatico la fattura elettronica alcuni giorni dopo il pagamento.</p>
                                    </div>
                                    <a href={portalUrl} target="_blank" rel="noreferrer" className="shrink-0 w-full sm:w-auto">
                                        <Button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 font-semibold">
                                            Apri Portale Stripe
                                        </Button>
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
