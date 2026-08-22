import { create } from 'zustand';

export type PatientState = 
  | "PRE_SOS"           // Choosing urgency, viewing map
  | "BROADCASTING"      // Pinging volunteers
  | "MATCHED"           // Volunteer accepted
  | "EN_ROUTE"          // Volunteer arriving
  | "IN_TRANSPORT"      // Being transported
  | "COMPLETED"         // At hospital
  | "CANCELLED"         // User cancelled
  | "ESCALATED";        // Auto-called 112

export type UrgencyLevel = 'routine' | 'urgent' | 'serious';

export interface VolunteerInfo {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  rescues: number;
  etaMins: number;
  distanceKm: number;
}

interface PatientSosStore {
  stage: PatientState;
  urgency: UrgencyLevel;
  triageSummary: string;
  destinationHospital: string;
  volunteer: VolunteerInfo | null;
  patientId: string;
  incidentId: string | null;
  
  // Actions
  setStage: (stage: PatientState) => void;
  setUrgency: (urgency: UrgencyLevel) => void;
  setTriageSummary: (summary: string) => void;
  setDestinationHospital: (hospital: string) => void;
  setVolunteer: (volunteer: VolunteerInfo | null) => void;
  setIncidentId: (id: string | null) => void;
  setInitialContext: (context: {
    clinicalSummary: string;
    urgency: UrgencyLevel;
    doNow: string[];
    doNot: string[];
    recommendedSpecialty: string;
  }) => void;
  reset: () => void;
}

export const usePatientSosStore = create<PatientSosStore>((set) => ({
  stage: "PRE_SOS",
  urgency: "urgent",
  triageSummary: "Suspected viral infection with high fever (102°F), needs evaluation.",
  destinationHospital: "AIIMS Delhi",
  volunteer: null,
  patientId: `pat_${Math.random().toString(36).substr(2, 9)}`,
  incidentId: null,

  setStage: (stage) => set({ stage }),
  setUrgency: (urgency) => set({ urgency }),
  setTriageSummary: (triageSummary) => set({ triageSummary }),
  setDestinationHospital: (destinationHospital) => set({ destinationHospital }),
  setVolunteer: (volunteer) => set({ volunteer }),
  setIncidentId: (incidentId) => set({ incidentId }),
  setInitialContext: (context) => set({
    urgency: context.urgency,
    triageSummary: context.clinicalSummary,
    destinationHospital: `${context.recommendedSpecialty} Clinic/Hospital`,
  }),
  reset: () => set({ 
    stage: "PRE_SOS", 
    volunteer: null,
    incidentId: null,
    patientId: `pat_${Math.random().toString(36).substr(2, 9)}` // generate new ID for next request
  }),
}));
