# Riferimento Modelli Email (Resend) e Flusso di Upgrade

Questo documento funge da riferimento centrale per tutte le email operative (transazionali) che verranno inviate tramite Resend, nonché per la strategia raccomandata per gestire i cambi di piano in modo manuale.

---

## 📧 1. Registrazione Utente (Welcome Email)
**Quando viene inviata:** Quando un utente si registra per la prima volta sulla piattaforma.
**Oggetto:** Benvenuto su Beautify Channel! 🎉
**Contenuto suggerito:**
- **Saluto:** Ciao [Nome],
- **Messaggio:** Grazie per esserti unito a Beautify Channel! Siamo entusiasti di averti qui.
- **Call to Action (CTA):** Pulsante per "Vai alla mia Dashboard" o "Completa il mio Profilo".
- **Piè di pagina:** Supporto tecnico e contatti.

## 📧 2. Recupero Password
**Quando viene inviata:** Quando l'utente clicca su "Ho dimenticato la password".
**Oggetto:** Recupero della tua password - Beautify Channel
**Contenuto suggerito:**
- **Messaggio:** Abbiamo ricevuto una richiesta per reimpostare la password del tuo account.
- **CTA:** Pulsante sicuro "Reimposta Password" (Magic link temporaneo).
- **Avviso:** "Se non hai richiesto tu questa email, puoi ignorarla in modo sicuro."

## 📧 3. Inizio Prova Gratuita (Free Trial)
**Quando viene inviata:** Quando l'utente attiva la creazione del suo canale di prova (Free).
**Oggetto:** La tua prova gratuita su Beautify Channel è iniziata 🚀
**Contenuto suggerito:**
- **Messaggio:** Il tuo canale di prova è ora attivo e pronto per trasmettere! Hai accesso temporaneo alle nostre funzioni di base.
- **Dettagli:** Promemoria della durata della prova (es. 7 o 14 giorni).
- **CTA:** "Vai al mio Canale ora".

---

## 📧 4. Richiesta di Cambio Piano (Upgrade Request)
Dato che attualmente il processo di pagamento è manuale (senza Stripe diretto), l'utente compilerà un modulo con i propri dati di fatturazione. Questo genera **due** email automatiche.

### A. Per l'Utente (Conferma di Ricezione)
**Quando viene inviata:** Immediatamente dopo aver inviato il modulo di richiesta di Upgrade.
**Oggetto:** Abbiamo ricevuto la tua richiesta per passare a [Nome del Piano] 🌟
**Contenuto suggerito:**
- **Messaggio:** Ciao [Nome], abbiamo ricevuto correttamente i tuoi dati per effettuare l'upgrade a **[Piano Premium / Basic]**.
- **Prossimi passi:** "Il nostro team sta esaminando i tuoi dati e ti contatterà al più presto con le istruzioni di pagamento e i dettagli per procedere. Non preoccuparti, il tuo canale attuale continuerà a funzionare nel frattempo!"

### B. Per il Team / Amministratore (Avviso Interno)
**Quando viene inviata:** Contemporaneamente alla precedente.
**Oggetto:** 🔔 NUOVA RICHIESTA DI UPGRADE - [Nome dell'Utente]
**Contenuto suggerito:**
- **Messaggio:** L'utente [Nome dell'Utente] ([Email]) ha richiesto un passaggio al piano [Nome del Piano].
- **Dati di Fatturazione:** [Mostrare P.IVA/CF, Ragione Sociale, Indirizzo, ecc., raccolti nel form].
- **Azione richiesta:** Contattare il cliente per inviargli il metodo di pagamento e poi attivare il suo piano dal Pannello Admin.

## 📧 5. Conferma di Pagamento e Attivazione (Manuale)
**Quando viene inviata:** Una volta che l'amministratore convalida che il pagamento manuale (bonifico, link di pagamento esterno, ecc.) è stato ricevuto e gli abilita il livello Premium nella dashboard.
**Oggetto:** Il tuo piano [Nome del Piano] è ora attivo! 💎
**Contenuto suggerito:**
- **Messaggio:** Congratulazioni! Abbiamo confermato il tuo pagamento. Il tuo account è stato aggiornato con successo al livello **[Piano Premium / Basic]**.
- **Vantaggi:** Piccolo promemoria di ciò che ora può fare (es. Canale unico personalizzato, senza interruzioni, ecc.).
- **CTA:** "Accedi al mio nuovo Canale Premium".

---

# 🛠️ Piano Strategico Raccomandato (Flusso Manuale)

Per gestire questo processo in modo efficiente e professionale senza avere Stripe implementato direttamente nel codice per ora, ti raccomando il seguente flusso:

### 1. Interfaccia Utente (Il Modulo di Upgrade)
Crea una pagina o un modulo modale (es. `/area-riservata/upgrade`) a cui l'utente può accedere quando è `FREE_TRIAL`.
- **Cosa chiedere:** Tipo di piano desiderato (Premium, Basic), Dati Persona Fisica o Azienda (Ragione Sociale, P.IVA/CF, Indirizzo Fiscale), e un campo opzionale per "Commenti o richieste speciali per il canale".
- **UX:** Fai in modo che sia molto chiaro che *non gli verrà addebitato nulla in quel momento*, ma che si tratta di una **richiesta formale**.

### 2. Database (Supabase)
Crea una tabella chiamata `upgrade_requests`:
- `id`, `user_id`, `requested_plan` (enum: basic, premium), `billing_details` (jsonb), `status` (pending, contacted, approved, rejected), `created_at`.

### 3. Il Trigger (Server Action)
Quando l'utente invia il modulo:
1. Viene salvato il record nella tabella `upgrade_requests` con stato `pending`.
2. Vengono attivate le due email di Resend (Sezione 4A per tranquillizzare il cliente, 4B per avvisare te). *Opzionale: Se hai n8n configurato (come abbiamo visto per i lead), puoi inviare anche un WhatsApp al team admin.*

### 4. La Gestione nell'Area Admin (Il tuo Lavoro)
Nel tuo `/admin`, aggiungi una scheda **"Richieste di Upgrade"**.
- Vedrai le richieste in sospeso.
- Contatterai il cliente manualmente (via email o inviandogli un link di pagamento Stripe pre-generato da te esternamente, o i dati per il bonifico bancario).
- Puoi cambiare lo stato in `contacted`.

### 5. L'Attivazione Finale (Passaggio a Premium)
Una volta che il cliente ti conferma il pagamento e vedi i soldi:
1. Entri nell'admin, cambi il ruolo/piano dell'utente in `PREMIUM`.
2. Crei o gli assegni il suo canale finale.
3. Questo attiva (o si preme un pulsante per attivare) l'email della Sezione 5 (Attivazione).

**Perché questo piano è buono?**
- **Controllo Totale:** Essendo manuale all'inizio, eviti problemi di fatturazione automatica errata se il prodotto è ancora in fase di iterazione.
- **Relazione con il cliente:** Hai l'opportunità di offrirgli un trattamento VIP: "Ciao, ho visto che vuoi passare a Premium, ecco come fare... che musica vorresti per il tuo canale?".
- **Transizione facile:** Quando in futuro vorrai automatizzare davvero con Stripe, avrai già pronta l'UI del modulo, ti basterà cambiare il pulsante "Richiedi" con un checkout di Stripe.
