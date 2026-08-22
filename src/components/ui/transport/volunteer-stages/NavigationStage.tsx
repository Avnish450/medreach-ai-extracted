'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation, Phone, MapPin, CheckCircle2, Navigation2 } from 'lucide-react';
import { useVolunteerStore } from '@/store/use-volunteer-store';
import { LiveNetworkMap } from '../LiveNetworkMap';
import { motion } from 'framer-motion';

export function NavigationStage({ onComplete }: { onComplete: () => void }) {
  const { stage, setStage, selectedIncident } = useVolunteerStore();

  const isEnRoute = stage === 'EN_ROUTE_TO_PATIENT';
  const targetLabel = isEnRoute ? 'Patient Location' : 'Hospital Destination';
  const targetDist = isEnRoute ? `${selectedIncident?.distanceKm || 1.2} km` : '4.3 km';
  
  const handleNextPhase = () => {
    if (isEnRoute) {
      setStage('TRANSPORTING_TO_HOSPITAL');
    } else {
      onComplete(); // Triggers Completed state in parent
    }
  };

  return (
    <div className="w-full h-[80vh] relative flex flex-col md:flex-row gap-4">
      {/* Map View - Takes up most space */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-900 shadow-2xl">
        {/* We use a static radius for demo. In a real app this would use Directions API */}
        <LiveNetworkMap showVolunteers={false} radiusKm={isEnRoute ? 2 : 5} />
        
        {/* Navigation HUD */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-start pointer-events-none z-10">
          <div className="bg-emerald-950/80 border border-emerald-900/50 px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-4">
            <div className="p-2 bg-emerald-500/20 rounded-full">
              <Navigation2 className="w-8 h-8 text-emerald-400 rotate-45" />
            </div>
            <div>
              <p className="text-white font-black text-2xl">300m <span className="text-sm font-medium text-slate-300">then Turn Left</span></p>
              <p className="text-emerald-400 text-sm font-bold">{targetLabel}</p>
            </div>
          </div>
          
          <div className="bg-black/80 px-4 py-2 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md text-right">
            <p className="text-2xl font-black text-white tabular-nums">
              {isEnRoute ? '5' : '12'} <span className="text-sm font-bold text-slate-400">MIN</span>
            </p>
            <p className="text-xs text-slate-500 font-bold">{targetDist}</p>
          </div>
        </div>
      </div>

      {/* Floating Info Card */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-96 shrink-0 flex flex-col gap-4"
      >
        <Card className="bg-slate-900/90 backdrop-blur-md border-slate-800 shadow-2xl flex-1 flex flex-col">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-white font-bold text-lg">Active Mission</h3>
                <p className="text-slate-400 text-sm">
                  {isEnRoute ? 'Heading to pickup patient' : 'Transporting to Apollo Hospital'}
                </p>
              </div>
              <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400">
                <span className="text-xs font-bold uppercase tracking-wider block text-center">Urgency</span>
                <span className="text-sm font-black">{selectedIncident?.urgency.toUpperCase() || 'URGENT'}</span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="p-4 bg-black/40 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Patient Complaint</p>
                <p className="text-sm text-slate-300">{selectedIncident?.symptoms}</p>
              </div>
              
              <div className="p-4 bg-indigo-950/20 border border-indigo-900/50 rounded-xl">
                <p className="text-xs text-indigo-400 font-bold uppercase mb-2">AI Clinical Brief</p>
                <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                  <li>Keep patient calm and seated</li>
                  <li>Drive smoothly, no sudden movements</li>
                  {isEnRoute && <li>Verify identity on arrival</li>}
                </ul>
              </div>
            </div>

            <div className="mt-auto pt-6 space-y-3">
              <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 h-12">
                <Phone className="w-4 h-4 mr-2 text-emerald-400" />
                Call Patient
              </Button>
              
              <Button 
                onClick={handleNextPhase}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg h-16 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
              >
                {isEnRoute ? (
                  <>
                    <MapPin className="w-5 h-5 mr-2" />
                    I'VE ARRIVED AT PICKUP
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    PATIENT DELIVERED
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
