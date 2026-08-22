export type VoiceState = "idle" | "listening" | "processing" | "speaking" | "error";

export interface SpeechEngineConfig {
  language: string;           // e.g., "en-US", "hi-IN"
  continuous: boolean;
  interimResults: boolean;
  voiceName?: string;         // e.g., "Google US English"
  speechRate: number;         // 0.5 to 2.0
  speechPitch: number;        // 0 to 2
}

export class SpeechEngine {
  private recognition: any;
  private synthesis: SpeechSynthesis;
  private config: SpeechEngineConfig;
  private onTranscript?: (text: string, isFinal: boolean) => void;
  private onStateChange?: (state: VoiceState) => void;
  private onError?: (error: string, type?: string) => void;
  private currentUtterance?: SpeechSynthesisUtterance;
  private isForceStopped: boolean = false;
  private silenceTimer?: ReturnType<typeof setTimeout>;

  constructor(config: SpeechEngineConfig) {
    this.config = config;
    
    // We only access window objects if we are in the browser
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      this.initRecognition();
    } else {
      // Dummy implementation for SSR
      this.synthesis = {} as any;
    }
  }

  private initRecognition() {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Browser does not support speech recognition.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.config.language;
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = 3; // Better for medical terms

    this.recognition.onstart = () => {
      this.isForceStopped = false;
      this.onStateChange?.("listening");
    };
    
    this.recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        this.onTranscript?.(interimTranscript, false);
      }
      if (finalTranscript) {
        this.onTranscript?.(this.correctMedicalTerms(finalTranscript), true);
      }
    };

    this.recognition.onerror = (event: any) => {
      const errorMessages: Record<string, string> = {
        "no-speech": "I didn't hear anything. Please try again.",
        "audio-capture": "Microphone not available. Check permissions.",
        "not-allowed": "Microphone permission denied. Please enable it in browser settings.",
        "service-not-allowed": "Speech Recognition is blocked by your browser or OS. Try Chrome or Edge.",
        "network": "Network error. Please check your connection.",
        "aborted": "Recognition was cancelled.",
      };
      // Prevent rapid fire errors from triggering UI updates repeatedly
      if (event.error !== "no-speech" && event.error !== "aborted") {
        this.onError?.(errorMessages[event.error] || `Error: ${event.error}`, event.error);
        this.onStateChange?.("error");
      }
    };

    this.recognition.onspeechstart = () => {
      if (this.silenceTimer) clearTimeout(this.silenceTimer);
    };

    this.recognition.onspeechend = () => {
      this.silenceTimer = setTimeout(() => {
        if (!this.isForceStopped) {
          this.speak("I didn't catch that. Could you repeat?");
        }
      }, 5000);
    };

    this.recognition.onend = () => {
      if (this.config.continuous && !this.isForceStopped) {
        // Auto-restart for continuous mode
        try {
          this.recognition.start();
        } catch (e) {
          console.error("Failed to auto-restart recognition", e);
        }
      } else {
        this.onStateChange?.("idle");
      }
    };
  }

  /**
   * Post-process transcript to correct common medical term misrecognitions
   */
  private correctMedicalTerms(text: string): string {
    const corrections: Record<string, string> = {
      "my old cardio": "myocardial",
      "disney": "dizzy",
      "die a ria": "diarrhea",
      "nauseous": "nauseous",
      "vom it": "vomit",
      "cars in": "chest pain",
      // Add more based on common misrecognitions
    };

    let corrected = text;
    for (const [wrong, right] of Object.entries(corrections)) {
      corrected = corrected.replace(new RegExp(wrong, "gi"), right);
    }
    return corrected;
  }

  startListening(
    onTranscript: (text: string, isFinal: boolean) => void,
    onStateChange: (state: VoiceState) => void,
    onError: (error: string, type?: string) => void
  ) {
    this.onTranscript = onTranscript;
    this.onStateChange = onStateChange;
    this.onError = onError;
    this.isForceStopped = false;

    // Stop any ongoing speech first
    if (this.synthesis) {
        this.synthesis.cancel();
    }
    
    try {
      if (this.recognition) {
        this.recognition.start();
      } else {
        onError("Speech recognition not supported in this browser.");
      }
    } catch (e) {
      // Already started exceptions can be ignored safely usually, or reset
      console.warn("Recognition start issue", e);
    }
  }

  stopListening() {
    this.isForceStopped = true;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    this.recognition?.stop();
    this.onStateChange?.("idle");
  }

  speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (e: any) => void
  ) {
    if (!this.synthesis) return;
    
    // Cancel any ongoing speech
    this.synthesis.cancel();

    // Small delay helps some browsers (Safari) properly trigger events
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.config.language;
        utterance.rate = this.config.speechRate;
        utterance.pitch = this.config.speechPitch;
    
        // Select voice
        const voices = this.synthesis.getVoices();
        if (this.config.voiceName) {
          const voice = voices.find(v => v.name === this.config.voiceName);
          if (voice) utterance.voice = voice;
        } else {
          // Default: pick first voice matching language
          const voice = voices.find(v => v.lang.startsWith(this.config.language.split("-")[0]));
          if (voice) utterance.voice = voice;
        }
    
        utterance.onstart = () => {
          this.onStateChange?.("speaking");
          onStart?.();
        };
    
        utterance.onend = () => {
          if (this.config.continuous && !this.isForceStopped) {
            this.onStateChange?.("listening");
            try { this.recognition?.start(); } catch(e) {}
          } else {
            this.onStateChange?.("idle");
          }
          onEnd?.();
        };
    
        utterance.onerror = (e) => {
          console.error("SpeechSynthesisError", e);
          this.onStateChange?.("error");
          onError?.(e);
        };
    
        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);
    }, 50);
  }

  interrupt() {
    this.isForceStopped = true;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.synthesis) {
        this.synthesis.cancel();
    }
    if (this.recognition) {
        this.recognition.stop();
    }
    this.onStateChange?.("idle");
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  updateConfig(config: Partial<SpeechEngineConfig>) {
    this.config = { ...this.config, ...config };
    if (this.recognition) {
      this.recognition.lang = this.config.language;
    }
  }
}
