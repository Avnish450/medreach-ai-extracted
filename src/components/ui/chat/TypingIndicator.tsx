import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
        <Bot className="h-5 w-5 text-teal-400" />
      </div>
      <div className="bg-slate-800/70 rounded-2xl rounded-tl-sm px-4 py-4 border border-slate-700 flex items-center h-10">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-teal-400"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
