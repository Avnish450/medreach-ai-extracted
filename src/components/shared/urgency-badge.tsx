import React from 'react';
import { UrgencyLevel } from '@/types';
import { Badge } from '@/components/ui/badge';
import { AlertOctagon, AlertCircle, Calendar, Home } from 'lucide-react';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  className?: string;
}

export function UrgencyBadge({ urgency, className = '' }: UrgencyBadgeProps) {
  const configs = {
    emergency: {
      label: 'Emergency Care',
      styles: 'bg-red-500 hover:bg-red-500 text-white border-red-600 animate-pulse flex items-center gap-1',
      icon: <AlertOctagon className="h-4 w-4" />
    },
    urgent: {
      label: 'Urgent Care',
      styles: 'bg-amber-500 hover:bg-amber-500 text-white border-amber-600 flex items-center gap-1',
      icon: <AlertCircle className="h-4 w-4" />
    },
    routine: {
      label: 'Routine Care',
      styles: 'bg-green-500 hover:bg-green-500 text-white border-green-600 flex items-center gap-1',
      icon: <Calendar className="h-4 w-4" />
    },
    'self-care': {
      label: 'Self Care',
      styles: 'bg-blue-500 hover:bg-blue-500 text-white border-blue-600 flex items-center gap-1',
      icon: <Home className="h-4 w-4" />
    }
  };

  const config = configs[urgency] || configs.routine;

  return (
    <Badge className={`${config.styles} font-bold px-3 py-1 text-xs uppercase tracking-wider rounded-full shadow-sm ${className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}
