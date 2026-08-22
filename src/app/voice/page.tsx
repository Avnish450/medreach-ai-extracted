'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Mic, MicOff, Volume2, VolumeX, ShieldAlert, ArrowRight, Activity, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { Disclaimer } from '@/components/shared/disclaimer';
import { UrgencyBadge } from '@/components/shared/urgency-badge';
import { TriageResponse, UrgencyLevel, ChatMessage } from '@/types';

export default function VoicePage() {
  const router = useRouter();
  const [statusText, setStatusText] = useState('Tap the microphone to speak your symptoms.');
  const [triageResponse, setTriageResponse] = useState<TriageResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSpeechSupported
  } = useSpeechRecognition({
    onResult: (text) => {
      setSpokenText(text);
    }
  });

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isSupported: isTtsSupported
  } = useTextToSpeech();

  // Handle voice transcript processing
  useEffect(() => {
    if (isListening) return;
    if (!transcript.trim()) return;

    const processVoiceInput = async (inputText: string) => {
      setIsProcessing(true);
      setStatusText('AI is analyzing your voice input...');
      
      const updatedHistory = [...chatHistory, { role: 'user' as const, content: inputText }];
      setChatHistory(updatedHistory);

      try {
        const response = await fetch('/api/triage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userInput: inputText, chatHistory })
        });
        const data: TriageResponse = await response.json();

        if (response.ok) {
          if (data.state === 'ASSESSMENT' && data.final_assessment?.urgency === 'EMERGENCY') {
            speak('Warning: Your symptoms suggest a potential medical emergency. Seek immediate care.');
            router.push('/emergency');
            return;
          }

          setTriageResponse(data);
          
          if (data.state === 'ASSESSMENT' && data.final_assessment) {
            localStorage.setItem('medreach_latest_triage', JSON.stringify(data.final_assessment));
          }

          let spokenAnswer = data.message;
          if (data.question && data.question.text) {
              spokenAnswer += " " + data.question.text;
          }
          speak(spokenAnswer);
          
          setChatHistory((prev) => [...prev, { role: 'assistant', content: spokenAnswer }]);
          setStatusText(data.state === 'ASSESSMENT' ? 'Analysis complete. Spoken feedback active.' : 'Please reply to the question.');
        } else {
          throw new Error((data as any).error);
        }
      } catch (err) {
        const error = err as Error & { message?: string };
        setStatusText(`Error parsing symptoms: ${error?.message || 'Please try again.'}`);
      } finally {
        setIsProcessing(false);
      }
    };

    // Defer side-effect to avoid React lint complaining about cascading renders.
    const id = window.setTimeout(() => {
      void processVoiceInput(transcript);
    }, 0);

    return () => window.clearTimeout(id);
  }, [isListening, transcript, router, speak]);

  const handleMicToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    }

    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setSpokenText('');
      startListening();
      setStatusText('Listening... describe your symptoms now.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl flex flex-col justify-center items-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full shadow-2xl border-border/40 backdrop-blur">
        <CardHeader className="text-center pb-6 border-b border-border/40">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400">
            <Mic className="h-6 w-6" />
            AI Voice Consultation
          </CardTitle>
          <CardDescription>
            Conduct a full medical symptom triage using hands-free natural speech input &amp; output.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center py-10 gap-8">

          {/* Animated Microphone Ring */}
          <div className="relative flex items-center justify-center">

            {/* Listening waves */}
            {isListening && (
              <>
                <span className="absolute h-36 w-36 rounded-full bg-teal-500/10 animate-ping" />
                <span className="absolute h-28 w-28 rounded-full bg-teal-500/20 animate-pulse" />
              </>
            )}

            {/* Speaking waves */}
            {isSpeaking && (
              <>
                <span className="absolute h-36 w-36 rounded-full bg-emerald-500/10 animate-pulse" />
                <span className="absolute h-28 w-28 rounded-full bg-emerald-500/20 animate-ping" />
              </>
            )}

            <Button
              onClick={handleMicToggle}
              size="icon"
              className={`h-24 w-24 rounded-full shadow-xl transition-all duration-300 relative z-10 ${isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : isSpeaking
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
            >
              {isListening ? (
                <MicOff className="h-10 w-10 animate-pulse" />
              ) : isSpeaking ? (
                <VolumeX className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </Button>
          </div>

          {/* Status message */}
          <div className="text-center max-w-md">
            <p className="font-semibold text-sm text-foreground">{statusText}</p>
            {isListening && (
              <span className="text-xs text-red-500 font-bold tracking-widest animate-pulse uppercase mt-1 block">
                Recording... Speak now
              </span>
            )}
            {isSpeaking && (
              <span className="text-xs text-emerald-500 font-bold tracking-widest animate-pulse uppercase mt-1 block flex items-center justify-center gap-1">
                <Volume2 className="h-3 w-3" />
                AI Speaking Response
              </span>
            )}
          </div>

          {/* Real-time transcript box */}
          {(transcript || spokenText) && (
            <div className="w-full bg-muted/50 border border-border/40 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Your Speech:</span>
              <p className="text-sm italic text-foreground">
                &ldquo;{transcript || spokenText}&rdquo;
              </p>
            </div>
          )}

          {/* AI Response Text Box for better accessibility */}
          {!isListening && triageResponse && (
            <div className="w-full bg-teal-500/10 border border-teal-500/20 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase block mb-1">AI Response:</span>
              <p className="text-sm text-foreground">
                {triageResponse.message} {triageResponse.question?.text}
              </p>
            </div>
          )}

          {/* Triage Summary display in-place */}
          {triageResponse && triageResponse.state === 'ASSESSMENT' && triageResponse.final_assessment && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full border border-teal-500/20 bg-teal-500/5 rounded-2xl p-5 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-muted-foreground">Final Assessment</span>
                <UrgencyBadge urgency={triageResponse.final_assessment.urgency.toLowerCase() as UrgencyLevel} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-xl p-3 border border-border/30">
                  <span className="text-xs text-muted-foreground block">Specialist Match</span>
                  <span className="font-bold text-sm text-teal-600 dark:text-teal-400 mt-1 block">
                    {triageResponse.final_assessment.recommended_specialties?.[0] || 'General Physician'}
                  </span>
                </div>
                <div className="bg-background/50 rounded-xl p-3 border border-border/30">
                  <span className="text-xs text-muted-foreground block">Time to Care</span>
                  <span className="font-bold text-sm text-foreground mt-1 block">
                    {triageResponse.final_assessment.time_to_care}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => router.push('/recommendations')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center justify-center gap-1 py-3 text-xs"
              >
                Open Recommendations Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-border/40 p-4">
          <Disclaimer />
        </CardFooter>
      </Card>
    </div>
  );
}
