import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckSquare, AlertOctagon, Info, Eye } from 'lucide-react';

interface ActionChecklistProps {
  doNow: string[];
  doNot: string[];
  watchForWorsening: string[];
  selfCareAdvice?: string | null;
}

export function ActionChecklist({ doNow, doNot, watchForWorsening, selfCareAdvice }: ActionChecklistProps) {
  return (
    <Card className="shadow-md border-border/40 h-full flex flex-col">
      <CardHeader className="pb-3 bg-muted/20 border-b border-border/40 shrink-0">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-teal-700 dark:text-teal-400">
          <CheckSquare className="h-5 w-5" />
          Action Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-6 flex-grow overflow-y-auto">
        
        {/* DO NOW */}
        {doNow && doNow.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-teal-700 dark:text-teal-400 mb-2 flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4" />
              Immediate Actions (Do Now)
            </h4>
            <ul className="space-y-2">
              {doNow.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-teal-500/10 p-2.5 rounded-md border border-teal-500/20">
                  <div className="mt-0.5 min-w-4 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-600"></div>
                  </div>
                  <span className="text-sm text-foreground leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* DO NOT */}
        {doNot && doNot.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1.5">
              <AlertOctagon className="h-4 w-4" />
              What to Avoid (Do Not)
            </h4>
            <ul className="space-y-2">
              {doNot.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-red-500/10 p-2.5 rounded-md border border-red-500/20">
                  <div className="mt-0.5 min-w-4 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-600"></div>
                  </div>
                  <span className="text-sm text-foreground leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* WATCH FOR WORSENING */}
        {watchForWorsening && watchForWorsening.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              Watch For These Warning Signs
            </h4>
            <ul className="space-y-2">
              {watchForWorsening.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-orange-500/10 p-2.5 rounded-md border border-orange-500/20">
                  <div className="mt-0.5 min-w-4 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-600"></div>
                  </div>
                  <span className="text-sm text-foreground leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SELF CARE ADVICE */}
        {selfCareAdvice && (
          <div>
            <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1.5">
              <Info className="h-4 w-4" />
              Self-Care Advice
            </h4>
            <div className="bg-blue-500/10 p-3 rounded-md border border-blue-500/20">
              <p className="text-sm text-foreground leading-relaxed">{selfCareAdvice}</p>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
