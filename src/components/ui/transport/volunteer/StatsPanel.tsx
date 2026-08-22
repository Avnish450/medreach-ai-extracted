import React from 'react';
import { Trophy, Clock, Heart, Users } from 'lucide-react';

export function StatsPanel() {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
          <Heart className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider">Lives Helped</span>
        </div>
        <div className="text-2xl font-black text-white">12</div>
      </div>
      
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider">Avg Response</span>
        </div>
        <div className="text-2xl font-black text-white">4.2 <span className="text-sm font-medium text-slate-500">min</span></div>
      </div>

      <div className="col-span-2 bg-gradient-to-r from-blue-900/20 to-emerald-900/20 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-blue-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">City Rank (Mumbai)</span>
          </div>
          <div className="text-xl font-black text-white">Top 3% <span className="text-sm font-medium text-slate-400 font-normal">of responders</span></div>
        </div>
        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
          <span className="text-xl font-bold text-blue-400">#3</span>
        </div>
      </div>
    </div>
  );
}
