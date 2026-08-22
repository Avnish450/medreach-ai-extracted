'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Navigation, PhoneOff, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { Incident } from '@/store/use-volunteer-store';

interface IncidentModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (incident: Incident) => void;
}

export function IncidentModal({ incident, isOpen, onClose, onAccept }: IncidentModalProps) {
  if (!incident) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-slate-950 border-red-900/50 shadow-2xl p-0 overflow-hidden">
        
        <div className="bg-red-950/40 p-6 border-b border-red-900/30 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-amber-500 animate-pulse" />
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              INCIDENT DETAILS
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase">📍 Pickup Location</p>
              <p className="text-white font-medium">123 MG Road ({incident.distanceKm} km)</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase">🏥 Destination</p>
              <p className="text-white font-medium">Apollo Hospital (4.3 km)</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-amber-400 font-bold bg-amber-900/20 p-2 rounded w-fit">
            <Navigation className="w-4 h-4" /> Total Trip: ~15 min
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* AI Clinical Brief */}
          <div className="border border-indigo-500/30 rounded-xl overflow-hidden bg-indigo-950/10">
            <div className="bg-indigo-900/30 p-3 flex items-center justify-between border-b border-indigo-500/20">
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">🧠 AI CLINICAL BRIEF</h4>
              <span className="text-[10px] text-indigo-500">From MedReach Triage</span>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Chief Complaint</p>
                <p className="text-sm text-slate-300">{incident.symptoms}</p>
                <p className="text-xs mt-1 text-slate-400">Patient: {incident.patientInfo}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm font-bold bg-black/40 p-2 rounded">
                <div className="text-slate-400">Suspected: <span className="text-white">Cardiac Event</span></div>
                <div className="text-slate-400">Urgency: <span className="text-red-400 uppercase">{incident.urgency}</span></div>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1 mb-2">
                    <CheckCircle2 className="w-4 h-4" /> DO:
                  </h5>
                  <ul className="text-xs text-slate-300 space-y-1 pl-5 list-disc">
                    <li>Keep patient calm and seated upright</li>
                    <li>Have them chew aspirin if not allergic</li>
                    <li>Drive smoothly, no sudden movements</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-red-400 uppercase flex items-center gap-1 mb-2">
                    <XCircle className="w-4 h-4" /> DO NOT:
                  </h5>
                  <ul className="text-xs text-slate-300 space-y-1 pl-5 list-disc">
                    <li>Do not let them walk or exert</li>
                    <li>Do not give food or drink</li>
                    <li>Do not delay — direct route to ER</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><PhoneOff className="w-4 h-4"/> Contact</h4>
              <p className="text-sm text-slate-300 italic">Hidden until accepted</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500"/> Protocols</h4>
              <ul className="text-[10px] text-slate-400 space-y-1 list-disc pl-3">
                <li>Verify identity on arrival</li>
                <li>Trip recording (auto-on)</li>
                <li>Emergency contact notified</li>
              </ul>
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex gap-3">
          <Button 
            onClick={onClose}
            variant="outline" 
            className="flex-1 border-slate-700 text-slate-400 hover:text-white"
          >
            Decline
          </Button>
          <Button 
            onClick={() => onAccept(incident)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            ACCEPT RESCUE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
