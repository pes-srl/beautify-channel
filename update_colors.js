const fs = require('fs');
const path = './src/components/draft2026/BasicHeroChannel2.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    /isPremium \? 'shadow-black border border-white\/5 bg-black' : planType === 'free_trial' \? 'shadow-\[\#D8B2A3\]\/20' : 'shadow-\[\#D8B2A3\]\/20'/g,
    "isPremium ? 'shadow-amber-500/20 border border-amber-500/10' : planType === 'free_trial' ? 'shadow-emerald-500/20 border border-emerald-500/10' : 'shadow-indigo-500/20 border border-indigo-500/10'"
);

content = content.replace(
    /isPremium \? 'from-\[\#4F3627\] via-\[\#0D0907\] to-black' : planType === 'free_trial' \? 'from-\[\#D8B2A3\] via-\[\#AB7169\] to-black' : 'from-\[\#D8B2A3\] via-\[\#5D6676\] to-black'/g,
    "isPremium ? 'from-amber-900 via-zinc-950 to-black' : planType === 'free_trial' ? 'from-emerald-900 via-teal-950 to-black' : 'from-indigo-900 via-zinc-950 to-black'"
);

content = content.replace(
    /isPremium \? 'bg-\[\#C69C85\]\/0' : planType === 'free_trial' \? 'bg-\[\#D8B2A3\]\/20' : 'bg-\[\#D8B2A3\]\/20'/g,
    "isPremium ? 'bg-amber-500/10' : planType === 'free_trial' ? 'bg-emerald-400/10' : 'bg-indigo-400/10'"
);

content = content.replace(
    /isPremium \? 'bg-\[\#C69C85\]\/0' : planType === 'free_trial' \? 'bg-\[\#AB7169\]\/20' : 'bg-\[\#5D6676\]\/20'/g,
    "isPremium ? 'bg-amber-700/10' : planType === 'free_trial' ? 'bg-teal-500/10' : 'bg-indigo-600/10'"
);

content = content.replace(
    /isPremium \? 'text-\[\#C69C85\]' : planType === 'free_trial' \? 'text-\[\#D8B2A3\]' : 'text-\[\#D8B2A3\]'/g,
    "isPremium ? 'text-amber-400' : planType === 'free_trial' ? 'text-emerald-400' : 'text-indigo-400'"
);

content = content.replace(
    /isPremium \? 'bg-\[\#C69C85\]\/10 text-\[\#C69C85\] border-\[\#C69C85\]\/20' : planType === 'free_trial' \? 'bg-\[\#D8B2A3\]\/20 text-\[\#D8B2A3\] border-\[\#D8B2A3\]\/30' : 'bg-\[\#D8B2A3\]\/20 text-\[\#D8B2A3\] border-\[\#D8B2A3\]\/30'/g,
    "isPremium ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : planType === 'free_trial' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'"
);

content = content.replace(
    /isPremium \? 'bg-\[\#C69C85\]' : planType === 'free_trial' \? 'bg-\[\#D8B2A3\]' : 'bg-\[\#D8B2A3\]'/g,
    "isPremium ? 'bg-amber-400' : planType === 'free_trial' ? 'bg-emerald-400' : 'bg-indigo-400'"
);

content = content.replace(
    /isPremium \? 'text-\[\#C69C85\] font-bold' : planType === 'free_trial' \? 'text-\[\#D8B2A3\]' : 'text-\[\#D8B2A3\]'/g,
    "isPremium ? 'text-amber-400 font-bold' : planType === 'free_trial' ? 'text-emerald-400 font-bold' : 'text-indigo-400 font-bold'"
);

content = content.replace(
    /isPremium \? 'border-\[\#C69C85\]\/20' : 'border-\[\#AB7169\]\/20'/g,
    "isPremium ? 'border-amber-400/20' : 'border-emerald-400/20'"
);

content = content.replace(
    /isPremium \? 'border-\[\#C69C85\]\/20' : 'border-\[\#5D6676\]\/20'/g,
    "isPremium ? 'border-amber-400/20' : 'border-indigo-400/20'"
);

content = content.replace(
    /text-\[\#C69C85\] font-black/g,
    'text-amber-400 font-black'
);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated colors in BasicHeroChannel2.tsx");
