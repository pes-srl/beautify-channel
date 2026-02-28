# 📻 Beautify Channel - Radio & Abbonamenti (Reference)

Questo documento serve come riferimento centrale per tutti i canali radio disponibili e le regole di accesso per ogni piano di abbonamento.

## 🎶 Elenco Canali Radio

Ecco la lista ufficiale e aggiornata dei canali musicali di Beautify:

1. **RELAX**
2. **LOUNGE**
3. **JAZZ**
4. **AMBIENT MASSAGE**
5. **ACOUSTIC VOCAL**
6. **DEEP SOFT**

*(Nota: in futuro possiamo aggiungere qui anche il Basic Channel, Laser Channel, Cosmetic Channel o Premium menzionati in precedenza, se sono ancora validi).*

---

## 🔒 Regole di Accesso (Condizioni)

Quale piano può ascoltare cosa? Ecco le logiche che andremo a programmare nel sistema per bloccare/sbloccare i player:

### Piano `free_trial` (7 Giorni)
- **Accesso:** Totale ai 6 canali principali.
- **Canali sbloccati:** Relax, Lounge, Jazz, Ambient Massage, Acoustic Vocal, Deep Soft.
- **Note:** Dopo i 7 giorni scadrà e perderà l'accesso se non acquista un piano.

### Piano `basic`
- **Accesso:** Totale ai 6 canali principali.
- **Canali sbloccati:** Relax, Lounge, Jazz, Ambient Massage, Acoustic Vocal, Deep Soft.

### Piano `premium`
- **Accesso:** *(Da definire con te)* - Ma di norma avrà accesso a tutti i canali del Basic + Canali esclusivi (es. "Premium", "Laser Channel", "Cosmetic Channel").

### Piano `free`
- **Accesso:** Nessun canale o solo un canale "Demo" di benvenuto? *(Da definire)*.

---

> **Da sviluppatore a te:** 
> Nel prossimo futuro andremo a scrivere una funzione React che controllerà in automatico if `user.plan_type === 'basic'` allora mostra solo questi 6 bottoni. Terremo questo documento sempre aggiornato con le tue decisioni di marketing!
