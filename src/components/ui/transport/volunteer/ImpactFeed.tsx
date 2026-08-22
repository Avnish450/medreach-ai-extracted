import React from 'react';
import { motion } from 'framer-motion';
import { PartyPopper, MessageSquareHeart } from 'lucide-react';

const FEED_ITEMS = [
  {
    id: 1,
    type: 'rescue',
    title: '🎉 You just helped save a life!',
    desc: 'Your rescue helped Priya reach Apollo Hospital in 12 minutes.',
    testimonial: '"Thank you, Rahul. You\'re a real hero." — Priya\'s family',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'milestone',
    title: '🏆 New Milestone Reached',
    desc: 'You just completed your 10th rescue! The Life Saver x10 badge has been added to your profile.',
    time: 'Yesterday',
  }
];

export function ImpactFeed() {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
        <MessageSquareHeart className="w-4 h-4 text-emerald-500" /> Impact Feed
      </h3>
      <div className="space-y-3">
        {FEED_ITEMS.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80"
          >
            <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
              {item.type === 'rescue' ? <PartyPopper className="w-3.5 h-3.5 text-yellow-500" /> : null}
              {item.title}
            </h4>
            <p className="text-xs text-slate-300 mb-2 leading-relaxed">
              {item.desc}
            </p>
            {item.testimonial && (
              <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/50 italic text-[11px] text-slate-400">
                {item.testimonial}
              </div>
            )}
            <p className="text-[10px] text-slate-500 mt-2 font-medium">{item.time}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
