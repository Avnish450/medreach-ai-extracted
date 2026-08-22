import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BodyMapInputProps {
  onSelect: (part: string) => void;
}

export function BodyMapInput({ onSelect }: BodyMapInputProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="ml-11 mt-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700"
    >
      <p className="text-xs text-slate-400 mb-3">👆 Tap the area of your body:</p>
      
      <svg viewBox="0 0 200 400" className="w-48 mx-auto">
        {/* Head */}
        <ellipse 
          cx="100" cy="40" rx="30" ry="35"
          className={`cursor-pointer transition ${hovered === "head" ? "fill-teal-500" : "fill-slate-700"}`}
          onMouseEnter={() => setHovered("head")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelect("head")}
        />
        {/* Torso */}
        <rect 
          x="65" y="80" width="70" height="120" rx="10"
          className={`cursor-pointer transition ${hovered === "chest" ? "fill-teal-500" : "fill-slate-700"}`}
          onMouseEnter={() => setHovered("chest")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelect("chest")}
        />
        {/* Abdomen */}
        <rect 
          x="70" y="200" width="60" height="60" rx="8"
          className={`cursor-pointer transition ${hovered === "abdomen" ? "fill-teal-500" : "fill-slate-700"}`}
          onMouseEnter={() => setHovered("abdomen")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelect("abdomen")}
        />
        {/* Arms */}
        <rect x="35" y="90" width="20" height="110" rx="10" 
              className={`cursor-pointer transition ${hovered === "left arm" ? "fill-teal-500" : "fill-slate-700"}`} 
              onMouseEnter={() => setHovered("left arm")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect("left arm")} />
        <rect x="145" y="90" width="20" height="110" rx="10" 
              className={`cursor-pointer transition ${hovered === "right arm" ? "fill-teal-500" : "fill-slate-700"}`} 
              onMouseEnter={() => setHovered("right arm")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect("right arm")} />
        {/* Legs */}
        <rect x="70" y="265" width="25" height="130" rx="10" 
              className={`cursor-pointer transition ${hovered === "left leg" ? "fill-teal-500" : "fill-slate-700"}`} 
              onMouseEnter={() => setHovered("left leg")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect("left leg")} />
        <rect x="105" y="265" width="25" height="130" rx="10" 
              className={`cursor-pointer transition ${hovered === "right leg" ? "fill-teal-500" : "fill-slate-700"}`} 
              onMouseEnter={() => setHovered("right leg")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect("right leg")} />
      </svg>
      
      {hovered && (
        <p className="text-center text-sm text-teal-400 mt-2 capitalize">{hovered}</p>
      )}
    </motion.div>
  );
}
