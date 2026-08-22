import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Timer, Calendar, CalendarDays, CalendarRange } from 'lucide-react';

interface DurationPickerProps {
  onSelect: (duration: string) => void;
}

export function DurationPicker({ onSelect }: DurationPickerProps) {
  const options = [
    { icon: <Clock className="h-6 w-6 text-teal-500" />, label: "Just now", value: "just_now" },
    { icon: <Timer className="h-6 w-6 text-teal-500" />, label: "A few hours", value: "hours" },
    { icon: <Calendar className="h-6 w-6 text-teal-500" />, label: "1-2 days", value: "few_days" },
    { icon: <CalendarDays className="h-6 w-6 text-teal-500" />, label: "A week", value: "week" },
    { icon: <CalendarRange className="h-6 w-6 text-teal-500" />, label: "Weeks+", value: "weeks_plus" },
  ];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="ml-11 mt-2 grid grid-cols-5 gap-2"
    >
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.label)}
          className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-teal-500 hover:bg-slate-700/50 transition-colors w-full h-full"
        >
          {opt.icon}
          <span className="text-xs text-slate-300 text-center font-medium leading-tight">{opt.label}</span>
        </button>
      ))}
    </motion.div>
  );
}
