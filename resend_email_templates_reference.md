# Riferimento Modelli Email e Flusso Transazionale (Beautify Channel)

Questo documento traccia rigorosamente **tutte le email transazionali attualmente inviate in produzione** tramite l'API di Resend. Include la descrizione di quando partono, i loro oggetti, e certifica l'utilizzo del dominio verificato.

---

## 🟢 1. Configurazione Globale (Dominio Verificato)
**Tutte** le email in uscita dal sistema ora utilizzano il dominio di produzione verificato tramite la variabile d'ambiente di Vercel:
`process.env.RESEND_FROM_EMAIL || 'Beautify Channel <info@beautify-channel.com>'`

Nessuna email utilizza più l'indirizzo di test `@resend.dev`.

---

## 🟢 2. Registrazione e Onboarding

### 2.1 Welcome Email & Inizio Prova Gratuita
* **File sorgente:** `src/app/api/send-welcome/route.ts`
* **Trigger:** Subito dopo che l'utente si è registrato con successo e ha completato i suoi dati dal form in Homepage.
* **Oggetto:** `Benvenuto su Beautify Channel! 🎵 La tua prova gratuita è attiva`
* **Stato:** ✅ **FUNZIONANTE SU VERCEL**
* **Contenuto Riepilogativo:** 
  - Saluto personalizzato (`Ciao [Nome]`).
  - Conferma dell'avvio dei 7 giorni di prova gratuita.
  - Spiegazione dei primi passi (Accedere all'area riservata, scegliere il canale, ecc.).
  - Pulsante CTA per entrare subito nell'Area Riservata.

---

## 🔴 3. Cron Jobs (Controllo Scadenze Abbonamenti e Prove)
*I cron jobs girano automaticamente ogni giorno per verificare la data di `trial_ends_at` e `subscription_expiration` sulle tabelle Supabase.*
* **File sorgente:** `src/app/api/cron/check-trials/route.ts`

### 3.1 Avviso: 2 Giorni alla fine della Prova Gratuita
* **Trigger:** Tracciato a 2 giorni dalla fine del campo `trial_ends_at` (piano `free_trial`).
* **Oggetto:** `Mancano 2 giorni alla scadenza della prova gratuita ⏳`
* **Stato:** ✅ **FUNZIONANTE SU VERCEL**

### 3.2 Avviso: 1 Giorno alla fine della Prova Gratuita
* **Trigger:** Tracciato a 1 giorno dalla fine del campo `trial_ends_at` (piano `free_trial`).
* **Oggetto:** `Manca 1 giorno alla scadenza della prova gratuita ⏰`
* **Stato:** ✅ **FUNZIONANTE SU VERCEL**

### 3.3 Scadenza Prova Gratuita (Downgrade a Free)
* **Trigger:** Quando la data in `trial_ends_at` è superata o uguale a oggi per un `free_trial`.
* **Oggetto:** `La tua prova è scaduta ⚠️ Riattiva Beautify Channel`
* **Stato:** ✅ **FUNZIONANTE SU VERCEL**

### 3.4 Avviso: 2 Giorni alla scadenza Abbonamento Basic/Premium
* **Trigger:** Tracciato a 2 giorni dal `subscription_expiration` (piani a pagamento).
* **Oggetto:** `Il tuo abbonamento scade tra 2 giorni ⏳ Rinnovo richiesto`
* **Stato:** ✅ **FUNZIONANTE SU VERCEL**

### 3.5 Scadenza Abbonamento Basic/Premium (Downgrade a Free)
* **Trigger:** Quando la data `subscription_expiration` è superata (piani a pagamento).
* **Oggetto:** `Il tuo abbonamento è scaduto ⚠️ Riattiva Beautify Channel`
* **Stato:** ✅ **FUNZIONANTE SU VERCEL**

---

## 💰 4. Webhook Stripe (Pagamenti Avvenuti)
*Le ricevute e le email post-pagamento partono automaticamente non appena Stripe conferma la transazione.*
* **File sorgente:** `src/app/api/webhooks/stripe/route.ts`

### 4.1 Avviso Interno Admin (Notifica Nuova Vendita)
* **Trigger:** All'evento Stripe `checkout.session.completed`.
* **Destinatario:** L'amministratore (configurabile).
* **Oggetto:** `🟢 PAGAMENTO RICEVUTO - Nuovo [PIANO] da [Email Cliente]`
* **Stato:** ✅ **FUNZIONANTE SU VERCEL**
* **Contenuto Riepilogativo:** Dettagli del cliente (P.IVA, Indirizzo, Durata). Avvisa l'amministratore dell'incasso.

### 4.2 Conferma per l'Utente (e Invio Documenti PDF)
* **Trigger:** All'evento Stripe `checkout.session.completed` (dopo l'attivazione in Supabase del Profilo e la generazione in background dei PDF).
* **Oggetto:** `🎉 Pagamento Confermato! Benvenuto in [PIANO] 🌟`
* **Stato:** ✅ **FUNZIONANTE SU VERCEL**
* **Contenuto Riepilogativo:** 
  - Ringraziamenti e conferma di avvenuto upgrade automatico.
  - **Allegati (2 file PDF vitali):** Il "Contratto di Abbonamento" generato contestualmente, e la "Licenza Ufficiale" (Certificato Epidemic Sound). I certificati non necessitano di firma.

---

## 🔐 5. Prossimi Passi Consigliati
1. **Recupero Carrelli Abbandonati:** Creare un'email automatica per chi richiede l'Upgrade ma non paga su Stripe.
2. **Template React Email:** Convertire tutte queste email in componenti React per un design ancora più premium (attualmente usano semplice HTML in linea).
