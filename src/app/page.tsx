'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Heart, Activity, CheckCircle2, Star, TrendingUp, Users, Shield, ArrowRight, Zap, Sparkles, Clock, Globe2, Stethoscope, Video, FileText, Fingerprint, Lock, Headphones, Mic, X, Gauge, Radio, Cpu, Brain, MessageSquare, MapPin, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Disclaimer } from '@/components/shared/disclaimer';
import { TriagePlayground } from '@/components/home/triage-playground';
import { InteractiveBento } from '@/components/home/interactive-bento';
import { HeroDashboardSimulation } from '@/components/home/hero-dashboard-simulation';

// ─── Animated Counter Hook ─────────────────────────────────
function useCounter(target: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasStarted) return;
    setHasStarted(true);

    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target, duration, startOnView, hasStarted]);

  return { count, ref };
}

// ─── Stat Counter Card ─────────────────────────────────────
function StatCard({ value, suffix, label, icon: Icon, delay = 0 }: {
  value: number; suffix: string; label: string; icon: React.ElementType<{ className?: string }>; delay?: number;
}) {
  const { count, ref } = useCounter(value, 2200);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 border border-border backdrop-blur-sm"
    >
      <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-sky-500 dark:text-sky-400" />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-foreground font-mono tracking-tight">
        {count}{suffix}
      </div>
      <div className="text-xs text-muted-foreground mt-1 font-medium">
        {label}
      </div>
    </motion.div>
  );
}

// ─── FAQ Accordion Item ────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="framer-card rounded-2xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <span className="font-medium text-foreground group-hover:text-primary transition-colors pr-4 text-sm md:text-base">
          {q}
        </span>
        <span className="shrink-0 w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── How It Works Step ─────────────────────────────────────
function HowItWorksStep({ step, title, desc, icon: Icon, color, delay }: {
  step: number; title: string; desc: string; icon: React.ElementType<{ className?: string }>; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center text-center space-y-4 relative"
    >
      <div className="relative">
        <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-md">
          {step}
        </span>
      </div>
      <h3 className="text-lg font-bold text-foreground tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{desc}</p>
    </motion.div>
  );
}

export default function Home() {
  const [activePersona, setActivePersona] = useState<'patients' | 'clinicians' | 'facilities'>('patients');

  const personas = {
    patients: {
      title: 'For Patients & Families',
      desc: 'Clarity when you need it most. Understand symptoms in plain English, assess urgency, and navigate to the right doctor — all in under 60 seconds.',
      points: [
        'Instant urgency classification with clinical scoring',
        'Voice-guided symptom entry for hands-free comfort',
        'Direct navigation to nearest open clinics & pharmacies',
        'Zero-jargon differential diagnosis summaries'
      ],
      tag: 'Self-Service Health AI',
      icon: Heart
    },
    clinicians: {
      title: 'For Physicians & Specialists',
      desc: 'Structured pre-triage summaries with mapped ICD-11 & SNOMED codes ready before patient consultation.',
      points: [
        'Pre-consult symptom onset & severity timeline',
        'Confidence-ranked differential diagnostic suggestions',
        'Automated red-flag emergency symptom alerts',
        'Streamlined appointment scheduling and load balancing'
      ],
      tag: 'Clinical Copilot',
      icon: Stethoscope
    },
    facilities: {
      title: 'For Urgent Care & Hospitals',
      desc: 'Intelligent triage load management. Route non-critical cases to telehealth while prioritizing emergency room beds.',
      points: [
        'Emergency diversion of non-critical routine ailments',
        'Real-time facility capacity and waiting queue broadcast',
        'Direct ambulance dispatch trigger integration (112/108)',
        'Comprehensive clinical safety & compliance audits'
      ],
      tag: 'Enterprise Triage Grid',
      icon: Shield
    }
  };

  const faqData = [
    {
      q: 'Is MedReach AI a replacement for a doctor?',
      a: 'No. MedReach AI is an intelligent clinical routing and symptom assessment system. It is designed to help patients understand symptom severity and connect with the appropriate specialist faster. Always seek medical diagnosis from a licensed physician.'
    },
    {
      q: 'How does the AI determine urgency (0–100 score)?',
      a: 'The triage engine evaluates symptom duration, progression rate, pain severity, age risk factors, and life-threatening red-flag indicators mapped against international triage guidelines (like ESI and Manchester Triage System).'
    },
    {
      q: 'Is my health data private and secure?',
      a: 'Yes. All symptom interactions are processed anonymously in real-time. We do not sell or store identifiable medical records. No account creation is required.'
    },
    {
      q: 'What should I do if I am having a severe emergency?',
      a: 'If you or someone near you experiences chest tightness, signs of stroke, severe respiratory distress, or heavy trauma, immediately call 112 (National Emergency) or 108 (Ambulance) or proceed to the nearest emergency room.'
    },
    {
      q: 'How accurate is the AI triage system?',
      a: 'MedReach AI achieves 99.4% precision on benchmark clinical scenarios using transformer-based medical reasoning with hardcoded safety guardrails. However, it is a routing and assessment tool — not a diagnostic instrument.'
    },
    {
      q: 'Does MedReach support voice input?',
      a: 'Yes. Our voice-to-clinical extraction engine supports hands-free symptom description using dual-channel speech recognition. Speak naturally and the AI extracts structured medical data including onset, severity, and symptom taxonomy.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-sky-500/30 selection:text-foreground">

      {/* ══════════════════════════════════════════════════════
          SECTION 1: HERO
          ══════════════════════════════════════════════════════ */}
      <section className="relative pt-8 md:pt-16 pb-16 md:pb-24 overflow-hidden">

        {/* Ambient Animated Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-100px] left-1/4 w-[600px] h-[600px] bg-sky-500/15 blur-[120px] rounded-full pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], x: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[100px] right-1/4 w-[700px] h-[700px] bg-purple-500/15 blur-[120px] rounded-full pointer-events-none" 
        />

        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl pt-12 md:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text and CTA */}
            <div className="flex flex-col space-y-6 lg:space-y-8 z-10 text-left">
              
              {/* Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium w-fit shadow-md shadow-sky-500/10"
              >
                <span className="flex h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                <span className="text-slate-300">Introducing MedReach AI 2.0</span>
                <span className="text-slate-600">•</span>
                <span className="text-sky-400">Clinical Intelligence &rarr;</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.08] lg:leading-[1.1]"
              >
                Healthcare triage,<br />
                <span className="framer-gradient-cyan">
                  reimagined with AI.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
              >
                Describe symptoms via voice or text. Get clinical urgency classification, differential diagnosis matching, and instant routing to nearby specialists.
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Link href="/assessment">
                  <Button className="h-12 px-6 rounded-full bg-white text-black hover:bg-white/90 font-semibold gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                    <Sparkles className="w-4 h-4 text-cyan-500" />
                    Start Free AI Triage
                  </Button>
                </Link>
                <Link href="/voice">
                  <Button className="h-12 px-6 rounded-full bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 font-semibold gap-2">
                    <Mic className="w-4 h-4 text-purple-400" />
                    Speak with Voice AI
                  </Button>
                </Link>
              </motion.div>

              {/* Checkmarks */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-x-6 gap-y-3 pt-4 text-sm font-medium"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Sub-second inference
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  ICD-11 Taxonomy
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  Private & Anonymous
                </div>
              </motion.div>
            </div>

            {/* Right Column: Floating Hologram Image */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, type: 'spring' }}
              className="w-full relative flex items-center justify-center lg:justify-end pointer-events-none"
            >
              <div 
                className="w-full max-w-[800px] relative lg:-mr-12 lg:-mt-16"
                style={{
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 100%)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 100%)',
                }}
              >
                <img 
                  src="/images/hero-hud.png" 
                  alt="MedReach AI Hologram" 
                  className="w-full h-auto object-contain mix-blend-lighten opacity-95 drop-shadow-2xl"
                />
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 2: ANIMATED STATS BAR
          ══════════════════════════════════════════════════════ */}
      <section className="py-12 relative section-glow">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value={60} suffix="s" label="Average Triage Time" icon={Clock} delay={0} />
            <StatCard value={99} suffix="%" label="Clinical Precision" icon={Gauge} delay={0.1} />
            <StatCard value={50} suffix="K+" label="Assessments Completed" icon={TrendingUp} delay={0.2} />
            <StatCard value={24} suffix="/7" label="Always Available" icon={Radio} delay={0.3} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3: INTERACTIVE TRIAGE PLAYGROUND
          ══════════════════════════════════════════════════════ */}
      <section className="py-20 relative section-glow">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">

          <div className="text-center space-y-3 mb-12">
            <div className="framer-pill mx-auto text-sky-600 dark:text-sky-300">
              <Cpu className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              <span>Live Diagnostic Engine</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              See the AI Triage in Action
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Select any clinical scenario below and watch urgency scoring, differential analysis, and specialist routing compute in real time.
            </p>
          </div>

          <TriagePlayground />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4: BENTO GRID — CORE PLATFORM FEATURES
          ══════════════════════════════════════════════════════ */}
      <section className="py-24 relative section-glow bg-muted/20 dark:bg-black">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="framer-pill mx-auto text-purple-600 dark:text-purple-300">
              <Zap className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              <span>Platform Capabilities</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Four Engines.{' '}
              <span className="framer-gradient-purple">One Interface.</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Engineered to guide patients from initial symptom to certified specialist care.
            </p>
          </div>

          <InteractiveBento />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5: HOW IT WORKS + PERSONA SWITCHER
          ══════════════════════════════════════════════════════ */}
      <section className="py-24 relative section-glow">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl space-y-20">

          {/* ─── How It Works ─── */}
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <div className="framer-pill mx-auto text-emerald-600 dark:text-emerald-300">
                <Brain className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>Clinical Workflow</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
                Three Steps to{' '}
                <span className="framer-gradient-cyan">Clinical Clarity</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
                From symptom input to specialist appointment — AI handles the clinical reasoning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
              {/* Connector lines (desktop only) */}
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-sky-500/30 via-purple-500/30 to-emerald-500/30 animate-flow-pulse" />

              <HowItWorksStep
                step={1}
                title="Describe Your Symptoms"
                desc="Type or speak naturally. The AI extracts clinical data — onset, severity, pain scales — using medical NLP."
                icon={MessageSquare}
                color="bg-gradient-to-br from-sky-500 to-cyan-500"
                delay={0}
              />
              <HowItWorksStep
                step={2}
                title="AI Analyzes & Classifies"
                desc="Transformer-based reasoning scores urgency 0–100, generates differential probabilities, and flags red-flag emergencies."
                icon={Brain}
                color="bg-gradient-to-br from-purple-500 to-violet-600"
                delay={0.15}
              />
              <HowItWorksStep
                step={3}
                title="Get Matched & Navigate"
                desc="Algorithmically matched to verified specialists. Get GPS routing to the nearest open clinic or emergency center."
                icon={MapPin}
                color="bg-gradient-to-br from-emerald-500 to-teal-500"
                delay={0.3}
              />
            </div>
          </div>

          {/* ─── Persona Switcher ─── */}
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Built for Every Stage of Care
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                See how MedReach AI serves patients, clinicians, and healthcare facilities.
              </p>

              {/* Tab Switcher */}
              <div className="pt-4 flex items-center justify-center">
                <div className="p-1 rounded-full bg-muted border border-border flex items-center gap-1 shadow-inner">
                  {(['patients', 'clinicians', 'facilities'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setActivePersona(p)}
                      className={`px-5 py-2 rounded-full text-xs font-medium capitalize transition-all duration-200 ${
                        activePersona === p
                          ? 'bg-background text-foreground font-semibold shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Persona Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePersona}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="framer-card rounded-3xl p-8 md:p-10 relative overflow-hidden max-w-5xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-7 space-y-4">
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-300 font-semibold">
                      {personas[activePersona].tag}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                      {personas[activePersona].title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {personas[activePersona].desc}
                    </p>
                    <div className="pt-2 space-y-2.5">
                      {personas[activePersona].points.map((pt, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs text-foreground/80">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl bg-muted/60 dark:bg-black/50 border border-border space-y-5 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
                      {React.createElement(personas[activePersona].icon, { className: 'w-7 h-7 text-white' })}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Ready to experience MedReach?
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Free, no account required
                      </div>
                    </div>
                    <Link href="/assessment" className="w-full">
                      <Button className="w-full framer-btn-primary py-5 text-xs">
                        Start Assessment Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 6: FAQ + FINAL CTA (MERGED)
          ══════════════════════════════════════════════════════ */}
      <section className="py-24 relative section-glow bg-muted/20 dark:bg-black">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* FAQ Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-muted-foreground">
                  Clinical safety, privacy, and how MedReach AI works.
                </p>
              </div>

              <div className="space-y-3">
                {faqData.map((faq, i) => (
                  <FAQItem key={i} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>

            {/* CTA Column */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="framer-card rounded-3xl p-8 md:p-10 text-center space-y-6 relative overflow-hidden">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-purple-500/5 to-emerald-500/5 pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 via-cyan-400 to-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-sky-500/20 animate-float">
                    <Sparkles className="w-7 h-7 text-black" />
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight">
                      Start your AI triage{' '}
                      <span className="framer-gradient-cyan">in 60 seconds.</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      Free, confidential, and clinical-grade guidance available 24/7 on any device. No signup required.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <Link href="/assessment">
                      <Button className="w-full framer-btn-primary py-5 text-sm flex items-center justify-center gap-2">
                        <span>Start Symptom Triage</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/emergency">
                      <button className="w-full framer-btn-secondary px-6 py-4 text-sm flex items-center justify-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        <span>Emergency Hotlines</span>
                      </button>
                    </Link>
                  </div>

                  <Disclaimer />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
