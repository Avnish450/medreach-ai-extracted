'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Sparkles, MapPin, ArrowRight, Stethoscope, 
  AlertCircle, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TriageScenario {
  id: string;
  tag: string;
  query: string;
  duration: string;
  urgency: 'Emergency' | 'Urgent' | 'Routine' | 'Self-Care';
  urgencyScore: number;
  urgencyColor: string;
  urgencyBg: string;
  urgencyBorder: string;
  matchedSpecialist: string;
  recommendedAction: string;
  nearestFacility: string;
  facilityDistance: string;
  confidence: number;
  differential: { name: string; probability: number }[];
  vitalsNote: string;
}

const SCENARIOS: TriageScenario[] = [
  {
    id: 'cardiac',
    tag: 'Chest Discomfort',
    query: 'Substernal chest heaviness radiating to left shoulder, mild diaphoresis, started 45 minutes ago while walking.',
    duration: '45 mins',
    urgency: 'Emergency',
    urgencyScore: 94,
    urgencyColor: 'text-rose-600 dark:text-rose-400',
    urgencyBg: 'bg-rose-500/10',
    urgencyBorder: 'border-rose-500/30',
    matchedSpecialist: 'Interventional Cardiologist',
    recommendedAction: 'Immediate emergency routing. Do not drive yourself. 112 dispatched.',
    nearestFacility: 'Metro Heart & Trauma Center (ER)',
    facilityDistance: '1.2 km (4 mins)',
    confidence: 98,
    differential: [
      { name: 'Acute Coronary Syndrome', probability: 88 },
      { name: 'Aortic Dissection Rule-out', probability: 8 },
      { name: 'Costochondritis', probability: 4 }
    ],
    vitalsNote: 'Priority Red 🚨 • Code STEMI Protocol Triggered'
  },
  {
    id: 'migraine',
    tag: 'Severe Headache',
    query: 'Unilateral pulsating frontal headache with photophobia and visual scintillating aura. Nausea present.',
    duration: '6 hours',
    urgency: 'Urgent',
    urgencyScore: 68,
    urgencyColor: 'text-amber-600 dark:text-amber-400',
    urgencyBg: 'bg-amber-500/10',
    urgencyBorder: 'border-amber-500/30',
    matchedSpecialist: 'Neurologist / Urgent Care MD',
    recommendedAction: 'Consult urgent care within 12-24 hours. Triptan / dark room management.',
    nearestFacility: 'City Neuro & Urgent Care Clinic',
    facilityDistance: '2.4 km (8 mins)',
    confidence: 94,
    differential: [
      { name: 'Classic Migraine with Aura', probability: 84 },
      { name: 'Tension-type Cluster Flare', probability: 11 },
      { name: 'Sinus Pressure Cephalea', probability: 5 }
    ],
    vitalsNote: 'Priority Yellow • Non-hemorrhagic indicators present'
  },
  {
    id: 'pediatric',
    tag: 'Fever in Child',
    query: 'Toddler (3 yrs) with 101.8°F fever, rhinorrhea, active during playtime, eating small meals.',
    duration: '2 days',
    urgency: 'Routine',
    urgencyScore: 38,
    urgencyColor: 'text-sky-600 dark:text-sky-400',
    urgencyBg: 'bg-sky-500/10',
    urgencyBorder: 'border-sky-500/30',
    matchedSpecialist: 'Pediatrician',
    recommendedAction: 'Schedule routine pediatric visit. Maintain hydration & antipyretic monitoring.',
    nearestFacility: 'Little Stars Pediatric Care',
    facilityDistance: '3.1 km (10 mins)',
    confidence: 91,
    differential: [
      { name: 'Viral Upper Respiratory Infection', probability: 79 },
      { name: 'Acute Otitis Media (Early)', probability: 15 },
      { name: 'Roseola Infantum', probability: 6 }
    ],
    vitalsNote: 'Priority Blue • Stable oral intake & hydration'
  },
  {
    id: 'knee',
    tag: 'Joint Strain',
    query: 'Mild right lateral knee stiffness after 10k run, no swelling or mechanical locking.',
    duration: '1 day',
    urgency: 'Self-Care',
    urgencyScore: 18,
    urgencyColor: 'text-emerald-600 dark:text-emerald-400',
    urgencyBg: 'bg-emerald-500/10',
    urgencyBorder: 'border-emerald-500/30',
    matchedSpecialist: 'Sports Physiotherapist / Orthopedic',
    recommendedAction: 'R.I.C.E. protocol at home. Book follow-up if discomfort persists > 5 days.',
    nearestFacility: 'Apex Sports Physio & Wellness',
    facilityDistance: '4.5 km (14 mins)',
    confidence: 96,
    differential: [
      { name: 'Iliotibial Band (ITB) Friction', probability: 85 },
      { name: 'Patellofemoral Mild Strain', probability: 12 },
      { name: 'Mild Meniscal Irritation', probability: 3 }
    ],
    vitalsNote: 'Priority Green • Conservative home management recommended'
  }
];

export function TriagePlayground() {
  const [selectedId, setSelectedId] = useState('cardiac');
  const [, setIsSimulating] = useState(false);

  const current = SCENARIOS.find(s => s.id === selectedId) || SCENARIOS[0];

  const handleSelectScenario = (id: string) => {
    setIsSimulating(true);
    setSelectedId(id);
    setTimeout(() => {
      setIsSimulating(false);
    }, 450);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Framer Window Frame Container */}
      <div className="framer-card rounded-3xl overflow-hidden border border-border shadow-2xl relative">
        
        {/* Top Window Header */}
        <div className="px-6 py-4 border-b border-border bg-muted/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            </div>
            <div className="h-4 w-px bg-border mx-1" />
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              <span>MedReach Triage Engine v2.4 • Live Simulation</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Realtime Inference
            </div>
          </div>
        </div>

        {/* Interactive Scenario Pills Bar */}
        <div className="p-4 md:p-6 bg-muted/20 border-b border-border flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">
            Try Symptom Presets:
          </span>
          {SCENARIOS.map((s) => {
            const isSelected = s.id === selectedId;
            return (
              <button
                key={s.id}
                onClick={() => handleSelectScenario(s.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-sky-500/15 border border-sky-500/50 text-foreground font-semibold shadow-sm scale-[1.02]'
                    : 'bg-muted/60 border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <span>{s.tag}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${s.urgencyBg} ${s.urgencyColor}`}>
                  {s.urgency}
                </span>
              </button>
            );
          })}
        </div>

        {/* Playground Main Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Symptom Input & Waveform */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                  Clinical Input Transcript
                </span>
                <span className="text-xs text-muted-foreground font-mono">Duration: {current.duration}</span>
              </div>

              {/* Chat-like Input Bubble */}
              <div className="p-5 rounded-2xl bg-card border border-border relative overflow-hidden shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="text-sm md:text-base text-foreground leading-relaxed font-sans"
                  >
                    &ldquo;{current.query}&rdquo;
                  </motion.div>
                </AnimatePresence>

                {/* Animated ECG Pulse Wave in corner */}
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span>AI Synthesizer: 99.4% Accuracy</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[40, 75, 25, 90, 45, 60, 20, 85, 30, 70, 50, 95].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-sky-500/50 rounded-full animate-pulse"
                        style={{
                          height: `${h * 0.25}px`,
                          animationDelay: `${i * 100}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Differential Diagnosis Bars */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                AI Differential Probability Matrix
              </span>

              <div className="space-y-2.5">
                <AnimatePresence>
                  {current.differential.map((d, idx) => (
                    <motion.div
                      key={`${current.id}-${d.name}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.3 }}
                      className="p-3 rounded-xl bg-card border border-border flex flex-col gap-1.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{d.name}</span>
                        <span className="font-mono text-muted-foreground font-semibold">{d.probability}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${d.probability}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            idx === 0 ? 'bg-gradient-to-r from-sky-500 to-cyan-400' : 'bg-muted-foreground/40'
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column: Live Triage Verdict Card */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className={`p-6 rounded-2xl border ${current.urgencyBorder} ${current.urgencyBg} backdrop-blur-xl flex flex-col justify-between h-full space-y-6 shadow-sm`}
              >
                {/* Urgency Badge & Score Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono tracking-wider uppercase text-muted-foreground">
                      Triage Classification
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`text-2xl font-bold ${current.urgencyColor}`}>
                        {current.urgency}
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-background/80 border border-border font-mono text-foreground font-medium">
                        Score: {current.urgencyScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Circular Speedometer Ring */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-muted/60"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={current.urgencyColor}
                        strokeDasharray={`${current.urgencyScore}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-xs font-mono font-bold text-foreground">
                      {current.urgencyScore}%
                    </span>
                  </div>
                </div>

                {/* Clinical Notes & Action */}
                <div className="space-y-3 bg-card/90 p-4 rounded-xl border border-border shadow-sm">
                  <div className="flex items-start gap-2.5">
                    <Stethoscope className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground">Matched Clinical Specialist</div>
                      <div className="text-sm font-semibold text-foreground mt-0.5">
                        {current.matchedSpecialist}
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground">Clinical Protocol Action</div>
                      <div className="text-xs text-foreground/90 mt-0.5 leading-relaxed">
                        {current.recommendedAction}
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground">Recommended Facility</div>
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-300 mt-0.5 flex items-center gap-2">
                        <span>{current.nearestFacility}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono">
                          {current.facilityDistance}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {current.vitalsNote}
                  </span>
                  <Button
                    size="sm"
                    className="framer-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
                    onClick={() => window.location.href = '/assessment'}
                  >
                    <span>Launch Live Triage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
