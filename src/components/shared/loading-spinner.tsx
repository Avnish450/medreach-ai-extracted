import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export function LoadingSpinner({ label = 'Loading...', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-10 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400" />
      <span className="text-sm font-medium text-muted-foreground animate-pulse">{label}</span>
    </div>
  );
}
