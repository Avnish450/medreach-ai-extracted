'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GoogleMap, useLoadScript, Marker, InfoWindow, Autocomplete } from '@react-google-maps/api';
import { MapPin, Phone, Star, Clock, Filter, Compass, Search, ExternalLink, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Clinic } from '@/types';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { motion } from 'framer-motion';
import { NearbyClinicsMap } from '@/components/ui/map/NearbyClinicsMap';


function ClinicMapContent() {
  const searchParams = useSearchParams();
  const initialSpecialty = searchParams.get('specialty') || 'All';

  const { location: geoLoc, error: geoError, loading: geoLoading } = useGeolocation();
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.2090 });
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiveGoogleData, setIsLiveGoogleData] = useState(false);

  // Sync state once browser geolocation completes
  useEffect(() => {
    if (!geoLoading && geoLoc) {
      setLocation(geoLoc);
    }
  }, [geoLoc, geoLoading]);

  // Google Map Instance Reference
  const [map, setMap] = useState<any>(null);

  const onLoad = React.useCallback(function callback(mapInstance: any) {
    setMap(mapInstance);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  // Autocomplete Reference and Callbacks
  const [autocomplete, setAutocomplete] = useState<any>(null);

  const onAutocompleteLoad = (autocompleteInstance: any) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const newLoc = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setLocation(newLoc);
        if (map) {
          map.panTo(newLoc);
          map.setZoom(13);
        }
      }
    }
  };

  // Handlers
  const handleSelectClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    if (map) {
      map.panTo(clinic.location);
      map.setZoom(15);
    }
  };

  const handleFindNearestHospital = () => {
    const hospital = clinics.find(c => c.type === 'hospital');
    if (hospital) {
      handleSelectClinic(hospital);
    }
  };

  const handleCenterMyLocation = () => {
    setSelectedClinic(null);
    if (map) {
      const targetLoc = geoLoc || { lat: 28.6139, lng: 77.2090 };
      map.panTo(targetLoc);
      map.setZoom(13);
      setLocation(targetLoc);
    }
  };

  // Filters
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [maxDistance, setMaxDistance] = useState<number[]>([10]); // Slider expects array
  const [openNow, setOpenNow] = useState(false);
  const [minRating, setMinRating] = useState('0');

  // Selected Clinic
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const dist = maxDistance[0];
      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lng: location.lng.toString(),
        radius: (dist * 1000).toString(),
        specialty: specialty !== 'All' ? specialty : ''
      });

      const res = await fetch(`/api/clinics?${params.toString()}`);
      const source = res.headers.get('x-data-source');
      setIsLiveGoogleData(source === 'google-places-live');

      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        let filtered = data as Clinic[];
        if (openNow) {
          filtered = filtered.filter(c => c.isOpen);
        }
        if (parseFloat(minRating) > 0) {
          filtered = filtered.filter(c => c.rating >= parseFloat(minRating));
        }
        setClinics(filtered);
      }
    } catch (err) {
      console.error('Error fetching clinics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!geoLoading) {
      queueMicrotask(() => {
        void fetchClinics();
      });
    }
  }, [location, geoLoading, specialty, maxDistance, openNow, minRating]);

  // Filters Hook Effect
  useEffect(() => {
    if (!geoLoading) {
      queueMicrotask(() => {
        void fetchClinics();
      });
    }
  }, [location, geoLoading, specialty, maxDistance, openNow, minRating]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] overflow-hidden">

      {/* Filters & Clinic Sidebar */}
      <div className="w-full lg:w-[400px] border-r border-border/40 flex flex-col bg-card shrink-0 h-1/2 lg:h-full">

        {/* Filter Section */}
        <div className="p-4 border-b border-border/40 space-y-4 shrink-0 bg-muted/20">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Find Providers
            </h1>
            <div className="flex items-center gap-1.5">
              {isLiveGoogleData ? (
                <Badge variant="default" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                  Live Google Places
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] text-zinc-400">
                  Demo Mode
                </Badge>
              )}
              <Badge variant="outline" className="text-[10px] font-bold">
                {clinics.length} found
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Specialty */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Specialty</span>
              <Select value={specialty} onValueChange={(val) => setSpecialty(val || 'All')}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectItem value="All">All Specialties</SelectItem>

                  {/* ── Primary Care ── */}
                  <div className="px-2 pt-2 pb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Primary Care</span>
                  </div>
                  <SelectItem value="General Medicine">General Medicine</SelectItem>
                  <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                  <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                  <SelectItem value="Geriatrics">Geriatrics</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Gynecology">Gynecology & Obstetrics</SelectItem>

                  {/* ── Surgical ── */}
                  <div className="px-2 pt-2 pb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Surgical</span>
                  </div>
                  <SelectItem value="General Surgery">General Surgery</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="Neurosurgery">Neurosurgery</SelectItem>
                  <SelectItem value="Cardiac Surgery">Cardiac Surgery</SelectItem>
                  <SelectItem value="Plastic Surgery">Plastic Surgery</SelectItem>
                  <SelectItem value="Urology">Urology</SelectItem>
                  <SelectItem value="Ophthalmology">Ophthalmology (Eye)</SelectItem>
                  <SelectItem value="ENT">ENT (Ear, Nose & Throat)</SelectItem>

                  {/* ── Medical Specialties ── */}
                  <div className="px-2 pt-2 pb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Medical Specialties</span>
                  </div>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Oncology">Oncology (Cancer)</SelectItem>
                  <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                  <SelectItem value="Pulmonology">Pulmonology (Lung)</SelectItem>
                  <SelectItem value="Nephrology">Nephrology (Kidney)</SelectItem>
                  <SelectItem value="Endocrinology">Endocrinology (Diabetes)</SelectItem>
                  <SelectItem value="Rheumatology">Rheumatology</SelectItem>
                  <SelectItem value="Hematology">Hematology</SelectItem>
                  <SelectItem value="Dermatology">Dermatology</SelectItem>
                  <SelectItem value="Infectious Disease">Infectious Disease</SelectItem>

                  {/* ── Mental Health ── */}
                  <div className="px-2 pt-2 pb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Mental Health</span>
                  </div>
                  <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                  <SelectItem value="Psychology">Psychology & Counselling</SelectItem>
                  <SelectItem value="Addiction Medicine">Addiction Medicine</SelectItem>

                  {/* ── Diagnostics & Therapy ── */}
                  <div className="px-2 pt-2 pb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Diagnostics & Therapy</span>
                  </div>
                  <SelectItem value="Radiology">Radiology & Imaging</SelectItem>
                  <SelectItem value="Pathology">Pathology & Lab</SelectItem>
                  <SelectItem value="Physiotherapy">Physiotherapy</SelectItem>
                  <SelectItem value="Dentistry">Dentistry</SelectItem>
                  <SelectItem value="Pharmacy">Pharmacy</SelectItem>

                  {/* ── Emergency ── */}
                  <div className="px-2 pt-2 pb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-red-500/70">Emergency</span>
                  </div>
                  <SelectItem value="Emergency Medicine">🚨 Emergency Medicine</SelectItem>
                  <SelectItem value="Critical Care">🏥 Critical Care / ICU</SelectItem>
                  <SelectItem value="Trauma">🩹 Trauma Center</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min Rating */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Min Rating</span>
              <Select value={minRating} onValueChange={(val) => setMinRating(val || '0')}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="4.0">4.0+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Distance Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
              <span>Max Distance</span>
              <span>{maxDistance[0]} km</span>
            </div>
            <Slider
              value={maxDistance}
              onValueChange={(val) => setMaxDistance(Array.isArray(val) ? val : [val])}
              min={2}
              max={25}
              step={1}
              className="py-2"
            />
          </div>

          {/* Open Now Switch */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-muted-foreground">Show Open Now Only</span>
            <Switch checked={openNow} onCheckedChange={setOpenNow} />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2 mt-2 border-t border-border/20">
            <Button
              id="btn-nearest-hospital"
              onClick={handleFindNearestHospital}
              disabled={clinics.length === 0 || !clinics.some(c => c.type === 'hospital')}
              className="flex-1 text-xs font-bold bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white flex items-center justify-center gap-1.5 h-9 shrink-0 cursor-pointer"
            >
              <ShieldAlert className="h-4 w-4 text-white animate-pulse" />
              Nearest Hospital
            </Button>
            <Button
              id="btn-my-location"
              onClick={handleCenterMyLocation}
              className="flex-1 text-xs font-bold border-border/50 text-foreground bg-card hover:bg-muted/50 flex items-center justify-center gap-1.5 h-9 shrink-0 cursor-pointer"
              variant="outline"
            >
              <Compass className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              My Location
            </Button>
          </div>
        </div>

        {/* Clinics List */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {loading ? (
            <LoadingSpinner label="Locating nearby clinics..." />
          ) : clinics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-semibold text-muted-foreground">No providers match your criteria.</p>
              <p className="text-xs text-muted-foreground/85 mt-1">Try expanding your search radius or changing filters.</p>
            </div>
          ) : (
            (() => {
              const nearestHospital = clinics.find(c => c.type === 'hospital');
              return clinics.map((clinic) => {
                const isNearestHospital = nearestHospital && clinic.id === nearestHospital.id;
                return (
                  <div
                    key={clinic.id}
                    onClick={() => handleSelectClinic(clinic)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${selectedClinic?.id === clinic.id
                      ? 'border-teal-500 bg-teal-500/5 shadow-sm'
                      : 'border-border/50 hover:border-teal-500/30 hover:bg-muted/30'
                      }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col gap-1 min-w-0">
                        <h3 className="font-bold text-sm text-foreground truncate">{clinic.name}</h3>
                        {isNearestHospital && (
                          <div className="inline-flex">
                            <Badge className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold border-none flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                              Nearest Hospital
                            </Badge>
                          </div>
                        )}
                      </div>
                      <Badge variant={clinic.isOpen ? 'secondary' : 'outline'} className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ${clinic.isOpen
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'border-border text-muted-foreground'
                        }`}>
                        {clinic.isOpen ? 'Open' : 'Closed'}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1">{clinic.address}</p>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {clinic.specialties.slice(0, 3).map((spec, sIdx) => (
                        <Badge key={sIdx} variant="outline" className="text-[9px] font-bold border-border/80 bg-muted/40">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/20 text-[11px] text-muted-foreground font-medium">
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <strong className="text-foreground">{clinic.rating}</strong> ({clinic.reviewCount})
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Compass className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                        {clinic.distance} km away
                      </span>
                    </div>
                  </div>
                );
              });
            })()
          )}
        </div>
      </div>


      {/* Map Section */}
      <div className="flex-grow h-1/2 lg:h-full relative bg-muted/10">
        {isLoaded && !loadError && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
          <>
            {/* Floating Autocomplete Search Bar */}
            <div className="absolute top-4 left-4 z-10 w-full max-w-sm px-4 sm:px-0">
              <Autocomplete
                onLoad={onAutocompleteLoad}
                onPlaceChanged={onPlaceChanged}
              >
                <div className="flex items-center bg-card border border-border shadow-lg rounded-full px-4 py-2 w-full focus-within:ring-2 focus-within:ring-teal-500/50 focus-within:border-teal-500 transition-all">
                  <input
                    type="text"
                    placeholder="Search Google Maps"
                    className="flex-grow bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none border-none mr-2 w-full"
                  />
                  <div className="flex items-center gap-2 border-l border-border pl-3 shrink-0">
                    <Search className="h-4.5 w-4.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                    <div
                      title="Reset to My Location"
                      className="w-7 h-7 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => handleCenterMyLocation()}
                    >
                      <Compass className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Autocomplete>
            </div>

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location}
              zoom={13}
              options={mapOptions}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
            <Marker
              position={location}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              }}
              title="Your Location"
            />

            {clinics.map((clinic) => {
              const nearestHospital = clinics.find(c => c.type === 'hospital');
              const isNearestHospital = nearestHospital && clinic.id === nearestHospital.id;
              return (
                <Marker
                  key={clinic.id}
                  position={clinic.location}
                  onClick={() => handleSelectClinic(clinic)}
                  icon={{
                    url: isNearestHospital
                      ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                      : clinic.isEmergency
                        ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        : 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                  }}
                  title={isNearestHospital ? `🚨 NEAREST HOSPITAL: ${clinic.name}` : clinic.name}
                />
              );
            })}

            {selectedClinic && (
              <InfoWindow
                position={selectedClinic.location}
                onCloseClick={() => setSelectedClinic(null)}
              >
                <div className="p-2 max-w-[200px] text-black">
                  <h4 className="font-bold text-xs">{selectedClinic.name}</h4>
                  <p className="text-[10px] mt-1 text-gray-700">{selectedClinic.address}</p>
                  <p className="text-[10px] font-semibold mt-1">Distance: {selectedClinic.distance} km</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedClinic.location.lat},${selectedClinic.location.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-teal-600 font-bold block mt-2 hover:underline"
                  >
                    Get Directions &rarr;
                  </a>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center bg-card">
            <div className="w-full max-w-lg h-64 border border-dashed border-border rounded-2xl relative overflow-hidden bg-muted/40 mb-6 flex flex-col justify-center items-center shadow-inner">
              <div className="absolute top-1/2 left-1/4 h-3 w-3 bg-blue-500 rounded-full animate-ping" />
              <div className="absolute top-1/2 left-1/4 h-3 w-3 bg-blue-600 rounded-full border border-white" title="Your Location" />

              {clinics.map((c, idx) => (
                <div
                  key={c.id}
                  className={`absolute h-4 w-4 rounded-full border border-white cursor-pointer hover:scale-125 transition-transform flex items-center justify-center text-[8px] font-bold text-white shadow ${c.isEmergency ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                  style={{
                    top: `${40 + (idx * 12) % 50}%`,
                    left: `${50 + (idx * 15) % 45}%`
                  }}
                  title={c.name}
                  onClick={() => setSelectedClinic(c)}
                >
                  H
                </div>
              ))}
              <span className="text-[10px] text-muted-foreground/80 mt-2 font-semibold">
                [Simulated Radar Map View: Delhi, India]
              </span>
            </div>

            <h2 className="text-xl font-bold mb-2">Simulated Clinic Locator Map</h2>
            <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
              Google Maps API Key is not set in `.env.local`. We are running in Demo Mock Mode.
              The list on the left is fully functional, using actual geolocation values to sort clinics.
            </p>

            {selectedClinic && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md border border-teal-500/20 bg-teal-500/5 rounded-2xl p-4 text-left flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-foreground">{selectedClinic.name}</h4>
                  <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/20 text-[9px]">
                    {selectedClinic.type.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{selectedClinic.address}</p>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-border/20">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    {selectedClinic.rating} ({selectedClinic.reviewCount} reviews)
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedClinic.location.lat},${selectedClinic.location.lng}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1">
                      Navigate Directions
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClinicMapPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ClinicMapContent />
    </Suspense>
  );
}
