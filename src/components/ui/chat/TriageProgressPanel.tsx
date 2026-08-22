import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { TriageProgress } from '@/types';

interface TriageProgressPanelProps {
  progress?: TriageProgress;
}

export function TriageProgressPanel({ progress }: TriageProgressPanelProps) {
  if (!progress) return null;

  return (
    <div className="w-full bg-muted/30 border-y border-border/40 py-2 px-4 flex flex-col gap-2">
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span className="font-semibold">Triage Progress</span>
        <span>{progress.percent}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-teal-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress.percent}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Completed Fields (Optional: could show a list if useful) */}
      <div className="flex flex-wrap gap-2 mt-1">
        {progress.completed_fields.map((field) => (
          <div key={field} className="flex items-center gap-1 text-[10px] text-teal-600 dark:text-teal-400">
            <CheckCircle2 className="h-3 w-3" />
            <span className="capitalize">{field.replace('_', ' ')}</span>
          </div>
        ))}
        {progress.next_field && progress.next_field !== 'none' && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground opacity-60">
            <Circle className="h-3 w-3" />
            <span className="capitalize">{progress.next_field.replace('_', ' ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
