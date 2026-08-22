import React from 'react';
import { Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function QuickActionsCard() {
  const router = useRouter();

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 mt-auto shadow-md">
      <div className="flex justify-between items-center text-sm text-slate-300 mb-1">
        <span className="font-semibold flex items-center gap-2">
          <Phone className="h-4 w-4 text-teal-500" />
          Quick Actions
        </span>
      </div>
      
      <Button 
        variant="destructive" 
        className="w-full justify-start text-xs font-semibold"
        onClick={() => router.push('/emergency')}
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        Call Emergency (112)
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full justify-start text-xs font-semibold border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
        onClick={() => router.push('/map')}
      >
        <MapPin className="h-4 w-4 mr-2" />
        Find Care Now
      </Button>
    </div>
  );
}

// Ensure AlertTriangle is imported for the emergency button
import { AlertTriangle } from 'lucide-react';
