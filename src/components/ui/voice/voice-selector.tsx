"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVoiceStore } from "@/lib/store/voice-store";
import { useEffect, useState } from "react";

export function VoiceSelector() {
  const { voiceName, setVoiceName } = useVoiceStore();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Auto-select a default English voice on first load
      if (!voiceName && availableVoices.length > 0) {
        const preferred =
          availableVoices.find(v => v.lang.startsWith('en') && v.localService) ||
          availableVoices.find(v => v.lang.startsWith('en')) ||
          availableVoices[0];
        if (preferred) setVoiceName(preferred.name);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [voiceName, setVoiceName]);

  // Always pass a defined string — empty string is fine for Radix Select
  const selectedValue = voiceName ?? '';

  if (voices.length === 0) {
    return (
      <div className="w-[180px] h-9 flex items-center justify-center rounded-md border border-slate-700 bg-slate-800/60 text-xs text-slate-400">
        Loading voices…
      </div>
    );
  }

  return (
    <Select value={selectedValue} onValueChange={(val) => val && setVoiceName(val)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Voice" />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {voices.map((v) => (
          <SelectItem key={v.name} value={v.name} className="text-xs">
            {v.name} ({v.lang})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
