'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Search, ChevronDown, Plus, Edit2, 
  AlertTriangle, Heart, Pill, ClipboardList, Activity, ArrowRight,
  Brain, Wind, Beaker, MapPin, Loader2, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroDashboardSimulation() {
  const [activeTab, setActiveTab] = useState<'triage' | 'vitals' | 'routing'>('triage');
  const [activeSegment, setActiveSegment] = useState<'cardiac' | 'neuro' | 'respiratory' | 'labs'>('cardiac');
  const [isDispatching, setIsDispatching] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setIsDispatched(true);
    }, 1500);
  };

  return (
    <div className="w-full mx-auto bg-card/60 backdrop-blur-2xl rounded-[2.5rem] border border-border shadow-2xl p-6 lg:p-10 relative overflow-hidden perspective-1000">
      
      {/* Center Pill Nav */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center bg-muted/50 rounded-full p-1.5 border border-border/50 relative shadow-sm">
          {(['triage', 'vitals', 'routing'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-8 py-2.5 text-sm font-semibold rounded-full transition-colors z-10 ${
                activeTab === tab ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="active-tab-pill"
                  className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 relative">
        
        {/* LEFT COLUMN: Dynamic based on active tab */}
        <div className="lg:col-span-3 flex flex-col gap-6 relative h-full">
          <AnimatePresence mode="wait">
            
            {activeTab === 'triage' && (
              <motion.div 
                key="triage-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-6 h-full"
              >
                {/* Patient Card */}
                <div className="bg-background/80 rounded-3xl border border-border p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
                        <img src="https://i.pravatar.cc/150?img=47" alt="Patient" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">Sarah J.</h3>
                        <p className="text-xs text-muted-foreground">32 y.o. • New York, NY</p>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 animate-pulse">
                      <Activity className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Chief Complaint</p>
                      <p className="text-sm font-medium">Severe chest pressure, radiating pain to left arm.</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Assigned Engine</p>
                      <p className="text-sm font-medium text-cyan-500">MedReach Neural v4.2</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Last Update</p>
                      <p className="text-sm font-medium text-emerald-500">Just now</p>
                    </div>
                  </div>
                </div>

                {/* Differential Diagnosis Card */}
                <div className="bg-background/80 rounded-3xl border border-border p-6 shadow-sm flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center">
                        <ClipboardList className="w-3 h-3 text-purple-500" />
                      </div>
                      <h3 className="font-bold text-sm">Differential Diagnosis</h3>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="group">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Primary Condition</p>
                        <Edit2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                      </div>
                      <p className="text-sm font-bold text-rose-500">Acute Coronary Syndrome</p>
                    </div>
                    
                    <div className="group">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Matched Symptoms</p>
                        <Edit2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Diaphoresis, retrosternal pressure, shortness of breath, left arm pain. High correlation with STEMI patterns.
                      </p>
                    </div>

                    <Button variant="outline" className="w-full mt-2 h-9 text-xs rounded-xl border-dashed border-primary text-primary hover:bg-primary/5">
                      <Plus className="w-3 h-3 mr-2" /> Add new symptom
                    </Button>
                  </div>
                </div>

                {/* Alert Card */}
                <div className="bg-rose-500/10 rounded-3xl border border-rose-500/20 p-6 shadow-sm mt-auto">
                  <div className="flex items-center gap-2 mb-2 text-rose-500">
                    <AlertTriangle className="w-4 h-4" />
                    <h3 className="font-bold text-sm">Critical Triage Flag</h3>
                  </div>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium leading-relaxed">
                    Immediate ER routing required. EMS dispatch recommended based on symptom cluster severity.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'vitals' && (
              <motion.div 
                key="vitals-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-background/80 rounded-3xl border border-border p-6 shadow-sm h-full"
              >
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Vitals History
                </h3>
                <div className="space-y-4">
                  {[
                    { time: '09:20 AM', hr: 110, bp: '142/90', o2: 95 },
                    { time: '09:15 AM', hr: 108, bp: '138/88', o2: 96 },
                    { time: '09:10 AM', hr: 98,  bp: '135/85', o2: 98 },
                    { time: '09:05 AM', hr: 95,  bp: '130/80', o2: 99 },
                  ].map((v, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-muted/50 border border-border/50">
                      <span className="text-xs font-medium text-muted-foreground">{v.time}</span>
                      <div className="flex gap-4 text-xs font-semibold">
                        <span className={v.hr > 100 ? 'text-rose-500' : ''}>HR: {v.hr}</span>
                        <span>BP: {v.bp}</span>
                        <span className={v.o2 < 96 ? 'text-orange-500' : 'text-emerald-500'}>O2: {v.o2}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'routing' && (
              <motion.div 
                key="routing-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-background/80 rounded-3xl border border-border p-6 shadow-sm h-full"
              >
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-500" /> Nearby Specialists
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Dr. Michael Chen', spec: 'Cardiologist', dist: '1.2 km', avail: 'Available Now' },
                    { name: 'Dr. Sarah Smith', spec: 'Internal Med', dist: '2.5 km', avail: 'In 30 mins' },
                    { name: 'City Hospital ER', spec: 'Emergency', dist: '0.8 km', avail: 'High Capacity' },
                  ].map((doc, i) => (
                    <div key={i} className="p-3 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/50 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold">{doc.name}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{doc.dist}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{doc.spec}</p>
                      <p className={`text-xs mt-2 font-medium ${i === 2 ? 'text-rose-500' : 'text-emerald-500'}`}>{doc.avail}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* CENTER COLUMN: The 3D Scan (Always visible) */}
        <div className="lg:col-span-6 z-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="w-full h-[500px] lg:h-[750px] relative rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl group bg-black"
          >
            {/* The Image */}
            <img 
              src="/images/medical-scan.jpg" 
              alt="Holographic Medical Scan" 
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
            />
            
            {/* Inner glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Floating Zoom Controls */}
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <span className="text-xl font-medium leading-none -mt-1">-</span>
              </button>
              <button className="w-10 h-10 mt-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95">
                <Search className="w-4 h-4" />
              </button>
            </div>
            
            {/* Overlay Scan Info */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    {activeTab === 'triage' ? 'Live Neural Scan' : activeTab === 'vitals' ? 'Cardiopulmonary Sync' : 'Location Tracking'}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-white/70">
                  {activeTab === 'triage' ? 'Scanning autonomic responses...' : activeTab === 'vitals' ? 'Monitoring real-time telemetry...' : 'Calculating optimal routing...'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Vitals & Routing */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Segmented Controls */}
          <div className="bg-background/80 rounded-3xl border border-border p-2 shadow-sm grid grid-cols-2 gap-2 relative z-10">
            {(['cardiac', 'neuro', 'respiratory', 'labs'] as const).map((segment) => (
              <button 
                key={segment}
                onClick={() => setActiveSegment(segment)}
                className={`relative py-2 text-xs font-semibold rounded-xl transition-colors ${
                  activeSegment === segment ? 'text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {activeSegment === segment && (
                  <motion.div
                    layoutId="active-segment"
                    className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="capitalize">{segment}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Segment Content Card */}
            <motion.div 
              key={activeSegment}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-background/80 rounded-3xl border border-border p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    activeSegment === 'cardiac' ? 'bg-rose-500/20 text-rose-500' :
                    activeSegment === 'neuro' ? 'bg-purple-500/20 text-purple-500' :
                    activeSegment === 'respiratory' ? 'bg-sky-500/20 text-sky-500' :
                    'bg-emerald-500/20 text-emerald-500'
                  }`}>
                    {activeSegment === 'cardiac' && <Heart className="w-3 h-3 fill-current" />}
                    {activeSegment === 'neuro' && <Brain className="w-3 h-3" />}
                    {activeSegment === 'respiratory' && <Wind className="w-3 h-3" />}
                    {activeSegment === 'labs' && <Beaker className="w-3 h-3" />}
                  </div>
                  <h3 className="font-bold text-sm capitalize">{activeSegment} Telemetry</h3>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {activeSegment === 'cardiac' && (
                <div className="flex items-stretch gap-4 h-24">
                  {/* Fake ECG SVG Chart */}
                  <div className="flex-1 bg-rose-500/5 rounded-xl border border-rose-500/10 flex items-center overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #f43f5e 1px, transparent 1px), linear-gradient(to bottom, #f43f5e 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                    <svg viewBox="0 0 100 40" className="w-full h-full text-rose-500 fill-none stroke-current" preserveAspectRatio="none">
                      <motion.path 
                        d="M0,20 L15,20 L18,10 L22,35 L26,5 L30,20 L50,20 L53,10 L57,35 L61,5 L65,20 L85,20 L88,10 L92,35 L96,5 L100,20" 
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-between w-12">
                    <div className="w-12 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-500">112</div>
                    <div className="w-12 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-xs font-bold text-sky-500">94</div>
                    <div className="w-12 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-xs font-bold text-rose-500 animate-pulse">140</div>
                  </div>
                </div>
              )}

              {activeSegment === 'neuro' && (
                <div className="h-24 flex items-center justify-center flex-col gap-2 bg-purple-500/5 rounded-xl border border-purple-500/10">
                  <div className="flex items-center gap-4 text-sm font-semibold">
                    <span className="text-purple-500">ICP: 14 mmHg</span>
                    <span className="text-emerald-500">CPP: 72 mmHg</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Neurological baselines stable.</p>
                </div>
              )}

              {activeSegment === 'respiratory' && (
                <div className="h-24 flex items-center justify-center flex-col gap-2 bg-sky-500/5 rounded-xl border border-sky-500/10">
                  <div className="flex items-center gap-4 text-sm font-semibold">
                    <span className="text-sky-500 animate-pulse">SpO2: 94%</span>
                    <span className="text-rose-500">RR: 24 bpm</span>
                  </div>
                  <p className="text-xs text-rose-500 font-medium">Tachypnea detected.</p>
                </div>
              )}

              {activeSegment === 'labs' && (
                <div className="h-24 flex items-center justify-center flex-col gap-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                  <div className="flex items-center gap-4 text-sm font-semibold">
                    <span className="text-rose-500">Troponin: High</span>
                    <span className="text-emerald-500">K+: 4.2</span>
                  </div>
                  <p className="text-xs text-muted-foreground">STAT lab results pending.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* AI Routing Recommendations */}
          <div className="bg-background/80 rounded-3xl border border-border p-6 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-sky-500/20 flex items-center justify-center">
                  <Activity className="w-3 h-3 text-sky-500" />
                </div>
                <h3 className="font-bold text-sm">AI Routing Plan</h3>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
              <div className="p-3 rounded-xl bg-muted/50 border border-border/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold">Apollo Trauma Center</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">0.8 km</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Level 1 Trauma • 5 min wait</p>
                
                <Button 
                  onClick={handleDispatch}
                  disabled={isDispatching || isDispatched}
                  className={`w-full h-8 text-xs transition-all ${
                    isDispatched ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {isDispatching ? (
                    <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Dispatching...</>
                  ) : isDispatched ? (
                    <><CheckCircle2 className="w-3 h-3 mr-2" /> EMS Dispatched</>
                  ) : (
                    <>Dispatch EMS <ArrowRight className="w-3 h-3 ml-2" /></>
                  )}
                </Button>
              </div>

              <div className="group mt-auto pt-4 border-t border-border/50">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Immediate Meds</p>
                  <Edit2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Pill className="w-4 h-4 text-orange-500" />
                  <p className="text-xs font-medium">Aspirin 325mg (Chewed)</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Pill className="w-4 h-4 text-purple-500" />
                  <p className="text-xs font-medium">Nitroglycerin 0.4mg SL</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
