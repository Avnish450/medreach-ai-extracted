import React from 'react';
import { ShieldCheck, HeartPulse, Zap, Heart, Moon, Stethoscope, Car } from 'lucide-react';

const BADGES = [
  { id: 'first_aid', icon: ShieldCheck, color: 'text-red-500', bg: 'bg-red-500/10', label: 'First Aid Certified', description: 'Verified First Aid Certification' },
  { id: 'cpr', icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'CPR Certified', description: 'Verified CPR Certification' },
  { id: 'fast_responder', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Fast Responder', description: 'Average response time <5 min' },
  { id: 'life_saver_10', icon: Heart, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Life Saver x10', description: 'Helped 10+ patients' },
  { id: 'night_owl', icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-400/10', label: 'Night Owl', description: 'Completed 10+ night rescues' },
  { id: 'medical_pro', icon: Stethoscope, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Verified Med Pro', description: 'Verified Medical Professional' },
  { id: 'reliable', icon: Car, color: 'text-slate-300', bg: 'bg-slate-300/10', label: 'Reliable', description: '95%+ Acceptance Rate' }
];

export function BadgesDisplay({ earnedBadgeIds }: { earnedBadgeIds: string[] }) {
  return (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
      <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Earned Badges</h3>
      <div className="flex flex-wrap gap-2">
        {BADGES.filter(b => earnedBadgeIds.includes(b.id)).map((badge) => {
          const Icon = badge.icon;
          return (
            <div 
              key={badge.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${badge.bg} border border-slate-700/50 hover:border-slate-600 transition-colors cursor-help group relative`}
            >
              <Icon className={`w-3.5 h-3.5 ${badge.color}`} />
              <span className={`text-[11px] font-bold ${badge.color}`}>{badge.label}</span>
              
              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-slate-800">
                {badge.description}
              </div>
            </div>
          );
        })}
        {earnedBadgeIds.length === 0 && (
          <p className="text-xs text-slate-500">Complete rescues to earn badges.</p>
        )}
      </div>
    </div>
  );
}
