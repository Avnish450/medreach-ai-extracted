'use client';

import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, Circle } from '@react-google-maps/api';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Loader2 } from 'lucide-react';

interface LiveNetworkMapProps {
  showVolunteers?: boolean;
  showActiveIncidents?: boolean;
  radiusKm?: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
};

const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Delhi

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
  ],
};

// Simulate random points around a center
const generateRandomPoints = (center: { lat: number; lng: number }, count: number, radiusMeters: number) => {
  return Array.from({ length: count }).map(() => {
    const r = radiusMeters / 111300; // rough meters to degrees
    const y0 = center.lat;
    const x0 = center.lng;
    const u = Math.random();
    const v = Math.random();
    const w = r * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y1 = w * Math.sin(t);
    const x1 = x / Math.cos(y0);
    
    return { lat: y0 + y1, lng: x0 + x1 };
  });
};

export function LiveNetworkMap({
  showVolunteers = false,
  showActiveIncidents = false,
  radiusKm = 10,
}: LiveNetworkMapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const { location, loading } = useGeolocation();
  const center = location || defaultCenter;

  const [volunteers, setVolunteers] = useState<{ lat: number; lng: number }[]>([]);
  const [incidents, setIncidents] = useState<{ lat: number; lng: number }[]>([]);

  useEffect(() => {
    // Generate simulated markers once location is known
    if (center && showVolunteers) {
      setVolunteers(generateRandomPoints(center, 8, radiusKm * 1000));
    }
    if (center && showActiveIncidents) {
      setIncidents(generateRandomPoints(center, 2, radiusKm * 1000));
    }
  }, [center, showVolunteers, showActiveIncidents, radiusKm]);

  if (!isLoaded || loading) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center bg-slate-900 rounded-2xl border border-slate-800">
        <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Connecting to Rescue Network...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        options={mapOptions}
      >
        {/* User Location Pulse */}
        <Marker
          position={center}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            scale: 8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }}
        />
        <Circle
          center={center}
          radius={radiusKm * 1000}
          options={{
            fillColor: '#3b82f6',
            fillOpacity: 0.05,
            strokeColor: '#3b82f6',
            strokeOpacity: 0.2,
            strokeWeight: 1,
          }}
        />

        {/* Volunteer Markers */}
        {showVolunteers && volunteers.map((pos, i) => (
          <Marker
            key={`vol-${i}`}
            position={pos}
            icon={{
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              fillColor: '#10b981', // green-500
              fillOpacity: 1,
              scale: 5,
              strokeColor: '#059669',
              strokeWeight: 2,
              rotation: Math.random() * 360, // Simulate driving direction
            }}
          />
        ))}

        {/* Incident Markers */}
        {showActiveIncidents && incidents.map((pos, i) => (
          <Marker
            key={`inc-${i}`}
            position={pos}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#ef4444', // red-500
              fillOpacity: 1,
              scale: 6,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
          />
        ))}
      </GoogleMap>
      
      {/* Overlay Stats */}
      <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-700 p-3 rounded-lg shadow-xl flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">{volunteers.length} Active Volunteers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">{incidents.length} SOS Alerts</span>
        </div>
      </div>
    </div>
  );
}
