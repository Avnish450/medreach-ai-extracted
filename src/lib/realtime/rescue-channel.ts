import { createClient } from "@supabase/supabase-js";
import { SosBroadcastPayload } from "../transport/sync-engine"; // We will borrow the types from here or redefine

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' ? process.env.NEXT_PUBLIC_SUPABASE_URL : 'https://dummy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY_HERE' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : 'dummy-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Simple Haversine distance calculation
function calculateDistance(
  loc1: { lat: number; lng: number },
  loc2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth radius in km
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
  const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * (Math.PI / 180)) *
      Math.cos(loc2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export function subscribeToNearbyIncidents(
  volunteerLocation: { lat: number; lng: number },
  radiusKm: number,
  onIncident: (incident: any) => void
) {
  return supabase
    .channel("rescue-network")
    .on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "sos_incidents",
    }, (payload) => {
      // In production with PostGIS, this filtering happens on the DB side via RPC.
      // For this demo with numeric lat/lng, we calculate it client side.
      const incidentLoc = { lat: payload.new.lat, lng: payload.new.lng };
      const distance = calculateDistance(volunteerLocation, incidentLoc);
      
      if (distance <= radiusKm) {
        // Enhance payload with calculated distance
        onIncident({
          ...payload.new,
          distanceKm: distance.toFixed(1)
        });
      }
    })
    .subscribe();
}

export async function broadcastSOS(sosData: SosBroadcastPayload) {
  const { data, error } = await supabase.from("sos_incidents").insert([{
    patient_id: sosData.patientId,
    patient_name: sosData.name || 'Anonymous',
    status: 'broadcasting',
    urgency: sosData.urgency || 'high',
    lat: sosData.location.lat,
    lng: sosData.location.lng,
    symptoms: sosData.triageSummary,
  }]).select().single();

  if (error) {
    console.error("Error broadcasting SOS:", error);
    throw error;
  }
  return data;
}

export async function cancelSOS(incidentId: string) {
  const { error } = await supabase.from("sos_incidents").update({ status: 'cancelled' }).eq('id', incidentId);
  if (error) console.error("Error cancelling SOS:", error);
}

export async function acceptRescue(incidentId: string, volunteerData: any) {
  const { error } = await supabase.from("sos_incidents").update({ 
    status: 'accepted',
    volunteer_id: volunteerData.id,
    volunteer_name: volunteerData.name,
    accepted_at: new Date().toISOString()
  }).eq('id', incidentId);

  if (error) console.error("Error accepting rescue:", error);
}

export function subscribeToIncidentUpdates(
  incidentId: string,
  onUpdate: (update: any) => void
) {
  return supabase
    .channel(`incident-${incidentId}`)
    .on("postgres_changes", {
      event: "UPDATE",
      schema: "public",
      table: "sos_incidents",
      filter: `id=eq.${incidentId}`,
    }, (payload) => onUpdate(payload.new))
    .subscribe();
}
