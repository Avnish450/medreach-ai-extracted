"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SiriOrb from "@/components/ui/smoothui/siri-orb";
import { type AIState } from "@/components/ui/smoothui/ai-core";
import { ConversationHistory } from "@/components/ui/voice/conversation-history";
import { VoiceControls } from "@/components/ui/voice/voice-controls";
import { LanguageSelector } from "@/components/ui/voice/language-selector";
import { TriageProgressBar } from "@/components/ui/voice/triage-progress-bar";
import { LiveTranscript } from "@/components/ui/voice/live-transcript";
import { EmergencyBanner } from "@/components/ui/voice/emergency-banner";
import { FinalAssessmentCard } from "@/components/ui/voice/final-assessment-card";
import { VoiceSelector } from "@/components/ui/voice/voice-selector";
import { SpeechRateSlider } from "@/components/ui/voice/speech-rate-slider";
import { Toggle } from "@/components/ui/toggle";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SpeechEngine, VoiceState } from "@/lib/voice/speech-engine";
import { AudioAnalyzer } from "@/lib/voice/audio-analyzer";
import { detectEmergency } from "@/lib/triage/emergency-detector";
import { useVoiceStore } from "@/lib/store/voice-store";

export default function VoiceAssistPage() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [showCaptions, setShowCaptions] = useState(true);
  const [errorType, setErrorType] = useState("");
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(true);
  
  const engineRef = useRef<SpeechEngine | null>(null);
  const analyzerRef = useRef<AudioAnalyzer | null>(null);
  
  const {
    messages,
    language,
    voiceName,
    speechRate,
    finalAssessment,
    addMessage,
    setFinalAssessment,
  } = useVoiceStore();

  // Initialize engine
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBrowserSupportsSpeech(false);
    }

    engineRef.current = new SpeechEngine({
      language,
      continuous: true,
      interimResults: true,
      voiceName,
      speechRate,
      speechPitch: 1,
    });
    
    if (!analyzerRef.current) {
      analyzerRef.current = new AudioAnalyzer();
    }

    // Auto-greet on mount
    const timer = setTimeout(() => {
      if (messages.length === 0) {
        const greeting = "Hello! I'm your MedReach voice assistant. Please describe what you're feeling, and I'll help assess your symptoms.";
        speakAndAdd(greeting, "assistant");
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      engineRef.current?.interrupt();
      analyzerRef.current?.stop();
    };
  }, [language, voiceName, speechRate, messages.length]);

  const speakAndAdd = (text: string, role: "user" | "assistant") => {
    addMessage({ role, content: text, timestamp: Date.now() });
    if (role === "assistant") {
      engineRef.current?.speak(text);
    }
  };

  const handleListen = async () => {
    if (voiceState === "listening") {
      engineRef.current?.stopListening();
      analyzerRef.current?.stop();
      return;
    }

    // Start audio analyzer for orb reactivity
    await analyzerRef.current?.start(setAudioLevel);

    engineRef.current?.startListening(
      (text, isFinal) => {
        setLiveTranscript(text);
        if (isFinal) {
          handleUserInput(text);
          setLiveTranscript("");
        }
      },
      setVoiceState,
      (err, type) => {
        console.error(err);
        setVoiceState("error");
        if (type) setErrorType(type);
      }
    );
  };

  // Barge-in detection
  useEffect(() => {
    if (audioLevel > 0.3 && voiceState === "speaking") {
      engineRef.current?.interrupt();
      handleListen(); // Stop AI, start listening
    }
  }, [audioLevel, voiceState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.code === "Space" && !target?.tagName?.match(/INPUT|TEXTAREA/)) {
        e.preventDefault();
        handleListen(); // Space toggles mic
      }
      if (e.code === "Escape") {
        engineRef.current?.interrupt();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [voiceState, liveTranscript]); // dependencies needed for handleListen closure

  const handleUserInput = async (text: string) => {
    // 1. Emergency detection (before AI call)
    const emergency = detectEmergency(text);
    if (emergency.isEmergency) {
      engineRef.current?.interrupt();
      setShowEmergency(true);
      setEmergencyReason(emergency.emergencyType ? `Critical symptom detected: ${emergency.emergencyType}` : "");
      
      // Speak emergency alert
      setTimeout(() => {
        engineRef.current?.speak(
          "I've detected what may be a medical emergency. Please stay calm. I'm redirecting you to call emergency services immediately."
        );
      }, 300);
      
      // Redirect after speaking
      setTimeout(() => {
        window.location.href = "/emergency";
      }, 5000);
      return;
    }

    // 2. Add user message and call AI
    addMessage({ role: "user", content: text, timestamp: Date.now() });
    setVoiceState("processing");

    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: messages,
          userMessage: text,
        }),
      });

      const data = await response.json();

      // 3. Speak the AI's response
      speakAndAdd(data.message, "assistant");

      // 4. Handle question follow-up
      if (data.question?.text) {
        setTimeout(() => {
          engineRef.current?.speak(data.question.text);
        }, data.message.length * 60); // Wait for message to finish
      }

      // 5. If final assessment ready, show card + speak summary
      if (data.state === "ASSESSMENT" && data.final_assessment) {
        setFinalAssessment(data.final_assessment);
        const summary = `Based on our conversation, my assessment is: ${data.final_assessment.urgency_explanation}. ${data.final_assessment.summary}`;
        setTimeout(() => engineRef.current?.speak(summary), 1500);
      }
    } catch (error) {
      console.error("Triage error:", error);
      speakAndAdd("Sorry, I encountered an error. Please try again.", "assistant");
    }
  };

  return (
    <div className="flex-grow flex flex-col bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Emergency Banner (Overlay) */}
      <AnimatePresence>
        {showEmergency && (
          <EmergencyBanner reason={emergencyReason} onDismiss={() => setShowEmergency(false)} />
        )}
      </AnimatePresence>

      {/* ARIA live region for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {voiceState === "listening" && "Listening for your voice"}
        {voiceState === "speaking" && "AI is speaking"}
        {liveTranscript && `You said: ${liveTranscript}`}
      </div>

      <div className="container mx-auto px-4 py-4 flex-grow flex flex-col">
        {!browserSupportsSpeech && (
          <Alert className="mb-4">
            <AlertTitle>Browser Not Fully Supported</AlertTitle>
            <AlertDescription className="flex flex-col gap-2 items-start">
              For the best experience, use Chrome, Edge, or Safari 14+.
              <Button onClick={() => window.location.href = "/assessment"} variant="outline">Switch to Text Mode</Button>
            </AlertDescription>
          </Alert>
        )}

        {voiceState === "error" && errorType === "not-allowed" && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Microphone Access Denied</AlertTitle>
            <AlertDescription className="flex flex-col gap-2 items-start">
              Please enable microphone permissions in your browser settings.
              <Button onClick={handleListen} variant="outline" className="text-black">Try Again</Button>
            </AlertDescription>
          </Alert>
        )}

        {voiceState === "error" && errorType === "service-not-allowed" && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Speech Recognition Blocked</AlertTitle>
            <AlertDescription className="flex flex-col gap-2 items-start">
              Your browser or OS is blocking the Speech Recognition service. This is common in Safari — try Chrome or Edge for the best experience.
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleListen} variant="outline" className="text-black">Retry</Button>
                <Button onClick={() => window.location.href = "/assessment"} variant="outline" className="text-black">Switch to Text Mode</Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {voiceState === "error" && errorType === "network" && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Network Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-2 items-start">
              Speech Recognition requires an internet connection. Please check your network and try again.
              <Button onClick={handleListen} variant="outline" className="text-black">Retry</Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
          
          {/* LEFT: Conversation History */}
          <div className="lg:col-span-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">💬 Conversation</h2>
            <ConversationHistory messages={messages} />
          </div>

          {/* CENTER: AI Orb + Controls */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center gap-6">
            
            {/* Language & Voice Selector (Top) */}
            <div className="flex gap-4 items-center flex-wrap justify-center">
              <LanguageSelector />
              <span className="text-slate-600 hidden md:inline">|</span>
              <VoiceSelector />
              <span className="text-slate-600 hidden md:inline">|</span>
              <SpeechRateSlider />
            </div>

            {/* THE ORB */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 my-8 flex items-center justify-center">
              <SiriOrb
                state={
                  voiceState === "processing" ? "thinking" :
                  voiceState === "speaking" ? "streaming" :
                  voiceState as AIState
                }
                amplitude={audioLevel}
                size="100%"
              />
            </div>

            {/* Live Transcript */}
            <div className="min-h-[80px] w-full flex flex-col justify-end items-center gap-2">
              <Toggle pressed={showCaptions} onPressedChange={setShowCaptions}>
                📝 Captions
              </Toggle>
              {showCaptions && (
                <LiveTranscript text={liveTranscript} state={voiceState} />
              )}
            </div>

            {/* Voice Controls */}
            <VoiceControls
              state={voiceState}
              onToggleListen={handleListen}
              onInterrupt={() => engineRef.current?.interrupt()}
            />

            {/* Progress Bar */}
            <TriageProgressBar />
          </div>
        </div>

        {/* Final Assessment (Bottom Slide-Up) */}
        <AnimatePresence>
          {finalAssessment && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="fixed bottom-0 left-0 right-0 p-4 z-50 flex justify-center"
            >
              <FinalAssessmentCard assessment={finalAssessment} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
