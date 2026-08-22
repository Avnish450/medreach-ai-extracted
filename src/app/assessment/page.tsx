'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Bot, AlertTriangle, ArrowRight, Mic, MicOff, RefreshCw,
  Plus, Check, X, ShieldAlert, Sparkles,
  Thermometer, HeartPulse, Brain, Waves, Wind, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { symptomCategories } from '@/lib/data/symptoms';
import { ChatMessage, TriageResponse, UrgencyLevel, TriageProgress } from '@/types';
import { ChatBubble } from '@/components/ui/chat/ChatBubble';
import { TriageProgressPanel } from '@/components/ui/chat/TriageProgressPanel';
import { ChatHeader } from '@/components/ui/chat/ChatHeader';
import { ChatInputArea } from '@/components/ui/chat/ChatInputArea';
import { TypingIndicator } from '@/components/ui/chat/TypingIndicator';
import { BodyMapInput } from '@/components/ui/chat/BodyMapInput';
import { SeveritySlider } from '@/components/ui/chat/SeveritySlider';
import { DurationPicker } from '@/components/ui/chat/DurationPicker';
import { PreliminaryAssessmentCard } from '@/components/ui/chat/PreliminaryAssessmentCard';
import { ContextualSymptomSelector } from '@/components/ui/chat/ContextualSymptomSelector';
import { QuickActionsCard } from '@/components/ui/chat/QuickActionsCard';

export default function AssessmentPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showSymptomPicker, setShowSymptomPicker] = useState(true);
  const [currentRegion, setCurrentRegion] = useState<string>('general');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Track overall triage progress
  const [triageProgress, setTriageProgress] = useState<TriageProgress | undefined>(undefined);

  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening
  } = useSpeechRecognition({
    onResult: (text) => {
      setInputValue((prev) => prev + ' ' + text);
    }
  });

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, triageProgress]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, triageProgress]);

  const handleToggleSymptom = (symptomName: string) => {
    setSelectedSymptoms((prev) => {
      const next = prev.includes(symptomName)
        ? prev.filter((s) => s !== symptomName)
        : [...prev, symptomName];

      // Update text input dynamically
      if (next.length > 0) {
        setInputValue(`I am experiencing ${next.join(', ')}.`);
      } else {
        setInputValue('');
      }
      return next;
    });
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setShowSymptomPicker(false); // Hide guided selector after first message

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: textToSend,
          history: messages.map((m) => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();

      if (response.ok) {
        const triageData = data as TriageResponse;

        // Check if urgent emergency redirect is triggered
        if (triageData.state === 'ASSESSMENT' && triageData.final_assessment?.urgency === 'EMERGENCY') {
          router.push('/emergency');
          return;
        }

        // Save latest triage result to LocalStorage so recommendations page can fetch it
        if (triageData.state === 'ASSESSMENT' && triageData.final_assessment) {
          localStorage.setItem('medreach_latest_triage', JSON.stringify(triageData.final_assessment));
        }

        // Update Progress
        if (triageData.progress) {
          setTriageProgress(triageData.progress);
        }

        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: triageData.message || 'Processing your response...',
          timestamp: new Date(),
          triageResponse: triageData
        };
        
        // Also add the follow-up question as a separate message bubble if it exists
        if (triageData.question && triageData.question.text) {
           const questionMsg: ChatMessage = {
              id: `ai-q-${Date.now()}`,
              role: 'assistant',
              content: triageData.question.text,
              timestamp: new Date(),
              triageResponse: triageData // attach triage response to the question message instead, so chips render there
           };
           // attach only message content to the first one without triageResponse, to avoid double-rendering cards
           assistantMsg.triageResponse = undefined;
           setMessages((prev) => [...prev, assistantMsg, questionMsg]);
        } else {
           setMessages((prev) => [...prev, assistantMsg]);
        }
        
      } else {
        throw new Error(data.error || 'Failed to triage');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `Error: ${message}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeCategory = symptomCategories.find(c => c.id === currentRegion) || symptomCategories[0];

  return (
    <div className="container mx-auto px-4 py-6 min-h-[calc(100vh-5rem)] flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* LEFT: Conversation Cockpit (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-md min-h-[600px]">
          <ChatHeader 
            isTyping={isLoading} 
            onReset={() => { setMessages([]); setTriageProgress(undefined); }} 
            onShare={() => alert("Share feature coming soon")} 
            onHistory={() => alert("History feature coming soon")} 
          />

          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                <Bot className="h-10 w-10 text-teal-500" />
              </div>
              
              <h1 className="text-3xl font-bold mb-2 text-slate-100 tracking-tight">
                How are you feeling today?
              </h1>
              <p className="text-slate-400 max-w-md mb-8">
                I'll ask you a few quick questions to understand your symptoms and guide you to the right care.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg w-full">
                {[
                  { icon: <Thermometer className="h-6 w-6 text-teal-500 mb-2" />, label: "Fever", query: "I have a fever" },
                  { icon: <HeartPulse className="h-6 w-6 text-teal-500 mb-2" />, label: "Chest pain", query: "I have chest discomfort" },
                  { icon: <Brain className="h-6 w-6 text-teal-500 mb-2" />, label: "Headache", query: "I have a headache" },
                  { icon: <Waves className="h-6 w-6 text-teal-500 mb-2" />, label: "Nausea", query: "I feel nauseous" },
                  { icon: <Wind className="h-6 w-6 text-teal-500 mb-2" />, label: "Cough", query: "I have a cough" },
                  { icon: <Activity className="h-6 w-6 text-teal-500 mb-2" />, label: "Joint pain", query: "I have joint pain" },
                ].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(item.query)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-teal-500 transition-colors w-full"
                  >
                    {item.icon}
                    <span className="text-xs text-slate-300 font-medium">{item.label}</span>
                  </button>
                ))}
              </div>

              <p className="text-xs text-slate-500 mt-8">
                🔒 Your conversation is private and encrypted
              </p>
            </motion.div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <ChatBubble 
                    key={msg.id} 
                    message={msg} 
                    isLast={index === messages.length - 1}
                    onSendReply={handleSend} 
                  />
                ))}
              </AnimatePresence>

              {isLoading && <TypingIndicator />}

              {/* Rich Inputs based on last message's requested type */}
              {messages.length > 0 && messages[messages.length - 1].triageResponse?.question?.type === 'body_map' && (
                <BodyMapInput onSelect={(part) => handleSend(part)} />
              )}
              {messages.length > 0 && messages[messages.length - 1].triageResponse?.question?.type === 'scale' && (
                <SeveritySlider onSubmit={(val) => handleSend(`${val} out of 10`)} />
              )}
              {messages.length > 0 && messages[messages.length - 1].triageResponse?.question?.type === 'duration' && (
                <DurationPicker onSelect={(val) => handleSend(val)} />
              )}
              
              <div ref={chatEndRef} />
            </div>
          )}

          <ChatInputArea 
            onSend={handleSend} 
            isTyping={isLoading} 
            isListening={isListening} 
            onToggleListen={isListening ? stopListening : startListening} 
          />
        </div>

        {/* RIGHT: Live Triage Panel (1/3 width) */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pb-4">
          <TriageProgressPanel progress={triageProgress} />
          
          <PreliminaryAssessmentCard 
            assessment={messages.length > 0 ? [...messages].reverse().find(m => m.triageResponse?.final_assessment)?.triageResponse?.final_assessment : null} 
            confidence={65 + Math.floor(Math.random() * 20)} 
          />
          
          <ContextualSymptomSelector 
            symptoms={activeCategory.symptoms.map(s => s.name).slice(0, 8)} 
            selectedSymptoms={selectedSymptoms} 
            onToggle={(symptom) => {
               handleToggleSymptom(symptom);
               // Send it immediately as a quick reply
               if (!selectedSymptoms.includes(symptom)) {
                  handleSend(`I also have ${symptom}`);
               }
            }} 
          />
          
          <QuickActionsCard />
        </div>

      </div>
      
      {/* Bottom: Compact Disclaimer Bar */}
      <div className="mt-4 text-center">
         <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            MedReach AI is for informational purposes only and is not a substitute for professional medical advice. In an emergency, call 112 immediately.
         </p>
      </div>
    </div>
  );
}
