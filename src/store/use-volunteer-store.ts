import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type VolunteerState = 
  | "ONBOARDING"
  | "OFFLINE"
  | "ONLINE"
  | "EN_ROUTE_TO_PATIENT"
  | "TRANSPORTING_TO_HOSPITAL"
  | "COMPLETED";

export interface Incident {
  id: string;
  patientId: string;
  location: { lat: number, lng: number };
  urgency: string;
  distanceKm: number;
  timeAgo: string;
  symptoms: string;
  patientInfo: string;
}

export interface VolunteerProfile {
  id: string;
  name: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  licensePlate: string;
  certifications: string[];
  rating: number;
  level: number;
  totalRescues: number;
}

interface VolunteerStore {
  stage: VolunteerState;
  profile: VolunteerProfile | null;
  activeIncidents: Incident[];
  selectedIncident: Incident | null;
  
  // Actions
  setStage: (stage: VolunteerState) => void;
  setProfile: (profile: VolunteerProfile) => void;
  addIncident: (incident: Incident) => void;
  removeIncident: (patientId: string) => void;
  setSelectedIncident: (incident: Incident | null) => void;
  clearIncidents: () => void;
}

export const useVolunteerStore = create<VolunteerStore>()(
  persist(
    (set) => ({
      stage: "ONBOARDING", // Starts at onboarding
      profile: null,
      activeIncidents: [],
      selectedIncident: null,

      setStage: (stage) => set({ stage }),
      setProfile: (profile) => set({ profile }),
      
      addIncident: (incident) => set((state) => {
        // Prevent duplicates
        if (state.activeIncidents.some(i => i.patientId === incident.patientId)) {
          return state;
        }
        return { activeIncidents: [...state.activeIncidents, incident] };
      }),
      
      removeIncident: (patientId) => set((state) => ({
        activeIncidents: state.activeIncidents.filter(i => i.patientId !== patientId),
        selectedIncident: state.selectedIncident?.patientId === patientId ? null : state.selectedIncident
      })),
      
      setSelectedIncident: (incident) => set({ selectedIncident: incident }),
      clearIncidents: () => set({ activeIncidents: [] }),
    }),
    {
      name: 'volunteer-storage',
      partialize: (state) => ({ profile: state.profile, stage: state.stage === 'ONBOARDING' ? 'ONBOARDING' : 'OFFLINE' }),
    }
  )
);
