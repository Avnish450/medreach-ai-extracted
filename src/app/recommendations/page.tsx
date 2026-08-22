'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bot, AlertTriangle, MapPin, Users, Share2, Clipboard,
  ArrowLeft, HeartPulse, RefreshCw, FileText, CheckCircle, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Disclaimer } from '@/components/shared/disclaimer';
import { UrgencyBadge } from '@/components/shared/urgency-badge';
import { FinalAssessment, UrgencyLevel } from '@/types';

export default function RecommendationsPage() {
  const router = useRouter();
  const [result, setResult] = useState<FinalAssessment | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('medreach_latest_triage');
    if (!saved) return;

    // Parse on initial mount without violating lint rules.
    let parsed: FinalAssessment | null = null;
    try {
      parsed = JSON.parse(saved) as FinalAssessment;
    } catch (err) {
      console.error('Failed to parse triage result from local storage:', err);
    }

    if (parsed) {
      queueMicrotask(() => {
        setResult(parsed);
      });
    }
  }, []);

  const handleShareWhatsApp = () => {
    if (!result) return;
    const recommendedSpecialist = result.recommended_specialties?.[0] || 'General Physician';
    const text = `MedReach AI Triage Summary:\n- Urgency: ${result.urgency.toUpperCase()}\n- Recommended Specialist: ${recommendedSpecialist}\n- Summary: ${result.summary}\n- Suggested Conditions: ${result.possible_conditions.map(c => `${c.name} (${c.likelihood})`).join(', ')}\n\nConsult a professional medical practitioner.`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const generatePDF = () => {
    // Basic simulated PDF print trigger
    window.print();
  };

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center max-w-md">
        <Bot className="h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-2">No Active Triage Result</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Please run a symptom assessment or speak with our voice assistant first to receive clinical guidance.
        </p>
        <Link href="/assessment">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6">
            Start Assessment Chat
          </Button>
        </Link>
      </div>
    );
  }

  const urgencyColors = {
    EMERGENCY: 'border-red-500 bg-red-500/5',
    URGENT: 'border-amber-500 bg-amber-500/5',
    ROUTINE: 'border-green-500 bg-green-500/5',
    SELF_CARE: 'border-blue-500 bg-blue-500/5',
    emergency: 'border-red-500 bg-red-500/5',
    urgent: 'border-amber-500 bg-amber-500/5',
    routine: 'border-green-500 bg-green-500/5',
    'self-care': 'border-blue-500 bg-blue-500/5'
  };

  const urgencyClass = urgencyColors[result.urgency as keyof typeof urgencyColors] || urgencyColors['routine'];
  const recommendedSpecialist = result.recommended_specialties?.[0] || 'General Physician';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">

      {/* Navigation and Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Link href="/assessment">
            <Button variant="outline" size="sm" className="gap-1 border-border/50 text-xs font-bold">
              <ArrowLeft className="h-3.5 w-3.5" />
              Triage Chat
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground">Triage ID: MR-{Math.floor(Math.random() * 89200)}</span>
        </div>

        {/* Document Actions */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={generatePDF}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none gap-1.5 border-border/50 text-xs font-bold"
          >
            <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            Print / PDF Summary
          </Button>
          <Button
            onClick={handleShareWhatsApp}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none gap-1.5 border-border/50 text-xs font-bold"
          >
            <Share2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            Share WhatsApp
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Columns - Triage Outcome */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Main Urgency Card */}
          <Card className={`border shadow-lg ${urgencyClass}`}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-2xl font-extrabold tracking-tight">Triage Outcome</CardTitle>
                  <CardDescription className="text-xs mt-1">Recommended level of clinical urgency</CardDescription>
                </div>
                <UrgencyBadge urgency={result.urgency.toLowerCase() as UrgencyLevel} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Urgency Explanation */}
              <div className="space-y-2">
                <p className="text-sm text-foreground font-medium">{result.urgency_explanation}</p>
              </div>

              {/* Specialist recommendation */}
              <div className="p-4 rounded-xl bg-card border border-border/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-muted-foreground block uppercase">Recommended Specialist</span>
                  <span className="text-lg font-bold text-teal-600 dark:text-teal-400 mt-0.5 block">
                    {recommendedSpecialist}
                  </span>
                  <span className="text-xs text-muted-foreground block mt-1">Time to Care: {result.time_to_care}</span>
                </div>
                <HeartPulse className="h-8 w-8 text-teal-600 dark:text-teal-400 opacity-80" />
              </div>

              {/* Next Steps Checklist */}
              <div>
                <h3 className="font-bold text-sm mb-3 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  Recommended Next Steps
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {result.do_now?.map((step, idx) => (
                    <li key={idx} className="flex gap-2 items-start bg-card/40 border border-border/20 p-3 rounded-xl leading-relaxed">
                      <span className="h-4 w-4 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
                
                {result.watch_for_worsening && result.watch_for_worsening.length > 0 && (
                  <div className="mt-4 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <h4 className="text-xs font-bold text-red-500 mb-2">Watch for Worsening Signs:</h4>
                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                      {result.watch_for_worsening.map((sign, idx) => (
                        <li key={idx}>{sign}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Suggested Conditions */}
          <Card className="shadow-lg border-border/40">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Suggested Possible Conditions</CardTitle>
              <CardDescription>Statistical match based on symptom markers. Not a diagnosis.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/40 p-0">
              {result.possible_conditions?.map((condition, idx) => (
                <div key={idx} className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-foreground">{condition.name}</span>
                    <Badge variant="secondary" className="bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/20 text-[10px]">
                      {condition.likelihood} likelihood
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {condition.brief} ({condition.medical_name})
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Right Column - Navigation Providers Actions */}
        <div className="flex flex-col gap-8">

          {/* Service Link Cards */}
          <Card className="shadow-lg border-border/40 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40">
              <CardTitle className="text-base font-bold">Find Medical Providers</CardTitle>
              <CardDescription>Connect with local medical assistance.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-4">

              {/* Map Action */}
              <Link href={`/map?specialty=${encodeURIComponent(recommendedSpecialist)}`}>
                <div className="p-4 rounded-xl border border-border/50 hover:border-teal-500/50 hover:bg-teal-500/[0.02] transition-all flex items-start gap-3 group cursor-pointer">
                  <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex items-center gap-1">
                      Locate Clinics
                      <ExternalLink className="h-3 w-3" />
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Search local clinics maps offering {recommendedSpecialist} consultations.
                    </p>
                  </div>
                </div>
              </Link>

              {/* Doctor Action */}
              <Link href={`/doctors?specialty=${encodeURIComponent(recommendedSpecialist)}`}>
                <div className="p-4 rounded-xl border border-border/50 hover:border-teal-500/50 hover:bg-teal-500/[0.02] transition-all flex items-start gap-3 group cursor-pointer">
                  <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex items-center gap-1">
                      Browse Specialists
                      <ExternalLink className="h-3 w-3" />
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Check fees, availability, and consult with {recommendedSpecialist} specialists.
                    </p>
                  </div>
                </div>
              </Link>

            </CardContent>
          </Card>

          {/* Quick Stats / Info */}
          <Card className="shadow-lg border-border/40">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Patient Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            </CardContent>
          </Card>

          <Disclaimer />
        </div>

      </div>
    </div>
  );
}
