import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function Disclaimer() {
  return (
    <Alert variant="default" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertTitle className="font-semibold text-sm">Medical Disclaimer</AlertTitle>
      <AlertDescription className="text-xs leading-relaxed mt-1">
        This tool is not a substitute for professional medical advice, diagnosis, or treatment. 
        Always seek the advice of your physician or other qualified health provider with any 
        questions you may have regarding a medical condition. Never disregard professional 
        medical advice or delay in seeking it because of something you have read on this website.
      </AlertDescription>
    </Alert>
  );
}
