"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useAudioStore } from "@/store/useAudioStore";

/**
 * Global HLS Audio Player
 * Mounts the physical <audio> tag and bridges Zustand state with HLS.js logic.
 * Place this once in the root layout or area-riservata layout.
 */
export function GlobalAudioPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);

    const {
        currentChannel,
        isPlaying,
        volume,
        setBufferingState,
        togglePlay
    } = useAudioStore();

    // 1. Sync Volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // 2. Play/Pause reaction
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentChannel) return;

        // If we want to play, but the audio source is still empty or loading, we WAIT.
        // The mount stream useEffect below will handle autoplaying once MANIFEST_PARSED happens.
        if (isPlaying && audio.paused) {
            // Only force play here if the audio is already fully loaded and ready to go.
            // When switching channels, readyState drops, so we skip this and let HLS handle it.
            if (audio.readyState >= 2) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        if (e.name !== 'AbortError') {
                            console.error("Playback failed", e);
                            setBufferingState("error");
                            if (isPlaying) togglePlay();
                        }
                    });
                }
            }
        } else if (!isPlaying && !audio.paused) {
            audio.pause();
        }
    }, [isPlaying, currentChannel, togglePlay, setBufferingState]);

    // 3. Mount Stream (HLS or Native)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentChannel) return;

        // Cleanup previous stream
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        const sourceUrl = currentChannel.streamUrl;
        if (!sourceUrl) return;

        setBufferingState("loading");

        const isHlsUrl = sourceUrl.includes(".m3u8");

        if (isHlsUrl && Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });

            hls.loadSource(sourceUrl);
            hls.attachMedia(audio);
            hlsRef.current = hls;

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setBufferingState("idle");
                if (isPlaying) {
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch((e) => {
                            if (e.name !== 'AbortError') {
                                console.error("HLS Play failed:", e);
                                setBufferingState("error");
                                if (isPlaying) togglePlay();
                            }
                        });
                    }
                }
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    setBufferingState("error");
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
        } else {
            // Native fallback (Safari, iOS) or mp3 stream
            audio.src = sourceUrl;
            audio.addEventListener("loadedmetadata", () => {
                setBufferingState("idle");
                if (isPlaying) {
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch((e) => {
                            if (e.name !== 'AbortError') {
                                console.error("Native Play failed:", e);
                                setBufferingState("error");
                                if (isPlaying) togglePlay();
                            }
                        });
                    }
                }
            }, { once: true });
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [currentChannel]);

    // 4. Native Event Listeners for Buffering updates
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlaying = () => {
            setBufferingState("playing");
        };
        const handleWaiting = () => setBufferingState("loading");
        const handleError = () => setBufferingState("error");

        audio.addEventListener("playing", handlePlaying);
        audio.addEventListener("waiting", handleWaiting);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("playing", handlePlaying);
            audio.removeEventListener("waiting", handleWaiting);
            audio.removeEventListener("error", handleError);
        };
    }, [setBufferingState]);

    return (
        <audio ref={audioRef} className="hidden" preload="none" />
    );
}
