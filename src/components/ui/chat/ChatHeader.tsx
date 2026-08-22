import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, RefreshCw, Share2, History } from 'lucide-react';

interface ChatHeaderProps {
  isTyping: boolean;
  onReset: () => void;
  onShare: () => void;
  onHistory: () => void;
}

export function ChatHeader({ isTyping, onReset, onShare, onHistory }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900 animate-pulse" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-100">Dr. MedReach AI</h2>
          <p className="text-xs text-slate-400">
            {isTyping ? "Analyzing..." : "AI Clinical Assistant • Online"}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onReset} className="text-slate-300 hover:text-white">
          <RefreshCw className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">New Session</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onShare} className="text-slate-300 hover:text-white">
          <Share2 className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onHistory} className="text-slate-300 hover:text-white">
          <History className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">History</span>
        </Button>
      </div>
    </div>
  );
}
