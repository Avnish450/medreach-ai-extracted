'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Heart, Thermometer, ShieldCheck,
  Stethoscope, MapPin, Sparkles, ShieldAlert,
  Radio
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroHudView() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:ml-auto lg:mr-0 perspective-1000 mt-10 lg:mt-0">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 via-cyan-500/5 to-purple-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Main HUD Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20, rotateX: 5 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative w-full bg-[#0B0F19]/90 border border-border/50 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl p-6 md:p-8"
      >
        {/* Top Attached Badge */}
        <div className="absolute -top-3 left-6 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 flex items-center gap-2 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-foreground leading-none">Clinical Safety Guardrails</span>
            <span className="text-[9px] text-muted-foreground">ICD-11 & SNOMED Verified</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex items-start justify-between mt-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">AI Clinical Sentinel</h3>
              <p className="text-xs text-muted-foreground font-medium">System Active • 99.4% Precision</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold uppercase tracking-wider">
            <Radio className="w-3 h-3 animate-pulse" />
            Live HUD
          </div>
        </div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card/40 border border-border/30">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Pulse</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">73</span>
              <span className="text-[10px] text-muted-foreground">BPM</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium mt-1">Normal Sinus</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card/40 border border-border/30">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">SpO2</span>
              <Activity className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">98.5</span>
              <span className="text-[10px] text-muted-foreground">%</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium mt-1">Optimal Level</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card/40 border border-border/30">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Temp</span>
              <Thermometer className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">98.4</span>
              <span className="text-[10px] text-muted-foreground">°F</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium mt-1">Afebrile</span>
          </div>
        </div>

        {/* Waveform Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Real-Time Rhythm Scan</span>
            <span className="text-[10px] font-mono text-sky-400/70">Lead II - 25mm/s</span>
          </div>
          <div className="h-16 w-full rounded-xl bg-card/40 border border-border/30 flex items-center justify-center overflow-hidden px-2">
            <div className="flex items-center gap-1 w-full h-full">
              {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 bg-cyan-500/50 rounded-full"
                  animate={{ 
                    height: ['20%', '80%', '20%'],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Triage Case Section */}
        <div className="mb-8 p-5 rounded-2xl bg-card/40 border border-border/30">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/30">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-bold text-foreground">Active Triage Case <span className="text-muted-foreground font-mono font-normal">#MR-8402</span></span>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-orange-500/10 text-orange-400">Urgency: 72/100</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Primary Diagnosis:</span>
              <span className="font-semibold text-foreground">Atypical Chest Pain / CAD</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Matched Specialist:</span>
              <span className="font-semibold text-sky-400">Dr. Sarah Jenkins (Cardiology)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Nearest Emergency Center:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Apollo Trauma • 0.8 km
              </span>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <Button className="w-full h-14 rounded-xl bg-foreground text-background font-bold text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Launch Free Instant Triage &rarr;
        </Button>

      </motion.div>
      
      {/* Bottom Attached Badge */}
      <div className="absolute -bottom-4 right-6 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2 flex items-center gap-3 backdrop-blur-md z-10">
        <ShieldAlert className="w-5 h-5 text-rose-500" />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-rose-500 leading-none mb-1">Emergency Protocol</span>
          <span className="text-[10px] text-rose-400/80 leading-none">Instant 112/108 Intercept</span>
        </div>
      </div>

    </div>
  );
}
