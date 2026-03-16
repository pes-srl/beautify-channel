const fs = require('fs');
const path = './src/app/area-riservata/page.tsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Replace the Background from zinc-950 to #0f0518
content = content.replace(
    /bg-zinc-950 pointer-events-none/g,
    'bg-[#0f0518] pointer-events-none'
);
content = content.replace(
    /pb-32 min-h-screen relative w-full/g,
    'pb-32 min-h-screen relative w-full bg-[#0f0518]'
);

// 2. Replace the old DYNAMIC WELCOME BANNER to the end of the INFO BLOCK INNOVATIVO
const startMarker = '{/* DYNAMIC WELCOME BANNER BASED ON PLAN */}';
const endMarker = 'ALTRI CANALI DISPONIBILI\n                                </h3>\n                            </div>\n                        )}';

const newUI = `{/* 1. DYNAMIC WELCOME BANNER (THE "GRAZIE" HERO) */}
                {!isAdmin && profile?.plan_type && !isExpired && (
                    <div className="w-full mt-32 md:mt-40 mb-20 flex flex-col items-center justify-center text-center">
                        <h1 className={\`text-5xl md:text-7xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-br \${profile.plan_type === 'free_trial' ? 'from-emerald-400 to-teal-300' : 'from-amber-400 to-amber-200'} mb-4 drop-shadow-lg\`}>
                            GRAZIE
                        </h1>
                        <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] font-[family-name:var(--font-montserrat)] text-white mb-6 uppercase">
                            Benvenuta nel tuo account
                        </h2>
                        
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-xl md:text-2xl font-bold text-white">
                                {profile?.salon_name || user.email}
                            </span>
                            <div className="flex bg-white/5 border border-white/10 rounded-full px-4 py-1.5 items-center gap-2 backdrop-blur-sm">
                                <span className={\`w-2 h-2 rounded-full animate-pulse \${profile.plan_type === 'free_trial' ? 'bg-emerald-400' : 'bg-amber-400'}\`} />
                                <span className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                                    {profile.plan_type === 'free_trial' ? \`Trial: \${daysLeft} \${daysLeft === 1 ? 'giorno' : 'giorni'} rimanenti\` : \`Piano: Premium\`}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* MAIN CONTENT V2 */}
                {(!isExpired || isAdmin) ? (
                    <>
                        {/* THE HERO PLAYER */}
                        <div className="mb-0 flex flex-col items-center">
                             <BasicHeroChannel2
                                planType={profile?.plan_type}
                                channel={channels?.find((c: any) =>
                                    profile?.plan_type === 'premium'
                                        ? (c.name.toLowerCase().includes('premium') || c.name.toLowerCase() === 'beautify channel premium')
                                        : (c.name.toLowerCase().includes('basic') || c.name.toLowerCase() === 'beautify channel basic')
                                ) || null}
                            />
                        </div>

                        {/* ACCORDIONS */}
                        <div className="w-full max-w-6xl mx-auto mt-6 mb-24 px-4">
                            {/* COME FUNZIONA ACCORDION */}
                            <details className="group mb-4 marker:content-['']">
                                <summary className="flex items-center justify-between cursor-pointer list-none bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md border border-white/5 rounded-[2rem] p-4 pr-6 transition-all duration-300 w-full md:w-3/4 mx-auto select-none">
                                    <div className="flex items-center gap-3 md:gap-5">
                                        <div className="p-3 bg-white/5 rounded-full shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8 text-white fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                        <span className="text-white font-black uppercase text-xl md:text-3xl tracking-widest">COME FUNZIONA</span>
                                    </div>
                                    <div className={\`p-2 rounded-full border \${profile?.plan_type === 'premium' ? 'border-amber-500/20 bg-amber-500/10' : 'border-emerald-500/20 bg-emerald-500/10'}\`}>
                                        <ArrowDown className={\`w-5 h-5 transition-transform duration-300 group-open:rotate-180 \${profile?.plan_type === 'premium' ? 'text-amber-400' : 'text-emerald-400'}\`} />
                                    </div>
                                </summary>
                                <div className="overflow-hidden mt-4 animate-in fade-in slide-in-from-top-4 duration-500 w-full md:w-3/4 mx-auto">
                                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 text-lg md:text-xl font-light leading-relaxed text-zinc-300">
                                        <p className="mb-6">Nulla di più semplice!<br /><br />
                                        Collega il tuo pc / smartphone / tablet all'<strong className="text-white">impianto audio</strong> del tuo istituto o a delle <strong className="text-white">casse Bluetooth</strong>.</p>
                                        
                                        <p className="mb-6">Premi play sul canale principale qui sopra, imposta il giusto volume in salone e <strong className="text-white">dimenticatene</strong>, il resto lo fa <strong className="text-white">BeautiFy</strong>.</p>
                                        
                                        <div className={\`pl-6 border-l-2 \${profile?.plan_type === 'premium' ? 'border-amber-500/30' : 'border-emerald-500/30'}\`}>
                                            <p>I nostri canali audio propongono una <strong className="text-white">raffinata selezione di diversi generi musicali</strong>, intervallata da <strong className="text-white">eleganti, delicati e generici suggerimenti vocali</strong>.</p>
                                            <p className="mt-4">Studiati per <strong className="text-white">stimolare la curiosità</strong> delle tue clienti e l'<strong className="text-white">acquisto dei tuoi servizi</strong>.</p>
                                        </div>
                                    </div>
                                </div>
                            </details>

                            {/* ALTRI CANALI ACCORDION */}
                            <details className="group marker:content-['']">
                                <summary className="flex items-center justify-between cursor-pointer list-none bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md border border-white/5 rounded-[2rem] p-4 pr-6 transition-all duration-300 w-full md:w-3/4 mx-auto select-none">
                                    <div className="flex items-center gap-3 md:gap-5">
                                        <div className="p-3 bg-white/5 rounded-full shrink-0">
                                            <Radio className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                        </div>
                                        <span className="text-white font-black uppercase text-xl md:text-3xl tracking-widest">ALTRI CANALI</span>
                                    </div>
                                    <div className={\`p-2 rounded-full border \${profile?.plan_type === 'premium' ? 'border-amber-500/20 bg-amber-500/10' : 'border-emerald-500/20 bg-emerald-500/10'}\`}>
                                        <ArrowDown className={\`w-5 h-5 transition-transform duration-300 group-open:rotate-180 \${profile?.plan_type === 'premium' ? 'text-amber-400' : 'text-emerald-400'}\`} />
                                    </div>
                                </summary>
                                <div className="overflow-hidden mt-4 animate-in fade-in slide-in-from-top-4 duration-500 w-full md:w-3/4 mx-auto">
                                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 relative">
                                        <div className={\`absolute -top-4 -right-4 text-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl rotate-12 transition-transform \${profile?.plan_type === 'premium' ? 'bg-amber-600 shadow-amber-900/50' : 'bg-emerald-600 shadow-emerald-900/50'}\`}>
                                            <span className="font-black text-2xl">+6</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">Cambia il tuo Mood</h3>
                                        <p className="text-lg md:text-xl text-zinc-300 font-light mb-8">
                                            Qui sotto, hai a disposizione altri 6 canali settoriali, per cambiare il tuo mood musicale in istituto durante la giornata.
                                        </p>
                                        <div className="bg-black/30 p-5 rounded-3xl border border-white/5 space-y-4">
                                            <p className="text-zinc-300 text-base md:text-lg">
                                                Anche questi canali contengono <span className="text-white italic">morbidi suggerimenti vocali</span> tranne <strong className="bg-white/10 text-white px-2 py-0.5 rounded-md align-middle mx-1 text-sm font-semibold">RELAX</strong> e <strong className="bg-white/10 text-white px-2 py-0.5 rounded-md align-middle mx-1 text-sm font-semibold">MASSAGE</strong>.
                                            </p>
                                            <p className="text-zinc-300 text-base md:text-lg">
                                                Rilassati con <strong className="bg-zinc-800 text-white px-2 py-0.5 rounded-md align-middle mx-1 text-sm font-semibold">DEEP SOFT</strong> nel weekend o del <strong className="bg-zinc-800 text-white px-2 py-0.5 rounded-md align-middle mx-1 text-sm font-semibold">JAZZ</strong> a fine giornata.
                                            </p>
                                        </div>
                                        <div className="pt-6 mt-6 border-t border-white/5">
                                            <p className={\`font-bold tracking-wider uppercase text-lg flex items-center gap-2 \${profile?.plan_type === 'premium' ? 'text-amber-400' : 'text-emerald-400'}\`}>
                                                <Radio className="w-5 h-5" /> Buon ascolto
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                        {/* END ACCORDIONS */}
                        `;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + newUI + content.substring(endIndex);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully updated page.tsx layout!");
} else {
    console.error("Markers not found!");
}
