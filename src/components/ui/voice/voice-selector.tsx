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
      
      // Set a default voice if none is selected
      if (!voiceName && availableVoices.length > 0) {
        const defaultVoice = availableVoices.find(v => v.lang.startsWith("en"));
        if (defaultVoice) {
          setVoiceName(defaultVoice.name);
        } else {
          setVoiceName(availableVoices[0].name);
        }
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [voiceName, setVoiceName]);

  return (
    <Select value={voiceName} onValueChange={(val) => val && setVoiceName(val)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Voice" />
      </SelectTrigger>
      <SelectContent>
        {voices.map((v) => (
          <SelectItem key={v.name} value={v.name} className="text-xs">
            {v.name} ({v.lang})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
