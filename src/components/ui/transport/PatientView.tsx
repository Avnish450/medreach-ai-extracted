'use client';

import React, { useEffect, useState } from 'react';
import { usePatientSosStore } from '@/store/use-patient-sos-store';
import { AnimatePresence, motion } from 'framer-motion';
import { broadcastSOS, cancelSOS, subscribeToIncidentUpdates } from '@/lib/realtime/rescue-channel';

import { PreSosStage } from './patient-stages/PreSosStage';
import { BroadcastingStage } from './patient-stages/BroadcastingStage';
import { MatchedStage } from './patient-stages/MatchedStage';
import { EnRouteStage } from './patient-stages/EnRouteStage';
import { CompletedStage } from './patient-stages/CompletedStage';
import { EscalatedStage } from './patient-stages/EscalatedStage';

export function PatientView() {
  const { stage, setStage, setVolunteer, patientId, incidentId, setIncidentId, reset } = usePatientSosStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!incidentId) return;

    // Subscribe to Supabase for incident updates (when a volunteer accepts)
    const subscription = subscribeToIncidentUpdates(incidentId, (incident) => {
      if (incident.status === 'accepted' && incident.volunteer_id) {
        setVolunteer({
          id: incident.volunteer_id,
          name: incident.volunteer_name || 'Volunteer',
          rating: 4.9, // This would normally come from joining the volunteers table
          rescues: 23,
          vehicle: 'White Honda City',
          distanceKm: 2.1,
          etaMins: 5
        });
        setStage('MATCHED');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [incidentId, setVolunteer, setStage]);

  if (!isMounted) return null;

  const handleBroadcast = async () => {
    setStage('BROADCASTING');
    try {
      const loc = { lat: 19.076, lng: 72.877 };
      const incident = await broadcastSOS({
        patientId,
        name: "Patient", // Optional
        location: loc, // mock loc for demo
        urgency: usePatientSosStore.getState().urgency.toUpperCase() as any,
        triageSummary: usePatientSosStore.getState().triageSummary,
        timestamp: Date.now(),
      });
      setIncidentId(incident.id);
      
      // Trigger Emergency Contact SMS
      fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: "Patient", // Ideally from user auth profile
          location: loc,
          type: "BROADCAST",
          phoneNumbers: ["+1234567890"] // Ideally from user emergency contacts settings
        })
      }).catch(err => console.error("Failed to trigger SMS:", err));

    } catch (error) {
      console.error("Failed to broadcast SOS:", error);
      // Fallback or error state
    }
  };

  const handleCancelBroadcast = async () => {
    if (incidentId) {
      await cancelSOS(incidentId);
    }
    reset();
  };

  // State Machine Render
  let StageComponent = null;

  switch (stage) {
    case 'PRE_SOS':
    case 'CANCELLED':
      StageComponent = <PreSosStage onBroadcast={handleBroadcast} />;
      break;
    case 'BROADCASTING':
      StageComponent = <BroadcastingStage onCancel={handleCancelBroadcast} />;
      break;
    case 'MATCHED':
      StageComponent = (
        <MatchedStage 
          onCancel={handleCancelBroadcast} 
          onProceed={() => setStage('EN_ROUTE')} 
        />
      );
      break;
    case 'EN_ROUTE':
    case 'IN_TRANSPORT':
      StageComponent = <EnRouteStage onComplete={() => setStage('COMPLETED')} />;
      break;
    case 'COMPLETED':
      StageComponent = <CompletedStage />;
      break;
    case 'ESCALATED':
      StageComponent = <EscalatedStage />;
      break;
    default:
      StageComponent = <PreSosStage onBroadcast={handleBroadcast} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {StageComponent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
