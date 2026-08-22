import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Clock, AlertCircle, Info } from 'lucide-react';
import { UrgencyLevel } from '@/types';

interface UrgencyBannerProps {
  urgency: UrgencyLevel;
  explanation: string;
  timeToCare: string;
}

export function UrgencyBanner({ urgency, explanation, timeToCare }: UrgencyBannerProps) {
  const urgencyConfig = {
    emergency: {
      color: 'bg-red-500/15 border-red-500/50 text-red-900 dark:text-red-200',
      icon: <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />,
      title: 'EMERGENCY - Seek Immediate Care',
      timeColor: 'text-red-700 dark:text-red-300 font-bold',
    },
    urgent: {
      color: 'bg-orange-500/15 border-orange-500/50 text-orange-900 dark:text-orange-200',
      icon: <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
      title: 'URGENT - Seek Care Soon',
      timeColor: 'text-orange-700 dark:text-orange-300 font-bold',
    },
    routine: {
      color: 'bg-teal-500/15 border-teal-500/50 text-teal-900 dark:text-teal-200',
      icon: <Clock className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
      title: 'ROUTINE - Schedule an Appointment',
      timeColor: 'text-teal-700 dark:text-teal-300 font-semibold',
    },
    'self-care': {
      color: 'bg-blue-500/15 border-blue-500/50 text-blue-900 dark:text-blue-200',
      icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      title: 'SELF-CARE - Manage at Home',
      timeColor: 'text-blue-700 dark:text-blue-300 font-semibold',
    },
  };

  // Normalize case (handle EMERGENCY vs emergency)
  const normalizedUrgency = urgency.toLowerCase() as keyof typeof urgencyConfig;
  const config = urgencyConfig[normalizedUrgency] || urgencyConfig['routine'];

  return (
    <Alert className={`${config.color} shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 bg-background p-1.5 rounded-full shadow-sm">{config.icon}</div>
        <div className="flex-grow">
          <AlertTitle className="text-lg font-extrabold uppercase tracking-wide">
            {config.title}
          </AlertTitle>
          <AlertDescription className="mt-1 space-y-2">
            <p className="text-sm leading-relaxed">{explanation}</p>
            <div className="flex items-center gap-1.5 mt-2 bg-background/50 inline-flex px-3 py-1.5 rounded-md border border-black/5 dark:border-white/5">
              <Clock className={`h-4 w-4 ${config.timeColor}`} />
              <span className={`text-sm ${config.timeColor}`}>Time to care: {timeToCare}</span>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
