'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertOctagon, MapPin, Check, ShieldAlert, PhoneCall, Share2 } from 'lucide-react';
import { usePatientSosStore } from '@/store/use-patient-sos-store';
import { LiveNetworkMap } from '../LiveNetworkMap';
import { motion, AnimatePresence } from 'framer-motion';

export function EnRouteStage({ onComplete }: { onComplete: () => void }) {
  const { volunteer, destinationHospital, stage } = usePatientSosStore();
  const [showSafetyCheck, setShowSafetyCheck] = useState(false);
  const [eta, setEta] = useState(volunteer?.etaMins || 5);
  const [checkInTimer, setCheckInTimer] = useState(30);
  const { setStage } = usePatientSosStore();
  
  // Simulate ETA decreasing and Safety Check-ins
  useEffect(() => {
    const timer = setInterval(() => {
      setEta(prev => Math.max(0, prev - 1));
      setShowSafetyCheck(true);
      setCheckInTimer(30);
    }, 60000); // 60s check-in interval
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSafetyCheck) {
      timer = setInterval(() => {
        setCheckInTimer(prev => {
          if (prev <= 1) {
            handleEmergency();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showSafetyCheck]);

  const handleSafetyConfirm = () => {
    setShowSafetyCheck(false);
    setCheckInTimer(30);
  };

  const handleEmergency = () => {
    window.location.href = "tel:112";
    setStage('ESCALATED');
  };

  const isTransporting = stage === 'IN_TRANSPORT';

  return (
    <Card className="shadow-2xl border-red-500/30 overflow-hidden relative bg-black/60 backdrop-blur-md w-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-rose-600" />
      
      <CardHeader className="bg-red-950/30 pb-4 border-b border-red-900/30">
        <CardTitle className="text-2xl font-extrabold flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-red-500 animate-bounce" />
            {isTransporting ? 'In Transit to Hospital' : 'Volunteer is Arriving'}
          </div>
          <div className="text-3xl font-black text-red-400 tabular-nums">
            {eta} <span className="text-sm font-bold text-slate-400">MIN</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 relative">
        
        {/* Full Bleed Map */}
        <div className="w-full h-64 bg-slate-900 relative">
          <LiveNetworkMap showVolunteers radiusKm={isTransporting ? 10 : 2} />
          
          {/* Overlay Status */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            <div className="bg-black/80 px-4 py-2 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md pointer-events-auto">
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">Destination</p>
              <p className="text-sm text-white font-medium">{isTransporting ? destinationHospital : 'Your Location'}</p>
            </div>
            
            <Button variant="outline" size="icon" className="rounded-full bg-black/80 border-slate-700 pointer-events-auto">
              <Share2 className="w-4 h-4 text-orange-400" />
            </Button>
          </div>

          {/* Trip Recording Indicator */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Audio Recording</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-400">
            Emergency contacts have been notified with your live tracking link.
          </p>

          <Button 
            onClick={handleEmergency}
            className="w-full bg-red-600/20 hover:bg-red-600 border border-red-500/50 hover:border-red-500 text-red-500 hover:text-white transition-all h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg"
          >
            <AlertOctagon className="w-6 h-6" /> PANIC: Call 112
          </Button>

          {/* Sim hook for demo */}
          <Button onClick={onComplete} variant="outline" className="w-full bg-slate-900 border-slate-800 text-slate-500 h-10">
            (Demo: Simulate Arrival at Hospital)
          </Button>
        </div>

        {/* Safety Check-in Overlay */}
        <AnimatePresence>
          {showSafetyCheck && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-4 left-4 right-4 bg-slate-900 border-2 border-orange-500 rounded-2xl p-6 shadow-2xl z-20"
            >
              <h3 className="text-xl font-black text-white flex items-center gap-2 mb-2">
                <ShieldAlert className="w-6 h-6 text-orange-500" /> 
                Safety Check-in
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Are you feeling safe with {volunteer?.name || 'the volunteer'}?
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleSafetyConfirm}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white h-12 text-lg font-bold"
                >
                  <Check className="w-5 h-5 mr-2" /> Yes
                </Button>
                <Button 
                  onClick={handleEmergency}
                  className="bg-red-600 hover:bg-red-500 text-white h-12 text-lg font-bold"
                >
                  <PhoneCall className="w-5 h-5 mr-2" /> Emergency
                </Button>
              </div>
              <p className="text-xs text-center text-slate-500 mt-4">
                Auto-escalating in <span className="text-red-400 font-bold">{checkInTimer}s</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </CardContent>
    </Card>
  );
}
