'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Heart, Star, Coffee, Users } from 'lucide-react';
import { usePatientSosStore } from '@/store/use-patient-sos-store';
import { motion } from 'framer-motion';

export function CompletedStage() {
  const { volunteer, reset } = usePatientSosStore();
  const [rating, setRating] = useState(0);

  return (
    <Card className="shadow-2xl border-emerald-500/30 overflow-hidden relative bg-black/60 backdrop-blur-md w-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
      
      <CardHeader className="bg-emerald-950/30 pb-4 border-b border-emerald-900/30 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2"
        >
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </motion.div>
        <CardTitle className="text-2xl font-extrabold text-white">
          Arrived at Hospital
        </CardTitle>
        <p className="text-emerald-400 font-medium">Safe and sound.</p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        
        {/* Impact Message */}
        <div className="text-center space-y-2">
          <Heart className="w-8 h-8 text-red-500 mx-auto animate-pulse" />
          <h3 className="text-xl font-bold text-white">
            {volunteer?.name || 'Rahul'} just saved a life 💚
          </h3>
          <p className="text-slate-400 text-sm">
            Community Rescue Network thrives on heroes like {volunteer?.name || 'Rahul'}.
          </p>
        </div>

        {/* Rating */}
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center space-y-4">
          <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Rate Your Rescue</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`transition-all ${rating >= star ? 'text-amber-400 scale-110' : 'text-slate-700 hover:text-slate-500'}`}
              >
                <Star className={`w-8 h-8 ${rating >= star ? 'fill-amber-400' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="bg-amber-600 hover:bg-amber-500 text-white h-14 rounded-xl flex flex-col gap-1">
            <Coffee className="w-4 h-4" />
            <span className="text-xs">Chip in for Fuel</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-xl flex flex-col gap-1">
            <Users className="w-4 h-4" />
            <span className="text-xs">Become a Volunteer</span>
          </Button>
        </div>

        <Button 
          onClick={reset} 
          variant="ghost" 
          className="w-full text-slate-500 hover:text-white mt-4"
        >
          Return to Home
        </Button>

      </CardContent>
    </Card>
  );
}
