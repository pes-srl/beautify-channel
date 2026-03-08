"use client";

import { useAudioStore } from "@/store/useAudioStore";
import { Play, Pause, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { unlockAudioContext } from "@/utils/audio-unlock";

interface ChannelGridProps {
    initialChannels: any[];
    serverError?: string;
    planType?: string;
}

export function ChannelGrid({ initialChannels, serverError, planType }: ChannelGridProps) {
    const { currentChannel, isPlaying, togglePlay, setChannel } = useAudioStore();

    const handleChannelClick = (channel: any) => {
        const isClickingCurrent = currentChannel?.id === channel.id;

        if (!isClickingCurrent || !isPlaying) {
            unlockAudioContext(document.getElementById("global-audio-player") as HTMLAudioElement);
        }

        if (isClickingCurrent) {
            togglePlay();
        } else {
            // Mapping the DB column to the expected store property logic
            const formattedChannel = {
                id: channel.id,
                name: channel.name,
                // Prioritize HLS (.m3u8), fallback to MP3
                streamUrl: channel.stream_url_hls || channel.stream_url_mp3,
                subtitle: channel.subtitle || "Premium Music",
            };
            setChannel(formattedChannel);
        }
    };

    if (serverError || initialChannels.length === 0) {
        return (
            <div className="p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center mt-8 max-w-2xl mx-auto">
                <h3 className="text-xl text-red-400 font-bold mb-2">DEBUG MODE: Dati Non Trovati</h3>
                <p className="text-red-200/70 text-sm font-mono wrap-break-word">{serverError || "0 canali attivi nel DB per questo utente."}</p>
                <div className="mt-4 p-4 bg-black/40 rounded-lg text-left">
                    <p className="text-xs text-zinc-500">Istruzioni (Per Mirko):</p>
                    <ol className="text-xs text-zinc-400 list-decimal pl-4 mt-2 space-y-1">
                        <li>Se dice "Could not find function get_authorized_channels", significa che non hai eseguito il file SQL in Supabase.</li>
                        <li>Se dice "0 canali attivi", significa che in Supabase `radio_channels` è vuoto o nessun canale ha `is_active = true`.</li>
                    </ol>
                </div>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-2 gap-4 md:gap-6 ${planType === 'free_trial' ? 'md:grid-cols-3 max-w-4xl mx-auto' : 'lg:grid-cols-4 xl:grid-cols-5'}`}>
            {initialChannels.map((channel: any, idx: number) => {
                const isActive = currentChannel?.id === channel.id;
                const isCurrentlyPlaying = isActive && isPlaying;

                return (
                    <motion.div
                        key={channel.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -5 }}
                        onClick={() => handleChannelClick(channel)}
                        className={`
              relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-300
              ${isActive ? 'ring-2 ring-fuchsia-500 shadow-[0_0_30px_-5px_var(--color-fuchsia-500)]' : 'border border-white/10 hover:border-white/30'}
            `}
                    >
                        {/* Background Image & Overlay */}
                        <div className="aspect-square w-full relative">
                            {channel.card_image_url ? (
                                <>
                                    {/* Ridotto l'overlay centrale (da bg-black/40 a bg-black/10) */}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10 duration-500" />
                                    { }
                                    <img
                                        src={channel.card_image_url}
                                        alt={channel.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-transparent transition-colors z-10" />
                                    <div className="w-full h-full bg-zinc-900 bg-linear-to-b from-zinc-800 to-zinc-900 flex flex-col items-center justify-center border border-white/5 relative z-0">
                                    </div>
                                </>
                            )}

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                                <div className={`
                                    w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-lg shadow-fuchsia-500/20 bg-white
                                    ${isActive ? 'outline-4 outline-fuchsia-500/30 ring-2 ring-fuchsia-400' : 'group-hover:scale-110'}
                                `}>
                                    {isCurrentlyPlaying ? (
                                        <Pause className="w-8 h-8 fill-white stroke-black stroke-[2px]" />
                                    ) : (
                                        <Play className="w-8 h-8 fill-white stroke-black stroke-[2px] ml-1" />
                                    )}
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-4 right-4 z-20">
                                {isActive && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg bg-fuchsia-500 text-white border-transparent">
                                        In Riproduzione
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 bg-linear-to-t from-black via-black/80 to-transparent z-20 pt-12 text-center md:text-left">
                            <h3 className="text-[13px] md:text-lg leading-tight font-semibold font-[family-name:var(--font-montserrat)] text-white md:truncate drop-shadow-md mt-[3px] line-clamp-2 md:line-clamp-none">{channel.name}</h3>
                            {isActive && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex gap-1 items-end h-3">
                                        {[1, 2, 3].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-fuchsia-400 rounded-full"
                                                animate={isCurrentlyPlaying ? { height: ["4px", "12px", "4px"] } : { height: "4px" }}
                                                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[11px] uppercase tracking-wider text-fuchsia-400 font-bold">Live</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
