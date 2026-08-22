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
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((opt, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="text-xs border-teal-500/30 hover:bg-teal-500/10 text-teal-700 dark:text-teal-300 bg-teal-500/5"
            onClick={() => onSelect(opt)}
          >
            {opt}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
