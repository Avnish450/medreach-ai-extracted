'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, ShieldAlert, Heart, MapPin, Users,
  CheckCircle2, ArrowRight, Mic, Search, Zap, Brain,
  Star, ChevronDown, ChevronUp, Globe, Cpu, Shield,
  Radio, Stethoscope, Sparkles, Clock, AlertTriangle,
  Layers, Check, X, PhoneCall
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Disclaimer } from '@/components/shared/disclaimer';
import { HeroDiagnosticHUD } from '@/components/home/hero-diagnostic-hud';
import { TriagePlayground } from '@/components/home/triage-playground';
import { InteractiveBento } from '@/components/home/interactive-bento';

// Lazy-loaded 3D animations
const DNAHelix = React.lazy(() =>
  import('@/components/home/dna-helix').then(m => ({ default: m.DNAHelix }))
);
const NeuralNetwork = React.lazy(() =>
  import('@/components/home/neural-network').then(m => ({ default: m.NeuralNetwork }))
);

// ─── FAQ Accordion Item ───────────────────────────────────────
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="framer-card rounded-2xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left group"
      >
        <span className="font-medium text-foreground group-hover:text-primary transition-colors pr-4 text-base">
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
            <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [activePersona, setActivePersona] = useState<'patients' | 'clinicians' | 'facilities'>('patients');

  const personas = {
    patients: {
      title: 'For Patients & Families',
      desc: 'Clarity when you need it most. Understand symptoms in plain English, assess urgency, and navigate to the right doctor.',
      points: [
        'Instant urgency classification in < 60 seconds',
        'Voice-guided symptom entry for hands-free comfort',
        'Direct navigation to nearest open clinics & pharmacies',
        'Zero jargon differential diagnosis summaries'
      ],
      tag: 'Self-Service Health AI'
    },
    clinicians: {
      title: 'For Physicians & Specialists',
      desc: 'Structured pre-triage summaries with mapped ICD-11 & SNOMED codes ready prior to patient consultation.',
      points: [
        'Pre-consult symptom onset & severity timeline',
        'Confidence-ranked differential diagnostic suggestions',
        'Automated red-flag emergency symptom alerts',
        'Streamlined appointment scheduling and load balancing'
      ],
      tag: 'Clinical Copilot'
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
      tag: 'Enterprise Triage Grid'
    }
  };

  const comparisonData = [
    { feature: 'Triage Response Time', medreach: '< 60 Seconds', traditional: '2–4 Hours in ER', chatbot: 'Instant (Generic)' },
    { feature: 'Clinical Urgency Scoring (0–100)', medreach: true, traditional: true, chatbot: false },
    { feature: 'Voice-to-Clinical Extraction', medreach: true, traditional: false, chatbot: false },
    { feature: 'Live Clinic Radar & GPS Navigation', medreach: true, traditional: false, chatbot: false },
    { feature: 'Emergency Hotline Interception (112)', medreach: true, traditional: true, chatbot: false },
    { feature: 'Matched Verified MD Directory', medreach: true, traditional: false, chatbot: false },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-sky-500/30 selection:text-foreground">

      {/* ── 1. HERO SECTION (Framer-Style) ──────────────────── */}
      <section className="relative pt-32 md:pt-44 pb-20 md:pb-28 overflow-hidden">
        
        {/* Ambient Top Glow Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-sky-500/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Pill Announcement Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="framer-pill"
              >
                <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                <span>Introducing MedReach AI 2.0</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sky-600 dark:text-sky-300 flex items-center gap-1 font-mono">
                  Clinical Intelligence <ArrowRight className="w-3 h-3" />
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.06]"
              >
                Healthcare triage,
                <br />
                <span className="framer-gradient-cyan">
                  reimagined with AI.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Describe symptoms via voice or text. Get clinical urgency classification, differential diagnosis matching, and instant routing to nearby specialists.
              </motion.p>

              {/* Dual Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full max-w-md mx-auto lg:mx-0"
              >
                <Link href="/assessment" className="w-full sm:w-auto">
                  <Button className="w-full framer-btn-primary px-7 py-6 text-sm flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>Start Free AI Triage</span>
                  </Button>
                </Link>
                <Link href="/voice" className="w-full sm:w-auto">
                  <Button className="w-full framer-btn-secondary px-7 py-6 text-sm flex items-center justify-center gap-2">
                    <Mic className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span>Speak with Voice AI</span>
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-mono"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>Sub-second inference</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                  <span>ICD-11 Taxonomy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                  <span>Private &amp; Anonymous</span>
                </div>
              </motion.div>
            </div>

            {/* Right: AI Clinical Diagnostic Console (5 cols) */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full"
              >
                <HeroDiagnosticHUD />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. INTERACTIVE TRIAGE STUDIO (Framer-Style Showcase) ─ */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          <div className="text-center space-y-3 mb-12">
            <div className="framer-pill mx-auto text-sky-600 dark:text-sky-300">
              <Cpu className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              <span>Interactive Diagnostic Canvas</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Test Real Clinical Scenarios Live
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Select any medical case below and watch our AI compute urgency risk, differential probabilities, and emergency protocols in real time.
            </p>
          </div>

          <TriagePlayground />

        </div>
      </section>

      {/* ── 3. FRAMER ASYMMETRIC BENTO GRID ──────────────────── */}
      <section className="py-24 relative border-t border-border bg-muted/20 dark:bg-black">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="framer-pill mx-auto text-purple-600 dark:text-purple-300">
              <Zap className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              <span>Core Platform Stack</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Four Specialized Engines.
              <br />
              <span className="framer-gradient-purple">One Unified Interface.</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Engineered with extreme precision to guide patients from initial pain to certified care.
            </p>
          </div>

          <InteractiveBento />

        </div>
      </section>

      {/* ── 4. DEEP TECH: 3D NEURAL SYNAPSE MATRIX ──────────── */}
      <section className="py-24 relative border-t border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="framer-pill text-emerald-600 dark:text-emerald-300">
                <Brain className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>Neural Reasoning Matrix</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
                Trained on Validated
                <br />
                <span className="framer-gradient-cyan">Clinical Pathways</span>
              </h2>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                MedReach combines transformer-based medical reasoning with hardcoded clinical safety guardrails. When assessing symptoms, the neural net correlates multiple vital dimensions:
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { title: 'Severity & Pain Scales', desc: 'Evaluates functional impairment, pain severity (0-10), and acute progression rates.' },
                  { title: 'Red-Flag Interception', desc: 'Instant overrides for stroke, cardiac infarction, sepsis, and anaphylaxis.' },
                  { title: 'Specialist Proximity Mapping', desc: 'Calculates shortest transit times to specialized trauma and acute care centers.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
                    <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                      <span>{item.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed pl-3.5">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="framer-card rounded-3xl p-4 overflow-hidden relative">
                <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted-foreground text-xs font-mono">Loading Neural Scene...</div>}>
                  <NeuralNetwork />
                </Suspense>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. INTERACTIVE PERSONA SWITCHER ─────────────────── */}
      <section className="py-24 relative border-t border-border bg-muted/30 dark:bg-zinc-950/30">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl space-y-10">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Tailored for Every Stage of Care
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore how MedReach AI optimizes the triage journey for all healthcare stakeholders.
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

          {/* Active Persona Showcase Card */}
          <div className="framer-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
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

              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/60 dark:bg-black/50 border border-border space-y-4 text-center">
                <Activity className="w-12 h-12 text-sky-500 dark:text-sky-400 animate-pulse" />
                <div className="text-sm font-semibold text-foreground">
                  Ready to experience MedReach?
                </div>
                <Link href="/assessment" className="w-full">
                  <Button className="w-full framer-btn-primary py-5 text-xs">
                    Start Assessment Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 6. COMPARISON MATRIX ────────────────────────────── */}
      <section className="py-24 relative border-t border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Why Healthcare Leaders Choose MedReach
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              How our clinical guidance platform outclasses traditional emergency waiting rooms and generic text bots.
            </p>
          </div>

          <div className="framer-card rounded-3xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="p-5 text-xs font-mono uppercase tracking-wider text-muted-foreground">Capability</th>
                    <th className="p-5 text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-500/10 font-bold">
                      MedReach AI
                    </th>
                    <th className="p-5 text-xs font-mono uppercase tracking-wider text-muted-foreground">Traditional ER</th>
                    <th className="p-5 text-xs font-mono uppercase tracking-wider text-muted-foreground">Generic Chatbots</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="p-5 font-medium text-foreground">{row.feature}</td>
                      <td className="p-5 bg-sky-500/[0.04] font-semibold text-foreground">
                        {typeof row.medreach === 'boolean' ? (
                          row.medreach ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <X className="w-4 h-4 text-muted-foreground/50" />
                        ) : (
                          <span className="text-sky-600 dark:text-sky-300 font-mono">{row.medreach}</span>
                        )}
                      </td>
                      <td className="p-5 text-muted-foreground">
                        {typeof row.traditional === 'boolean' ? (
                          row.traditional ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <X className="w-4 h-4 text-muted-foreground/50" />
                        ) : (
                          row.traditional
                        )}
                      </td>
                      <td className="p-5 text-muted-foreground">
                        {typeof row.chatbot === 'boolean' ? (
                          row.chatbot ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <X className="w-4 h-4 text-muted-foreground/50" />
                        ) : (
                          row.chatbot
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. FAQ ACCORDION ────────────────────────────────── */}
      <section className="py-24 relative border-t border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl space-y-10">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Clear answers on clinical safety, privacy compliance, and triage accuracy.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Is MedReach AI a replacement for a doctor?',
                a: 'No. MedReach AI is an intelligent clinical routing and symptom assessment system. It is designed to help patients understand symptom severity and connect with the appropriate specialist faster. Always seek medical diagnosis from a licensed physician.'
              },
              {
                q: 'How does the AI determine urgency (0–100 score)?',
                a: 'The triage engine evaluates symptom duration, progression rate, pain severity, age risk factors, and life-threatening red-flag indicators mapped against international triage guidelines (like ESI and Manchester Triage).'
              },
              {
                q: 'Is my health data private and secure?',
                a: 'Yes. All symptom interactions are processed anonymously in real-time. We do not sell or store identifiable medical records.'
              },
              {
                q: 'What should I do if I am having a severe emergency?',
                a: 'If you or someone near you experiences chest tightness, signs of stroke, severe respiratory distress, or heavy trauma, immediately call 112 (National Emergency) or 108 (Ambulance) or proceed to the nearest emergency room.'
              }
            ].map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>

        </div>
      </section>

      {/* ── 8. GRAND FRAMER-STYLE FOOTER CTA BANNER ─────────── */}
      <section className="py-20 relative border-t border-border overflow-hidden">
        
        {/* Glow backdrop spotlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-sky-500/20">
            <Sparkles className="w-6 h-6 text-black" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Start your AI health assessment
            <br />
            <span className="framer-gradient-cyan">in under 60 seconds.</span>
          </h2>

          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Free, confidential, and clinical-grade guidance available 24/7 on any device.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/assessment">
              <Button className="framer-btn-primary px-8 py-6 text-sm flex items-center gap-2">
                <span>Start Symptom Triage</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/emergency">
              <button className="framer-btn-secondary px-8 py-4 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Emergency Hotlines</span>
              </button>
            </Link>
          </div>

          <div className="pt-6">
            <Disclaimer />
          </div>
        </div>
      </section>

    </div>
  );
}
