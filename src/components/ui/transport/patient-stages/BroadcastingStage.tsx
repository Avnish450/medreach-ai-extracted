'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { usePatientSosStore } from '@/store/use-patient-sos-store';

export function BroadcastingStage({ onCancel }: { onCancel: () => void }) {
  const { setStage, incidentId } = usePatientSosStore();
  const [countdown, setCountdown] = useState(180);
  const [feedIndex, setFeedIndex] = useState(0);

  const feedMessages = [
    { text: "📡 Signal sent to 12 volunteers", color: "text-slate-400" },
    { text: "👀 3 volunteers viewing your request", color: "text-slate-300" },
    { text: "✅ 1 volunteer accepting...", color: "text-emerald-400 font-bold" }
  ];

  // Auto-escalation countdown
  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = "tel:112";
      // In a real app, we would also update the incident status in Supabase here
      setStage('ESCALATED');
      return;
    }
    const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, setStage]);

  // Simulate feed updates
  useEffect(() => {
    if (feedIndex < feedMessages.length - 1) {
      const timer = setTimeout(() => {
        setFeedIndex(prev => prev + 1);
      }, feedIndex === 0 ? 3000 : 2500);
      return () => clearTimeout(timer);
    }
  }, [feedIndex]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50 p-4"
    >
      {/* Pulsing SOS Circle */}
      <div className="relative mt-8">
        <motion.div
          className="absolute inset-0 rounded-full bg-red-500/50"
          animate={{ scale: [1, 2.5], opacity: [1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-red-500/30"
          animate={{ scale: [1, 2], opacity: [1, 0] }}
          transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
        />
        <div className="relative w-40 h-40 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.8)] border-4 border-red-500">
          <span className="text-6xl animate-pulse">🆘</span>
        </div>
      </div>

      <h2 className="text-4xl font-black mt-12 text-white">Broadcasting SOS...</h2>
      <p className="text-slate-400 mt-2 text-lg">
        Pinging volunteers within 5km radius
      </p>

      {/* Volunteer Response Feed */}
      <div className="mt-12 w-full max-w-sm space-y-3 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 h-40">
        {feedMessages.slice(0, feedIndex + 1).map((msg, idx) => (
          <motion.p 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-sm ${msg.color} flex items-center`}
          >
            {msg.text}
          </motion.p>
        ))}
      </div>

      {/* Countdown Timer */}
      <div className="mt-12 flex flex-col items-center">
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Auto-escalating to 112 in</p>
        <div className="text-6xl font-black text-amber-500 tabular-nums tracking-tighter shadow-amber-500/50 drop-shadow-lg">
          {countdown}s
        </div>
      </div>

      {/* Cancel Button */}
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="mt-16 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full px-8 h-12"
      >
        Cancel SOS Request
      </Button>
    </motion.div>
  );
}
