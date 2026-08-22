"use client";
import { motion } from "framer-motion";
import { VoiceState } from "@/lib/voice/speech-engine";

interface Props {
  state: VoiceState;
  onToggleListen: () => void;
  onInterrupt: () => void;
}

export function VoiceControls({ state, onToggleListen, onInterrupt }: Props) {
  return (
    <div className="flex gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleListen}
        className={`
          px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3
          ${state === "listening" 
            ? "bg-red-500 text-white shadow-lg shadow-red-500/50" 
            : "bg-teal-500 text-white shadow-lg shadow-teal-500/50"}
          transition-all
        `}
      >
        {state === "listening" ? "⏸️ Stop" : "🎤 Speak"}
      </motion.button>

      {state === "speaking" && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={onInterrupt}
          className="px-6 py-4 rounded-full bg-slate-800 text-white border border-slate-700"
        >
          ⏹️ Interrupt
        </motion.button>
      )}
    </div>
  );
}
