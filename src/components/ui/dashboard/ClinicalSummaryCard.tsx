import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TriagePossibleCondition } from '@/types';
import { Activity, Stethoscope } from 'lucide-react';

interface ClinicalSummaryCardProps {
  summary: string;
  possibleConditions: TriagePossibleCondition[];
}

export function ClinicalSummaryCard({ summary, possibleConditions }: ClinicalSummaryCardProps) {
  return (
    <Card className="shadow-md border-border/40">
      <CardHeader className="pb-3 bg-muted/20 border-b border-border/40">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-teal-700 dark:text-teal-400">
          <Activity className="h-5 w-5" />
          Clinical Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-1">Patient Report</h4>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
        
        {possibleConditions && possibleConditions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4" />
              Possible Conditions
            </h4>
            <div className="space-y-3">
              {possibleConditions.map((condition, idx) => (
                <div key={idx} className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-foreground">{condition.name}</span>
                    <Badge variant={condition.likelihood === 'HIGH' ? 'destructive' : 'secondary'} className="text-[10px]">
                      {condition.likelihood} LIKELIHOOD
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground italic mb-1">{condition.medical_name}</div>
                  <p className="text-xs text-muted-foreground">{condition.brief}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
