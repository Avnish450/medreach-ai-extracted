'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhoneCall, AlertTriangle } from 'lucide-react';
import { usePatientSosStore } from '@/store/use-patient-sos-store';

export function EscalatedStage() {
  const { reset } = usePatientSosStore();

  return (
    <Card className="shadow-2xl border-red-500 overflow-hidden relative bg-black/90 backdrop-blur-md w-full">
      <div className="absolute top-0 left-0 w-full h-2 bg-red-600 animate-pulse" />
      
      <CardContent className="p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-24 h-24 rounded-full bg-red-600/20 flex items-center justify-center mb-4 border border-red-500">
          <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
        </div>
        
        <h2 className="text-3xl font-black text-white">No Volunteers Nearby</h2>
        <p className="text-slate-400 text-lg">
          We could not find an available volunteer in time. This has been escalated.
        </p>
        
        <Button 
          className="w-full bg-red-600 hover:bg-red-500 text-white h-16 text-xl font-bold rounded-xl mt-8"
          onClick={() => window.location.href = 'tel:112'}
        >
          <PhoneCall className="w-6 h-6 mr-3" />
          Call 112 Immediately
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={reset}
          className="text-slate-500 hover:text-white mt-4"
        >
          Cancel and return to home
        </Button>
      </CardContent>
    </Card>
  );
}
