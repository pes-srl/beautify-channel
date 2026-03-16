const fs = require('fs');
const pathPage = './src/app/area-riservata/page.tsx';
const pathGrid = './src/components/draft2026/ChannelGrid2.tsx';

// 1. Update the Accordion text in Area Riservata
let pageContent = fs.readFileSync(pathPage, 'utf8');

// The marker to replace in the Accordion
const oldAccordionText = `<div className="bg-black/30 p-5 rounded-3xl border border-white/5 space-y-4">
                                            <p className="text-zinc-300 text-base md:text-lg">
                                                Anche questi canali contengono <span className="text-white italic">morbidi suggerimenti vocali</span> tranne <strong className="bg-white/10 text-white px-2 py-0.5 rounded-md align-middle mx-1 text-sm font-semibold">RELAX</strong> e <strong className="bg-white/10 text-white px-2 py-0.5 rounded-md align-middle mx-1 text-sm font-semibold">MASSAGE</strong>.
                                            </p>
                                            <p className="text-zinc-300 text-base md:text-lg">
                                                Rilassati con <strong className="bg-zinc-800 text-white px-2 py-0.5 rounded-md align-middle mx-1 text-sm font-semibold">DEEP SOFT</strong> nel weekend o del <strong className="bg-zinc-800 text-white px-2 py-0.5 rounded-md align-middle mx-1 text-sm font-semibold">JAZZ</strong> a fine giornata.
                                            </p>
                                        </div>`;

const newAccordionText = `<div className="bg-white/[0.02] p-5 rounded-[1.5rem] border border-white/5 space-y-5 shadow-inner">
                                            <p className="text-zinc-200 text-base md:text-lg font-light leading-relaxed">
                                                Anche questi canali contengono <span className="text-white italic font-normal">morbidi suggerimenti vocali</span> tranne <strong className="bg-white/10 text-white px-3 py-1 rounded-full align-middle mx-1 text-xs md:text-sm font-bold tracking-wider uppercase border border-white/10">RELAX</strong> e <strong className="bg-white/10 text-white px-3 py-1 rounded-full align-middle mx-1 text-xs md:text-sm font-bold tracking-wider uppercase border border-white/10">MASSAGE</strong>.
                                            </p>
                                            <p className="text-zinc-200 text-base md:text-lg font-light leading-relaxed">
                                                Rilassati con <strong className="bg-white/10 text-white px-3 py-1 rounded-full align-middle mx-1 text-xs md:text-sm font-bold tracking-wider uppercase border border-white/10">DEEP SOFT</strong> nel weekend o del <strong className="bg-white/10 text-white px-3 py-1 rounded-full align-middle mx-1 text-xs md:text-sm font-bold tracking-wider uppercase border border-white/10">JAZZ</strong> a fine giornata.
                                            </p>
                                        </div>`;

pageContent = pageContent.replace(oldAccordionText, newAccordionText);

// Also update the PlayCircle icon in "COME FUNZIONA" to match the mockup exactly if it wasn't a PlayCircle
pageContent = pageContent.replace(
    '<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8 text-white fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    '<Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-transparent stroke-[1.5]" />'
);

// We need to import Play if not already there
if (!pageContent.includes('Play, Pause')) {
    pageContent = pageContent.replace('LogOut, Sparkles, AlertCircle, CheckCircle2, Lock, Radio, ArrowDown', 'LogOut, Sparkles, AlertCircle, CheckCircle2, Lock, Radio, ArrowDown, Play');
}

fs.writeFileSync(pathPage, pageContent, 'utf8');


// 2. Update ChannelGrid2 styling
let gridContent = fs.readFileSync(pathGrid, 'utf8');

// Replace the play button style (transparent circle with thin border instead of solid white circle)
gridContent = gridContent.replace(
    /w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-lg bg-white/g,
    'w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 shadow-xl bg-white/20 border-2 border-white group-hover:bg-white/30'
);

gridContent = gridContent.replace(
    /shadow-emerald-400\/20/g,
    ''
).replace(
    /\$\{planType === 'free_trial' \? '' \: 'shadow-\\[\\#AB7169\\]\\/20'\}/g,
    ''
);

// Fix the Play Icon inside the circle to be white stroke
gridContent = gridContent.replace(
    /<Play className="w-8 h-8 fill-white stroke-black stroke-\[2px\] ml-1" \/>/g,
    '<Play className="w-6 h-6 md:w-8 md:h-8 fill-transparent stroke-white stroke-[2px] ml-1" />'
);
gridContent = gridContent.replace(
    /<Pause className="w-8 h-8 fill-white stroke-black stroke-\[2px\]" \/>/g,
    '<Pause className="w-6 h-6 md:w-8 md:h-8 fill-transparent stroke-white stroke-[2px]" />'
);

// Fix the bottom text area: we want a sharp black gradient at the very bottom
const oldBottomGradient = `<div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 bg-linear-to-t from-black via-black/80 to-transparent z-20 pt-12 flex flex-col items-center text-center">
                            <h3 className="text-[16px] md:text-xl leading-tight font-semibold font-[family-name:var(--font-montserrat)] text-white md:truncate drop-shadow-md mt-[3px] line-clamp-2 md:line-clamp-none">{channel.name}</h3>`;

const newBottomGradient = `<div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pt-16 flex flex-col items-center text-center translate-y-1">
                            <h3 className="text-sm md:text-lg leading-tight font-black font-[family-name:var(--font-montserrat)] tracking-widest uppercase text-white drop-shadow-lg drop-shadow-black">{channel.name}</h3>`;

gridContent = gridContent.replace(oldBottomGradient, newBottomGradient);

fs.writeFileSync(pathGrid, gridContent, 'utf8');
console.log("Updated Altri Canali grid & accordion styling.");
