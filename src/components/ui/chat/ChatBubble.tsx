import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, ArrowRight, Info } from 'lucide-react';
import { ChatMessage, UrgencyLevel } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UrgencyBadge } from '@/components/shared/urgency-badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { QuickReplyChips } from './QuickReplyChips';
import { StreamingText } from './StreamingText';
import { useRouter } from 'next/navigation';
import { PolicyConfirmationModal } from '@/components/ui/PolicyConfirmationModal';

interface ChatBubbleProps {
  message: ChatMessage;
  onSendReply?: (text: string) => void;
  isLast?: boolean;
}

export function ChatBubble({ message, onSendReply, isLast }: ChatBubbleProps) {
  const router = useRouter();
  const isUser = message.role === 'user';
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
    >
      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0 ${isUser
          ? 'bg-teal-600'
          : 'bg-muted border border-border text-teal-600 dark:text-teal-400'
        }`}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm w-full ${isUser
            ? 'bg-teal-500 text-white rounded-tr-sm'
            : 'bg-slate-800/70 text-slate-100 rounded-tl-sm border border-slate-700'
          }`}>
          
          {!isUser && isLast ? (
            <StreamingText text={message.content} />
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}

          {/* Why-asking tooltip for AI questions */}
          {!isUser && message.triageResponse?.question?.why_asking && (
            <TooltipProvider delay={300}>
              <Tooltip>
                <TooltipTrigger className="mt-2 text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors bg-transparent border-none p-0 cursor-pointer">
                  <Info className="h-3 w-3" />
                  Why am I asking this?
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200 text-xs max-w-[250px]">
                  {message.triageResponse.question.why_asking}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Quick Reply Chips if AI asks a question */}
          {!isUser && isLast && message.triageResponse?.question?.options && (
            <QuickReplyChips 
              options={message.triageResponse.question.options} 
              onSelect={(opt) => onSendReply?.(opt)} 
            />
          )}

          {/* Final Triage Result Card */}
          {!isUser && message.triageResponse?.state === 'ASSESSMENT' && message.triageResponse.final_assessment && (
            (() => {
              const urgency = message.triageResponse.final_assessment.urgency.toUpperCase();
              const isHighPriority = urgency === 'EMERGENCY' || urgency === 'HIGH';
              const specialty = message.triageResponse.final_assessment.recommended_specialties?.[0] || 'General physician consultation';
              
              const modalProps = isHighPriority ? {
                actionName: "Urgent Care Recommended",
                targetService: "Urgent care / Emergency department",
                reasoning: "Potentially urgent symptoms detected that may require immediate medical evaluation. MedReach is not treating this as a routine appointment.",
                policyTrigger: "Exception Override: Potential emergency symptoms detected → Urgent care/emergency department recommendation (Overrides Routine Flow).",
                dataShared: ["Live GPS Location", "Urgency Status", "Emergency Contacts"],
                confirmText: "Confirm Urgent Care",
                cancelText: "Go Back / View Options"
              } : {
                actionName: `Recommend Care: ${specialty}`,
                targetService: "Nearby clinic selected based on location",
                reasoning: "Symptoms appear suitable for routine medical evaluation.",
                policyTrigger: "Routine symptoms → recommend non-emergency healthcare.",
                dataShared: ["Symptoms entered by the user", "Approximate/current location for nearby healthcare options"],
                confirmText: "Confirm & Continue",
                cancelText: "Cancel / Go Back"
              };

              return (
                <div className="mt-4 pt-4 border-t border-border/40 flex flex-col gap-3 bg-background/50 p-3 rounded-xl border">
                  <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">Urgency Classification:</span>
                <UrgencyBadge urgency={message.triageResponse.final_assessment.urgency.toLowerCase() as UrgencyLevel} />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">Recommended Care:</span>
                <Badge variant="outline" className="font-bold border-teal-500/20 text-teal-600 dark:text-teal-400">
                  {message.triageResponse.final_assessment.recommended_specialties?.[0] || 'General Physician'}
                </Badge>
              </div>

              {message.triageResponse.final_assessment.do_now && message.triageResponse.final_assessment.do_now.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Immediate Actions:</p>
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1 pl-1">
                    {message.triageResponse.final_assessment.do_now.slice(0, 3).map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                className="mt-3 w-full bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2 flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                onClick={() => setIsModalOpen(true)}
              >
                Go to Recommendations Dashboard
                <ArrowRight className="h-3 w-3" />
              </Button>

              <PolicyConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => router.push('/recommendations')}
                actionName={modalProps.actionName}
                reasoning={modalProps.reasoning}
                policyTrigger={modalProps.policyTrigger}
                dataShared={modalProps.dataShared}
                targetService={modalProps.targetService}
                isHighPriority={isHighPriority}
                confirmText={modalProps.confirmText}
                cancelText={modalProps.cancelText}
              />
            </div>
              );
            })()
          )}
        </div>
        <span className="text-[10px] text-muted-foreground/80 px-1 text-right">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
