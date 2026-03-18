"use client";

import { useAudioStore } from "@/store/useAudioStore";
import { Play, Pause, Sparkles, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { unlockAudioContext } from "@/utils/audio-unlock";

interface BasicHeroChannel2Props {
    channel: any;
    planType?: string;
}

export function BasicHeroChannel2({ channel, planType }: BasicHeroChannel2Props) {
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
        <div className={`relative w-full md:w-2/3 lg:w-3/5 mx-auto rounded-3xl overflow-hidden shadow-2xl mb-12 group transition-all duration-700 ${isPremium ? 'shadow-amber-500/20 border border-amber-500/10' : 'shadow-fuchsia-500/20 border border-fuchsia-500/10'}`}>
            {/* Animated Gradient Background */}
            <div className={`absolute inset-0 z-0 bg-gradient-to-r ${isPremium ? 'from-amber-900 via-zinc-950 to-black' : 'from-fuchsia-900 via-purple-950 to-black'}`} />

            {/* Glowing Orbs */}
            <div className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[100px] rounded-full mix-blend-screen -translate-y-1/2 translate-x-1/3 pointer-events-none ${isPremium ? 'bg-amber-500/10' : 'bg-fuchsia-400/10'}`} />
            <div className={`absolute bottom-0 left-0 w-[200px] h-[200px] blur-[80px] rounded-full mix-blend-screen translate-y-1/2 -translate-x-1/3 pointer-events-none ${isPremium ? 'bg-amber-700/10' : 'bg-purple-500/10'}`} />

            {/* Content Container */}
        <div className="relative z-10 flex flex-col md:flex-row items-center border border-white/5 rounded-3xl bg-transparent">

                {/* Left side: Premium Badge & Info */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest border backdrop-blur-md bg-transparent text-white border-white/10`}>
                            <Sparkles className={`w-3.5 h-3.5 ${isPremium ? 'text-amber-400' : 'text-fuchsia-400'}`} />
                            <span>CANALE AUDIO PRINCIPALE</span>
                        </div>
                        {isActive && (
                            <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${isPremium ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20'}`}>
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

                    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-semibold font-[family-name:var(--font-montserrat)] tracking-tight mb-4 ${isPremium || planType === 'free_trial' || planType === 'basic' ? 'text-zinc-300' : 'text-zinc-200'}`}>
                        Beautify Channel
                        <span className={`block mt-1 ${isPremium ? 'text-amber-400 font-bold' : planType === 'free_trial' ? 'text-fuchsia-400 font-bold' : 'text-[#ff7393] font-bold'}`}>
                            {isPremium ? 'Premium' : planType === 'free_trial' ? 'Prova Gratuita' : 'Basic'}
                        </span>
                    </h2>

                    <div className={`max-w-lg leading-relaxed mb-4 text-zinc-300`}>
                        {isPremium ? (
                            <p className="text-base md:text-lg">
                                Questo è il <span><strong className="text-white font-black">CANALE AUDIO PRINCIPALE</strong> che contiene tutte le <strong className="text-amber-400 font-black">TUE PROMO PERSONALIZZATE</strong></span> dei prossimi mesi e che trasforma radicalmente l'atmosfera del tuo istituto.<br />Sotto altri canali settoriali!
                            </p>
                        ) : planType === 'free_trial' ? (
                            <p className="text-base md:text-lg">
                                <strong className="text-white font-black block mb-1 text-xl">Benvenuta in BeautiFy Channel</strong>
                                Grazie per aver scelto di provare l'esperienza BeautiFy Channel!<br />
                                <span className="italic mt-1 block">Buon ascolto!</span>
                            </p>
                        ) : (
                            <p className="text-base md:text-lg">
                                Questo è il <strong className="text-white font-black">CANALE AUDIO PRINCIPALE</strong> che trasforma radicalmente l'atmosfera del tuo istituto.<br />Sotto altri canali settoriali!
                            </p>
                        )}
                    </div>

                </div>

                {/* Right side: Abstract Art / Vinyl Visualizer & Play Button */}
                <div className="flex flex-col w-full md:w-[250px] lg:w-[300px] shrink-0 relative items-center justify-center p-6 md:p-8 border-t md:border-t-0 md:border-l border-white/5 bg-transparent">
                    <div className="absolute inset-0 bg-transparent pointer-events-none" />

                    {/* Pulsing rings if active */}
                    {isCurrentlyPlaying && (
                        <>
                            <motion.div
                                className={`absolute w-[80%] h-[80%] rounded-full border ${isPremium ? 'border-amber-400/20' : 'border-fuchsia-400/20'}`}
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            />
                            <motion.div
                                className={`absolute w-[60%] h-[60%] rounded-full border ${isPremium ? 'border-amber-400/20' : 'border-fuchsia-400/20'}`}
                                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: 0.5 }}
                            />
                        </>
                    )}

                    {/* Central Vinyl/Icon */}
                    <div
                        onClick={handlePlayClick}
                        className={`
                        relative w-3/4 aspect-square rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-[1.02] mb-6
                        bg-linear-to-br from-zinc-800 to-black border-2 border-zinc-700/50 shadow-2xl
                        ${isCurrentlyPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}
                    `}>
                        {/* Grooves */}
                        <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
                        <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
                        <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none" />
                        <div className="absolute inset-16 rounded-full border border-white/5 pointer-events-none" />

                        {/* Center label */}
                        <div className={`w-1/3 h-1/3 rounded-full flex items-center justify-center overflow-hidden z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isPremium ? 'bg-transparent' : 'bg-white'}`}>
                            <img
                                src={isPremium ? "/premium-vinyl-graphic.png" : "https://eufahlzjxbimyiwivoiq.supabase.co/storage/v1/object/public/bucket-assets/1772319918240-8c1dg.png"}
                                alt="BeautiFy Channel Vinyl Image"
                                className={`w-full h-full object-cover scale-[1.05] ${!isActive ? 'opacity-50 grayscale' : 'opacity-100'} transition-all duration-500`}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handlePlayClick}
                        className={`
                            flex items-center justify-center gap-3 w-3/4
                            px-8 py-4 rounded-2xl font-semibold font-[family-name:var(--font-montserrat)] text-xl transition-all duration-300 shadow-xl relative z-20 
                            bg-white text-zinc-800 hover:bg-zinc-100
                            ${isActive ? 'hover:bg-zinc-200' : ''}
                            ${!isActive ? 'hover:scale-105' : ''}
                        `}
                    >
                        {isCurrentlyPlaying ? (
                            <>
                                <Pause className={`w-6 h-6 stroke-[2px] fill-zinc-800 stroke-zinc-800`} />
                                <span>Pausa</span>
                            </>
                        ) : (
                            <>
                                <Play className={`w-6 h-6 stroke-[2px] ml-1 fill-zinc-800 stroke-zinc-800`} />
                                <span>{isActive ? 'Play' : 'Ascolta'}</span>
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
