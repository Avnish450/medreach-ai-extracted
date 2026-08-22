'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { PatientView } from '@/components/ui/transport/PatientView';
import { VolunteerView } from '@/components/ui/transport/VolunteerView';
import { usePatientSosStore } from '@/store/use-patient-sos-store';
import { LiveNetworkMap } from '@/components/ui/transport/LiveNetworkMap';
import { Activity, Users, HeartPulse, Building2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StatPill = ({ icon, label, value, pulse }: { icon: React.ReactNode, label: string, value: string | number, pulse?: boolean }) => (
  <div className="flex items-center gap-3 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-full px-5 py-2">
    <div className={`p-1.5 rounded-full bg-slate-800 ${pulse ? 'animate-pulse' : ''}`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{label}</span>
      <span className="text-sm font-extrabold text-white">{value}</span>
    </div>
  </div>
);

const ModeCard = ({ mode, icon, title, subtitle, color, pulse, onClick }: any) => {
  const colorMap: Record<string, string> = {
    red: 'from-red-500/20 to-red-900/20 border-red-500/30 hover:border-red-500 hover:shadow-red-500/20 text-red-500',
    green: 'from-emerald-500/20 to-emerald-900/20 border-emerald-500/30 hover:border-emerald-500 hover:shadow-emerald-500/20 text-emerald-500',
  };

  return (
    <button
      onClick={() => onClick(mode)}
      className={`relative overflow-hidden group flex flex-col items-center text-center p-8 rounded-2xl border bg-gradient-to-b ${colorMap[color]} transition-all duration-300 shadow-xl w-64`}
    >
      {pulse && (
        <span className="absolute top-4 right-4 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-300">{subtitle}</p>
    </button>
  );
};

export default function TransportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <TransportPageContent />
    </Suspense>
  );
}

function TransportPageContent() {
  const [activeMode, setActiveMode] = useState<'landing' | 'patient' | 'volunteer'>('landing');
  const searchParams = useSearchParams();
  const setPatientStage = usePatientSosStore(state => state.setStage);

  useEffect(() => {
    const mode = searchParams.get('mode');
    const auto = searchParams.get('auto');

    if (mode === 'patient' || mode === 'volunteer') {
      setActiveMode(mode);
    }

    if (auto === 'true' && mode === 'patient') {
      // Auto-trigger the SOS broadcast if coming from recommendations
      // We set a slight timeout so the PatientView has time to mount
      setTimeout(() => {
        setPatientStage('PRE_SOS'); // Then let the user confirm or auto broadcast
        // We could also skip directly to BROADCASTING, but for safety 
        // letting the user hit the big red button is better.
      }, 100);
    }
  }, [searchParams, setPatientStage]);

  return (
    <div className="flex-1 w-full relative min-h-screen pb-12 pt-8 bg-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black" />

      <div className="relative z-10 container max-w-5xl mx-auto px-4">
        
        <AnimatePresence mode="wait">
          {activeMode === 'landing' && (
            <motion.section 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center"
            >
              {/* Live Stats Bar */}
              <div className="flex justify-center gap-4 mb-10 flex-wrap">
                <StatPill icon={<Users className="w-4 h-4 text-emerald-400" />} label="Volunteers Online" value={142} pulse />
                <StatPill icon={<Activity className="w-4 h-4 text-amber-400" />} label="Avg Response" value="4.2 min" />
                <StatPill icon={<HeartPulse className="w-4 h-4 text-red-400" />} label="Lives Helped" value={"1,204"} />
                <StatPill icon={<Building2 className="w-4 h-4 text-blue-400" />} label="Partner Hospitals" value={18} />
              </div>

              {/* Hero Title */}
              <h1 className="text-5xl md:text-6xl font-extrabold text-center tracking-tight mb-4 text-white">
                Community <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Rescue Network</span>
              </h1>
              <p className="text-center text-slate-400 max-w-2xl mx-auto text-lg">
                When every second counts. Verified volunteers, real-time dispatch, 
                and AI-powered clinical context working together to save lives.
              </p>

              {/* Mode Toggle */}
              <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12 mb-16">
                <ModeCard
                  mode="patient"
                  icon="🆘"
                  title="I Need Help"
                  subtitle="Broadcast SOS to nearby volunteers instantly"
                  color="red"
                  pulse
                  onClick={setActiveMode}
                />
                <ModeCard
                  mode="volunteer"
                  icon="🚗"
                  title="I Can Help"
                  subtitle="Go online to save lives in your neighborhood"
                  color="green"
                  onClick={setActiveMode}
                />
              </div>

              {/* Live Hero Map */}
              <div className="w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative h-[500px]">
                <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-slate-900/80 to-transparent z-10 pointer-events-none">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Live Network Activity
                  </h3>
                </div>
                <LiveNetworkMap showVolunteers showActiveIncidents radiusKm={15} />
              </div>
            </motion.section>
          )}

          {activeMode !== 'landing' && (
            <motion.div
              key="app"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl mx-auto"
            >
              <Button 
                variant="ghost" 
                onClick={() => setActiveMode('landing')}
                className="mb-6 text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Command Center
              </Button>
              
              {activeMode === 'patient' ? <PatientView /> : <VolunteerView />}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
