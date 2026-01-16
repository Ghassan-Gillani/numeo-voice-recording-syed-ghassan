import { create } from 'zustand';

export interface Translation {
  id: string;
  original: string;
  translated: string;
  timestamp: string;
}

interface TranslationState {
  translations: Translation[];
  isRecording: boolean;
  isConnected: boolean;
  error: string | null;
  addTranslation: (translation: Omit<Translation, 'id'>) => void;
  setRecording: (recording: boolean) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  clearTranslations: () => void;
}

export const useTranslationStore = create<TranslationState>((set) => ({
  translations: [],
  isRecording: false,
  isConnected: false,
  error: null,
  addTranslation: (translation) =>
    set((state) => ({
      translations: [
        ...state.translations,
        { ...translation, id: Date.now().toString() },
      ],
    })),
  setRecording: (recording) => set({ isRecording: recording }),
  setConnected: (connected) => set({ isConnected: connected }),
  setError: (error) => set({ error }),
  clearTranslations: () => set({ translations: [] }),
}));
