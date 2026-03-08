const fs = require('fs');

const files = [
    'src/app/area-riservata-2/page.tsx',
    'src/components/draft2026/BasicHeroChannel2.tsx',
    'src/components/draft2026/ChannelGrid2.tsx',
    'src/components/draft2026/UpgradeFormTrial2.tsx'
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // TESTI DA CHIARI A SCURI
    content = content.replace(/text-white/g, 'text-zinc-900');
    content = content.replace(/text-zinc-100/g, 'text-zinc-900');
    content = content.replace(/text-zinc-200/g, 'text-zinc-800');
    content = content.replace(/text-zinc-300/g, 'text-zinc-700');
    content = content.replace(/text-zinc-400/g, 'text-zinc-600');
    content = content.replace(/text-\[\#D8B2A3\]/g, 'text-[#8B4513]');
    content = content.replace(/text-\[\#AB7169\]/g, 'text-[#483D8B]');
    content = content.replace(/text-\[\#5D6676\]/g, 'text-[#483D8B]');

    // SFONDI E BORDI DA SCURI A CHIARI
    content = content.replace(/border-white\/(\d+)/g, 'border-black/$1');
    content = content.replace(/bg-white\/(\d+)/g, 'bg-black/$1');
    content = content.replace(/bg-zinc-900/g, 'bg-white');
    content = content.replace(/bg-zinc-950/g, 'bg-zinc-50');
    content = content.replace(/bg-\[\#2b2730\]/g, 'bg-white/60');
    content = content.replace(/bg-black(\/[0-9]+)?/g, 'bg-white$1');
    content = content.replace(/backdrop-blur-xl bg-gradient-to-br from-\[\#AB7169\]\/10 to-\[\#2e1d1b\]/g, 'backdrop-blur-xl bg-white/70');
    content = content.replace(/from-black/g, 'from-white');
    content = content.replace(/via-black\/(\d+)/g, 'via-white/$1');
    content = content.replace(/via-black/g, 'via-white');

    // SPECIFICO PER LA PAGINA - Aggiunta sfondo bianco con gradient marrone/viola
    if (file.includes('page.tsx')) {
        // Aggiungiamo un main container col nuovo sfondo
        content = content.replace(/<div className="pt-12 pb-32">/,
            '<div className="pt-12 pb-32 min-h-screen bg-white relative z-0 overflow-hidden text-zinc-900">\n            <div className="absolute inset-0 bg-gradient-to-br from-white via-[#8B4513]/20 to-[#483D8B]/20 -z-10" />');

        // Fix up gradient texts replacing colors if they got inverted badly
        content = content.replace(/from-\[\#D8B2A3\] to-\[\#AB7169\]/g, 'from-[#8B4513] to-[#483D8B]');
        content = content.replace(/from-\[\#AB7169\] to-\[\#D8B2A3\]/g, 'from-[#483D8B] to-[#8B4513]');

        // Adjust hero bg to make sure it's visible on white
        content = content.replace(/bg-\[\#D8B2A3\]\/20/g, 'bg-[#8B4513]/10');
        content = content.replace(/bg-\[\#AB7169\]\/20/g, 'bg-[#483D8B]/10');
    }

    if (file.includes('BasicHeroChannel2.tsx')) {
        // BasicHero background is dark usually
        content = content.replace(/from-\[\#AB7169\]\/10 via-\[\#AB7169\]\/5 to-white/g, 'from-[#8B4513]/10 via-[#483D8B]/10 to-white');
    }

    fs.writeFileSync(file, content);
}
