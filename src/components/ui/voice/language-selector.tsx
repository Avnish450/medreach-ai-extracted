"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVoiceStore } from "@/lib/store/voice-store";

const LANGUAGES = [
  { code: "en-US", label: "🇺🇸 English (US)" },
  { code: "en-GB", label: "🇬🇧 English (UK)" },
  { code: "hi-IN", label: "🇮🇳 हिंदी" },
  { code: "es-ES", label: "🇪🇸 Español" },
  { code: "fr-FR", label: "🇫🇷 Français" },
  { code: "de-DE", label: "🇩🇪 Deutsch" },
  { code: "ar-SA", label: "🇸🇦 العربية" },
  { code: "zh-CN", label: "🇨🇳 中文" },
  { code: "ja-JP", label: "🇯🇵 日本語" },
  { code: "pt-BR", label: "🇧🇷 Português" },
];

export function LanguageSelector() {
  const { language, setLanguage } = useVoiceStore();
  
  return (
    <Select value={language} onValueChange={(val) => val && setLanguage(val)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map(l => (
          <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
