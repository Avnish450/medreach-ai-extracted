'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Bot, User, AlertTriangle, ArrowRight, Mic, MicOff, RefreshCw,
  Plus, Check, X, ShieldAlert, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { symptomCategories } from '@/lib/data/symptoms';
import { ChatMessage, TriageResult, UrgencyLevel } from '@/types';
import { UrgencyBadge } from '@/components/shared/urgency-badge';
import { Disclaimer } from '@/components/shared/disclaimer';

export default function AssessmentPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showSymptomPicker, setShowSymptomPicker] = useState(true);
  const [currentRegion, setCurrentRegion] = useState<string>('general');
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        id: 'greet',
        role: 'assistant',
        content: "Hello! I am your AI clinical assistant. Describe what you are feeling in your own words, or choose symptoms from the guided selector below to begin your triage.",
        timestamp: new Date()
      }
    ]);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
    setShowSymptomPicker(false);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: textToSend,
          chatHistory: messages.map((m) => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Check if urgent emergency redirect is triggered
        if (data.urgency === 'emergency') {
          router.push('/emergency');
          return;
        }

        // Save latest triage result to LocalStorage so recommendations page can fetch it
        localStorage.setItem('medreach_latest_triage', JSON.stringify(data));

        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: `Thank you for sharing. Based on my analysis: I have classified the urgency level as "${data.urgency.toUpperCase()}". I recommend speaking with a ${data.recommendedSpecialist || 'General Physician'}.`,
          timestamp: new Date(),
          triageResult: data
        };

        setMessages((prev) => [...prev, assistantMsg]);
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
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 max-w-7xl min-h-[calc(100vh-8rem)]">

      {/* Left Pane - Chat Assistant */}
      <div className="flex-grow flex flex-col gap-4 lg:w-3/5">
        <Card className="flex-grow flex flex-col min-h-[500px] shadow-lg border-border/40 backdrop-blur">
          <CardHeader className="border-b border-border/40 py-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              <div>
                <CardTitle className="text-base font-bold">Triage Chat Assistant</CardTitle>
                <CardDescription className="text-xs">AI-driven symptom analysis</CardDescription>
              </div>
            </div>
            {selectedSymptoms.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedSymptoms([]);
                  setInputValue('');
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear Selection
              </Button>
            )}
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="flex-grow overflow-y-auto p-4 max-h-[450px] space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0 ${msg.role === 'user'
                      ? 'bg-teal-600'
                      : 'bg-muted border border-border text-teal-600 dark:text-teal-400'
                    }`}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                        ? 'bg-teal-600 text-white rounded-tr-none'
                        : 'bg-muted/80 text-foreground rounded-tl-none border border-border/40'
                      }`}>
                      {msg.content}

                      {/* Render Triage Result inside chat bubble */}
                      {msg.triageResult && (
                        <div className="mt-4 pt-4 border-t border-border/40 flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-muted-foreground">Urgency Classification:</span>
                            <UrgencyBadge urgency={msg.triageResult.urgency} />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-muted-foreground">Recommended Specialist:</span>
                            <Badge variant="outline" className="font-bold border-teal-500/20 text-teal-600 dark:text-teal-400">
                              {msg.triageResult.recommendedSpecialist}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Suggested Next Steps:</p>
                            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1 pl-1">
                              {msg.triageResult.nextSteps.slice(0, 3).map((step, sIdx) => (
                                <li key={sIdx}>{step}</li>
                              ))}
                            </ul>
                          </div>
                          <Button
                            className="mt-3 w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 flex items-center justify-center gap-1"
                            onClick={() => router.push('/recommendations')}
                          >
                            Go to Recommendations Dashboard
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground/80 self-end px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="flex gap-3 mr-auto items-center">
                <div className="h-8 w-8 rounded-full bg-muted border border-border text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted/80 border border-border/40 rounded-2xl rounded-tl-none p-4 text-sm flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-bounce" />
                  <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-bounce delay-75" />
                  <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-bounce delay-150" />
                  <span className="text-xs text-muted-foreground font-semibold ml-1">AI analyzing symptoms...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </CardContent>

          {/* Form Input */}
          <CardFooter className="border-t border-border/40 p-4 flex flex-col gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="flex w-full items-end gap-2"
            >
              <div className="flex-grow relative">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe your symptoms (e.g. 'I have had a mild headache and fever for 2 days...')"
                  className="min-h-[60px] pr-10 resize-none rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(inputValue);
                    }
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={isListening ? stopListening : startListening}
                  className={`absolute right-2 bottom-2 h-8 w-8 rounded-full ${isListening ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20' : 'text-muted-foreground'
                    }`}
                  title={isListening ? 'Stop Listening' : 'Voice Input'}
                >
                  {isListening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                type="submit"
                size="icon"
                className="h-12 w-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md"
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            <div className="w-full">
              <Disclaimer />
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Right Pane - Guided Symptom Picker */}
      <AnimatePresence>
        {showSymptomPicker && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full lg:w-2/5 flex flex-col gap-4"
          >
            <Card className="shadow-lg border-border/40 backdrop-blur h-full flex flex-col">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-base font-bold flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                  <Sparkles className="h-5 w-5" />
                  Guided Symptom Selector
                </CardTitle>
                <CardDescription className="text-xs">
                  Select common symptoms by body region to auto-populate the description field.
                </CardDescription>
              </CardHeader>

              {/* Category tabs */}
              <div className="flex gap-1 overflow-x-auto p-2 border-b border-border/40 bg-muted/45 shrink-0 scrollbar-none">
                {symptomCategories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={currentRegion === cat.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentRegion(cat.id)}
                    className="text-xs flex gap-1 items-center whitespace-nowrap"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Button>
                ))}
              </div>

              {/* Symptoms Grid */}
              <CardContent className="flex-grow p-4 overflow-y-auto max-h-[350px]">
                <div className="grid grid-cols-2 gap-2">
                  {activeCategory.symptoms.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom.name);
                    return (
                      <Button
                        key={symptom.id}
                        type="button"
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => handleToggleSymptom(symptom.name)}
                        className={`h-auto py-3 px-3 justify-start text-left text-xs font-semibold rounded-xl flex items-center gap-2 border-border/50 ${symptom.isEmergency && !isSelected ? 'border-red-500/30 text-red-500 hover:bg-red-500/5' : ''
                          }`}
                      >
                        <span className={`h-4 w-4 rounded-full border border-current flex items-center justify-center shrink-0 ${isSelected ? 'bg-white text-teal-600' : ''
                          }`}>
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </span>
                        <span className="truncate">{symptom.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>

              {/* Selected symptoms preview */}
              {selectedSymptoms.length > 0 && (
                <CardFooter className="border-t border-border/40 p-4 bg-muted/20 flex flex-col gap-2 shrink-0">
                  <span className="text-xs font-bold text-muted-foreground self-start">Selected Symptoms:</span>
                  <div className="flex flex-wrap gap-1.5 w-full">
                    {selectedSymptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 flex items-center gap-1 py-1 pr-1"
                      >
                        {symptom}
                        <X
                          className="h-3 w-3 hover:bg-teal-500/20 rounded-full cursor-pointer"
                          onClick={() => handleToggleSymptom(symptom)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
