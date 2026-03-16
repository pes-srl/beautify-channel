# Stile e Pattern UX dell'Area Riservata (Dashboard) (2026)

Questo documento descrive i pattern visivi e strutturali specifici applicati alle dashboard "Area Riservata" e "Area Riservata 2" (Premium) del progetto BeautiFy Channel.

## 1. Tema Visivo
La dashboard utilizza un'estetica "deep-space" ad alto contrasto, più drammatica rispetto alla landing page.

- **Colori Principali**:
  - `bg-[#0f0518]` (Indaco Profondo/Nero)
  - `emerald-400` / `teal-300` (Accenti per stato Trial/Free)
  - `amber-400` / `amber-300` / `orange-400` (Accenti per stato Premium/Upgrade, es. "Piano Premium", "tue promozioni", "servizi personalizzati")
  - `white` (Testo/parole chiave ad alta enfasi, es. "CANALE AUDIO PRINCIPALE", "RADICALMENTE", "BeautiFy", "Premi play sul canale principale", "Collega il tuo pc / smartphone / tablet", "casse Bluetooth")
  - `zinc-300` / `zinc-400` (Testo secondario/istruzionale)

## 2. Design dei Componenti & Layout

### 2.1 Hero Player (BasicHeroChannel)
- **Sfondi Sfumati (Gradient)**:
  - Premium: `from-amber-900 via-zinc-900 to-black`
  - Trial: `from-emerald-900 via-teal-950 to-black`
- **Gerarchia del Testo**:
  - Usa `font-black` e `text-white` per i termini chiave (es., `RADICALMENTE`) per farli risaltare sul fondo scuro.
  - Le intestazioni di benvenuto usano `uppercase`, `tracking-widest`, e un mix di testo sfumato e bianco puro.

### 2.2 Separazione dei Contenuti (Testo Istruzionale)
Quando si presentano passaggi tecnici o procedurali (es., "Come funziona"), segui queste regole:
- **Tecnica di Separazione**: Separa concetti distinti con doppi `<br />` o blocchi `<span>` multipli anziché usare lunghi paragrafi monolitici. Questo crea "respiro visivo".
- **Esempio di Flusso**:
  1. Frase ad effetto/Esclamazione (es., "Nulla di più semplice!")
  2. Azione Concreta (es., "Collega il tuo pc / smartphone / tablet all'impianto audio del tuo istituto o a delle casse Bluetooth.")
  3. Operazione Continua (es., "Premi play sul canale principale qui sopra, imposta il giusto volume in salone e **dimenticatene**, il resto lo fa **BeautiFy**.")
- **Parole d'Impatto**: Usa `strong` con `text-white` per le parti più importanti della frase (es., `BeautiFy`, `dimenticatene`, `Premi play sul canale principale`).
- **Caso d'uso: Infrastruttura**: Quando si menziona hardware come "casse Bluetooth" o "Impianto audio", usa `text-white` per rassicurare l'utente sulla compatibilità tecnica.

### 2.3 Contenuti a Comparsa (Pattern UX - Collapsible)
Per mantenere la pagina "pulita" pur fornendo le informazioni necessarie, usa il pattern `<details>` / `<summary>` per lunghi blocchi di istruzioni o griglie di contenuti secondari.

- **Intestazioni Dinamiche & Layout Iniziale**:
    - L'Intestazione di Benvenuto (Welcome Header) è ora rigorosamente **Minimalista** e di **Forte Impatto**. Presenta un `GRAZIE` molto grande e in maiuscolo (`text-5xl md:text-7xl`) in una sfumatura del brand (`from-emerald-400 to-teal-300`) come punto focale primario.
    - Sotto questo, l'intestazione "BENVENUTA NEL TUO ACCOUNT" e i metadati del Salone/Piano sono tutti **centrati** su ogni viewport per creare una "Hero Entry" simmetrica.
    - **Spaziatura**: Un margine superiore significativo (es., `mt-32 md:mt-40`) viene applicato prima del blocco di testo "Area Riservata" per separarlo dall'intestazione iniziale di benvenuto/ringraziamento, creando uno stacco visivo netto prima dei dettagli del profilo utente.

- **Ottimizzazione Logo Intestazione**:
    - Il logo di navigazione è ingrandito per una migliore presenza del brand.
    - **Altezza Desktop**: `h-[50px]`.
    - **Altezza Mobile**: `h-[52px]` (aumentata per un maggiore impatto su mobile).

- **Titoli Standard**: Usa titoli diretti e di forte impatto in **Bianco** (`text-white`), `font-black`, `uppercase`, e con una dimensione del font grande (es., `text-2xl md:text-4xl`) come "COME FUNZIONA" e "ALTRI CANALI DISPONIBILI".
- **Allineamento**: Le intestazioni per i blocchi espandibili dovrebbero essere tipicamente **allineate a sinistra** (`justify-start`, `text-left`) per mantenere un flusso di lettura coeso.
- **Pattern delle Icone**:
    - Includi un'icona contestuale a sinistra: `PlayCircle` per "COME FUNZIONA", `Radio` per "ALTRI CANALI".
    - **Dimensionamento**: Usa taglie grandi e identiche per consistenza: `w-8 h-8 md:w-10 md:h-10 shrink-0`.
    - Le icone devono essere chiaramente visibili e proporzionate ai grandi titoli testuali in maiuscolo.
    - Usa un `ChevronDown` finale da Lucide-React con una transizione di rotazione (`group-open:rotate-180`) all'interno di un contenitore stilizzato (es. `p-2 rounded-full border border-emerald-500/20 bg-emerald-500/10`).
- **Animazione**: Il contenuto dovrebbe usare una dissolvenza in entrata verticale (`animate-in fade-in slide-in-from-top-8 duration-500`).
- **Superficie**: Usa `backdrop-blur-md` o `backdrop-blur-xl` e `border-white/10` per il contenitore per abbinarlo all'estetica della dashboard.
- Per le griglie di contenuti, il summary può essere stilizzato come una "pillola" inline o "bottone" usando `bg-white/[0.02]`, `rounded-[2rem]`, e `backdrop-blur-md`.

## 3. Trucchi di Implementazione UI

### 3.1 Gestione dei Bordi Immagine "Integrati"
Se un asset (PNG) ha un bordo nero non voluto che non corrisponde ai contenitori arrotondati o agli sfondi:
- **Soluzione Scaling**: Applica `scale-[1.15]` (o superiore) e assicurati che il genitore abbia `overflow-hidden` e `rounded-3xl`.
- **Ragionamento**: Questo "zooma" nell'immagine, spingendo il finto bordo fuori dall'inquadratura e lasciando che l'angolo arrotondato definito dal CSS lo tagli perfettamente.

### 3.2 UI di Selezione Premium (Form Tabs)
- **Stato di Selezione**: Usa `bg-amber-400` e `text-zinc-950` con un bagliore (glow) associato per le tab attive dei piani "Premium": `shadow-[0_0_15_rgba(251,191,36,0.3)]`.
- **Stile dei Pulsanti**: I pulsanti dovrebbero preferire `text-white` per un'alta leggibilità, specialmente quando il fondo del bottone è un colore vivace del brand come `#AB7169`.

## 4. Sequenza di Benvenuto (UX)
- **Il "Welcome" di Impatto**:
  - Usa un `GRAZIE` maiuscolo molto grande (text-5xl md:text-7xl) in un gradiente del brand (`from-emerald-400 to-teal-300`) come punto focale primario della pagina.
  - Posizionalo direttamente sopra l'intestazione secondaria "BENVENUTA NEL TUO ACCOUNT". Tutti gli elementi, inclusi il logo e i fregi di sfondo, devono essere centrati orizzontalmente.
  - **Minimalismo**: Rimuovi testi secondari che costruiscono fiducia (es., "grazie per la fiducia", "consiglio: diffondi l'audio") per mantenere il focus sull'impatto del benvenuto.

- **Allineamento dei Metadati Informativi**:
  - Il titolo della pagina "Area Riservata", Nome Salone, e Badge del Piano in `area-riservata/page.tsx` sono ora **centrati** (`justify-center`, `items-center`) al fine di matcharsi con la simmetria della hero.
  - **Spazio di Respiro Verticale**: Applica un margine grande (`mt-32 md:mt-40`) sopra l'intestazione "Area Riservata" per separare la sequenza di benvenuto dalla sezione principale di gestione del profilo.

- **Sincronizzazione Dinamica del Trial**:
  - Non inserire "hardcoded" le stringhe della durata del trial (es., "7 giorni"). Invece, legale a una variabile calcolata come `daysLeft`.
  - Usa logiche di pluralizzazione per la stringa: `{daysLeft} {daysLeft === 1 ? 'giorno' : 'giorni'}`.
  - Aumenta la dimensione e il peso del font (`font-black`) per il numero di giorni nei banner di trial, per assicurare un'alta visibilità.

## 5. Metadati per Sviluppatori
- **Ricerca di Contesto**: Usa parole chiave come "Area Riservata 2", "Upgrade Form", "Premium Suggestions", "Radio Live Waveform", "Collapsible Sections".
- **File Correlati**:
  - `src/app/area-riservata/page.tsx`
  - `src/app/area-riservata-2/page.tsx`
  - `src/components/draft2026/UpgradeFormTrial2.tsx`
  - `src/components/player/BasicHeroChannel.tsx` (e `BasicHeroChannel2.tsx`)
  - `src/components/homepagenew/HeaderNew.tsx`
