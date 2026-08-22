"use client";
import { FinalAssessment } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { UrgencyBadge } from "@/components/shared/urgency-badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FinalAssessmentCard({ assessment }: { assessment: FinalAssessment }) {
  return (
    <Card className="bg-slate-900 border-slate-700 shadow-2xl max-w-4xl mx-auto backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Final Triage Assessment</h3>
            <p className="text-slate-400 max-w-2xl">{assessment.summary}</p>
          </div>
          <UrgencyBadge urgency={assessment.urgency} />
        </div>

        <div className="bg-slate-950 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-slate-300 mb-2">Recommendation</p>
          <p className="text-white">{assessment.urgency_explanation}</p>
        </div>

        <div className="flex justify-end">
          <Button render={<Link href="/recommendations" />} className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8">
            View Clinic Recommendations <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
