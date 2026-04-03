"use client";

import { useAudioStore } from "@/store/useAudioStore";
import { Play, Pause, Volume2, VolumeX, Loader2, Radio } from "lucide-react";
import { GlobalAudioPlayer } from "./GlobalAudioPlayer";
import { useEffect, useRef, useState } from "react";
import { logChannelPlay } from "@/app/actions/analytics-actions";
import { unlockAudioContext } from "@/utils/audio-unlock";

export function AudioPlayer() {
    const {
        currentChannel,
        isPlaying,
        volume,
        bufferingState,
        togglePlay,
        setVolume
    } = useAudioStore();
    const [showVolumeHint, setShowVolumeHint] = useState(false);

    const lastLoggedChannel = useRef<string | null>(null);

    // Register a play event for analytics whenever the channel starts playing
    useEffect(() => {
        if (isPlaying && currentChannel?.id && lastLoggedChannel.current !== currentChannel.id) {
            logChannelPlay(currentChannel.id).catch(console.error);
            lastLoggedChannel.current = currentChannel.id;

            // Trigger Volume Hint flashing
            setShowVolumeHint(true);
            const timer = setTimeout(() => setShowVolumeHint(false), 5000); // 5 seconds of flashing
            return () => clearTimeout(timer);
        } else if (!isPlaying) {
            lastLoggedChannel.current = null;
        }
    }, [isPlaying, currentChannel?.id]);

    return (
        <>
            {/* The Invisible Engine that handles HLS and Native Audio */}
            <GlobalAudioPlayer />

            {/* The Visible UI Overlay */}
            {currentChannel && (
                <div className="fixed bottom-0 left-0 right-0 h-20 md:h-24 bg-zinc-950 border-t border-white/10 flex items-center z-50 shadow-2xl">
                    <div className="grid grid-cols-3 items-center w-full max-w-7xl mx-auto px-4 md:px-6">

                        {/* Left: Track Info */}
                        <div className="flex items-center gap-2 md:gap-4 min-w-0 pr-2">
                            <div className="h-10 w-10 md:h-14 md:w-14 bg-zinc-900 rounded-lg border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                                {currentChannel.imageUrl ? (
                                    <img src={currentChannel.imageUrl} alt={currentChannel.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Radio className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-500/50" />
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="text-zinc-100 font-bold truncate text-[13px] md:text-base leading-tight">{currentChannel.name}</h4>
                                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-fuchsia-400 mt-0.5 md:mt-1 flex items-center gap-1.5 md:gap-2">
                                    {bufferingState === 'buffering' || bufferingState === 'loading' ? (
                                        <><Loader2 className="w-2.5 h-2.5 md:w-3 md:h-3 animate-spin" /> <span className="hidden xs:inline">Caricamento...</span></>
                                    ) : (
                                        <>Live <span className="hidden xs:inline">Stream</span></>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Center: Play Controls (Always Perfect Center) */}
                        <div className="flex justify-center items-center">
                            <button
                                onClick={() => {
                                    if (!isPlaying) {
                                        unlockAudioContext(document.getElementById("global-audio-player") as HTMLAudioElement);
                                    }
                                    togglePlay();
                                }}
                                className={`h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center transition-all duration-300 ${isPlaying && bufferingState !== 'buffering' && bufferingState !== 'loading'
                                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                                    : "bg-linear-to-r from-fuchsia-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:scale-105"
                                    }`}
                            >
                                {bufferingState === 'buffering' || bufferingState === 'loading' ? (
                                    <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                                ) : isPlaying ? (
                                    <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                                ) : (
                                    <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-0.5 md:ml-1" />
                                )}
                            </button>
                        </div>

                        {/* Right: Volume Controls (Avoid Cookie overlap by moving it slightly left with padding) */}
                        <div className="flex justify-end items-center pr-12 md:pr-0">
                            <div className={`relative flex items-center md:gap-3 transition-all duration-500 rounded-full px-2 md:px-3 py-1.5 ${showVolumeHint ? "shadow-[0_0_20px_rgba(217,70,239,0.5)] bg-fuchsia-500/10 border border-fuchsia-500/40 animate-pulse scale-105" : "border border-transparent"}`}>
                                <button
                                    onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                                    className={`transition-colors ${showVolumeHint ? "text-fuchsia-400" : "text-zinc-400 hover:text-white"}`}
                                >
                                    {volume === 0 ? <VolumeX className="size-4 md:w-5 md:h-5" /> : <Volume2 className="size-4 md:w-5 md:h-5" />}
                                </button>

                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className={`hidden md:block w-24 h-1.5 rounded-lg appearance-none cursor-pointer transition-all ${showVolumeHint ? "bg-fuchsia-500/40 accent-white" : "bg-zinc-800 accent-fuchsia-500 hover:accent-fuchsia-400"}`}
                                />

                                {/* Hand Hint - Elegant Elongated Pointing Hand */}
                                {showVolumeHint && (
                                    <div className="hidden lg:block absolute -right-14 top-1/2 -translate-y-1/2 text-fuchsia-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.7)]">
                                        <div className="animate-[indicateLeft_1s_infinite_ease-in-out]">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-90">
                                                <path d="M12 11V3.5C12 2.67157 11.3284 2 10.5 2C9.67157 2 9 2.67157 9 3.5V11M9 11V8.5C9 7.67157 8.32843 7 7.5 7C6.67157 7 6 7.67157 6 8.5V11M6 11V9.5C6 8.67157 5.32843 8 4.5 8C3.67157 8 3 8.67157 3 9.5V11M3 11V10.5C3 9.67157 2.32843 9 1.5 9C0.67157 9 0 9.67157 0 10.5V18C0 20.2091 1.79086 22 4 22H11C13.7614 22 16 19.7614 16 17V14C16 12.8954 15.1046 12 14 12C12.8954 12 12 12.8954 12 14V11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                                <style jsx global>{`
                                    @keyframes indicateLeft {
                                        0%, 100% { transform: translateX(0); opacity: 0.8; }
                                        50% { transform: translateX(-15px); opacity: 1; }
                                    }
                                `}</style>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
