"use client";

import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, RadioTower, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StreamConfig {
    name: string;
    description: string;
    hlsUrl: string;
    mp3Url: string;
    publicUrl: string;
}

const beautifyStream: StreamConfig = {
    name: "Beautify Channel",
    description: "La tua Beauty Routine Sonora",
    hlsUrl: "https://canali2.pesstream.eu/hls/beautify-channel/live.m3u8",
    mp3Url: "https://canali2.pesstream.eu/listen/beautify-channel/radio.mp3",
    publicUrl: "https://canali2.pesstream.eu/public/beautify-channel"
};

export default function TestChannelPage() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [streamType, setStreamType] = useState<"HLS" | "MP3">("HLS");
    const [status, setStatus] = useState<"idle" | "loading" | "playing" | "error">("idle");
    const hlsRef = useRef<Hls | null>(null);

    // Gestione dell'audio base (Play/Pause)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlaying = () => setStatus("playing");
        const handleWaiting = () => setStatus("loading");
        const handleError = () => setStatus("error");

        audio.addEventListener("playing", handlePlaying);
        audio.addEventListener("waiting", handleWaiting);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("playing", handlePlaying);
            audio.removeEventListener("waiting", handleWaiting);
            audio.removeEventListener("error", handleError);
        };
    }, []);

    // Gestione del volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Inizializzazione flussi HLS.js vs MP3 standard
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Pulizia HLS precedente
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        setStatus("loading");

        if (streamType === "HLS") {
            if (Hls.isSupported()) {
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });

                hls.loadSource(beautifyStream.hlsUrl);
                hls.attachMedia(audio);
                hlsRef.current = hls;

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    setStatus("idle");
                    if (isPlaying) audio.play().catch(() => setStatus("error"));
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        setStatus("error");
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                hls.recoverMediaError();
                                break;
                            default:
                                hls.destroy();
                                break;
                        }
                    }
                });
            } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
                // Supporto nativo HLS (es. Safari)
                audio.src = beautifyStream.hlsUrl;
                audio.addEventListener("loadedmetadata", () => {
                    setStatus("idle");
                    if (isPlaying) audio.play().catch(() => setStatus("error"));
                });
            } else {
                setStatus("error");
            }
        } else {
            // Flusso MP3 Diretto
            audio.src = beautifyStream.mp3Url;
            setStatus("idle");
            if (isPlaying) {
                audio.play().catch(() => setStatus("error"));
            }
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [streamType]); // Ricarica la sorgente se cambia il tipo

    // Gestore Play/Pause Manuale
    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
            setStatus("idle");
        } else {
            setStatus("loading");
            audio.play()
                .then(() => {
                    setIsPlaying(true);
                    setStatus("playing");
                })
                .catch(err => {
                    console.error("Playback failed:", err);
                    setStatus("error");
                    setIsPlaying(false);
                });
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 px-4 py-24 relative overflow-hidden">
            {/* Sfondo */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20">
                <div className="absolute w-[600px] h-[600px] bg-indigo-600/30 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute w-[600px] h-[600px] bg-fuchsia-600/30 blur-[120px] rounded-full mix-blend-screen translate-x-32" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-12 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-2xl">
                        <RadioTower className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Stream Test Playground</h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Test in tempo reale dei flussi audio di Beautify Channel. Usa la modalità HLS per una gestione avanzata della rete o MP3 per il fallback diretto.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                    {/* Intestazione Player */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
                                {status === "playing" && (
                                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                )}
                                {status === "loading" && (
                                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                                )}
                                {status === "error" && (
                                    <span className="w-2 h-2 rounded-full bg-red-400" />
                                )}
                                {status === "idle" && (
                                    <span className="w-2 h-2 rounded-full bg-zinc-400" />
                                )}
                                {status.toUpperCase()}
                            </span>
                            <h2 className="text-2xl font-bold text-white mb-1">{beautifyStream.name}</h2>
                            <p className="text-zinc-400">{beautifyStream.description}</p>
                        </div>
                        <a
                            href={beautifyStream.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </a>
                    </div>

                    {/* Controlli Principali */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 rounded-2xl bg-black/20 border border-white/5">
                        <button
                            onClick={togglePlay}
                            className={`flex items-center justify-center w-16 h-16 rounded-full shrink-0 transition-all ${isPlaying
                                    ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                    : "bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:scale-105"
                                }`}
                        >
                            {status === "loading" ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : isPlaying ? (
                                <Pause className="w-6 h-6 fill-current" />
                            ) : (
                                <Play className="w-6 h-6 fill-current ml-1" />
                            )}
                        </button>

                        <div className="flex-1 w-full space-y-3">
                            {/* Switch Tipo di Flusso */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-zinc-300">Tipo di Flusso</span>
                                <div className="flex p-1 rounded-lg bg-zinc-900 border border-white/10">
                                    <button
                                        onClick={() => {
                                            setStreamType("HLS");
                                            setIsPlaying(false);
                                        }}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${streamType === "HLS" ? "bg-fuchsia-500 text-white shadow-md" : "text-zinc-500 hover:text-zinc-300"
                                            }`}
                                    >
                                        HLS (.m3u8)
                                    </button>
                                    <button
                                        onClick={() => {
                                            setStreamType("MP3");
                                            setIsPlaying(false);
                                        }}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${streamType === "MP3" ? "bg-fuchsia-500 text-white shadow-md" : "text-zinc-500 hover:text-zinc-300"
                                            }`}
                                    >
                                        MP3
                                    </button>
                                </div>
                            </div>

                            {/* Controllo Volume */}
                            <div className="flex items-center gap-4 bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => {
                                        setVolume(parseFloat(e.target.value));
                                        if (isMuted) setIsMuted(false);
                                    }}
                                    className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                                />
                                <span className="text-xs text-zinc-500 font-mono w-8 text-right">
                                    {Math.round((isMuted ? 0 : volume) * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Dettagli Tecnici */}
                    <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-black/40 border border-fuchsia-500/10">
                            <h4 className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-2">Sorgente HLS Consigliata</h4>
                            <p className="text-xs font-mono text-zinc-400 break-all">{beautifyStream.hlsUrl}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Sorgente MP3 Diretta</h4>
                            <p className="text-xs font-mono text-zinc-500 break-all">{beautifyStream.mp3Url}</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Elemento Audio Nascosto */}
            <audio ref={audioRef} className="hidden" />
        </div>
    );
}
