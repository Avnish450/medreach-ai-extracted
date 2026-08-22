import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface SeveritySliderProps {
  onSubmit: (value: number) => void;
}

export function SeveritySlider({ onSubmit }: SeveritySliderProps) {
  const [value, setValue] = useState(5);
  
  const labels = ["None", "Very Mild", "Mild", "Discomforting", "Moderate", "Distressing", "Severe", "Intense", "Very Intense", "Excruciating", "Unbearable"];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="ml-11 mt-2 p-5 rounded-xl bg-slate-800 border border-slate-700 shadow-sm"
    >
      <p className="text-xs text-slate-400 mb-6 font-medium">Rate your pain from 0 (none) to 10 (unbearable):</p>
      
      <div className="flex flex-col items-center justify-center mb-6 h-24">
        <div className={`text-5xl font-bold transition-colors ${
          value === 0 ? "text-slate-400" :
          value < 4 ? "text-green-400" :
          value < 7 ? "text-yellow-400" :
          "text-red-500"
        }`}>{value}</div>
        <div className="text-sm font-medium text-slate-300 mt-2">{labels[value]}</div>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={([v]) => setValue(v)}
        min={0}
        max={10}
        step={1}
        className="mb-4"
      />
      
      <Button onClick={() => onSubmit(value)} className="w-full bg-teal-500 hover:bg-teal-600">
        Submit
      </Button>
    </motion.div>
  );
}
