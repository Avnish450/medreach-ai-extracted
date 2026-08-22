import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { TriageProgress } from '@/types';

interface TriageProgressPanelProps {
  progress?: TriageProgress;
}

export function TriageProgressPanel({ progress }: TriageProgressPanelProps) {
  if (!progress) return null;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 shadow-md">
      <div className="flex justify-between items-center text-sm text-slate-300">
        <span className="font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-teal-500" />
          Triage Progress
        </span>
        <span className="text-teal-400 font-medium">{progress.percent}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-teal-600 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress.percent}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-2 mt-2">
        {progress.completed_fields.map((field) => (
          <div key={field} className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="capitalize">{field.replace('_', ' ')}</span>
          </div>
        ))}
        {progress.next_field && progress.next_field !== 'none' && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="h-4 w-4 rounded-full border border-slate-600 flex items-center justify-center flex-shrink-0">
              <motion.div 
                className="w-1.5 h-1.5 bg-slate-500 rounded-full" 
                animate={{ opacity: [0.3, 1, 0.3] }} 
                transition={{ duration: 1.5, repeat: Infinity }} 
              />
            </div>
            <span className="capitalize">{progress.next_field.replace('_', ' ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
