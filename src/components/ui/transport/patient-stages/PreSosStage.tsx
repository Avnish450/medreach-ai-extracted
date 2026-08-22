'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, MapPin, Edit3, CheckCircle2, Clock, Activity, Car, AlertTriangle, Phone } from 'lucide-react';
import { usePatientSosStore, UrgencyLevel } from '@/store/use-patient-sos-store';
import { useGeolocation } from '@/hooks/use-geolocation';
import { LiveNetworkMap } from '../LiveNetworkMap';
import { Badge } from '@/components/ui/badge';
import { PolicyConfirmationModal } from '@/components/ui/PolicyConfirmationModal';

export function PreSosStage({ onBroadcast }: { onBroadcast: () => void }) {
  const { location, loading: geoLoading } = useGeolocation();
  const { urgency, setUrgency, triageSummary, destinationHospital } = usePatientSosStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const urgencyOptions: { value: UrgencyLevel; label: string; desc: string; icon: React.ReactNode, color: string }[] = [
    { value: 'routine', label: 'Non-critical', desc: 'Routine transport', icon: <Car className="w-4 h-4"/>, color: 'border-blue-500/50 bg-blue-500/10 text-blue-400' },
    { value: 'urgent', label: 'Urgent', desc: 'Need care within 1 hr', icon: <Activity className="w-4 h-4"/>, color: 'border-amber-500/50 bg-amber-500/10 text-amber-400' },
    { value: 'serious', label: 'Serious', desc: 'Need immediate transport', icon: <AlertTriangle className="w-4 h-4"/>, color: 'border-red-500/50 bg-red-500/10 text-red-400' },
  ];

  return (
    <Card className="shadow-2xl border-slate-800 overflow-hidden relative bg-black/60 backdrop-blur-md w-full">
      <CardHeader className="border-b border-slate-800 bg-slate-900/50 pb-4">
        <CardTitle className="text-2xl font-extrabold flex items-center gap-2 text-white">
          <ShieldAlert className="h-6 w-6 text-red-500" />
          Request Community Rescue
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        
        {/* Location Section */}
        <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-full">
              <MapPin className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Your Location</p>
              <p className="text-sm text-white font-medium">
                {geoLoading ? 'Detecting...' : location ? 'Detected via GPS' : 'Location Required'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
            <Edit3 className="w-4 h-4 mr-2" /> Edit
          </Button>
        </div>

        {/* Urgency Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" /> What's the situation?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {urgencyOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setUrgency(opt.value)}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  urgency === opt.value 
                    ? opt.color + ' ring-2 ring-offset-2 ring-offset-black ring-' + opt.color.split('-')[1] + '-500' 
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {opt.icon} {opt.label}
                </div>
                <span className="text-[10px] opacity-80">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Triage Preview */}
        <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl space-y-2 relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500" />
          <div className="flex justify-between items-start pl-2">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">🧠 Auto-detected from your Triage</h3>
            <div className="flex gap-2">
              <span className="text-[10px] text-emerald-500/80 underline cursor-pointer hover:text-emerald-400">Edit</span>
            </div>
          </div>
          <p className="text-sm text-slate-300 font-medium pl-2 italic border-l-2 border-slate-700 ml-2 py-1">
            "{triageSummary}"
          </p>
        </div>

        {/* Destination & Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase">🏥 Destination</p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white font-medium flex justify-between items-center">
              {destinationHospital}
              <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-400">Change</Button>
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
            <p className="text-xs text-slate-400 font-bold uppercase">📊 Live Availability</p>
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              12 verified volunteers within 5km
            </div>
            <div className="flex items-center gap-2 text-sm text-amber-400 font-medium">
              <Clock className="w-3 h-3" />
              Est. pickup: 8-12 mins
            </div>
          </div>
        </div>

        {/* Mini Map */}
        <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-800 relative">
          <LiveNetworkMap showVolunteers radiusKm={5} />
          <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-white/10" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
          <Button 
            size="lg" 
            onClick={() => setIsModalOpen(true)}
            disabled={geoLoading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-xl h-16 shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_50px_rgba(239,68,68,0.6)] transition-all animate-pulse duration-2000"
          >
            🚨 BROADCAST SOS NOW
          </Button>

          <PolicyConfirmationModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => {
              setIsModalOpen(false);
              onBroadcast();
            }}
            title="Authorize Emergency Dispatch"
            actionName="Broadcast SOS & Dispatch Community Responders"
            reasoning={triageSummary || "Patient initiated emergency community rescue."}
            policyTrigger="Emergency Response Protocol ER-1: Authorization required for mass-broadcasting location to community volunteers."
            dataShared={["Live GPS Location", "Urgency Status", "Emergency Contacts"]}
            targetService="MedReach Peer-to-Peer Rescue Network"
            isHighPriority={true}
          />

          <div className="flex items-center gap-4 justify-center pt-2">
            <span className="text-xs text-slate-500 font-bold uppercase">⚠️ Life-threatening?</span>
            <Button variant="outline" className="border-red-900/50 text-red-500 hover:bg-red-950 hover:text-red-400 h-8 text-xs">
              <Phone className="w-3 h-3 mr-2" /> Call 112 Immediately
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
