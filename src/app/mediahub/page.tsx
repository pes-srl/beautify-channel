"use client";

import React from "react";

// AUDIO & VIDEO MOCK (Fissi come prima)
const MOCK_DATA = {
    newsAudio: {
        title: "Aggiornamento Sviluppo: Fase 2",
        date: "10 Marzo 2026",
        audioSrc: "/audio/beautify-demo.mp3",
    },
    videos: [
        {
            id: 1,
            title: "Presentazione Progetto Alpha",
            youtubeId: "dQw4w9WgXcQ",
        },
    ],
};

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useRef } from "react";
import { Loader2, Play, Pause, Volume2 } from "lucide-react";
import Link from "next/link";

interface Articolo {
    id: string;
    titolo: string;
    immagine_copertina: string | null;
    contenuto: string;
    created_at: string;
}

function CustomAudioPlayer({ src }: { src: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            if (duration) {
                setProgress((current / duration) * 100);
            }
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#111', padding: '15px 20px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '10px' }}>
            <button onClick={togglePlay} style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: '4px' }} />}
            </button>
            <div style={{ flexGrow: 1, height: '4px', backgroundColor: '#333', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progress}%`, backgroundColor: '#fff', transition: 'width 0.1s linear' }} />
            </div>
            <Volume2 size={20} color="#666" style={{ flexShrink: 0 }} />
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
            />
        </div>
    );
}

export default function MediaHub() {
    const supabase = createClient();
    const [articoli, setArticoli] = useState<Articolo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticoli = async () => {
            const { data, error } = await supabase
                .from("articoli")
                .select("*")
                .eq("status", "published")
                .order("created_at", { ascending: false });

            if (data) {
                setArticoli(data);
            }
            setIsLoading(false);
        };

        fetchArticoli();
    }, [supabase]);

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <h1 style={styles.mainTitle}>MediaHub</h1>
                <p style={styles.subtitle}>
                    Esplora i nostri contenuti in modalità read-only
                </p>
            </header>

            <main style={styles.mainContent}>
                {/* Sezione News Audio */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <span style={styles.icon}>AUDIO</span>
                    </h2>
                    <div style={styles.audioCard}>
                        <div style={styles.audioInfo}>
                            <h3 style={styles.audioTitle}>{MOCK_DATA.newsAudio.title}</h3>
                            <p style={styles.audioDate}>{MOCK_DATA.newsAudio.date}</p>
                        </div>
                        <CustomAudioPlayer src={MOCK_DATA.newsAudio.audioSrc} />
                    </div>
                </section>

                {/* Sezione Blog/Articoli */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <span style={styles.icon}>LATEST STORIES</span>
                    </h2>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-fuchsia-500" />
                        </div>
                    ) : articoli.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500 bg-zinc-950/50 rounded-xl border border-white/5">
                            <p>Nessun articolo pubblicato al momento.</p>
                        </div>
                    ) : (
                        <div style={styles.grid}>
                            {articoli.map((article) => (
                                <Link
                                    href={`/mediahub/${article.id}`}
                                    key={article.id}
                                    style={{ textDecoration: 'none', display: 'block' }}
                                >
                                    <div
                                        className="article-card"
                                        style={styles.card}
                                    >
                                        {article.immagine_copertina && (
                                            <div style={styles.imageOverflow}>
                                                <img
                                                    src={article.immagine_copertina}
                                                    alt={article.titolo}
                                                    style={styles.cardImage}
                                                    className="card-img"
                                                />
                                            </div>
                                        )}
                                        <div style={styles.cardContent}>
                                            <p style={styles.articleDate}>
                                                {new Date(article.created_at).toLocaleDateString('it-IT')}
                                            </p>
                                            <h3 style={styles.cardTitle}>{article.titolo}</h3>
                                            {/* Utilizziamo dangerouslySetInnerHTML perché Tiptap salva in HTML */}
                                            {/* In un caso reale, dovremmo limitare i caratteri (es. estratto di 100 char) e sanitizzare l'HTML */}
                                            <div
                                                style={styles.cardText}
                                                className="line-clamp-3 overflow-hidden prose-sm prose-invert"
                                                dangerouslySetInnerHTML={{ __html: article.contenuto }}
                                            />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Sezione Video */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <span style={styles.icon}>FEATURED VISUALS</span>
                    </h2>
                    <div style={styles.videoContainer}>
                        {MOCK_DATA.videos.map((video) => (
                            <div key={video.id} style={styles.videoWrapper}>
                                <iframe
                                    style={styles.iframe}
                                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Stili CSS interattivi isolati */}
            <style>{`
        .article-card {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .article-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          border-color: #6366f1;
        }
        .article-card:hover .card-img {
          transform: scale(1.08);
        }
        .card-img {
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* Stili CSS interattivi isolati (Premium Redesign) */
        .article-card {
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease, border-color 0.5s ease;
        }
        .article-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 20px rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.4);
        }
        .article-card:hover .card-img {
          transform: scale(1.05);
        }
        .card-img {
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* Custom Audio Player resets for Webkit */
        audio::-webkit-media-controls-panel {
          background-color: #1a1a1a;
          color: #fff;
        }
        audio::-webkit-media-controls-current-time-display,
        audio::-webkit-media-controls-time-remaining-display {
            color: #fff;
        }
        
        /* Utility styles for article preview */
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .prose-invert p {
          margin: 0;
          color: #a3a3a3; /* text-neutral-400 */
          font-size: 0.95rem;
          line-height: 1.6;
          font-weight: 300;
        }
      `}</style>
        </div>
    );
}

// Inline Styles (Premium/Exclusive Theme)
const styles = {
    pageContainer: {
        fontFamily: "'Outfit', 'Inter', 'Segoe UI', sans-serif",
        backgroundColor: "#050505", // Deepest black
        backgroundImage: "radial-gradient(circle at 50% 0%, #151515 0%, #050505 70%)",
        color: "#ffffff",
        minHeight: "100vh",
        padding: "80px 20px",
    },
    header: {
        textAlign: "center" as const,
        marginBottom: "80px",
    },
    mainTitle: {
        fontSize: "4.5rem",
        fontWeight: "400",
        margin: "0 0 15px 0",
        letterSpacing: "-0.03em",
        color: "#ffffff",
        textTransform: "uppercase" as const,
    },
    subtitle: {
        fontSize: "1.1rem",
        color: "#D4AF37", // Metallic Gold
        margin: 0,
        fontWeight: "300",
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
    },
    mainContent: {
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column" as const,
        gap: "80px",
    },
    section: {
        backgroundColor: "transparent",
    },
    sectionTitle: {
        fontSize: "0.85rem",
        fontWeight: "300",
        margin: "0 0 30px 0",
        paddingBottom: "15px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        color: "#ffffff",
        letterSpacing: "0.25em",
        textTransform: "uppercase" as const,
    },
    icon: {
        opacity: 0.6,
        color: "#ffffff",
    },
    audioCard: {
        backgroundColor: "#0a0a0a",
        borderRadius: "16px",
        padding: "30px",
        border: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        flexDirection: "column" as const,
        gap: "20px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    },
    audioInfo: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "8px",
    },
    audioTitle: {
        margin: 0,
        fontSize: "1.5rem",
        fontWeight: "400",
        color: "#ffffff",
    },
    audioDate: {
        margin: 0,
        fontSize: "0.85rem",
        color: "#ffffff",
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
    },
    audioPlayer: {
        width: "100%",
        marginTop: "10px",
        outline: "none",
        borderRadius: "0",
        filter: "invert(1) grayscale(1) brightness(1.5)", // Trucco CSS per scurire il player nativo
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "40px",
    },
    card: {
        backgroundColor: "#0a0a0a",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.05)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column" as const,
        height: "100%",
    },
    imageOverflow: {
        width: "100%",
        height: "220px",
        overflow: "hidden",
    },
    cardImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
        display: "block",
        filter: "contrast(1.1) brightness(0.9)", // Moody look
    },
    cardContent: {
        padding: "30px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column" as const,
        gap: "15px",
        backgroundColor: "#0a0a0a",
    },
    cardTitle: {
        fontSize: "1.4rem",
        fontWeight: "400",
        margin: "0 0 10px 0",
        color: "#ffffff",
        lineHeight: "1.3",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical" as const,
        overflow: "hidden",
    },
    articleDate: {
        fontSize: "0.75rem",
        color: "#ffffff",
        fontWeight: "400",
        margin: 0,
        textTransform: "uppercase" as const,
        letterSpacing: "0.15em",
    },
    cardText: {
        fontSize: "0.95rem",
        lineHeight: "1.6",
        color: "#a3a3a3",
        margin: 0,
        fontWeight: "300",
    },
    videoContainer: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "40px",
    },
    videoWrapper: {
        position: "relative" as const,
        paddingBottom: "56.25%", /* Formato 16:9 */
        height: 0,
        overflow: "hidden",
        borderRadius: "16px",
        backgroundColor: "#000",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
    },
    iframe: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        filter: "contrast(1.05)",
    },
};
