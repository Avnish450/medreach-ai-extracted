"use client";
import { useVoiceStore } from "@/lib/store/voice-store";

export function TriageProgressBar() {
  const { messages, finalAssessment } = useVoiceStore();

  // Basic estimation of progress based on conversation length
  const progress = finalAssessment ? 100 : Math.min(10 + messages.length * 15, 95);

  return (
    <div className="w-full max-w-2xl mt-8">
      <div className="flex justify-between text-xs text-slate-400 mb-2">
        <span>Triage Assessment</span>
        <span>{progress === 100 ? "Complete" : "In Progress..."}</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-teal-500 transition-all duration-1000 ease-in-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}
