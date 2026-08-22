import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface QuickReplyChipsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export function QuickReplyChips({ options, onSelect, disabled }: QuickReplyChipsProps) {
  if (!options || options.length === 0) return null;

  return (
    <motion.div 
      className="flex flex-wrap gap-2 ml-11 mt-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {options.map((opt, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(opt)}
          disabled={disabled}
          className="px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-sm hover:bg-teal-500/20 transition"
        >
          {opt}
        </motion.button>
      ))}
    </motion.div>
  );
}
