'use client';

import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { ExternalLink } from 'lucide-react';
import { Clinic } from '@/types';
import { Button } from '@/components/ui/button';

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
  borderRadius: '0.75rem'
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  styles: [
    {
      featureType: 'poi.business',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

interface NearbyClinicsMapProps {
  clinics: Clinic[];
  center: { lat: number; lng: number };
  onClinicSelect?: (clinic: Clinic | null) => void;
  selectedClinicId?: string;
}

export function NearbyClinicsMap({ clinics, center, onClinicSelect, selectedClinicId }: NearbyClinicsMapProps) {
  const [internalSelectedClinic, setInternalSelectedClinic] = useState<Clinic | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const handleMarkerClick = (clinic: Clinic) => {
    setInternalSelectedClinic(clinic);
    if (onClinicSelect) {
      onClinicSelect(clinic);
    }
  };

  const handleCloseClick = () => {
    setInternalSelectedClinic(null);
    if (onClinicSelect) {
      onClinicSelect(null);
    }
  };

  // Allow external control of the selected clinic
  const activeClinic = selectedClinicId 
    ? clinics.find(c => c.id === selectedClinicId) || internalSelectedClinic 
    : internalSelectedClinic;

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      options={mapOptions}
    >
      {/* User's Location Marker */}
      <Marker
        position={center}
        icon={{
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }}
      />

      {/* Clinic Markers */}
      {clinics.map((clinic) => (
        <Marker
          key={clinic.id}
          position={clinic.location}
          onClick={() => handleMarkerClick(clinic)}
          icon={{
            url: clinic.isEmergency
              ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
              : 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
          }}
        />
      ))}

      {/* Info Window */}
      {activeClinic && (
        <InfoWindow
          position={activeClinic.location}
          onCloseClick={handleCloseClick}
        >
          <div className="p-2 max-w-[200px] text-black">
            <h4 className="font-bold text-xs">{activeClinic.name}</h4>
            <p className="text-[10px] mt-1 text-gray-700">{activeClinic.address}</p>
            <p className="text-[10px] font-semibold mt-1">Distance: {activeClinic.distance} km</p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeClinic.location.lat},${activeClinic.location.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-teal-600 font-bold block mt-2 hover:underline flex items-center gap-1"
            >
              Get Directions <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
