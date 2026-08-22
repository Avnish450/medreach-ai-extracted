import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X } from 'lucide-react';

interface ContextualSymptomSelectorProps {
  symptoms: string[];
  selectedSymptoms: string[];
  onToggle: (symptom: string) => void;
}

export function ContextualSymptomSelector({ symptoms, selectedSymptoms, onToggle }: ContextualSymptomSelectorProps) {
  if (!symptoms || symptoms.length === 0) return null;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md">
      <div className="flex justify-between items-center text-sm text-slate-300 pb-2 border-b border-slate-800">
        <span className="font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-500" />
          Related Symptoms
        </span>
      </div>
      
      <p className="text-xs text-slate-500 font-medium">Tap to add common related symptoms to your description.</p>

      <div className="flex flex-wrap gap-2 mt-1">
        {symptoms.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom);
          return (
            <Badge
              key={symptom}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-colors text-xs py-1 ${
                isSelected 
                  ? 'bg-teal-500 hover:bg-teal-600 text-white border-teal-500' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-teal-500/50 hover:bg-slate-800/80'
              }`}
              onClick={() => onToggle(symptom)}
            >
              {symptom}
              {isSelected && <X className="h-3 w-3 ml-1" />}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
