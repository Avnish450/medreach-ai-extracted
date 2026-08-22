import { useState, useEffect, useRef } from 'react';

interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  lang?: string;
}

export function useSpeechRecognition({ onResult, lang = 'en-US' }: UseSpeechRecognitionProps = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  type RecognitionRef = {
    abort: () => void;
    start: () => void;
    stop: () => void;
  } | null;

  const recognitionRef = useRef<RecognitionRef>(null);


  useEffect(() => {
    // Check if SpeechRecognition is supported in browser
    type SpeechRecognitionLike = {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onstart: (() => void) | null;
      onresult: ((event: SpeechRecognitionEventLike) => void) | null;
      onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
      abort: () => void;
    };

    type SpeechRecognitionEventLike = {
      resultIndex: number;
      results: {
        length: number;
        [index: number]: {
          isFinal: boolean;
          0: { transcript: string };
        };
      };
    };

    type SpeechRecognitionErrorEventLike = {
      error?: string;
    };

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Defer state update to avoid React lint warnings about setState in effects.
      queueMicrotask(() => {
        setError('Speech recognition is not supported in this browser.');
      });
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = lang;

    rec.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    rec.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => prev + ' ' + finalTranscript);
        onResult?.(finalTranscript);
      }
    };

    rec.onerror = (event) => {
      const errorMsg = event.error ?? 'Speech recognition error';
      console.error('Speech recognition error:', errorMsg);
      setError(errorMsg);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;

    return () => {
      recognitionRef.current?.abort();
    };
  }, [lang, onResult]);


  const startListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not initialized');
      return;
    }
    setTranscript('');
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Start error:', err);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error('Stop error:', err);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: typeof window !== 'undefined' && !!((window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition)
  };
}
