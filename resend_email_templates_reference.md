# Riferimento Modelli Email e Flusso Transazionale (Beautify Channel)

Questo documento traccia rigorosamente **tutte le email transazionali attualmente inviate in produzione** (sia tramite l'API di Resend, sia tramite Supabase Auth). Include la descrizione di quando partono, i loro oggetti, e una sezione finale con **proposte di miglioramento**.

---

## 🟢 1. Registrazione e Onboarding

### 1.1 Welcome Email & Inizio Prova Gratuita
* **File sorgente:** `src/app/api/send-welcome/route.ts`
* **Trigger:** Subito dopo che l'utente si è registrato con successo e ha completato i suoi dati.
* **Mittente:** `Beautify Channel <noreply@beautifychannel.com>`
* **Oggetto:** `Benvenuto su Beautify Channel! 🎵 La tua prova gratuita è attiva`
* **Contenuto Riepilogativo:** 
  - Saluto personalizzato (`Ciao [Nome]`).
  - Conferma dell'avvio dei 7 giorni di prova gratuita.
  - Spiegazione dei primi passi (Accedere all'area riservata, scegliere il canale, ecc.).
  - Pulsante CTA per entrare subito nell'Area Riservata.

## 🔴 2. Cron Jobs (Controllo Scadenze Abbonamenti e Prove)
*I cron jobs girano automaticamente ogni giorno per verificare la data di `trial_ends_at` e `subscription_expiration` sulle tabelle Supabase.*
* **File sorgente:** `src/app/api/cron/check-trials/route.ts`
* **Mittente:** `Beautify Channel <noreply@beautifychannel.com>`

### 2.1 Avviso: 2 Giorni alla fine della Prova Gratuita
* **Trigger:** Tracciato a 2 giorni esatti (48-72 ore) dalla fine del campo `trial_ends_at` (piano `free_trial`).
* **Oggetto:** `Mancano 2 giorni alla scadenza della prova gratuita ⏳`
* **Contenuto Riepilogativo:** Avviso ("Il tempo stringe!"). Comunica che in 48 ore scadrà l'accesso e invita l'utente ai piani a pagamento per non interrompere la musica nel salone.

### 2.2 Avviso: 1 Giorno alla fine della Prova Gratuita
* **Trigger:** Tracciato a 1 giorno esatto (24 ore) dalla fine del campo `trial_ends_at` (piano `free_trial`).
* **Oggetto:** `Manca 1 giorno alla scadenza della prova gratuita ⏰`
* **Contenuto Riepilogativo:** Avviso urgenza ("Ultimo giorno di musica!"). Suggerisce di passare a Premium per non far spegnere la musica nel salone. CTA verso il listino prezzi.

### 2.2 Scadenza Prova Gratuita (Downgrade a Free)
* **Trigger:** Quando la data in `trial_ends_at` è uguale o inferiore alla data odierna per un piano `free_trial`.
* **Oggetto:** `La tua prova è scaduta ⚠️ Riattiva Beautify Channel`
* **Contenuto Riepilogativo:** "La musica si è fermata!". Notifica che l'account è sospeso/limitato al piano Free e si invita urgentemente al rinnovo.

### 2.4 Avviso: 2 Giorni alla scadenza Abbonamento Pay
* **Trigger:** Tracciato a 2 giorni esatti (48-72 ore) prima del `subscription_expiration` (piani `basic` o `premium`).
* **Oggetto:** `Il tuo abbonamento scade tra 2 giorni ⏳ Rinnovo richiesto`
* **Contenuto Riepilogativo:** "Rinnovo in arrivo!". Invita a rinnovare in anticipo per mantenere l'esclusività dei canali e non interrompere il servizio ai clienti del centro.

### 2.5 Scadenza Abbonamento Pay (Downgrade a Free)
* **Trigger:** Quando la data `subscription_expiration` è superata e l'utente ha piano `basic` o `premium`.
* **Oggetto:** `Il tuo abbonamento è scaduto ⚠️ Riattiva Beautify Channel`
* **Contenuto Riepilogativo:** "Abbonamento Terminato!". Comunica che l'accesso ai canali è sospeso. Rinnova subito per non restare nel silenzio.

## 💰 3. Webhook Stripe (Pagamenti Avvenuti)
* **File sorgente:** `src/app/api/webhooks/stripe/route.ts`

### 3.1 Avviso Interno Admin
* **Trigger:** All'evento Stripe `checkout.session.completed`.
* **Mittente:** `Beautify Channel Pagamenti <onboarding@resend.dev>`
* **Destinatario:** `mirkocata@gmail.com`
* **Oggetto:** `🟢 PAGAMENTO RICEVUTO - Nuovo [PIANO] da [Email Cliente]`
* **Contenuto Riepilogativo:** Dettagli del cliente (ID sessione, P.IVA, SDI, Indirizzo, Durata). Avvisa l'amministratore che non c'è azione tecnica da intraprendere perché il canale si è sbloccato automaticamente.

### 3.2 Conferma per l'Utente (e Invio Documenti)
* **Trigger:** All'evento Stripe `checkout.session.completed` (subito dopo l'attivazione in Supabase del Profilo e PDF).
* **Mittente:** `Beautify Channel <onboarding@resend.dev>`
* **Oggetto:** `🎉 Pagamento Confermato! Benvenuto in [PIANO] 🌟`
* **Contenuto Riepilogativo:** 
  - Ringraziamenti e conferma di avvenuto upgrade automatico.
  - **Allegati (2 file PDF vitali):** Il "Contratto di Abbonamento" generato contestualmente, e la "Licenza Ufficiale" (Certificato Epidemic Sound). Entrambi conterranno le date di attivazione e scadenza corrette e non conterranno la firma obbligatoria.

## 🔐 4. Auth & Sicurezza
*Queste email sono attualmente gestite dalle impostazioni interne di Supabase, non dal codice sorgente esplicito con Resend, ma fanno parte del flusso.*

### 4.1 Recupero Password
* **Trigger:** L'utente preme "Ho dimenticato la password" e conferma la UI.
* **Oggetto:** *Gestito nel pannello Email Templates di Supabase* 
* **Funzionamento:** Recapita un Magic Link o Token a tempo di scadenza che riporta l'utente a `/area-riservata/profilo` per forzare il cambio password.

---

# 🚀 Proposte di Miglioramento (Roadmap Email)

Attualmente il flusso base è ben coperto. Tuttavia, per dare all'app una "veste" ancora più Premium ed Enterprise, ecco cosa ti suggerisco di implementare nel breve/medio termine:

### 1. Dominio di Produzione per il Webhook
**Problema:** Nel Webhook di Stripe in `route.ts`, per le email di conferma pagamento stiamo ancora usando `<onboarding@resend.dev>` come mittente.
**Soluzione:** Nelle impostazioni del tuo account Resend, verifica il nuovo dominio a pagamento (quando lanci) e sostituisci il mittente con `pagamenti@beautifychannel.com` o `supporto@beautifychannel.com`.

### 2. Aggiungere le React Email (Styling Avanzato)
**Problema:** Attualmente le email HTML in `send-welcome` e nei Cron Jobs sono grosse stringhe di testo iniettato nel codice JS, difficili da manutenere o abbellire visivamente senza rompere la formattazione.
**Soluzione:** Integrare la libreria **[React-Email](https://react.email/)** insieme a Resend. Questo ti permette di codificare le email come normali componenti `.tsx` compatibili col brand (con Tailwind incluso), vederne le anteprime live in sviluppo e mantenere il codice molto più pulito.

### 3. Recupero Carrelli Abbandonati (Stripe/N8N)
**Problema:** Un utente compila il modulo "Dati Fatturazione", va su Stripe ma poi chiude la tendina senza pagare. Al momento la richiesta rimane "pending" ma lui non viene ricontattato in automatico.
**Soluzione:** Aggiungere un Cron Job che rileva le `upgrade_requests` in stato "pending" da più di 24 ore. Tramite Resend, fargli arrivare un'email del tipo *"Hai dimenticato qualcosa? Completa ora il tuo upgrade e ottieni i canali musicali premium!"*. 

### 4. Fatturazione Automatica PDF
**Problema:** Noi generiamo e gli inviamo via email solo "Documenti Legali" (il Contratto di Servizio e il Certificato Exemption SIAE). Manca l'invio della vera e propria Fattura Commerciale che magari generi su un software terzo (es. Aruba, FattureInCloud).
**Soluzione:** Si può connettere il webhook di Stripe direttamente a Zapier/Make per generare anche la fattura SDI ufficiale italiana o sfruttare Stripe Invoicing se la p.iva è abilitata.

### 5. Email Personalizzata al Scattare del Mese Finale dell'Abbonamento
**Problema Il rinnovo annuale/semestrale potrebbe cogliere un business model di sorpresa.
**Soluzione:** Aggiungere al file Cron uno step `30 days warning`. Ad un mese prima della scadenza di un piano a 6-12 mesi, inviargli l'Avviso Bonario invitandolo a non aspettare l'ultimo giorno per rinnovare (magari offrendogli la possibilità di fare l'addebito automatico sul rinnovo se implementerete gli Stripe Subscriptions reali invece di sessioni di checkout "One Off").
