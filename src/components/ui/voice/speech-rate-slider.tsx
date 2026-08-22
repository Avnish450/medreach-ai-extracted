"use client";
import { useVoiceStore } from "@/lib/store/voice-store";

export function SpeechRateSlider() {
  const { speechRate, setSpeechRate } = useVoiceStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">Speed:</span>
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={speechRate}
        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
        className="w-24 accent-teal-500"
      />
      <span className="text-xs font-mono w-8 text-right text-teal-500">
        {speechRate.toFixed(1)}x
      </span>
    </div>
  );
}
