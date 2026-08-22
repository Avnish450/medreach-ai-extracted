import React from 'react';
import { motion } from 'framer-motion';
import { Target, Activity } from 'lucide-react';
import { UrgencyLevel, FinalAssessment } from '@/types';
import { UrgencyBadge } from '@/components/shared/urgency-badge';
import { Badge } from '@/components/ui/badge';

interface PreliminaryAssessmentCardProps {
  assessment?: FinalAssessment | null;
  confidence?: number;
}

export function PreliminaryAssessmentCard({ assessment, confidence = 65 }: PreliminaryAssessmentCardProps) {
  if (!assessment) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md"
    >
      <div className="flex justify-between items-center text-sm text-slate-300 pb-2 border-b border-slate-800">
        <span className="font-semibold flex items-center gap-2">
          <Target className="h-4 w-4 text-teal-500" />
          Preliminary Read
        </span>
      </div>

      <div className="flex justify-between items-center mt-1">
        <UrgencyBadge urgency={assessment.urgency.toLowerCase() as UrgencyLevel} />
        {confidence > 0 && (
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Confidence: {confidence}%
          </span>
        )}
      </div>

      {assessment.recommended_specialties && assessment.recommended_specialties.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {assessment.recommended_specialties.map(spec => (
             <Badge key={spec} variant="outline" className="border-teal-500/20 text-teal-400 text-[10px]">
               {spec}
             </Badge>
          ))}
        </div>
      )}

      {assessment.urgency_explanation && (
        <p className="text-xs text-slate-400 mt-2 line-clamp-3">
          "{assessment.urgency_explanation}"
        </p>
      )}
    </motion.div>
  );
}
