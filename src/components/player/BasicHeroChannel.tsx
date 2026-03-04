"use client";

import { useAudioStore } from "@/store/useAudioStore";
import { Play, Pause, Sparkles, Radio } from "lucide-react";
import { motion } from "framer-motion";

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

    // Un canale è "attivo" se l'ID corrisponde O se l'URL in play è il nostro fallback esatto
    const isActive = currentChannel?.id === channel?.id || currentChannel?.streamUrl === fallbackUrl;
    const isCurrentlyPlaying = isActive && isPlaying;

    const handlePlayClick = () => {
        if (isActive) {
            togglePlay();
        } else {

            const formattedChannel = {
                id: channel?.id || (isPremium ? "premium-hero" : "basic-hero"),
                name: channel?.name || `Beautify Channel ${isPremium ? 'Premium' : 'Basic'}`,
                streamUrl: channel?.stream_url_hls || channel?.stream_url_mp3 || fallbackUrl,
                subtitle: channel?.subtitle || `Premium ${isPremium ? 'Exclusive' : 'Basic'} Experience`,
                imageUrl: channel?.image_url || null,
            };
            setChannel(formattedChannel);
        }
    };

    return (
        <div className={`relative w-full rounded-3xl overflow-hidden shadow-2xl mb-12 group ${isPremium ? 'shadow-amber-900/20' : 'shadow-fuchsia-900/20'}`}>
            {/* Animated Gradient Background */}
            <div className={`absolute inset-0 bg-linear-to-br z-0 ${isPremium ? 'from-amber-900 via-zinc-900 to-black' : 'from-fuchsia-900 via-indigo-950 to-black'}`} />

            {/* Glowing Orbs */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[100px] rounded-full mix-blend-screen -translate-y-1/2 translate-x-1/3 pointer-events-none ${isPremium ? 'bg-amber-600/20' : 'bg-fuchsia-600/20'}`} />
            <div className={`absolute bottom-0 left-0 w-[300px] h-[300px] blur-[80px] rounded-full mix-blend-screen translate-y-1/2 -translate-x-1/3 pointer-events-none ${isPremium ? 'bg-orange-600/20' : 'bg-indigo-600/20'}`} />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col md:flex-row items-center border border-white/10 rounded-3xl bg-black/20 backdrop-blur-sm">

                {/* Left side: Premium Badge & Info */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center gap-1.5 bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 backdrop-blur-md">
                            <Sparkles className={`w-3.5 h-3.5 ${isPremium ? 'text-amber-400' : 'text-fuchsia-400'}`} />
                            <span>Esperienza Premium</span>
                        </div>
                        {isActive && (
                            <div className={`flex items-center gap-2 border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${isPremium ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30'}`}>
                                <div className="flex gap-0.5 items-end h-3">
                                    {[1, 2, 3].map((i) => (
                                        <motion.div
                                            key={`wave-${i}`}
                                            className={`w-0.5 rounded-full ${isPremium ? 'bg-amber-400' : 'bg-fuchsia-400'}`}
                                            animate={isCurrentlyPlaying ? { height: ["4px", "10px", "4px"] } : { height: "4px" }}
                                            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                                        />
                                    ))}
                                </div>
                                Live
                            </div>
                        )}
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-white/70 tracking-tight mb-4">
                        Beautify Channel
                        <span className={`block ${isPremium ? 'text-amber-400' : 'text-fuchsia-400'}`}>
                            {isPremium ? 'Premium' : 'Basic'}
                        </span>
                    </h2>

                    <p className="text-zinc-300 text-lg md:text-xl max-w-xl leading-relaxed mb-8">
                        {isPremium
                            ? "Il tuo canale esclusivo con suggerimenti personalizzati. L'atmosfera perfetta, cucita su misura per il tuo istituto e le tue promozioni."
                            : "il servizio che trasforma radicalmente l'atmosfera del tuo istituto!"}
                    </p>

                </div>

                {/* Right side: Abstract Art / Vinyl Visualizer & Play Button */}
                <div className="hidden md:flex flex-col w-1/3 relative items-center justify-center p-12">
                    <div className="absolute inset-0 bg-linear-to-l from-black/80 to-transparent pointer-events-none" />

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
                        <div className={`
                            w-1/3 h-1/3 rounded-full flex items-center justify-center
                            ${isActive
                                ? (isPremium ? 'bg-linear-to-br from-amber-500 to-orange-600' : 'bg-linear-to-br from-fuchsia-500 to-indigo-600')
                                : 'bg-zinc-800'
                            }
                        `}>
                            <Radio className={`w-1/2 h-1/2 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                        </div>
                    </div>

                    <button
                        onClick={handlePlayClick}
                        className={`
                            flex items-center justify-center gap-3 w-3/4
                            px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl relative z-20
                            ${isActive
                                ? 'bg-white text-zinc-950 hover:bg-zinc-200 shadow-white/10'
                                : (isPremium
                                    ? 'bg-linear-to-r from-amber-600 to-orange-600 text-white hover:scale-105 hover:shadow-amber-500/25'
                                    : 'bg-linear-to-r from-fuchsia-600 to-indigo-600 text-white hover:scale-105 hover:shadow-fuchsia-500/25'
                                )
                            }
                        `}
                    >
                        {isCurrentlyPlaying ? (
                            <>
                                <Pause className="w-6 h-6 fill-current" />
                                <span>Metti in Pausa</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-6 h-6 fill-current ml-1" />
                                <span>{isActive ? 'Play' : 'Ascolta Ora'}</span>
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
