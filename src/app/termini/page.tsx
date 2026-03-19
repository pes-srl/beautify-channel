
export default function TerminiPage() {
    return (
        <main className="min-h-screen bg-zinc-950">
            <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md prose prose-invert prose-fuchsia max-w-none">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Termini e condizioni</h1>
                    <p className="text-zinc-400 text-sm mb-12">Data di aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>

                    <p className="text-zinc-300 leading-relaxed text-lg mb-10">
                        Benvenuti su Beautify Channel (di seguito "Sito"), gestito da PES Prodotti Elettronici Syncronizzati s.r.l. (di seguito "Società"), con sede legale in via Norvegia 23, 20093 Cologno Monzese (Mi). Utilizzando il nostro Sito, accetti i seguenti termini e condizioni. Se non accetti questi termini, ti invitiamo a non utilizzare il nostro Sito.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-6">1. Servizio Offerto</h2>
                    <p className="text-zinc-300 leading-relaxed mb-6">
                        Beautify Channel fornisce un servizio di canali musicali in streaming per istituti di bellezza, con musica e comunicazioni settoriali e personalizzate, a seconda dell'abbonamento scelto tra Basic e Premium.<br /><br />
                        Il servizio include:<br />
                        &ndash; Licenza di diffusione musicale (diritti d'autore) per l'istituto.<br />
                        &ndash; Atmosfera musicale studiata per il settore Beauty.<br />
                        &ndash; Suggerimenti vocali generalisti per promuovere vendite e comunicazioni istituzionali.<br />
                        &ndash; Suggerimenti vocali personalizzati per promuovere le vendite con l'abbonamento Premium.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-6">2. Periodo di Prova Gratuito (Free Trial)</h2>
                    <p className="text-zinc-300 leading-relaxed mb-6">
                        Ai nuovi iscritti viene offerto un periodo di prova gratuito di 14 giorni senza alcun obbligo di inserimento della carta di credito. Al termine dei 14 giorni, se non verrà effettuato l'avanzamento a un piano a pagamento (Basic o Premium), l'accesso ai canali musicali completi e alle relative licenze legali verrà sospeso o limitato.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-6">3. Abbonamenti, Prezzi e Pagamenti</h2>
                    <p className="text-zinc-300 leading-relaxed mb-6">
                        Il costo del servizio varia a seconda dell'abbonamento scelto:<br />
                        &ndash; <strong>Basic 12 mesi</strong>: 20,90€ + IVA al mese (pagamento in unica soluzione).<br />
                        &ndash; <strong>Basic 6 mesi</strong>: 25,90€ + IVA al mese (pagamento in unica soluzione).<br />
                        &ndash; <strong>Premium 12 mesi</strong>: 38,90€ + IVA al mese (pagamento in unica soluzione).<br />
                        &ndash; <strong>Premium 6 mesi</strong>: 43,90€ + IVA al mese (pagamento in unica soluzione).<br /><br />
                        I pagamenti vengono processati in modo sicuro e tracciato tramite la piattaforma <strong>Stripe</strong>. A seguito del buon esito del pagamento, il sistema abiliterà l'account e permetterà il download della Certificazione e del contratto B2B. La fatturazione elettronica verrà emessa utilizzando i dati forniti dall'utente (Partita IVA e Codice Univoco SDI). Il mancato pagamento darà diritto a PES di sospendere l'erogazione del servizio.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-6">4. Esenzione compensi SIAE/SCF e Certificato (Royalty-Free)</h2>
                    <p className="text-zinc-300 leading-relaxed mb-6">
                        La musica trasmessa su Beautify Channel è catalogata come "Royalty-Free". L'abbonamento conferisce al cliente una licenza valida ai fini dell'in-store music, esonerando totalmente l'istituto dal pagamento di ulteriori diritti alle società di gestione collettiva nazionali (quali SIAE, SCF o analoghe).<br /><br />
                        Il <strong>Certificato di Esonero</strong> (in formato PDF scaricabile dalla propria area riservata) ha valore legale <strong>esclusivamente durante il periodo di validità dell'abbonamento regolarmente pagato</strong>. In caso di scadenza, disdetta o mancato rinnovo del piano, la suddetta licenza d'uso decadrà immediatamente.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-6">5. Limitazione e Regole di Utilizzo (1 Profilo = 1 Istituto)</h2>
                    <p className="text-zinc-300 leading-relaxed mb-6">
                        Accedendo e utilizzando il servizio, accetti di non violare alcuna legge e di utilizzare la piattaforma esclusivamente per la diffusione sonora all'interno del tuo esercizio commerciale.<br /><br />
                        <strong>Importante:</strong> Ogni abbonamento sottoscritto è strettamente legato e valido per un <strong>(1) singolo istituto fisico di bellezza</strong>. È severamente vietato l'utilizzo condiviso delle stesse credenziali d'accesso (web player) per la diffusione simultanea in più punti vendita. Per le catene è necessaria l'attivazione di una licenza separata per singola sede fisica.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-6">6. Proprietà Intellettuale</h2>
                    <p className="text-zinc-300 leading-relaxed mb-6">
                        Tutti i contenuti del Sito, inclusi musica, player web, loghi e messaggi pubblicitari, sono di proprietà esclusiva di PES S.r.l. e protetti dal copyright. Nessun audio può essere scaricato e salvato offline (download) o ridistribuito all'esterno della piattaforma.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-6">7. Trattamento dei Dati e Sicurezza (Privacy Policy)</h2>
                    <p className="text-zinc-300 leading-relaxed mb-6">
                        La raccolta e il trattamento dei dati personali degli utenti avvengono nel pieno rispetto del Regolamento Generale sulla Protezione dei Dati (GDPR). Ti invitiamo a consultare attentamente la nostra Privacy e Cookie Policy, generata tramite Iubenda e disponibile nel piè di pagina (footer) del Sito, per comprendere in che modo i tuoi dati vengono gestiti e protteti.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-6">8. Limitazione di Responsabilità</h2>
                    <p className="text-zinc-300 leading-relaxed mb-6">
                        PES non sarà responsabile per eventuali danni derivanti dall'uso o dall'impossibilità di utilizzare il Sito o il Servizio, inclusi problemi tecnici imputabili alla connettività internet dell'istituto, all'hardware utilizzato per la riproduzione o a interruzioni temporanee del servizio dovute a manutenzione server.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-6">9. Durata e Recesso</h2>
                    <p className="text-zinc-300 leading-relaxed mb-6">
                        Il contratto avrà durata di 6 o 12 mesi a seconda dell'abbonamento scelto, con decorrenza dalla data di attivazione (pagamento avvenuto). Trattandosi di un abbonamento B2B con pagamento in unica soluzione pre-pagata (Upfront), non è previsto rimborso in caso di recesso anticipato rispetto alla naturale scadenza del contratto.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-6">10. Modifiche ai Termini</h2>
                    <p className="text-zinc-300 leading-relaxed mb-6">
                        PES si riserva il diritto di modificare questi Termini e Condizioni in qualsiasi momento. L'uso continuato del Servizio dopo la pubblicazione delle modifiche costituirà accettazione implicita delle stesse.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-6">11. Legge Applicabile</h2>
                    <p className="text-zinc-300 leading-relaxed mb-6">
                        Questi Termini sono regolati dalla legge italiana. Qualsiasi controversia tecnica, amministrativa o legale sarà sottoposta in via esclusiva alla giurisdizione dei tribunali italiani.
                    </p>
                </div>
            </div>
        </main>
    );
}
