"use client";

import { useAudioStore } from "@/store/useAudioStore";
import { Play, Pause, Volume2, VolumeX, Loader2, Radio } from "lucide-react";
import { GlobalAudioPlayer } from "./GlobalAudioPlayer";
import { useEffect, useRef } from "react";
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

    const lastLoggedChannel = useRef<string | null>(null);

    // Register a play event for analytics whenever the channel starts playing
    useEffect(() => {
        if (isPlaying && currentChannel?.id && lastLoggedChannel.current !== currentChannel.id) {
            logChannelPlay(currentChannel.id).catch(console.error);
            lastLoggedChannel.current = currentChannel.id;
        } else if (!isPlaying) {
            // Reset so we log again if they pause and play the same channel later?
            // Usually, analytics count distinct sessions, we can reset this if we want every 'Play' click.
            lastLoggedChannel.current = null;
        }
    }, [isPlaying, currentChannel?.id]);

    return (
        <>
            {/* The Invisible Engine that handles HLS and Native Audio */}
            <GlobalAudioPlayer />

            {/* The Visible UI Overlay */}
            {currentChannel && (
                <div className="fixed bottom-0 left-0 right-0 h-24 bg-zinc-950 border-t border-white/10 flex items-center px-6 z-50 shadow-2xl">
                    <div className="flex items-center justify-between w-full max-w-7xl mx-auto gap-4">

                        {/* Left: Track Info */}
                        <div className="flex items-center gap-4 w-[30%] min-w-[200px]">
                            <div className="h-14 w-14 bg-zinc-900 rounded-lg border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                                {currentChannel.imageUrl ? (
                                    <img src={currentChannel.imageUrl} alt={currentChannel.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Radio className="w-6 h-6 text-fuchsia-500/50" />
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="text-zinc-100 font-bold truncate text-sm md:text-base">{currentChannel.name}</h4>
                                <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-400 mt-1 flex items-center gap-2">
                                    {bufferingState === 'buffering' || bufferingState === 'loading' ? (
                                        <><Loader2 className="w-3 h-3 animate-spin" /> Connessione...</>
                                    ) : bufferingState === 'error' ? (
                                        <span className="text-red-400">Errore di Rete</span>
                                    ) : (
                                        <>Live Stream</>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Center: Play Controls */}
                        <div className="flex-1 flex justify-center items-center">
                            <button
                                onClick={() => {
                                    if (!isPlaying) {
                                        unlockAudioContext(document.getElementById("global-audio-player") as HTMLAudioElement);
                                    }
                                    togglePlay();
                                }}
                                className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 ${isPlaying && bufferingState !== 'buffering' && bufferingState !== 'loading'
                                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                                    : "bg-linear-to-r from-fuchsia-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:scale-105"
                                    }`}
                            >
                                {bufferingState === 'buffering' || bufferingState === 'loading' ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : isPlaying ? (
                                    <Pause className="w-6 h-6 fill-current" />
                                ) : (
                                    <Play className="w-6 h-6 fill-current ml-1" />
                                )}
                            </button>
                        </div>

                        {/* Right: Volume Controls */}
                        <div className="w-[30%] min-w-[150px] flex justify-end items-center gap-3">
                            <button
                                onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>

                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-24 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500 hover:accent-fuchsia-400 transition-all"
                            />
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
