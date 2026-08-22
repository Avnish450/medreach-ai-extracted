'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Phone, MessageSquare, X, ShieldCheck, MapPin, Navigation, User, Star } from 'lucide-react';
import { usePatientSosStore } from '@/store/use-patient-sos-store';
import { LiveNetworkMap } from '../LiveNetworkMap';

export function MatchedStage({ onCancel, onProceed }: { onCancel: () => void, onProceed: () => void }) {
  const { volunteer, triageSummary, destinationHospital, setStage } = usePatientSosStore();

  // In a real app, this would automatically transition when the volunteer gets close
  // For demo, we provide a proceed button
  const handleSimulateArrival = () => {
    setStage('EN_ROUTE');
  };

  return (
    <Card className="shadow-2xl border-emerald-500/30 overflow-hidden relative bg-black/60 backdrop-blur-md w-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
      
      <CardHeader className="bg-emerald-950/30 pb-4 border-b border-emerald-900/30">
        <CardTitle className="text-2xl font-extrabold flex items-center gap-2 text-white">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          Rescue Accepted!
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        
        {/* Volunteer Profile */}
        <div className="flex items-start gap-4 p-4 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-emerald-500 overflow-hidden flex items-center justify-center shrink-0">
            <User className="w-8 h-8 text-slate-400" />
            {/* Real app: <img src={volunteer.photoUrl} /> */}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">{volunteer?.name || 'Rahul S.'}</h3>
                <div className="flex items-center gap-2 text-sm text-amber-400 font-medium">
                  <Star className="w-3 h-3 fill-amber-400" /> {volunteer?.rating || '4.9'} 
                  <span className="text-slate-500 font-normal">({volunteer?.rescues || 23} rescues)</span>
                </div>
              </div>
              <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-800/50 p-2 rounded text-slate-300 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-slate-500" />
                {volunteer?.distanceKm || '2.1'} km away
              </div>
              <div className="bg-slate-800/50 p-2 rounded text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                {volunteer?.etaMins || '5'} min ETA
              </div>
            </div>
            
            <p className="mt-2 text-sm text-slate-400 font-medium flex items-center gap-2">
              🚗 {volunteer?.vehicle || 'White Honda City • MH-12-AB-1234'}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800">
            <Phone className="w-4 h-4 mr-2 text-emerald-400" /> Call
          </Button>
          <Button variant="outline" className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800">
            <MessageSquare className="w-4 h-4 mr-2 text-blue-400" /> Message
          </Button>
          <Button variant="outline" onClick={onCancel} className="bg-slate-900 border-red-900/50 text-red-400 hover:bg-red-950/30 hover:text-red-300">
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
        </div>

        {/* Live Map */}
        <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-800 relative">
          {/* We simulate the volunteer coming to the patient */}
          <LiveNetworkMap showVolunteers radiusKm={2} />
          <div className="absolute top-2 right-2 bg-black/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 border border-emerald-900/50 flex items-center gap-2 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Tracking
          </div>
        </div>

        {/* Volunteer Briefing Status */}
        <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            🩺 Volunteer has been briefed on:
          </h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Your symptoms: <span className="text-slate-400 italic">"{triageSummary}"</span></span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              Recommended emergency do's and don'ts
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              Destination: <span className="font-semibold text-white">{destinationHospital}</span>
            </li>
          </ul>
        </div>
        
        {/* Sim hook for demo */}
        <Button onClick={handleSimulateArrival} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12">
          (Demo: Simulate Arrival)
        </Button>

      </CardContent>
    </Card>
  );
}
