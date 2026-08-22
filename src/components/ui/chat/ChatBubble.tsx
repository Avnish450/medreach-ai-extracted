import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, ArrowRight } from 'lucide-react';
import { ChatMessage, UrgencyLevel } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UrgencyBadge } from '@/components/shared/urgency-badge';
import { QuickReplyChips } from './QuickReplyChips';
import { useRouter } from 'next/navigation';

interface ChatBubbleProps {
  message: ChatMessage;
  onSendReply?: (text: string) => void;
  isLast?: boolean;
}

export function ChatBubble({ message, onSendReply, isLast }: ChatBubbleProps) {
  const router = useRouter();
  const isUser = message.role === 'user';

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

      <div className="flex flex-col gap-1">
        <div className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${isUser
            ? 'bg-teal-600 text-white rounded-tr-none'
            : 'bg-muted/80 text-foreground rounded-tl-none border border-border/40'
          }`}>
          
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Quick Reply Chips if AI asks a question */}
          {!isUser && isLast && message.triageResponse?.question?.options && (
            <QuickReplyChips 
              options={message.triageResponse.question.options} 
              onSelect={(opt) => onSendReply?.(opt)} 
            />
          )}

          {/* Final Triage Result Card */}
          {!isUser && message.triageResponse?.state === 'ASSESSMENT' && message.triageResponse.final_assessment && (
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
                className="mt-3 w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 flex items-center justify-center gap-1"
                onClick={() => router.push('/recommendations')}
              >
                Go to Recommendations Dashboard
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground/80 px-1 text-right">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
