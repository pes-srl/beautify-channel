"use client";

import { useAudioStore } from "@/store/useAudioStore";
import { Play, Pause, Sparkles, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { unlockAudioContext } from "@/utils/audio-unlock";

interface BasicHeroChannelProps {
    channel: any;
    planType?: string;
}

export function BasicHeroChannel({ channel, planType }: BasicHeroChannelProps) {
    const { currentChannel, isPlaying, togglePlay, setChannel } = useAudioStore();

    const isPremium = planType === 'premium';
    const fallbackUrl = isPremium
        ? "https://canali2.pesstream.eu/hls/beautify-channel-premium/live.m3u8"
        : "https://canali2.pesstream.eu/hls/beautify-channel/live.m3u8";

    // Un canale è "attivo" se esiste un canale attualmente in riproduzione e il suo ID o URL corrisponde a questo
    const isActive = currentChannel ? (currentChannel.id === channel?.id || currentChannel.streamUrl === fallbackUrl) : false;
    const isCurrentlyPlaying = isActive && isPlaying;

    const handlePlayClick = () => {
        if (!isActive || !isPlaying) {
            unlockAudioContext(document.getElementById("global-audio-player") as HTMLAudioElement);
        }

        if (isActive) {
            togglePlay();
        } else {

            const formattedChannel = {
                id: channel?.id || (isPremium ? "premium-hero" : "basic-hero"),
                name: channel?.name || `Beautify Channel ${isPremium ? 'Premium' : planType === 'free_trial' ? 'Prova Gratuita' : 'Basic'}`,
                streamUrl: channel?.stream_url_hls || channel?.stream_url_mp3 || fallbackUrl,
                subtitle: channel?.subtitle || `Premium ${isPremium ? 'Exclusive' : 'Basic'} Experience`,
                imageUrl: channel?.image_url || null,
            };
            setChannel(formattedChannel);
        }
    };

    return (
        <div className={`relative w-full rounded-3xl overflow-hidden shadow-2xl mb-12 group ${isPremium ? 'shadow-amber-900/20' : planType === 'free_trial' ? 'shadow-emerald-900/20' : 'shadow-sky-900/20'}`}>
            {/* Animated Gradient Background */}
            <div className={`absolute inset-0 bg-linear-to-br z-0 ${isPremium ? 'from-amber-900 via-zinc-900 to-black' : planType === 'free_trial' ? 'from-emerald-900 via-teal-950 to-black' : 'from-sky-900 via-indigo-950 to-black'}`} />

            {/* Glowing Orbs */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[100px] rounded-full mix-blend-screen -translate-y-1/2 translate-x-1/3 pointer-events-none ${isPremium ? 'bg-amber-600/20' : planType === 'free_trial' ? 'bg-emerald-600/20' : 'bg-sky-600/20'}`} />
            <div className={`absolute bottom-0 left-0 w-[300px] h-[300px] blur-[80px] rounded-full mix-blend-screen translate-y-1/2 -translate-x-1/3 pointer-events-none ${isPremium ? 'bg-orange-600/20' : planType === 'free_trial' ? 'bg-teal-600/20' : 'bg-purple-600/20'}`} />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col md:flex-row items-center border border-white/10 rounded-3xl bg-black/20 backdrop-blur-sm">

                {/* Left side: Premium Badge & Info */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center gap-1.5 bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 backdrop-blur-md">
                            <Sparkles className={`w-3.5 h-3.5 ${isPremium ? 'text-amber-400' : planType === 'free_trial' ? 'text-emerald-400' : 'text-sky-400'}`} />
                            <span>CANALE PRINCIPALE</span>
                        </div>
                        {isActive && (
                            <div className={`flex items-center gap-2 border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${isPremium ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : planType === 'free_trial' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-sky-500/20 text-sky-400 border-sky-500/30'}`}>
                                <div className="flex gap-0.5 items-end h-3">
                                    {[1, 2, 3].map((i) => (
                                        <motion.div
                                            key={`wave-${i}`}
                                            className={`w-0.5 rounded-full ${isPremium ? 'bg-amber-400' : planType === 'free_trial' ? 'bg-emerald-400' : 'bg-sky-400'}`}
                                            animate={isCurrentlyPlaying ? { height: ["4px", "10px", "4px"] } : { height: "4px" }}
                                            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                                        />
                                    ))}
                                </div>
                                Live
                            </div>
                        )}
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold font-[family-name:var(--font-montserrat)] text-transparent bg-clip-text bg-linear-to-r from-white to-white/70 tracking-tight mb-4">
                        Beautify Channel
                        <span className={`block ${isPremium ? 'text-amber-400' : planType === 'free_trial' ? 'text-emerald-400' : 'text-sky-400'}`}>
                            {isPremium ? 'Premium' : planType === 'free_trial' ? 'Prova Gratuita' : 'Basic'}
                        </span>
                    </h2>

                    <p className="text-zinc-300 text-lg md:text-lg max-w-xl leading-relaxed mb-8">
                        {isPremium ? (
                            <>Questo è il <strong className="text-white font-black">CANALE AUDIO PRINCIPALE</strong> che contiene tutte le <strong className="text-amber-400 font-black">TUE PROMO PERSONALIZZATE</strong> dei prossimi mesi e che trasforma radicalmente l'atmosfera del tuo istituto!<br />Sotto altri canali settoriali!</>
                        ) : (
                            <>Questo è il <strong className="text-white font-black">CANALE AUDIO PRINCIPALE</strong> che trasforma <strong className="text-white font-black">RADICALMENTE</strong> l'atmosfera del tuo istituto!<br />Sotto altri canali settoriali!</>
                        )}
                    </p>

                </div>

                {/* Right side: Abstract Art / Vinyl Visualizer & Play Button */}
                <div className="flex flex-col w-full md:w-1/3 relative items-center justify-center p-8 md:p-12 border-t md:border-t-0 md:border-l border-white/5 bg-black/10">
                    <div className="absolute inset-0 bg-linear-to-b md:bg-linear-to-l from-black/80 to-transparent pointer-events-none" />

                    {/* Pulsing rings if active */}
                    {isCurrentlyPlaying && (
                        <>
                            <motion.div
                                className={`absolute w-[80%] h-[80%] rounded-full border ${isPremium ? 'border-amber-500/20' : 'border-fuchsia-500/20'}`}
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            />
                            <motion.div
                                className={`absolute w-[60%] h-[60%] rounded-full border ${isPremium ? 'border-orange-500/20' : 'border-indigo-500/20'}`}
                                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: 0.5 }}
                            />
                        </>
                    )}

                    {/* Central Vinyl/Icon */}
                    <div
                        className={`
                        relative w-3/4 aspect-square rounded-full flex items-center justify-center mb-6
                        bg-linear-to-br from-zinc-800 to-black border-2 border-zinc-700/50 shadow-2xl
                        ${isCurrentlyPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}
                    `}>
                        {/* Grooves */}
                        <div className="absolute inset-4 rounded-full border border-white/5" />
                        <div className="absolute inset-8 rounded-full border border-white/5" />
                        <div className="absolute inset-12 rounded-full border border-white/5" />
                        <div className="absolute inset-16 rounded-full border border-white/5" />

                        {/* Center label */}
                        <div className="w-1/3 h-1/3 rounded-full flex items-center justify-center overflow-hidden bg-white z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                            <img
                                src="https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772319918240-8c1dg.png"
                                alt="BeautiFy Channel Vinyl Image"
                                className={`w-full h-full object-cover scale-[1.05] ${!isActive ? 'opacity-50 grayscale' : 'opacity-100'} transition-all duration-500`}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handlePlayClick}
                        className={`
                            flex items-center justify-center gap-3 w-3/4
                            px-8 py-4 rounded-2xl font-semibold font-[family-name:var(--font-montserrat)] text-xl transition-all duration-300 shadow-xl relative z-20 bg-white text-zinc-800
                            ${isActive
                                ? 'hover:bg-zinc-200'
                                : 'hover:scale-105 hover:bg-zinc-100'
                            }
                        `}
                    >
                        {isCurrentlyPlaying ? (
                            <>
                                <Pause className="w-6 h-6 fill-zinc-800 stroke-zinc-800 stroke-[2px]" />
                                <span>Metti in Pausa</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-6 h-6 fill-zinc-800 stroke-zinc-800 stroke-[2px] ml-1" />
                                <span>{isActive ? 'Play' : 'Ascolta Ora'}</span>
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
