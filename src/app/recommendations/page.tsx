'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, ArrowLeft, Share2, FileText, MapPin, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FinalAssessment } from '@/types';
import { ClinicalSummaryCard } from '@/components/ui/dashboard/ClinicalSummaryCard';
import { ActionChecklist } from '@/components/ui/dashboard/ActionChecklist';
import { UrgencyBanner } from '@/components/ui/dashboard/UrgencyBanner';

export default function RecommendationsPage() {
  const router = useRouter();
  const [result, setResult] = useState<FinalAssessment | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('medreach_latest_triage');
    if (!saved) return;

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

  const recommendedSpecialist = result.recommended_specialties?.[0] || 'General Physician';

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-[calc(100vh-8rem)] flex flex-col gap-6">

      {/* Navigation and Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/assessment">
            <Button variant="outline" size="sm" className="gap-1 border-border/50 text-xs font-bold hover:bg-muted/50">
              <ArrowLeft className="h-4 w-4" />
              Back to Chat
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Patient Action Center</h1>
            <p className="text-xs text-muted-foreground">Triage ID: MR-{Math.floor(Math.random() * 89200)}</p>
          </div>
        </div>

        {/* Document Actions */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={generatePDF}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none gap-1.5 border-border/50 text-xs font-bold bg-background shadow-sm hover:bg-muted/50"
          >
            <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            Print / PDF Summary
          </Button>
          <Button
            onClick={handleShareWhatsApp}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none gap-1.5 border-border/50 text-xs font-bold bg-background shadow-sm hover:bg-muted/50"
          >
            <Share2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            Share WhatsApp
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column (Main Info) */}
        <div className="flex flex-col gap-6">
          <UrgencyBanner 
            urgency={result.urgency} 
            explanation={result.urgency_explanation} 
            timeToCare={result.time_to_care} 
          />
          
          <ClinicalSummaryCard 
            summary={result.summary} 
            possibleConditions={result.possible_conditions} 
          />
        </div>

        {/* Right Column (Actions & Providers) */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          
          {/* Action Plan Checklist */}
          <ActionChecklist 
            doNow={result.do_now}
            doNot={result.do_not}
            watchForWorsening={result.watch_for_worsening}
            selfCareAdvice={result.self_care_advice}
          />

          {/* Providers Card */}
          <Card className="shadow-md border-border/40">
            <CardHeader className="bg-muted/20 border-b border-border/40 pb-3">
              <CardTitle className="text-sm font-bold">Find Medical Providers</CardTitle>
              <CardDescription className="text-xs">Connect with {recommendedSpecialist}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-3">
              <Link href={`/map?specialty=${encodeURIComponent(recommendedSpecialist)}`}>
                <div className="p-3 rounded-xl border border-border/50 hover:border-teal-500/50 hover:bg-teal-500/[0.02] transition-all flex items-start gap-3 group cursor-pointer bg-background">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex items-center gap-1">
                      Locate Clinics
                      <ExternalLink className="h-3 w-3" />
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                      Search local clinic maps.
                    </p>
                  </div>
                </div>
              </Link>
              <Link href={`/doctors?specialty=${encodeURIComponent(recommendedSpecialist)}`}>
                <div className="p-3 rounded-xl border border-border/50 hover:border-teal-500/50 hover:bg-teal-500/[0.02] transition-all flex items-start gap-3 group cursor-pointer bg-background">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex items-center gap-1">
                      Browse Specialists
                      <ExternalLink className="h-3 w-3" />
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                      Check fees and availability.
                    </p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>



    </div>
  );
}
