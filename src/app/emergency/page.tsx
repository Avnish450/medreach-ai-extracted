'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ShieldAlert, Phone, MapPin, ExternalLink, ArrowLeft, LocateFixed, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { emergencyContacts } from '@/lib/data/emergency-keywords';
import { demoClinics } from '@/lib/data/clinics';
import { Clinic } from '@/types';

// ── Haversine distance (km) ─────────────────────────────────────────────────
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type LocationState = 'loading' | 'granted' | 'denied' | 'prompt';
// Fallback local hospitals
const localEmergencyHospitals = demoClinics.filter(c => c.isEmergency || c.type === 'hospital');

export default function EmergencyPage() {
  const [locationState, setLocationState] = useState<LocationState>('loading');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<(Clinic & { realDistance: number })[]>([]);

  // Fetch real nearby hospitals from Google Places via our API
  const fetchLiveHospitals = useCallback(async (lat: number, lng: number) => {
    try {
      // Increase radius for emergency to ensure we find hospitals
      const res = await fetch(`/api/clinics?lat=${lat}&lng=${lng}&radius=15000&specialty=Emergency`);
      if (res.ok) {
        const isLiveData = res.headers.get('x-live-data') === 'true';
        const data: Clinic[] = await res.json();
        
        // If it's live data, use it. If it's fallback data, only use it if it's reasonably close (e.g. < 100km)
        let realHospitals = data.filter(c => c.isEmergency || c.type === 'hospital');
        if (!isLiveData) {
          realHospitals = realHospitals.filter(c => haversineDistance(lat, lng, c.location.lat, c.location.lng) < 100);
        }

        if (realHospitals.length > 0) {
          const withDist = realHospitals.map(h => ({
            ...h,
            realDistance: parseFloat(haversineDistance(lat, lng, h.location.lat, h.location.lng).toFixed(1)),
          }));
          withDist.sort((a, b) => a.realDistance - b.realDistance);
          setHospitals(withDist);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to fetch live hospitals:', err);
    }

    // Fallback if fetch fails or returns empty
    const withDist = localEmergencyHospitals.map(h => ({
      ...h,
      realDistance: parseFloat(haversineDistance(lat, lng, h.location.lat, h.location.lng).toFixed(1)),
    }));
    withDist.sort((a, b) => a.realDistance - b.realDistance);
    setHospitals(withDist);
  }, []);

  // Request location
  const requestLocation = useCallback(() => {
    setLocationState('loading');
    setHospitals([]);

    if (!navigator.geolocation) {
      setLocationState('denied');
      setHospitals(localEmergencyHospitals.map(h => ({ ...h, realDistance: h.distance })));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocationState('granted');
        fetchLiveHospitals(coords.lat, coords.lng);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setLocationState('denied');
        setHospitals(localEmergencyHospitals.map(h => ({ ...h, realDistance: h.distance })));
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchLiveHospitals]);

  // Auto-request on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return (
    <div className="min-h-screen bg-red-950/20 py-12 px-4 md:px-8 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full flex flex-col gap-8">
        
        {/* Header Alert Card */}
        <div className="bg-red-600 dark:bg-red-700 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl shadow-red-500/20 border border-red-500/50 relative overflow-hidden animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-50" />
          <div className="p-4 rounded-full bg-white/10 relative z-10">
            <ShieldAlert className="h-16 w-16" />
          </div>
          <div className="flex-grow text-center md:text-left relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              IMMEDIATE MEDICAL ATTENTION REQUIRED
            </h1>
            <p className="mt-2 text-lg text-white/95 leading-relaxed font-semibold">
              Seek immediate medical help. If you or someone nearby is experiencing chest pain, difficulty breathing, stroke symptoms, heavy bleeding, or loss of consciousness, please contact emergency services instantly.
            </p>
          </div>
        </div>

        {/* Action Button & Disclaimer */}
        <div className="flex justify-between items-center gap-4">
          <Link href="/">
            <Button variant="outline" className="border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-500/10 font-bold flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back Home
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground max-w-sm text-right hidden md:inline">
            Do not waste time browsing if symptoms are critical. Call the ambulance immediately.
          </span>
        </div>

        {/* Contacts and Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Emergency Hotlines */}
          <Card className="border-red-500/20 bg-card/65 shadow-lg backdrop-blur">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-red-500">
                <Phone className="h-5 w-5" />
                Emergency Hotlines
              </CardTitle>
              <CardDescription>Click to call national emergency services immediately.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/40 p-0">
              {emergencyContacts.map((contact, idx) => (
                <a
                  key={idx}
                  href={`tel:${contact.number}`}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{contact.icon}</span>
                    <div>
                      <p className="font-bold text-sm text-foreground">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">Toll-Free Helpline</p>
                    </div>
                  </div>
                  <span className="text-lg font-extrabold text-red-500 group-hover:underline flex items-center gap-1">
                    {contact.number}
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
              ))}
            </CardContent>
          </Card>

          {/* Nearest Emergency Hospitals */}
          <Card className="border-red-500/20 bg-card/65 shadow-lg backdrop-blur">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-red-500">
                <MapPin className="h-5 w-5" />
                Nearest Emergency Hospitals
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                {locationState === 'granted' && (
                  <>
                    <LocateFixed className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      Sorted by your live location
                    </span>
                  </>
                )}
                {locationState === 'loading' && (
                  <>
                    <Loader2 className="h-3.5 w-3.5 text-yellow-500 animate-spin" />
                    <span>Detecting your location…</span>
                  </>
                )}
                {locationState === 'denied' && (
                  <span>Showing default distances. Enable location for accuracy.</span>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="divide-y divide-border/40 p-0">
              {/* PERMISSION REQUEST BANNER — shown when location is denied */}
              {locationState === 'denied' && (
                <div className="p-4 bg-yellow-500/10 border-b border-yellow-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                      📍 Location access needed
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Allow location to find hospitals nearest to you and get accurate distances.
                    </p>
                  </div>
                  <Button
                    onClick={requestLocation}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold shrink-0 flex items-center gap-1.5"
                  >
                    <LocateFixed className="h-3.5 w-3.5" />
                    Enable Location
                  </Button>
                </div>
              )}

              {/* LOADING STATE */}
              {locationState === 'loading' && hospitals.length === 0 && (
                <div className="p-8 flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
                  <p className="text-sm text-muted-foreground font-semibold">
                    Locating nearby hospitals…
                  </p>
                </div>
              )}

              {/* HOSPITAL LIST */}
              {hospitals.map((hospital, idx) => (
                <div key={hospital.id || idx} className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{hospital.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{hospital.address}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {idx === 0 && locationState === 'granted' && (
                        <span className="bg-green-500/15 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30">
                          NEAREST
                        </span>
                      )}
                      <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                        24/7 ER
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {hospital.realDistance} km away
                    </span>
                    <div className="flex gap-2">
                      <a href={`tel:${hospital.phone}`}>
                        <Button size="sm" variant="outline" className="h-8 border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs font-bold">
                          Call Hospital
                        </Button>
                      </a>
                      <a 
                        href={
                          userCoords
                            ? `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${hospital.location.lat},${hospital.location.lng}`
                            : `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`
                        }
                        target="_blank" 
                        rel="noreferrer"
                      >
                        <Button size="sm" className="h-8 bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1">
                          Directions
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
