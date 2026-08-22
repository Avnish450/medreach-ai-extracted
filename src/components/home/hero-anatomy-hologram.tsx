'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, HeartPulse, Activity, Bone, ScanSearch, ShieldAlert
} from 'lucide-react';

const ORGANS = [
  { id: 'brain', icon: Brain, label: 'Neurology', status: 'Optimal', y: 15, color: 'text-purple-400', glow: 'shadow-purple-500/50' },
  { id: 'heart', icon: HeartPulse, label: 'Cardiology', status: 'Irregular Rhythm', y: 40, color: 'text-rose-400', glow: 'shadow-rose-500/50', alert: true },
  { id: 'gi', icon: Activity, label: 'Gastrointestinal', status: 'Stable', y: 65, color: 'text-emerald-400', glow: 'shadow-emerald-500/50' },
  { id: 'bone', icon: Bone, label: 'Orthopedics', status: 'Scanning...', y: 85, color: 'text-sky-400', glow: 'shadow-sky-500/50' },
];

export function HeroAnatomyHologram() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync active organ with the scanner sweep (which takes ~4s to go down)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ORGANS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[3/4] max-h-[600px] flex items-center justify-center perspective-1000">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-sky-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Holographic Container */}
      <div className="relative w-full h-full framer-card bg-black/40 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden backdrop-blur-md flex items-center justify-center">
        
        {/* Hologram Projector Base (Bottom) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-sky-500/20 blur-2xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-8 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-sm rounded-full pointer-events-none" />

        {/* Vertical Scanning Laser */}
        <motion.div 
          className="absolute left-0 right-0 h-[2px] bg-cyan-400 z-50 shadow-[0_0_15px_3px_rgba(34,211,238,0.6)]"
          animate={{ top: ['5%', '95%', '5%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Scanning Laser Aura */}
        <motion.div 
          className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent z-40"
          animate={{ top: ['-5%', '85%', '-5%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Central Anatomical Axis (Spine/Core) */}
        <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-sky-500/50 to-transparent">
          {/* Pulsing energy down the spine */}
          <motion.div 
            className="w-[3px] h-20 bg-cyan-300 rounded-full blur-[2px] -ml-[1px]"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Abstract Digital Silhouette Background */}
        <div className="absolute inset-y-12 inset-x-8 opacity-20 pointer-events-none flex justify-center">
          <svg viewBox="0 0 100 200" className="h-full text-sky-300 stroke-current drop-shadow-[0_0_10px_rgba(125,211,252,0.8)]" fill="none" strokeWidth="0.5">
            {/* Head */}
            <circle cx="50" cy="20" r="12" strokeDasharray="2 2" />
            {/* Shoulders & Torso */}
            <path d="M 30 45 C 30 35, 70 35, 70 45 L 75 90 C 75 140, 65 150, 50 160 C 35 150, 25 140, 25 90 Z" strokeDasharray="3 3" />
            {/* Arms */}
            <path d="M 25 50 Q 10 70 15 110" strokeDasharray="1 4" />
            <path d="M 75 50 Q 90 70 85 110" strokeDasharray="1 4" />
          </svg>
        </div>

        {/* Organ Nodes & Data Panels */}
        <div className="absolute inset-0">
          {ORGANS.map((organ, index) => {
            const isActive = index === activeIndex;
            return (
              <div key={organ.id} className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-full" style={{ top: `${organ.y}%` }}>
                
                {/* Connecting Line to Panel */}
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={isActive ? { width: '80px', opacity: 1 } : { width: 0, opacity: 0 }}
                  className={`absolute h-[1px] ${organ.alert ? 'bg-rose-500' : 'bg-cyan-500'} right-1/2 mr-6 hidden sm:block`}
                />

                {/* The Organ Icon */}
                <motion.div 
                  animate={isActive ? { scale: [1, 1.2, 1], filter: 'brightness(1.5)' } : { scale: 1, filter: 'brightness(0.5)' }}
                  transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                  className={`relative z-20 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-500 ${isActive ? `bg-black/60 ${organ.glow}` : 'bg-black/20'}`}
                >
                  <organ.icon className={`w-5 h-5 ${isActive ? organ.color : 'text-slate-500'}`} />
                  {organ.alert && isActive && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
                  )}
                </motion.div>

                {/* Connecting Line to Panel (Right side for mobile/alternate) */}
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={isActive ? { width: '40px', opacity: 1 } : { width: 0, opacity: 0 }}
                  className={`absolute h-[1px] ${organ.alert ? 'bg-rose-500' : 'bg-cyan-500'} left-1/2 ml-6 sm:hidden`}
                />

                {/* Data Panel */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
                      className="absolute z-30 right-full mr-4 sm:mr-[100px] hidden sm:block w-48"
                    >
                      <div className={`p-3 rounded-xl border backdrop-blur-xl shadow-2xl ${organ.alert ? 'bg-rose-950/40 border-rose-500/50' : 'bg-slate-900/60 border-cyan-500/30'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {organ.alert ? <ShieldAlert className="w-3 h-3 text-rose-400" /> : <ScanSearch className="w-3 h-3 text-cyan-400" />}
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${organ.alert ? 'text-rose-400' : 'text-cyan-400'}`}>
                            {organ.label}
                          </span>
                        </div>
                        <div className="text-xs text-white font-medium mb-2">
                          Status: <span className={organ.alert ? 'text-rose-300 animate-pulse' : 'text-slate-300'}>{organ.status}</span>
                        </div>
                        {organ.alert && (
                          <div className="text-[9px] bg-rose-500/20 text-rose-200 px-2 py-1 rounded border border-rose-500/30">
                            Critical Triage Match Found. Dispatching...
                          </div>
                        )}
                        {!organ.alert && (
                          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-cyan-400 rounded-full"
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1.8 }}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mobile Data Panel (Right side) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="absolute z-30 left-1/2 ml-[60px] block sm:hidden w-32"
                    >
                      <div className={`p-2 rounded-lg border backdrop-blur-xl ${organ.alert ? 'bg-rose-950/40 border-rose-500/50' : 'bg-slate-900/60 border-cyan-500/30'}`}>
                        <span className={`text-[9px] font-mono block mb-1 ${organ.alert ? 'text-rose-400' : 'text-cyan-400'}`}>{organ.label}</span>
                        <span className="text-[10px] text-white font-medium">{organ.status}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>



      </div>
    </div>
  );
}
