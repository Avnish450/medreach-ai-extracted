'use client';

import React, { useEffect, useState } from 'react';
import { useVolunteerStore, Incident } from '@/store/use-volunteer-store';
import { AnimatePresence, motion } from 'framer-motion';
import { subscribeToNearbyIncidents, acceptRescue } from '@/lib/realtime/rescue-channel';
import { supabase } from '@/lib/realtime/rescue-channel';

import { OnboardingStage } from './volunteer-stages/OnboardingStage';
import { DashboardStage } from './volunteer-stages/DashboardStage';
import { IncidentModal } from './volunteer-stages/IncidentModal';
import { NavigationStage } from './volunteer-stages/NavigationStage';

export function VolunteerView() {
  const { stage, setStage, profile, activeIncidents, addIncident, removeIncident, selectedIncident, setSelectedIncident } = useVolunteerStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (stage !== 'ONLINE') return;

    // Use a fixed location for demo, ideally this would be device location
    const volunteerLoc = { lat: 19.076, lng: 72.877 }; 
    const radius = 10; // 10km radius

    const subscription = subscribeToNearbyIncidents(volunteerLoc, radius, (incident) => {
      addIncident({
        id: incident.id,
        patientId: incident.patient_id,
        location: { lat: incident.lat, lng: incident.lng },
        urgency: incident.urgency || 'urgent',
        distanceKm: incident.distanceKm,
        timeAgo: 'Just now',
        symptoms: incident.symptoms || 'Needs immediate medical attention',
        patientInfo: incident.patient_name || 'Details hidden for privacy'
      });
    });

    // Also listen for cancellations on incidents we are tracking
    const cancelSub = supabase.channel('incident-cancellations')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sos_incidents' }, (payload) => {
         if (payload.new.status === 'cancelled') {
           removeIncident(payload.new.patient_id);
         }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      cancelSub.unsubscribe();
    };
  }, [stage, addIncident, removeIncident]);

  if (!isMounted) return null;

  const handleSelectIncident = (id: string) => {
    const inc = activeIncidents.find(i => i.id === id);
    if (inc) setSelectedIncident(inc);
  };

  const handleAcceptRescue = async (incident: Incident) => {
    if (!profile) return;
    
    try {
      await acceptRescue(incident.id, {
        id: profile.id,
        name: profile.name,
      });

      setSelectedIncident(null);
      setStage('EN_ROUTE_TO_PATIENT');
    } catch (error) {
      console.error("Failed to accept rescue:", error);
    }
  };

  const handleCompleteMission = () => {
    setStage('ONLINE');
    // Remove the completed incident from active list
    if (selectedIncident) {
      removeIncident(selectedIncident.patientId);
      setSelectedIncident(null);
    }
  };

  let StageComponent = null;

  switch (stage) {
    case 'ONBOARDING':
      StageComponent = <OnboardingStage />;
      break;
    case 'OFFLINE':
    case 'ONLINE':
      StageComponent = (
        <>
          <DashboardStage onSelectIncident={handleSelectIncident} />
          <IncidentModal 
            isOpen={!!selectedIncident} 
            incident={selectedIncident}
            onClose={() => setSelectedIncident(null)}
            onAccept={handleAcceptRescue}
          />
        </>
      );
      break;
    case 'EN_ROUTE_TO_PATIENT':
    case 'TRANSPORTING_TO_HOSPITAL':
      StageComponent = <NavigationStage onComplete={handleCompleteMission} />;
      break;
    case 'COMPLETED':
      // Short flash message before going back online
      StageComponent = (
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-3xl font-bold text-emerald-400">Mission Accomplished</h2>
          <button onClick={() => setStage('ONLINE')} className="mt-4 text-slate-400 underline">Return to Dashboard</button>
        </div>
      );
      break;
    default:
      StageComponent = <DashboardStage onSelectIncident={handleSelectIncident} />;
  }

  return (
    <div className="w-full mx-auto h-full p-2 md:p-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full"
        >
          {StageComponent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
