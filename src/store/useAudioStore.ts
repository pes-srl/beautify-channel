import { create } from 'zustand';

interface AudioState {
    currentChannel: {
        id: string;
        name: string;
        streamUrl: string;
        imageUrl?: string;
    } | null;
    isPlaying: boolean;
    volume: number;
    bufferingState: 'idle' | 'loading' | 'buffering' | 'playing' | 'error';
    setChannel: (channel: AudioState['currentChannel']) => void;
    togglePlay: () => void;
    setVolume: (volume: number) => void;
    setBufferingState: (state: AudioState['bufferingState']) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
    currentChannel: null,
    isPlaying: false,
    volume: 0.8,
    bufferingState: 'idle',

    setChannel: (channel) => set({ currentChannel: channel, isPlaying: true, bufferingState: 'buffering' }),

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    setVolume: (volume) => set({ volume }),

    setBufferingState: (state) => set({ bufferingState: state }),
}));
