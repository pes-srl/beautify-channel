"use client";

import { useState } from "react";
import { submitUpgradeRequest } from "@/app/actions/upgrade-actions";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Heart } from "lucide-react";
import { UpgradeFormBasic } from "./UpgradeFormBasic";

export function UpgradeFormTrial({ userEmail }: { userEmail?: string }) {
  const [showPremiumForm, setShowPremiumForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestedPlan = 'basic';
  const [metriQuadriOption, setMetriQuadriOption] = useState<'0-250' | 'oltre'>('0-250');
  const [durataAbbonamento, setDurataAbbonamento] = useState<'6 mesi' | '12 mesi'>('6 mesi');
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const getMonthlyPrice = () => {
    return durataAbbonamento === '6 mesi' ? 25.90 : 20.90;
  };

  const getMonths = () => {
    return durataAbbonamento === '6 mesi' ? 6 : 12;
  };

  const totalPrice = (getMonthlyPrice() * getMonths()).toFixed(2).replace('.', ',');

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const result = await submitUpgradeRequest(formData);

    if (result.error) {
      setStatus({ type: "error", message: result.error });
    } else {
      setStatus({
        type: "success",
        message: result.message || "Richiesta inviata con successo.",
      });
      // Opcional: limpiar el formulario aquí si tuvieras refs
    }

    setIsSubmitting(false);
  }

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(1);
  };

  if (showPremiumForm) {
    return <UpgradeFormBasic userEmail={userEmail} onBack={() => setShowPremiumForm(false)} />;
  }

  if (status.type === "success") {
    return (
      <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-2xl p-8 text-center mt-6">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">
          Richiesta Ricevuta!
        </h3>
        <p className="text-emerald-100">{status.message}</p>
        <p className="text-emerald-200/70 text-sm mt-4">
          Il nostro team esaminerà i tuoi dati e ti invierà al più presto
          un'e-mail con il contratto e il link per il pagamento sicuro.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        id="upgrade-section"
        className="bg-gradient-to-br from-[#061e16] to-[#010906] border border-emerald-500/30 rounded-3xl p-6 md:p-10 my-16 shadow-2xl relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold font-[family-name:var(--font-montserrat)] text-white mb-3 uppercase tracking-wide">
              MIGLIORA IL TUO PIANO
            </h2>
            <div className="text-zinc-200 text-lg font-light font-[family-name:var(--font-montserrat)] mt-4 leading-relaxed bg-black/20 p-6 rounded-2xl border border-emerald-500/20 shadow-inner max-w-2xl mx-auto">
              <p className="mb-3">
                Conclusa la tua prova gratuita di 7 giorni, puoi scegliere il nostro <strong className="text-white font-semibold">abbonamento Basic</strong>. Questi sono i dati base che ci servono.
              </p>
              <p className="text-zinc-300 text-base">
                Se invece desideri l'abbonamento Premium con le Promo Sonore Personalizzate dei tuoi servizi, clicca qui: <strong onClick={() => setShowPremiumForm(true)} className="text-amber-400 font-bold underline cursor-pointer hover:text-amber-300">PREMIUM</strong><br /><br />
                Grazie<br />
                <span className="italic opacity-80">BeautiFy Staff</span>
              </p>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-6">
            {status.type === "error" && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{status.message}</p>
              </div>
            )}

            <div className="overflow-hidden relative w-full">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: currentStep === 1 ? 'translateX(0)' : 'translateX(-100%)' }}
              >
                {/* STEP 1: Dati Istituto */}
                <div id="step-1-container" className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 gap-6 p-1">

                  {/* Plan Selection hidden */}
                  <input type="hidden" name="requested_plan" value="basic" />

                  {/* Durata abbonamento */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300">
                      Durata abbonamento*
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 mb-2">
                      <label className={`flex-1 flex flex-col items-start gap-1 p-4 rounded-xl border cursor-pointer transition-colors ${durataAbbonamento === '6 mesi' ? 'bg-emerald-600/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-black/40 border-white/10 hover:bg-white/5'}`}>
                        <div className="flex items-center gap-2 text-white font-bold text-lg">
                          <input
                            type="radio"
                            name="durataAbbonamento"
                            value="6 mesi"
                            checked={durataAbbonamento === '6 mesi'}
                            onChange={() => setDurataAbbonamento('6 mesi')}
                            className="text-emerald-600 focus:ring-emerald-500 bg-white/10 border-white/20 w-4 h-4"
                          />
                          6 mesi
                        </div>
                        <div className={`text-xs sm:text-sm pl-6 format-cost ${durataAbbonamento === '6 mesi' ? 'text-white font-medium' : 'text-zinc-300'}`}>
                          € 25,90 / mese
                          <br />
                          <span className="text-[10px] sm:text-[11px] font-normal leading-tight text-white mt-1 block">
                            Unica Soluzione
                          </span>
                        </div>
                      </label>

                      <label className={`flex-1 flex flex-col items-start gap-1 p-4 rounded-xl border cursor-pointer transition-colors ${durataAbbonamento === '12 mesi' ? 'bg-emerald-600/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-black/40 border-white/10 hover:bg-white/5'}`}>
                        <div className="flex items-center gap-2 text-white font-bold text-lg">
                          <input
                            type="radio"
                            name="durataAbbonamento"
                            value="12 mesi"
                            checked={durataAbbonamento === '12 mesi'}
                            onChange={() => setDurataAbbonamento('12 mesi')}
                            className="text-emerald-600 focus:ring-emerald-500 bg-white/10 border-white/20 w-4 h-4"
                          />
                          12 mesi
                        </div>
                        <div className={`text-xs sm:text-sm pl-6 format-cost ${durataAbbonamento === '12 mesi' ? 'text-white font-medium' : 'text-zinc-300'}`}>
                          € 20,90 / mese
                          <br />
                          <span className="text-[10px] sm:text-[11px] font-normal leading-tight text-white mt-1 block">
                            Unica Soluzione
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Nome istituto */}
                  <div className="md:col-span-2 space-y-2">
                    <label
                      htmlFor="nomeIstituto"
                      className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                    >
                      Nome istituto*
                    </label>
                    <input
                      id="nomeIstituto"
                      name="nomeIstituto"
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {/* Indirizzo istituto diviso */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300">
                      Indirizzo istituto*
                    </label>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-10">
                        <input
                          name="indirizzoVia"
                          type="text"
                          placeholder="Via/Piazza"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <input
                          name="indirizzoCivico"
                          type="text"
                          placeholder="N°"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                      </div>
                      <div className="col-span-6 md:col-span-3">
                        <input
                          name="indirizzoCap"
                          type="text"
                          placeholder="CAP"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                      </div>
                      <div className="col-span-8 md:col-span-7">
                        <input
                          name="indirizzoCitta"
                          type="text"
                          placeholder="Città"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <input
                          name="indirizzoProvincia"
                          type="text"
                          placeholder="Pr(Mi)"
                          required
                          maxLength={2}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Metri quadri istituto */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300">
                      Metri quadri istituto*
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 mb-2">
                      <label className="flex items-center gap-2 text-white cursor-pointer bg-black/40 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                        <input
                          type="radio"
                          name="metriQuadriRadio"
                          value="0-250"
                          checked={metriQuadriOption === '0-250'}
                          onChange={() => setMetriQuadriOption('0-250')}
                          className="text-emerald-600 focus:ring-emerald-500 bg-white/10 border-white/20 w-4 h-4"
                        />
                        0-250 mq
                      </label>
                      <label className="flex items-center gap-2 text-white cursor-pointer bg-black/40 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                        <input
                          type="radio"
                          name="metriQuadriRadio"
                          value="oltre"
                          checked={metriQuadriOption === 'oltre'}
                          onChange={() => setMetriQuadriOption('oltre')}
                          className="text-emerald-600 focus:ring-emerald-500 bg-white/10 border-white/20 w-4 h-4"
                        />
                        Oltre 250 mq
                      </label>
                    </div>
                  </div>

                  {/* Responsabile istituto */}
                  <div className="md:col-span-2 space-y-2">
                    <label
                      htmlFor="responsabileIstituto"
                      className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                    >
                      Responsabile istituto*
                    </label>
                    <input
                      id="responsabileIstituto"
                      name="responsabileIstituto"
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {/* Pulsante Avanti */}
                  <div className="md:col-span-2 pt-4 flex justify-end w-full">
                    <Button
                      onClick={handleNextStep}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold font-[family-name:var(--font-montserrat)] py-6 px-10 rounded-xl text-lg transition-all border border-white/10"
                    >
                      Prosegui &rarr;
                    </Button>
                  </div>
                </div>

                {/* STEP 2: Fatturazione & Contatti */}
                <div id="step-2-container" className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 gap-6 p-1">

                  {/* Ragione Sociale */}
                  <div className="md:col-span-2 space-y-2">
                    <label
                      htmlFor="ragioneSociale"
                      className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                    >
                      Ragione Sociale*
                    </label>
                    <input
                      id="ragioneSociale"
                      name="ragioneSociale"
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {/* Partita IVA / CF */}
                  <div className="space-y-2">
                    <label
                      htmlFor="partitaIva"
                      className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                    >
                      CF - Partita IVA*
                    </label>
                    <input
                      id="partitaIva"
                      name="partitaIva"
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {/* Codice Destinatario/SDI */}
                  <div className="space-y-2">
                    <label
                      htmlFor="codiceSdi"
                      className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                    >
                      Codice Destinatario/SDI
                    </label>
                    <input
                      id="codiceSdi"
                      name="codiceSdi"
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {/* La tua email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="emailContatto"
                      className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                    >
                      La tua email*
                    </label>
                    <input
                      id="emailContatto"
                      name="emailContatto"
                      type="email"
                      required
                      readOnly
                      defaultValue={userEmail || ""}
                      className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-zinc-300 cursor-not-allowed focus:outline-none transition-all"
                    />
                  </div>

                  {/* Il Tuo telefono */}
                  <div className="space-y-2">
                    <label
                      htmlFor="telefono"
                      className="block text-base font-semibold font-[family-name:var(--font-montserrat)] text-zinc-300"
                    >
                      Il Tuo telefono*
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {/* Box Totale da saldare */}
                  <div className="md:col-span-2 mt-4 mb-2 flex flex-col md:flex-row justify-center items-stretch gap-6 text-center">
                    
                    {/* Switcher 6/12 mesi (DUPLICATO) */}
                    <div className="flex flex-col gap-3 w-full max-w-[200px] justify-center">
                      <label className={`cursor-pointer px-4 py-3 rounded-xl transition-all border font-semibold flex items-center justify-center gap-2 ${durataAbbonamento === '6 mesi' ? 'bg-fuchsia-600/30 border-fuchsia-400 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)]' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
                        <input type="radio" name="durataAbbonamentoStep2" value="6 mesi" checked={durataAbbonamento === '6 mesi'} onChange={() => setDurataAbbonamento('6 mesi')} className="hidden" />
                        <div className={`w-3 h-3 rounded-full border border-fuchsia-400 ${durataAbbonamento === '6 mesi' ? 'bg-fuchsia-400' : 'bg-transparent'}`}></div>
                        6 mesi
                      </label>
                      <label className={`cursor-pointer px-4 py-3 rounded-xl transition-all border font-semibold flex items-center justify-center gap-2 ${durataAbbonamento === '12 mesi' ? 'bg-fuchsia-600/30 border-fuchsia-400 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)]' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
                        <input type="radio" name="durataAbbonamentoStep2" value="12 mesi" checked={durataAbbonamento === '12 mesi'} onChange={() => setDurataAbbonamento('12 mesi')} className="hidden" />
                        <div className={`w-3 h-3 rounded-full border border-fuchsia-400 ${durataAbbonamento === '12 mesi' ? 'bg-fuchsia-400' : 'bg-transparent'}`}></div>
                        12 mesi
                      </label>
                    </div>

                    <div className="bg-black/30 border border-fuchsia-400/20 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_15px_rgba(232,121,249,0.1)] flex flex-col justify-center">
                      <p className="text-white font-semibold mb-1 uppercase tracking-wider text-sm font-[family-name:var(--font-montserrat)]">{durataAbbonamento === '6 mesi' ? 'Totale complessivo 6 mesi' : 'Totale complessivo 12 mesi'}</p>
                      <p className="font-bold mb-3 uppercase tracking-wide text-fuchsia-300">Piano Basic</p>
                      <p className="text-4xl font-bold font-[family-name:var(--font-montserrat)] text-fuchsia-300"><span className="text-3xl font-medium pr-1">€</span>{totalPrice}</p>
                      <p className="text-base text-white mt-3 font-semibold">*{getMonths()} mesi a € {getMonthlyPrice().toFixed(2).replace('.', ',')} / mese</p>
                      <p className="text-sm text-fuchsia-200 mt-2 italic font-medium">I prezzi sono da considerarsi IVA esclusa</p>
                    </div>
                  </div>

                  {/* Pulsanti Step 2 */}
                  <div className="md:col-span-2 pt-4 flex flex-col-reverse md:flex-row justify-between w-full gap-4">
                    <Button
                      onClick={handlePrevStep}
                      type="button"
                      className="bg-transparent hover:bg-white/5 text-white font-semibold py-6 px-6 md:px-10 rounded-xl transition-all border border-white/10"
                    >
                      &larr; Indietro
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-teal-300 to-teal-100 hover:from-teal-200 hover:to-white text-teal-950 font-bold font-[family-name:var(--font-montserrat)] py-6 px-6 md:px-10 rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all disabled:opacity-50 border-none flex-1 md:flex-none text-lg"
                    >
                      {isSubmitting
                        ? "Invio in corso..."
                        : "Richiedi Upgrade"}
                    </Button>
                  </div>

                </div>
              </div>
            </div>
          </form>

          {/* GRAZIE Section */}
          <div className="mt-16 text-center relative flex flex-col items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-600/20 blur-[50px] rounded-full pointer-events-none" />
            <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-[family-name:var(--font-montserrat)] tracking-[0.2em] md:tracking-[0.4em] uppercase mb-2 relative z-10">
              GRAZIE
            </h3>
            <p className="text-emerald-200/50 text-sm md:text-base flex items-center justify-center gap-2 relative z-10 font-medium">
              <Heart className="w-4 h-4 text-emerald-400/70 fill-emerald-400/20" />
              Il giusto mood fa la differenza in istituto
              <Heart className="w-4 h-4 text-emerald-400/70 fill-emerald-400/20" />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
