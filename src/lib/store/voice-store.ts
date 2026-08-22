import { create } from 'zustand';
import { persist } from "zustand/middleware";
import { FinalAssessment } from '@/types';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface VoiceStore {
  messages: Message[];
  language: string;
  voiceName?: string;
  speechRate: number;
  finalAssessment: FinalAssessment | null;
  addMessage: (msg: Message) => void;
  setLanguage: (lang: string) => void;
  setVoiceName: (voiceName: string) => void;
  setSpeechRate: (rate: number) => void;
  setFinalAssessment: (assessment: FinalAssessment) => void;
  clear: () => void;
}

export const useVoiceStore = create<VoiceStore>()(
  persist(
    (set) => ({
      messages: [],
      language: 'en-US',
      voiceName: undefined,
      speechRate: 1,
      finalAssessment: null,
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      setLanguage: (language) => set({ language }),
      setVoiceName: (voiceName) => set({ voiceName }),
      setSpeechRate: (speechRate) => set({ speechRate }),
      setFinalAssessment: (finalAssessment) => set({ finalAssessment }),
      clear: () => set({ messages: [], finalAssessment: null }),
    }),
    { name: "medreach-voice" }
  )
);
