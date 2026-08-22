import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Send, Paperclip } from 'lucide-react';

interface ChatInputAreaProps {
  onSend: (text: string) => void;
  isTyping: boolean;
  isListening: boolean;
  onToggleListen: () => void;
}

export function ChatInputArea({ onSend, isTyping, isListening, onToggleListen }: ChatInputAreaProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    onSend(input);
    setInput('');
  };

  const handleImageAttach = () => {
    // Placeholder for image attachment logic
    alert("Image attachment coming soon!");
  };

  return (
    <div className="p-4 border-t border-slate-800 bg-slate-900/50">
      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your symptoms or use voice..."
          rows={1}
          className="min-h-[52px] max-h-32 pr-32 pb-4 resize-none bg-slate-800/50 border-slate-700 focus:border-teal-500 rounded-xl text-slate-100 placeholder:text-slate-500"
        />
        
        <div className="absolute right-2 bottom-2 flex gap-1">
          {/* Attach image (rash photo etc.) */}
          <Button variant="ghost" size="icon" type="button" onClick={handleImageAttach} className="text-slate-400 hover:text-teal-400 hover:bg-teal-500/10">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          {/* Voice input */}
          <Button 
            variant="ghost" 
            size="icon" 
            type="button"
            onClick={onToggleListen}
            className={`${isListening ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" : "text-slate-400 hover:text-teal-400 hover:bg-teal-500/10"}`}
          >
            {isListening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          {/* Send */}
          <Button 
            size="icon" 
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-teal-500 hover:bg-teal-600 text-white rounded-lg h-9 w-9 ml-1"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Character count / hint */}
      <div className="flex justify-between mt-2 text-xs text-slate-500 px-1">
        <span className="hidden sm:inline">Press Enter to send • Shift+Enter for new line</span>
        <span className="sm:hidden">Send message</span>
        <span>{input.length}/500</span>
      </div>
    </div>
  );
}
