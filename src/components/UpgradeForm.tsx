"use client";

import { useState } from "react";
import { submitUpgradeRequest } from "@/app/actions/upgrade-actions";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function UpgradeForm({ userEmail }: { userEmail?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metriQuadriOption, setMetriQuadriOption] = useState<'0-250' | 'oltre'>('0-250');
  const [durataAbbonamento, setDurataAbbonamento] = useState<'6 mesi' | '12 mesi'>('6 mesi');
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

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
    <div
      id="upgrade-section"
      className="bg-[#1e0d36] border border-fuchsia-500/30 rounded-3xl p-6 md:p-10 my-16 shadow-2xl relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-3">
            Migliora il tuo Piano
          </h2>
          <p className="text-fuchsia-200">
            Compila questo breve modulo per richiedere il passaggio a un piano a
            pagamento. Non ti verrà addebitato nulla ora; ti contatteremo
            manualmente con il contratto e il metodo di pagamento.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          {status.type === "error" && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Selection */}
            {/* Plan Selection Area (Tabs Style) */}
            <div className="md:col-span-2 mb-2">
              <label className="block text-sm font-bold text-zinc-300 mb-2">
                Servizio richiesto<span className="text-fuchsia-500">*</span>
              </label>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 w-full mb-2">
                <label className="flex-1 relative cursor-pointer text-center">
                  <input
                    type="radio"
                    name="requested_plan"
                    value="basic"
                    className="sr-only peer"
                    required
                    defaultChecked
                  />
                  <div className="py-2.5 px-4 rounded-lg font-bold text-sm text-zinc-400 peer-checked:bg-sky-400 peer-checked:text-zinc-950 transition-all peer-checked:shadow-md">
                    Basic
                  </div>
                </label>
                <label className="flex-1 relative cursor-pointer text-center">
                  <input
                    type="radio"
                    name="requested_plan"
                    value="premium"
                    className="sr-only peer"
                  />
                  <div className="py-2.5 px-4 rounded-lg font-bold text-sm text-zinc-400 peer-checked:bg-amber-500 peer-checked:text-zinc-950 transition-all peer-checked:shadow-md">
                    Premium
                  </div>
                </label>
              </div>
            </div>

            {/* Ragione Sociale */}
            <div className="space-y-2">
              <label
                htmlFor="ragioneSociale"
                className="block text-sm font-bold text-zinc-300"
              >
                Ragione Sociale<span className="text-fuchsia-500">*</span>
              </label>
              <input
                id="ragioneSociale"
                name="ragioneSociale"
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
              />
            </div>

            {/* Partita IVA */}
            <div className="space-y-2">
              <label
                htmlFor="partitaIva"
                className="block text-sm font-bold text-zinc-300"
              >
                Partita IVA*
              </label>
              <input
                id="partitaIva"
                name="partitaIva"
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
              />
            </div>

            {/* Indirizzo istituto */}
            <div className="space-y-2">
              <label
                htmlFor="indirizzoIstituto"
                className="block text-sm font-bold text-zinc-300"
              >
                Indirizzo istituto*
              </label>
              <input
                id="indirizzoIstituto"
                name="indirizzoIstituto"
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
              />
            </div>

            {/* Nome istituto */}
            <div className="space-y-2">
              <label
                htmlFor="nomeIstituto"
                className="block text-sm font-bold text-zinc-300"
              >
                Nome istituto*
              </label>
              <input
                id="nomeIstituto"
                name="nomeIstituto"
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
              />
            </div>

            {/* Metri quadri istituto */}
            <div className="md:col-span-1 space-y-2">
              <label className="block text-sm font-bold text-zinc-300">
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
                    className="text-fuchsia-600 focus:ring-fuchsia-500 bg-white/10 border-white/20 w-4 h-4"
                  />
                  0-250
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer bg-black/40 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                  <input
                    type="radio"
                    name="metriQuadriRadio"
                    value="oltre"
                    checked={metriQuadriOption === 'oltre'}
                    onChange={() => setMetriQuadriOption('oltre')}
                    className="text-fuchsia-600 focus:ring-fuchsia-500 bg-white/10 border-white/20 w-4 h-4"
                  />
                  Oltre
                </label>
              </div>
            </div>

            {/* Durata abbonamento */}
            <div className="md:col-span-1 space-y-2">
              <label className="block text-sm font-bold text-zinc-300">
                Durata abbonamento*
              </label>
              <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <label className={`flex-1 flex flex-col items-start gap-1 p-4 rounded-xl border cursor-pointer transition-colors ${durataAbbonamento === '6 mesi' ? 'bg-fuchsia-600/20 border-fuchsia-500/50 shadow-[0_0_15px_rgba(192,38,211,0.2)]' : 'bg-black/40 border-white/10 hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2 text-white font-bold text-lg">
                    <input
                      type="radio"
                      name="durataAbbonamento"
                      value="6 mesi"
                      checked={durataAbbonamento === '6 mesi'}
                      onChange={() => setDurataAbbonamento('6 mesi')}
                      className="text-fuchsia-600 focus:ring-fuchsia-500 bg-white/10 border-white/20 w-4 h-4"
                    />
                    6 mesi
                  </div>
                  <div className={`text-xs sm:text-sm pl-6 format-cost ${durataAbbonamento === '6 mesi' ? 'text-white font-medium' : 'text-zinc-300'}`}>
                    € 25,90 / mese
                    <br />
                    <span className="text-[10px] sm:text-[11px] font-normal leading-tight hidden text-zinc-400 mt-1 block">
                      (pagamento unica soluzione)
                    </span>
                  </div>
                </label>

                <label className={`flex-1 flex flex-col items-start gap-1 p-4 rounded-xl border cursor-pointer transition-colors ${durataAbbonamento === '12 mesi' ? 'bg-fuchsia-600/20 border-fuchsia-500/50 shadow-[0_0_15px_rgba(192,38,211,0.2)]' : 'bg-black/40 border-white/10 hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2 text-white font-bold text-lg">
                    <input
                      type="radio"
                      name="durataAbbonamento"
                      value="12 mesi"
                      checked={durataAbbonamento === '12 mesi'}
                      onChange={() => setDurataAbbonamento('12 mesi')}
                      className="text-fuchsia-600 focus:ring-fuchsia-500 bg-white/10 border-white/20 w-4 h-4"
                    />
                    12 mesi
                  </div>
                  <div className={`text-xs sm:text-sm pl-6 format-cost ${durataAbbonamento === '12 mesi' ? 'text-white font-medium' : 'text-zinc-300'}`}>
                    € 20,90 / mese
                    <br />
                    <span className="text-[10px] sm:text-[11px] font-normal leading-tight hidden text-zinc-400 mt-1 block">
                      (pagamento unica soluzione)
                    </span>
                  </div>
                </label>
              </div>
            </div>
            {/* Responsabile istituto */}
            <div className="md:col-span-2 space-y-2">
              <label
                htmlFor="responsabileIstituto"
                className="block text-sm font-bold text-zinc-300"
              >
                Responsabile istituto*
              </label>
              <input
                id="responsabileIstituto"
                name="responsabileIstituto"
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
              />
            </div>

            {/* La tua email */}
            <div className="md:col-span-2 space-y-2">
              <label
                htmlFor="emailContatto"
                className="block text-sm font-bold text-zinc-300"
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
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed focus:outline-none transition-all"
              />
            </div>

            {/* Il Tuo telefono */}
            <div className="md:col-span-2 space-y-2">
              <label
                htmlFor="telefono"
                className="block text-sm font-bold text-zinc-300"
              >
                Il Tuo telefono*
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-6 px-10 rounded-xl text-lg shadow-[0_0_20px_rgba(192,38,211,0.4)] transition-all disabled:opacity-50"
            >
              {isSubmitting
                ? "Invio richiesta in corso..."
                : "Richiedi Upgrade"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
