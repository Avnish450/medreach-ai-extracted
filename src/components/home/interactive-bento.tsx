'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Mic, Play, Pause, MapPin, ShieldAlert, 
  Sparkles, ArrowRight, Phone, 
  Radio, HeartPulse, UserCheck, Stethoscope
} from 'lucide-react';
import Link from 'next/link';

export function InteractiveBento() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSpecialistIdx, setActiveSpecialistIdx] = useState(0);

  const specialists = [
    { title: 'Emergency Medicine', queue: 'No wait', fee: '₹0 triage', status: 'Immediate' },
    { title: 'Cardiologist', queue: '12 mins', fee: '₹800', status: 'Available' },
    { title: 'Pulmonologist', queue: '25 mins', fee: '₹700', status: 'Available' },
    { title: 'Pediatric Specialist', queue: '8 mins', fee: '₹600', status: 'Available' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* ── CARD 1: Voice AI Clinical Waveform (7 cols) ── */}
        <div className="md:col-span-7 framer-card framer-card-interactive rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-mono font-medium">
                <Mic className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                <span>Voice-to-Clinical Triage</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">Dual-Channel STT</span>
            </div>

            <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2">
              Speak Naturally. Get Structured Clinical Insight.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mb-6">
              Hands-free voice recognition extracts symptoms, onset timestamps, and pain intensity scales directly into medical-grade SNOMED/ICD-11 taxonomy.
            </p>

            {/* Interactive Audio Simulator Box */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-lg shadow-purple-500/25"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div>
                    <div className="text-xs font-medium text-foreground">
                      {isPlayingAudio ? 'Analyzing Audio Stream...' : 'Click to preview voice analysis'}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {isPlayingAudio ? 'Listening • Neural Noise Suppressor: Active' : 'Sample: "Sharp abdominal pain after meals"'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-semibold">
                    48kHz HD
                  </span>
                </div>
              </div>

              {/* Dynamic Waveform Bars */}
              <div className="h-12 flex items-center justify-between gap-1 px-2">
                {[15, 30, 65, 45, 90, 80, 50, 100, 70, 40, 85, 95, 60, 35, 75, 55, 90, 40, 65, 80, 30, 95, 60, 40, 70, 85, 50, 30].map((val, i) => (
                  <motion.div
                    key={i}
                    animate={isPlayingAudio ? {
                      height: [`${val * 0.2}%`, `${val}%`, `${val * 0.4}%`],
                    } : {
                      height: `${val * 0.3}%`
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + (i % 5) * 0.1,
                      ease: 'easeInOut',
                      delay: i * 0.02
                    }}
                    className={`w-full rounded-full transition-colors ${
                      isPlayingAudio ? 'bg-gradient-to-t from-purple-500 to-cyan-400' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>

              <div className="p-3 rounded-xl bg-muted/50 border border-border text-xs text-foreground/90 font-sans flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />
                <span>Extracted: <strong className="text-foreground">Epigastric Pain</strong> • Onset: <strong className="text-foreground">Postprandial</strong> • Risk: <strong className="text-amber-600 dark:text-amber-400">Moderate</strong></span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <Link href="/voice" className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1.5 transition-colors">
              <span>Open Voice Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── CARD 2: Realtime Clinic Radar (5 cols) ── */}
        <div className="md:col-span-5 framer-card framer-card-interactive rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-medium">
                <Radio className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 animate-pulse" />
                <span>Live Facility Radar</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">GPS Auto-Routing</span>
            </div>

            <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2">
              Nearby Clinics &amp; Emergency Hubs
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Instant routing to accredited hospitals and clinics with live wait times, open status, and direct navigation paths.
            </p>

            {/* Radar Visualizer Window */}
            <div className="relative w-full h-44 rounded-2xl bg-card border border-border overflow-hidden flex items-center justify-center shadow-inner">
              {/* Radar concentric circles */}
              <div className="absolute w-16 h-16 rounded-full border border-emerald-500/20" />
              <div className="absolute w-28 h-28 rounded-full border border-emerald-500/20" />
              <div className="absolute w-40 h-40 rounded-full border border-emerald-500/20" />
              <div className="absolute w-full h-px bg-emerald-500/15" />
              <div className="absolute h-full w-px bg-emerald-500/15" />

              {/* Sweeping radar beam */}
              <div className="absolute w-40 h-40 origin-center animate-radar pointer-events-none">
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-emerald-400/30 to-transparent rounded-tl-full" />
              </div>

              {/* Pulsing Clinic Pins */}
              <div className="absolute top-8 left-12 flex items-center gap-1.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-background/90 px-1.5 py-0.5 rounded border border-emerald-500/30 font-semibold shadow-sm">
                  Apollo ER (0.8km)
                </span>
              </div>

              <div className="absolute bottom-9 right-10 flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
                </span>
                <span className="text-[10px] font-mono text-sky-700 dark:text-sky-300 bg-background/90 px-1.5 py-0.5 rounded border border-sky-500/30 font-semibold shadow-sm">
                  City Clinic (1.4km)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <Link href="/map" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 transition-colors">
              <span>View Live Map &amp; Navigation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── CARD 3: Specialist Directory Matching (5 cols) ── */}
        <div className="md:col-span-5 framer-card framer-card-interactive rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-mono font-medium">
                <Stethoscope className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                <span>Specialist Matching</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">Verified MDs</span>
            </div>

            <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2">
              Verified Doctors &amp; Instant Consults
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Matched algorithmically based on your symptom severity, differential diagnosis, and location proximity.
            </p>

            {/* Specialist Interactive Selector */}
            <div className="space-y-2">
              {specialists.map((sp, idx) => (
                <div
                  key={sp.title}
                  onClick={() => setActiveSpecialistIdx(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeSpecialistIdx === idx
                      ? 'bg-sky-500/10 border-sky-500/30 text-foreground font-semibold shadow-sm'
                      : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className={`w-4 h-4 ${activeSpecialistIdx === idx ? 'text-sky-500 dark:text-sky-400' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-medium">{sp.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span className="text-muted-foreground">Wait: {sp.queue}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{sp.fee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <Link href="/doctors" className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1.5 transition-colors">
              <span>Explore Doctor Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── CARD 4: Emergency Sentinel 24/7 (7 cols) ── */}
        <div className="md:col-span-7 framer-card framer-card-interactive rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group bg-gradient-to-br from-rose-500/5 via-card to-card border-rose-500/30">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono font-medium">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 animate-pulse" />
                <span>Emergency Sentinel 24/7</span>
              </div>
              <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold">Instant Hotline Sync</span>
            </div>

            <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2">
              Life-Threatening Symptom Interception
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mb-6">
              When critical red-flag symptoms are detected (anaphylaxis, stroke, chest pain), MedReach bypasses regular questionnaires and provides immediate dispatch instructions.
            </p>

            {/* Emergency Hotline Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="tel:112"
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all flex items-center justify-between group/hotline shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Call 112</div>
                    <div className="text-xs text-rose-600 dark:text-rose-300 font-medium">National Emergency</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-rose-500 group-hover/hotline:translate-x-1 transition-transform" />
              </a>

              <a
                href="tel:108"
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all flex items-center justify-between group/hotline shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Call 108</div>
                    <div className="text-xs text-rose-600 dark:text-rose-300 font-medium">Ambulance Dispatch</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-rose-500 group-hover/hotline:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <Link href="/emergency" className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5 transition-colors">
              <span>View Complete Emergency Protocol</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
