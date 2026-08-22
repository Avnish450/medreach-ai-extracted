import React, { useState, useEffect } from 'react';

export function StreamingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20); // 20ms per character
    return () => clearInterval(interval);
  }, [text]);
  
  return (
    <p className="text-sm leading-relaxed whitespace-pre-wrap">
      {displayed}
      {displayed.length < text.length && <span className="animate-pulse">▊</span>}
    </p>
  );
}
