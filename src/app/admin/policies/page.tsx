'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, History, Settings, FileText, Users, Activity, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SimulationState = 'idle' | 'preview' | 'activated';
type PolicyMode = 'current' | 'proposed';

export default function AdminPolicySimulator() {
  const [activePolicy, setActivePolicy] = useState<PolicyMode>('current');
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');

  const handlePreview = () => setSimulationState('preview');
  const handleCancel = () => setSimulationState('idle');
  const handleActivate = () => {
    setActivePolicy('proposed');
    setSimulationState('activated');
  };
  const handleReset = () => {
    setActivePolicy('current');
    setSimulationState('idle');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground selection:bg-primary/30 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
            </div>
            <p className="text-muted-foreground text-sm">Policy Simulator & Rules Engine</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono text-emerald-500 border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded">SYSTEM: SECURE</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          
          {/* ========================================================
              STATE 1: IDLE / DASHBOARD HOME
              ======================================================== */}
          {simulationState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Current Active Policy */}
                <Card className="border-border/40 bg-slate-900/50 shadow-md">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Active Routing Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-black border border-border">
                      <p className="text-sm font-medium text-slate-200">
                        {activePolicy === 'current' 
                          ? "Potentially urgent symptoms → Show urgent-care recommendation → Require user confirmation before continuing."
                          : "Potentially urgent symptoms → Automatically initiate urgent referral."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <History className="w-3 h-3" />
                      Last modified: {activePolicy === 'current' ? 'Oct 12, 2023' : 'Just now'}
                    </div>
                  </CardContent>
                </Card>

                {/* Proposed Policy (Only show if not already activated) */}
                {activePolicy === 'current' ? (
                  <Card className="border-primary/20 bg-primary/5 shadow-[0_0_20px_rgba(37,99,235,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">Update Available</span>
                    </div>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-sm text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Proposed Rule Change
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-lg bg-black border border-primary/20 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none rounded-lg" />
                        <p className="text-sm font-medium text-white relative z-10">
                          "Potentially urgent symptoms → Automatically initiate urgent referral."
                        </p>
                      </div>
                      <Button onClick={handlePreview} className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
                        Simulate Policy Change
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border/40 rounded-xl bg-slate-900/20 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-3" />
                    <p className="text-sm text-slate-300 font-medium">System is up to date.</p>
                    <p className="text-xs text-muted-foreground mt-1">No proposed policy changes pending.</p>
                    <Button onClick={handleReset} variant="outline" size="sm" className="mt-4 border-border/50 text-xs">
                      Reset Demo State
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ========================================================
              STATE 2: PREVIEW / SIMULATION
              ======================================================== */}
          {simulationState === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleCancel} className="text-muted-foreground hover:text-white px-2">
                  <ArrowRight className="w-4 h-4 rotate-180 mr-1" /> Back
                </Button>
                <h2 className="text-xl font-bold text-white">Policy Change Preview</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Diff View */}
                <Card className="border-border/40 bg-slate-900/50 shadow-md col-span-1 lg:col-span-2">
                  <CardContent className="p-0 flex flex-col md:flex-row">
                    {/* Current */}
                    <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-border/40 bg-black/40">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        Current Flow
                      </h3>
                      <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-700 bg-slate-900 text-slate-400 text-[10px] font-bold z-10">1</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300">
                            Detect potentially urgent symptoms
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-700 bg-slate-900 text-slate-400 text-[10px] font-bold z-10">2</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300">
                            Show urgent-care recommendation
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border border-amber-500/50 bg-amber-500/20 text-amber-500 text-[10px] font-bold z-10 shadow-[0_0_10px_rgba(245,158,11,0.2)]">3</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium">
                            Ask user for confirmation
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-700 bg-slate-900 text-slate-400 text-[10px] font-bold z-10">4</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300">
                            Continue to routing
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Proposed */}
                    <div className="flex-1 p-6 bg-primary/5">
                      <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                        Proposed Flow
                      </h3>
                      <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/20 before:to-transparent">
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-700 bg-slate-900 text-slate-400 text-[10px] font-bold z-10">1</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300">
                            Detect potentially urgent symptoms
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border border-primary/50 bg-primary/20 text-primary text-[10px] font-bold z-10 shadow-[0_0_10px_rgba(37,99,235,0.4)]">2</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded bg-primary/20 border border-primary/30 text-xs text-white font-medium shadow-md shadow-primary/10">
                            Initiate urgent referral automatically
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group opacity-30 line-through">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-800 bg-transparent text-slate-600 text-[10px] font-bold z-10">x</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded bg-transparent border border-slate-800 text-xs text-slate-500">
                            Ask user for confirmation (Removed)
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Analysis */}
                <div className="col-span-1 lg:col-span-2 bg-slate-900 border border-border/50 rounded-xl p-6">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" /> Impact Analysis
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">What will change</p>
                      <p className="text-xs text-slate-300">Reduces friction in emergency paths by skipping the manual authorization dialog.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Who could be affected</p>
                      <p className="text-xs text-slate-300 flex items-center gap-1"><Users className="w-3 h-3 text-emerald-400"/> Patients flagged as "EMERGENCY"</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">UX Changes</p>
                      <p className="text-xs text-slate-300">1 fewer click. Immediate transition to dispatch radar.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Information Involved</p>
                      <p className="text-xs text-slate-300 flex items-center gap-1"><FileText className="w-3 h-3 text-blue-400"/> Triage payload, Live GPS</p>
                    </div>
                    <div className="space-y-1 sm:col-span-2 md:col-span-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase text-amber-500">Potential Risks</p>
                      <p className="text-xs text-amber-400/90">False positives could dispatch resources unnecessarily without final human check.</p>
                    </div>
                  </div>
                </div>

                {/* High Priority Warning */}
                <div className="col-span-1 lg:col-span-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                  <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-red-500">Important Policy Modification</h4>
                    <p className="text-xs text-red-400 mt-1">This policy change removes the existing user confirmation step for this action. Confirmations will no longer be required.</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 lg:col-span-2 flex justify-end gap-3 pt-4 border-t border-border/40">
                  <Button variant="outline" onClick={handleCancel} className="border-border/50 text-slate-300 hover:text-white">
                    Cancel Changes
                  </Button>
                  <Button onClick={handleActivate} className="bg-primary hover:bg-primary/90 text-white font-bold px-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                    Confirm & Activate Policy
                  </Button>
                </div>

              </div>
            </motion.div>
          )}

          {/* ========================================================
              STATE 3: ACTIVATED
              ======================================================== */}
          {simulationState === 'activated' && (
            <motion.div
              key="activated"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center p-12 text-center bg-emerald-500/5 border border-emerald-500/20 rounded-xl"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 ring-4 ring-emerald-500/10">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Policy Activated Successfully</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                The global routing rules engine has been updated. The new urgent care referral policy is now active in production.
              </p>
              <div className="flex gap-4">
                <Button onClick={handleReset} variant="outline" className="border-border/50">
                  Reset Demo
                </Button>
                <Button onClick={() => setSimulationState('idle')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  Return to Dashboard
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
