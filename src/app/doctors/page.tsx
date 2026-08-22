'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Calendar, Star, Award, Clock, ArrowRight,
  ShieldAlert, Sparkles, Filter, X, MapPin, Phone,
  Bell, AlertTriangle, CheckCircle, Building2,
  Ambulance, ChevronDown, ZapIcon, Users, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Doctor } from '@/types';
import { POPULAR_INDIAN_CITIES, INDIAN_CITIES } from '@/lib/data/indian-cities';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface EmergencyFormData {
  patientName: string;
  patientAge: string;
  patientGender: string;
  contactPhone: string;
  emergencyType: string;
  urgencyCode: 'Code Red' | 'Code Amber';
  etaMinutes: string;
  transportMode: string;
  symptomsNotes: string;
}

const EMPTY_FORM: EmergencyFormData = {
  patientName: '',
  patientAge: '',
  patientGender: '',
  contactPhone: '',
  emergencyType: '',
  urgencyCode: 'Code Red',
  etaMinutes: '',
  transportMode: 'Ambulance (108)',
  symptomsNotes: '',
};

const EMERGENCY_TYPES = [
  'Cardiac Arrest / Heart Attack',
  'Stroke / Seizure',
  'Severe Trauma / Road Accident',
  'Respiratory Distress',
  'Severe Burns',
  'Obstetric Emergency',
  'Anaphylaxis / Allergic Shock',
  'Acute Abdomen / GI Bleed',
  'Toxic Ingestion / Overdose',
  'Pediatric Emergency',
  'Drowning / Suffocation',
  'Spinal / Head Injury',
  'Other Critical Emergency',
];

const TRANSPORT_MODES = [
  'Ambulance (108)',
  'Private Vehicle',
  'Air Ambulance',
  'Police/Rescue Vehicle',
  'Walk-In Critical',
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
function UrgencyBadge({ status }: { status: Doctor['availabilityStatus'] }) {
  const map = {
    available: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    busy: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    offline: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
  };
  const label = { available: 'Available', busy: 'Busy', offline: 'Offline' };
  return (
    <Badge
      variant="outline"
      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${map[status]}`}
    >
      {label[status]}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/* Main Content Component                                             */
/* ------------------------------------------------------------------ */
function DoctorDirectoryContent() {
  const searchParams = useSearchParams();
  const initialSpecialty = searchParams.get('specialty') || 'All';

  // ---- filter state ----
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [city, setCity] = useState('All India');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [maxFee, setMaxFee] = useState<number[]>([2500]);
  const [minFee, setMinFee] = useState<number[]>([0]);
  const [minExperience, setMinExperience] = useState<number[]>([0]);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // ---- appointment dialog ----
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  // ---- emergency alert dialog ----
  const [emergencyDoctor, setEmergencyDoctor] = useState<Doctor | null>(null);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [emergencyForm, setEmergencyForm] = useState<EmergencyFormData>(EMPTY_FORM);
  const [emergencySent, setEmergencySent] = useState(false);
  const [emergencyAlertId, setEmergencyAlertId] = useState('');

  /* ---- filtered city list for autocomplete ---- */
  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) return POPULAR_INDIAN_CITIES;
    const q = citySearchQuery.toLowerCase();
    return INDIAN_CITIES
      .filter(c => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q))
      .map(c => c.name)
      .slice(0, 12);
  }, [citySearchQuery]);

  /* ---- fetch doctors ---- */
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        specialty: specialty !== 'All' ? specialty : '',
        city: city !== 'All India' ? city : '',
        searchQuery,
        availableOnly: availableOnly.toString(),
        emergencyOnly: emergencyOnly.toString(),
        maxFee: maxFee[0].toString(),
        minFee: minFee[0].toString(),
        minExperience: minExperience[0].toString(),
      });
      const res = await fetch(`/api/doctors?${params.toString()}`);
      const data = await res.json();
      if (res.ok) setDoctors(data);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => { void fetchDoctors(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialty, city, searchQuery, availableOnly, emergencyOnly, maxFee, minFee, minExperience]);

  /* ---- appointment handlers ---- */
  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBooked(false);
    setBookingDate('');
    setBookingTime('');
    setIsBookingOpen(true);
  };
  const submitBooking = () => { if (bookingDate && bookingTime) setIsBooked(true); };

  /* ---- emergency handlers ---- */
  const handleEmergencyAlert = (doctor: Doctor) => {
    setEmergencyDoctor(doctor);
    setEmergencyForm(EMPTY_FORM);
    setEmergencySent(false);
    setIsEmergencyOpen(true);
  };

  const submitEmergencyAlert = () => {
    const requiredFields = ['patientName', 'patientAge', 'contactPhone', 'emergencyType', 'etaMinutes'] as const;
    if (requiredFields.some(f => !emergencyForm[f].trim())) return;
    const alertId = `MR-EM-${Date.now().toString(36).toUpperCase()}`;
    setEmergencyAlertId(alertId);
    setEmergencySent(true);
  };

  const isEmergencyFormValid =
    emergencyForm.patientName.trim() &&
    emergencyForm.patientAge.trim() &&
    emergencyForm.contactPhone.trim() &&
    emergencyForm.emergencyType.trim() &&
    emergencyForm.etaMinutes.trim();

  /* ---- reset filters ---- */
  const resetFilters = () => {
    setSpecialty('All');
    setCity('All India');
    setSearchQuery('');
    setAvailableOnly(false);
    setEmergencyOnly(false);
    setMaxFee([2500]);
    setMinExperience([0]);
  };

  const activeFilterCount = [
    specialty !== 'All',
    city !== 'All India',
    availableOnly,
    emergencyOnly,
    maxFee[0] < 2500 || minFee[0] > 0,
    minExperience[0] > 0,
    !!searchQuery,
  ].filter(Boolean).length;

  /* ================================================================ */
  /* RENDER                                                             */
  /* ================================================================ */
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">

      {/* ---- Header ---- */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold mb-4">
          <ShieldAlert className="h-3.5 w-3.5" />
          Emergency-Ready Doctor Directory
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Specialist Doctor Directory
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Browse verified healthcare professionals across India. Filter by city, specialty, and emergency availability. Send real-time emergency alerts to hospital desks.
        </p>
      </div>

      {/* ---- Stats bar ---- */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: Users, label: 'Verified Doctors', value: '80+', color: 'text-teal-600 dark:text-teal-400' },
          { icon: MapPin, label: 'Cities Covered', value: '25+', color: 'text-blue-600 dark:text-blue-400' },
          { icon: Ambulance, label: 'Emergency-Ready', value: '60+', color: 'text-red-600 dark:text-red-400' },
        ].map(s => (
          <Card key={s.label} className="border-border/40 bg-card/50 backdrop-blur">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-8 w-8 ${s.color} shrink-0`} />
              <div>
                <p className="text-xl font-extrabold leading-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* ============================================================ */}
        {/* LEFT — Filter Sidebar                                         */}
        {/* ============================================================ */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-lg border-border/40 h-fit">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-1.5">
                <Filter className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                Filter Directory
                {activeFilterCount > 0 && (
                  <Badge className="ml-auto text-[10px] bg-teal-600 text-white h-5 px-1.5">
                    {activeFilterCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs">Refine doctor availability listings</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-5">

              {/* Search */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Search</span>
                <div className="relative">
                  <Input
                    id="doctor-search"
                    placeholder="Doctor, clinic, keyword..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-8 h-9 text-xs"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* City selector */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  City / Location
                </span>
                <div className="relative">
                  <button
                    id="city-selector"
                    onClick={() => setShowCityDropdown(v => !v)}
                    className="w-full h-9 text-xs flex items-center justify-between px-3 rounded-md border border-input bg-background hover:border-teal-500 transition-colors"
                  >
                    <span className={city === 'All India' ? 'text-muted-foreground' : 'text-foreground font-semibold'}>
                      {city}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showCityDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full mt-1 left-0 right-0 z-50 bg-popover border border-border rounded-lg shadow-xl overflow-hidden"
                      >
                        <div className="p-2 border-b border-border">
                          <div className="relative">
                            <Input
                              placeholder="Search city..."
                              value={citySearchQuery}
                              onChange={e => setCitySearchQuery(e.target.value)}
                              className="h-7 text-xs pl-7"
                              autoFocus
                            />
                            <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="max-h-52 overflow-y-auto py-1">
                          {filteredCities.map(c => (
                            <button
                              key={c}
                              onClick={() => {
                                setCity(c);
                                setShowCityDropdown(false);
                                setCitySearchQuery('');
                              }}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors flex items-center gap-2 ${city === c ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold' : ''}`}
                            >
                              <MapPin className="h-3 w-3 shrink-0 opacity-50" />
                              {c}
                            </button>
                          ))}
                          {filteredCities.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-3">No cities found</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Specialty */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Specialty</span>
                <Select value={specialty} onValueChange={val => setSpecialty(val || 'All')}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'All', 'Cardiology', 'Dermatology', 'Emergency Medicine',
                      'Endocrinology', 'ENT (Otolaryngology)', 'Gastroenterology',
                      'General Medicine', 'Gynecology', 'Neurology',
                      'Oncology', 'Ophthalmology', 'Orthopedics',
                      'Pediatrics', 'Psychiatry', 'Pulmonology',
                      'Rheumatology', 'Urology'
                    ].map(s => (
                      <SelectItem key={s} value={s}>{s === 'All' ? 'All Specialties' : s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fee range */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                  <span>Fee Range</span>
                  <span className="font-mono">{minFee[0] === 0 ? 'FREE' : `₹${minFee[0]}`} – ₹{maxFee[0]}</span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Min</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{minFee[0] === 0 ? '₹0 (Free)' : `₹${minFee[0]}`}</span>
                  </div>
                  <Slider
                    value={minFee}
                    onValueChange={val => setMinFee(Array.isArray(val) ? val : [val])}
                    min={0}
                    max={2500}
                    step={50}
                    className="py-1"
                  />
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Max</span>
                    <span className="font-mono font-bold">₹{maxFee[0]}</span>
                  </div>
                  <Slider
                    value={maxFee}
                    onValueChange={val => setMaxFee(Array.isArray(val) ? val : [val])}
                    min={0}
                    max={2500}
                    step={50}
                    className="py-1"
                  />
                </div>
              </div>

              {/* Min Experience */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                  <span>Min Experience</span>
                  <span>{minExperience[0]} yrs</span>
                </div>
                <Slider
                  value={minExperience}
                  onValueChange={val => setMinExperience(Array.isArray(val) ? val : [val])}
                  min={0}
                  max={25}
                  step={1}
                  className="py-1"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-1 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Available Today</span>
                  <Switch checked={availableOnly} onCheckedChange={setAvailableOnly} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-red-500 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Emergency Ready
                  </span>
                  <Switch checked={emergencyOnly} onCheckedChange={setEmergencyOnly} />
                </div>
              </div>

              {/* Reset */}
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="w-full text-xs border-border/50 font-semibold"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Reset Filters
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Emergency tip card */}
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-2.5">
                <div className="h-8 w-8 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">Emergency Alerts</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Click <strong className="text-foreground">🚨 Alert Hospital</strong> on any emergency-ready doctor card to notify their hospital that a patient is en route.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============================================================ */}
        {/* RIGHT — Doctor Grid                                           */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 flex flex-col gap-4">

          {/* City / result context bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {city !== 'All India' && (
                <Badge
                  variant="outline"
                  className="gap-1.5 border-teal-500/40 text-teal-600 dark:text-teal-400 bg-teal-500/5 font-semibold"
                >
                  <MapPin className="h-3 w-3" />
                  {city}
                  <button onClick={() => setCity('All India')}>
                    <X className="h-3 w-3 ml-0.5 hover:text-foreground" />
                  </button>
                </Badge>
              )}
              {!loading && (
                <span className="text-xs text-muted-foreground">
                  {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner label="Querying doctors catalog..." />
          ) : doctors.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
              <MapPin className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="font-semibold text-muted-foreground text-sm">No doctors found matching the filters.</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Try changing city, specialty, or reset filters.</p>
              <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4 text-xs font-semibold border-border/50">
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <AnimatePresence>
                {doctors.map(doctor => (
                  <motion.div
                    key={doctor.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card className={`shadow hover:shadow-lg transition-all border-border/40 bg-card/60 backdrop-blur flex flex-col h-full group ${doctor.isEmergencyAvailable ? 'hover:border-red-500/30' : 'hover:border-teal-500/30'}`}>

                      {/* Card Header */}
                      <CardHeader className="pb-3 border-b border-border/20">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm font-bold leading-tight truncate">
                              {doctor.name}
                            </CardTitle>
                            <CardDescription className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                              {doctor.specialty}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <UrgencyBadge status={doctor.availabilityStatus} />
                            {doctor.isEmergencyAvailable && (
                              <span className="text-[8px] font-extrabold uppercase tracking-wide text-red-500 flex items-center gap-0.5">
                                <ZapIcon className="h-2.5 w-2.5" />ER Ready
                              </span>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      {/* Card Body */}
                      <CardContent className="py-3 space-y-2.5 flex-grow text-xs text-muted-foreground leading-relaxed">

                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1.5">
                            <Award className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                            <span>{doctor.experience} Yrs Exp</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                            <span className="font-bold text-foreground">₹{doctor.consultationFee}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-0.5">Qualification</span>
                          <p className="text-foreground font-medium leading-tight line-clamp-1">{doctor.qualification}</p>
                        </div>

                        <div>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-0.5 flex items-center gap-1">
                            <Building2 className="h-2.5 w-2.5" /> Hospital
                          </span>
                          <p className="text-foreground font-medium leading-tight line-clamp-1">{doctor.clinicName}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-2.5 w-2.5 shrink-0" />
                            {doctor.clinicAddress}, {doctor.clinicCity}
                            {doctor.clinicState && <span className="opacity-60">, {doctor.clinicState}</span>}
                          </p>
                        </div>

                        {/* Emergency desk info */}
                        {doctor.isEmergencyAvailable && doctor.emergencyDesk && (
                          <div className="flex items-start gap-1.5 rounded-lg bg-red-500/5 border border-red-500/15 p-2">
                            <ShieldAlert className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[9px] font-extrabold text-red-500 uppercase block">Emergency Desk</span>
                              <p className="text-[11px] text-foreground font-medium">{doctor.emergencyDesk}</p>
                              {doctor.hospitalPhone && (
                                <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                                  <Phone className="h-2.5 w-2.5" />
                                  {doctor.hospitalPhone}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-0.5">About</span>
                          <p className="line-clamp-2 text-[11px]">{doctor.about}</p>
                        </div>

                      </CardContent>

                      {/* Card Footer — dual action buttons */}
                      <CardFooter className="pt-3 border-t border-border/20 bg-muted/10 flex gap-2">
                        <Button
                          onClick={() => handleBookAppointment(doctor)}
                          className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 flex items-center justify-center gap-1"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          Appointment
                        </Button>
                        {doctor.isEmergencyAvailable ? (
                          <Button
                            onClick={() => handleEmergencyAlert(doctor)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 flex items-center justify-center gap-1"
                          >
                            <Bell className="h-3.5 w-3.5" />
                            Alert Hospital
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            disabled
                            className="flex-1 text-xs font-semibold border-border/40 text-muted-foreground cursor-not-allowed"
                            title="This facility does not have a 24/7 emergency desk"
                          >
                            <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                            ER N/A
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* APPOINTMENT BOOKING DIALOG                                       */}
      {/* ============================================================== */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
              <Sparkles className="h-5 w-5" />
              Schedule Appointment
            </DialogTitle>
            <DialogDescription>
              Book a consultation with {selectedDoctor?.name} at {selectedDoctor?.clinicName}.
            </DialogDescription>
          </DialogHeader>

          {isBooked ? (
            <div className="py-6 text-center flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base">Appointment Confirmed!</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Your appointment with <strong className="text-foreground">{selectedDoctor?.name}</strong> at{' '}
                  <strong className="text-foreground">{selectedDoctor?.clinicName}</strong> has been successfully simulated.
                </p>
                <div className="bg-muted border border-border/40 rounded-xl p-3 mt-4 text-xs font-semibold space-y-1 text-left">
                  <p>Date: {bookingDate}</p>
                  <p>Time: {bookingTime}</p>
                  <p>Consultation Fee: ₹{selectedDoctor?.consultationFee}</p>
                  <p>Location: {selectedDoctor?.clinicCity}, {selectedDoctor?.clinicState}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-3 text-sm">
              <div className="space-y-1.5">
                <label className="font-bold text-[10px] text-muted-foreground uppercase">Select Date</label>
                <Input
                  type="date"
                  value={bookingDate}
                  onChange={e => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-[10px] text-muted-foreground uppercase">Select Time Slot</label>
                <Select value={bookingTime} onValueChange={val => setBookingTime(val || '')}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choose a slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {['10:00 AM', '11:30 AM', '02:30 PM', '04:00 PM', '05:30 PM'].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            {isBooked ? (
              <Button onClick={() => setIsBookingOpen(false)} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold">
                Close
              </Button>
            ) : (
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={() => setIsBookingOpen(false)} className="flex-1 font-bold border-border/50">Cancel</Button>
                <Button onClick={submitBooking} disabled={!bookingDate || !bookingTime} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold">
                  Confirm Booking
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================== */}
      {/* EMERGENCY ALERT DIALOG                                           */}
      {/* ============================================================== */}
      <Dialog open={isEmergencyOpen} onOpenChange={setIsEmergencyOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <div className="h-8 w-8 rounded-full bg-red-500/15 flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              Emergency Hospital Alert
            </DialogTitle>
            <DialogDescription className="text-xs">
              Notify <strong className="text-foreground">{emergencyDoctor?.clinicName}</strong> ({emergencyDoctor?.clinicCity}) that a critical patient is en route.
              {emergencyDoctor?.emergencyDesk && (
                <span className="block mt-1 text-red-500 font-semibold">
                  → {emergencyDoctor.emergencyDesk}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {emergencySent ? (
            /* ---- Success state ---- */
            <div className="py-6 flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-red-500" />
                </div>
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-foreground">Alert Dispatched!</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Emergency notification sent to{' '}
                  <strong className="text-foreground">{emergencyDoctor?.clinicName}</strong>
                </p>
              </div>

              <div className="w-full bg-muted border border-border/40 rounded-xl p-4 text-xs space-y-2 text-left">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-extrabold text-foreground text-sm">Alert Summary</span>
                  <Badge className="bg-red-600 text-white font-bold text-[10px]">{emergencyAlertId}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div><span className="text-muted-foreground">Patient:</span> <strong className="text-foreground">{emergencyForm.patientName}</strong></div>
                  <div><span className="text-muted-foreground">Age:</span> <strong className="text-foreground">{emergencyForm.patientAge} yrs</strong></div>
                  <div><span className="text-muted-foreground">Emergency:</span> <strong className="text-foreground">{emergencyForm.emergencyType}</strong></div>
                  <div><span className="text-muted-foreground">Code:</span> <strong className={`${emergencyForm.urgencyCode === 'Code Red' ? 'text-red-500' : 'text-amber-500'}`}>{emergencyForm.urgencyCode}</strong></div>
                  <div><span className="text-muted-foreground">ETA:</span> <strong className="text-foreground">{emergencyForm.etaMinutes} min</strong></div>
                  <div><span className="text-muted-foreground">Transport:</span> <strong className="text-foreground">{emergencyForm.transportMode}</strong></div>
                  <div><span className="text-muted-foreground">Contact:</span> <strong className="text-foreground">{emergencyForm.contactPhone}</strong></div>
                  <div><span className="text-muted-foreground">Hospital Tel:</span> <strong className="text-foreground">{emergencyDoctor?.hospitalPhone}</strong></div>
                </div>
                {emergencyForm.symptomsNotes && (
                  <div className="pt-2 border-t border-border/40">
                    <span className="text-muted-foreground block mb-0.5">Notes:</span>
                    <p className="text-foreground font-medium">{emergencyForm.symptomsNotes}</p>
                  </div>
                )}
                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle className="h-3 w-3" />
                    Alert Received by ER Desk
                  </div>
                  <span className="text-[10px] text-muted-foreground">{new Date().toLocaleTimeString('en-IN')}</span>
                </div>
              </div>

              <div className="w-full flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => { setEmergencySent(false); setEmergencyForm(EMPTY_FORM); }}
                  className="flex-1 text-xs font-bold border-border/50"
                >
                  Send Another Alert
                </Button>
                <Button
                  onClick={() => setIsEmergencyOpen(false)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            /* ---- Form state ---- */
            <div className="space-y-4 py-2">

              {/* Hospital destination banner */}
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 flex items-start gap-3">
                <Building2 className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-foreground">{emergencyDoctor?.clinicName}</p>
                  <p className="text-muted-foreground">{emergencyDoctor?.clinicAddress}, {emergencyDoctor?.clinicCity}</p>
                  {emergencyDoctor?.traumaLevel && (
                    <p className="text-red-500 font-semibold mt-0.5">🏥 {emergencyDoctor.traumaLevel}</p>
                  )}
                  {emergencyDoctor?.hospitalPhone && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3" /> {emergencyDoctor.hospitalPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Urgency Code */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Urgency Code</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Code Red', 'Code Amber'] as const).map(code => (
                    <button
                      key={code}
                      onClick={() => setEmergencyForm(f => ({ ...f, urgencyCode: code }))}
                      className={`rounded-lg border-2 p-3 text-xs font-extrabold transition-all ${emergencyForm.urgencyCode === code
                        ? (code === 'Code Red'
                          ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
                          : 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400')
                        : 'border-border text-muted-foreground hover:border-border/80'}`}
                    >
                      {code === 'Code Red' ? '🔴' : '🟡'} {code}
                      <span className="block text-[9px] font-normal mt-0.5 opacity-70">
                        {code === 'Code Red' ? 'Life-threatening' : 'Urgent, not immediately fatal'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency type */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Emergency Type *</label>
                <Select
                  value={emergencyForm.emergencyType}
                  onValueChange={val => setEmergencyForm(f => ({ ...f, emergencyType: val ?? '' }))}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select emergency type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {EMERGENCY_TYPES.map(t => (
                      <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Patient info row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Patient Name *</label>
                  <Input
                    placeholder="Full name"
                    value={emergencyForm.patientName}
                    onChange={e => setEmergencyForm(f => ({ ...f, patientName: e.target.value }))}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Age *</label>
                  <Input
                    placeholder="e.g. 45"
                    type="number"
                    value={emergencyForm.patientAge}
                    onChange={e => setEmergencyForm(f => ({ ...f, patientAge: e.target.value }))}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Gender</label>
                  <Select value={emergencyForm.patientGender} onValueChange={val => setEmergencyForm(f => ({ ...f, patientGender: val ?? '' }))}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {['Male', 'Female', 'Other', 'Unknown'].map(g => <SelectItem key={g} value={g} className="text-xs">{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Contact Phone *</label>
                  <Input
                    placeholder="+91 XXXXX XXXXX"
                    value={emergencyForm.contactPhone}
                    onChange={e => setEmergencyForm(f => ({ ...f, contactPhone: e.target.value }))}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* ETA and transport */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">ETA (minutes) *</label>
                  <Input
                    placeholder="e.g. 15"
                    type="number"
                    value={emergencyForm.etaMinutes}
                    onChange={e => setEmergencyForm(f => ({ ...f, etaMinutes: e.target.value }))}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Transport Mode</label>
                  <Select value={emergencyForm.transportMode} onValueChange={val => setEmergencyForm(f => ({ ...f, transportMode: val ?? 'Ambulance (108)' }))}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TRANSPORT_MODES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Symptoms notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Clinical Notes / Symptoms</label>
                <textarea
                  placeholder="Briefly describe symptoms, vitals, known medications, allergies..."
                  value={emergencyForm.symptomsNotes}
                  onChange={e => setEmergencyForm(f => ({ ...f, symptomsNotes: e.target.value }))}
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition"
                />
              </div>

              <p className="text-[10px] text-muted-foreground">
                * Required fields. This alert is a simulation for demonstration purposes only.
              </p>
            </div>
          )}

          {!emergencySent && (
            <DialogFooter>
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => setIsEmergencyOpen(false)}
                  className="flex-1 font-bold border-border/50 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitEmergencyAlert}
                  disabled={!isEmergencyFormValid}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Bell className="h-4 w-4" />
                  Dispatch Emergency Alert
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default function DoctorDirectoryPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DoctorDirectoryContent />
    </Suspense>
  );
}
