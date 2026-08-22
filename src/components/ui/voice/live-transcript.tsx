"use client";
import { motion } from "framer-motion";
import { VoiceState } from "@/lib/voice/speech-engine";

export function LiveTranscript({ text, state }: { text: string; state: VoiceState }) {
  if (!text && state !== "listening") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl w-full bg-slate-900/70 backdrop-blur border border-teal-500/30 rounded-xl p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs text-teal-400 uppercase tracking-wider">Live Transcript</span>
      </div>
      <p className="text-lg text-white/90 min-h-[2em]">
        {text || <span className="text-slate-500 italic">Listening...</span>}
      </p>
    </motion.div>
  );
}
