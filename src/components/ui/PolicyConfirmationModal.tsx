import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, FileText, Database, ArrowRight, X, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PolicyConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  actionName: string;
  reasoning: string;
  policyTrigger: string;
  dataShared: string[];
  targetService?: string;
  isHighPriority?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export function PolicyConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Action Authorization Required",
  actionName,
  reasoning,
  policyTrigger,
  dataShared,
  targetService,
  isHighPriority = false,
  confirmText = "Confirm & Continue",
  cancelText = "Cancel / Go Back"
}: PolicyConfirmationProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[#09090b] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className={`p-5 border-b border-white/10 flex items-start justify-between ${isHighPriority ? 'bg-red-500/10' : 'bg-primary/5'}`}>
            <div className="flex gap-3 items-center">
              {isHighPriority ? (
                <ShieldAlert className="h-6 w-6 text-red-500" />
              ) : (
                <ShieldCheck className="h-6 w-6 text-primary" />
              )}
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Policy Simulation Step</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-6">
            
            {/* Warning if High Priority */}
            {isHighPriority && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <p><strong>High Urgency Action:</strong> This recommendation involves emergency or urgent care routing. Ensure you review the destination carefully.</p>
              </div>
            )}

            {/* Action Details */}
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Target Action</p>
                <p className="text-sm font-medium text-white">{actionName}</p>
                {targetService && <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><ArrowRight className="h-3 w-3" /> {targetService}</p>}
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Clinical Reasoning</p>
                <p className="text-sm text-slate-300">{reasoning}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Triggering Policy</p>
                <div className="flex items-center gap-2 mt-1">
                  <FileText className="h-4 w-4 text-primary" />
                  <p className="text-xs font-mono text-primary/90 bg-primary/10 px-2 py-1 rounded">{policyTrigger}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Data Exchange Manifest</p>
                <ul className="grid grid-cols-2 gap-2">
                  {dataShared.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                      <Database className="h-3 w-3 text-muted-foreground" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-white/10 bg-white/5 flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} className="border-white/10 hover:bg-white/5">
              {cancelText}
            </Button>
            <Button onClick={onConfirm} className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
