# Phase 2: Email Automation (Resend)

## Obiettivo 🎯
Inviare e-mail automatiche transazionali ai nuovi utenti iscritti al Free Trial per farli sentire accolti e guidarli all'acquisto.

## 1. La "Welcome Email" (Oggi)
Questa è l'email che parte *immediatamente* non appena un utente si iscrive con successo dal modulo `/provagratis`.

**Contenuto:**
- Benvenuto ufficiale in "Beautify Channel".
- Riepilogo: "La tua prova in HD gratuita di 7 giorni è ufficialmente attiva!"
- Call to Action: "Vai alla tua Area Riservata" (che linkerà a `/area-riservata`).

**Come lo implementiamo:**
Aggiungeremo una chiamata API a `Resend` direttamente dentro la funzione `handleSignup` in `src/app/provagratis/page.tsx` (o in una Next.js Server Action dedicata per maggiore sicurezza, nascondendo la tua API Key).

## 2. Le "Expiration Emails" (Nei prossimi giorni / Cron Jobs)
Queste richiederanno l'impostazione di script ricorrenti.
- **Avviso (Giorno 6):** "Attenzione, la tua prova scade domani. Non far spegnere la musica nel tuo salone."
- **Scadenza (Giorno 7+):** "La tua prova è scaduta. Clicca qui per sbloccare di nuovo il piano Basic o Premium."
-----------------------

## Prossimi Passi Tecnici
1. Assicurarsi di avere la variabile `RESEND_API_KEY` dentro il file `.env.local`.
2. Creare una API Route (es. `src/app/api/send-welcome/route.ts`) sicura.
3. Creare il Template grafico della mail usando Tailwind/React Email.
4. Collegare il modulo `/provagratis` all'invio.
