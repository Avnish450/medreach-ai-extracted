'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Heart, Shield, Sparkles, CheckCircle2, 
  MapPin, Stethoscope, Zap, Bell, ArrowRight, 
  Thermometer, User, Clock, Radio
} from 'lucide-react';
import Link from 'next/link';

export function HeroDiagnosticHUD() {
  const [bpm, setBpm] = useState(74);
  const [activeStep, setActiveStep] = useState(0);

  // Simulated live heartbeat rhythm
  useEffect(() => {
    const interval = setInterval(() => {
      setBpm(prev => 72 + Math.floor(Math.random() * 6));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const triageSteps = [
    { title: 'Symptom Vectorization', status: 'Active', desc: 'Chest tightness, mild dyspnea' },
    { title: 'Neural Differential Scan', status: 'Computing', desc: 'ACS vs Costochondritis' },
    { title: 'Clinical Urgency Classification', status: 'Priority Yellow', desc: 'Score: 72/100 • Urgent' },
    { title: 'Specialist Proximity Match', status: 'Ready', desc: 'Apollo Cardiology • 0.8 km' },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto">
      
      {/* Ambient background glow */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-sky-500/20 via-cyan-500/10 to-purple-500/15 blur-2xl pointer-events-none" />

      {/* Main Glass Console Card */}
      <div className="relative framer-card rounded-3xl p-6 md:p-7 border border-border shadow-2xl overflow-hidden space-y-6">
        
        {/* Top Console Status Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>AI Clinical Sentinel</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">
                System Active • 99.4% Precision
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-300 text-xs font-mono font-semibold">
            <Radio className="w-3 h-3 text-sky-500 animate-pulse" />
            <span>LIVE HUD</span>
          </div>
        </div>

        {/* Live Vitals Real-Time Grid */}
        <div className="grid grid-cols-3 gap-3">
          
          {/* Heart Rate / ECG */}
          <div className="p-3.5 rounded-2xl bg-card border border-border flex flex-col justify-between space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="font-mono">PULSE</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            </div>
            <div className="text-xl font-bold text-foreground font-mono">
              {bpm} <span className="text-[10px] font-normal text-muted-foreground">BPM</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Normal Sinus
            </div>
          </div>

          {/* SpO2 Oxygen */}
          <div className="p-3.5 rounded-2xl bg-card border border-border flex flex-col justify-between space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="font-mono">SpO2</span>
              <Zap className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <div className="text-xl font-bold text-foreground font-mono">
              98.5<span className="text-[10px] font-normal text-muted-foreground">%</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Optimal Level
            </div>
          </div>

          {/* Temp */}
          <div className="p-3.5 rounded-2xl bg-card border border-border flex flex-col justify-between space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="font-mono">TEMP</span>
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-foreground font-mono">
              98.4<span className="text-[10px] font-normal text-muted-foreground">°F</span>
            </div>
            <div className="text-[10px] text-muted-foreground font-medium">
              Afebrile
            </div>
          </div>

        </div>

        {/* Live ECG Waveform Animation Banner */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-mono">Real-Time Rhythm Scan</span>
            <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-semibold">Lead II • 25mm/s</span>
          </div>

          <div className="h-10 w-full flex items-center justify-between gap-1 overflow-hidden">
            {[10, 15, 12, 18, 14, 85, 20, 10, 15, 45, 12, 10, 14, 18, 90, 25, 12, 15, 40, 10, 15, 12, 18, 85, 22, 12, 15, 50, 14, 10].map((val, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [`${val * 0.3}%`, `${val}%`, `${val * 0.4}%`]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay: i * 0.04,
                  ease: 'easeInOut'
                }}
                className="w-1 bg-gradient-to-t from-sky-500 to-cyan-400 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Live Clinical Pipeline Card */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-sky-500" />
              Active Triage Case #MR-8402
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono font-bold">
              Urgency: 72/100
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Primary Diagnosis:</span>
              <span className="font-semibold text-foreground">Atypical Chest Pain / CAD</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Matched Specialist:</span>
              <span className="font-semibold text-sky-600 dark:text-sky-400">Dr. Sarah Jenkins (Cardiology)</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Nearest Emergency Center:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Apollo Trauma • 0.8 km
              </span>
            </div>
          </div>
        </div>

        {/* Quick Launch CTA Button */}
        <Link href="/assessment" className="block w-full">
          <button className="w-full framer-btn-primary py-3.5 text-xs flex items-center justify-center gap-2 shadow-lg">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Launch Free Instant Triage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>

      </div>

      {/* Floating Badge 1: Verification */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute -top-4 -left-6 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-card border border-border shadow-xl backdrop-blur-xl text-xs font-medium text-foreground"
      >
        <div className="w-6 h-6 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-bold">Clinical Safety Guardrails</div>
          <div className="text-[10px] text-muted-foreground font-mono">ICD-11 &amp; SNOMED Verified</div>
        </div>
      </motion.div>

      {/* Floating Badge 2: Emergency Response */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute -bottom-4 -right-6 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-card border border-border shadow-xl backdrop-blur-xl text-xs font-medium text-foreground"
      >
        <div className="w-6 h-6 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-500 animate-pulse">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400">Emergency Protocol</div>
          <div className="text-[10px] text-muted-foreground font-mono">Instant 112/108 Intercept</div>
        </div>
      </motion.div>

    </div>
  );
}
