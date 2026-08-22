// A simulated real-time event bus using BroadcastChannel for cross-tab sync.
// In a production app, this would be replaced by Pusher, Socket.io, or Supabase Realtime.

export type SosUrgency = 'EMERGENCY' | 'URGENT' | 'ROUTINE';

export interface PatientLocation {
  lat: number;
  lng: number;
}

export interface SosBroadcastPayload {
  patientId: string;
  name: string;
  location: PatientLocation;
  urgency: SosUrgency;
  triageSummary: string | null;
  timestamp: number;
}

export interface SosAcceptPayload {
  patientId: string;
  volunteerId: string;
  volunteerName: string;
  volunteerVehicle: string;
  etaMins: number;
  timestamp: number;
}

export type NetworkEvent = 
  | { type: 'SOS_BROADCAST'; payload: SosBroadcastPayload }
  | { type: 'SOS_CANCEL'; payload: { patientId: string } }
  | { type: 'SOS_ACCEPT'; payload: SosAcceptPayload }
  | { type: 'SOS_COMPLETE'; payload: { patientId: string } };

class SyncEngine {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(event: NetworkEvent) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.channel = new BroadcastChannel('medreach_rescue_network');
      this.channel.onmessage = (event: MessageEvent<NetworkEvent>) => {
        this.listeners.forEach(listener => listener(event.data));
      };
    }
  }

  subscribe(listener: (event: NetworkEvent) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  publish(event: NetworkEvent) {
    // Notify other tabs
    this.channel?.postMessage(event);
    // Notify own tab (BroadcastChannel doesn't fire onmessage for the sender)
    this.listeners.forEach(listener => listener(event));
  }
}

// Singleton instance
export const transportSync = new SyncEngine();
