'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Star, DollarSign, Award, Clock, ArrowRight, ShieldAlert, Sparkles, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Doctor } from '@/types';

function DoctorDirectoryContent() {
  const searchParams = useSearchParams();
  const initialSpecialty = searchParams.get('specialty') || 'All';

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [maxFee, setMaxFee] = useState<number[]>([2000]);
  const [minExperience, setMinExperience] = useState<number[]>([5]);

  // Appointment Dialog States
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        specialty: specialty !== 'All' ? specialty : '',
        searchQuery,
        availableOnly: availableOnly.toString(),
        maxFee: maxFee[0].toString(),
        minExperience: minExperience[0].toString()
      });

      const res = await fetch(`/api/doctors?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setDoctors(data);
      }
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Defer to avoid React lint rule about setState inside an effect.
    queueMicrotask(() => {
      void fetchDoctors();
    });
  }, [specialty, searchQuery, availableOnly, maxFee, minExperience]);


  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBooked(false);
    setIsBookingOpen(true);
  };

  const submitBooking = () => {
    if (!bookingDate || !bookingTime) return;
    setIsBooked(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Specialist Doctor Directory</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Browse verified healthcare professionals, check consultation fees, and schedule simulated appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left column - Filter Sidebar */}
        <Card className="lg:col-span-1 shadow-lg border-border/40 h-fit">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Filter Directory
            </CardTitle>
            <CardDescription className="text-xs">Refine the doctor availability listings</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-5">

            {/* Search Input */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Search</span>
              <div className="relative">
                <Input
                  placeholder="Doctor, clinic, keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Specialty */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Specialty</span>
              <Select value={specialty} onValueChange={(val) => setSpecialty(val || 'All')}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Specialties</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Dermatology">Dermatology</SelectItem>
                  <SelectItem value="General Medicine">General Medicine</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="ENT">ENT</SelectItem>
                  <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                  <SelectItem value="Pulmonology">Pulmonology</SelectItem>
                  <SelectItem value="Gynecology">Gynecology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                  <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                  <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fee range */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                <span>Max Fee</span>
                <span>₹{maxFee[0]}</span>
              </div>
              <Slider
                value={maxFee}
                onValueChange={(val) => setMaxFee(Array.isArray(val) ? val : [val])}
                min={400}
                max={2500}
                step={100}
                className="py-1"
              />
            </div>

            {/* Min Experience */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                <span>Min Experience</span>
                <span>{minExperience[0]} yrs</span>
              </div>
              <Slider
                value={minExperience}
                onValueChange={(val) => setMinExperience(Array.isArray(val) ? val : [val])}
                min={2}
                max={25}
                step={1}
                className="py-1"
              />
            </div>

            {/* Available Only */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-muted-foreground">Show Available Today</span>
              <Switch checked={availableOnly} onCheckedChange={setAvailableOnly} />
            </div>

          </CardContent>
        </Card>

        {/* Right column - Doctor Grid */}
        <div className="lg:col-span-3 flex flex-col gap-4">

          {loading ? (
            <LoadingSpinner label="Querying doctors catalog..." />
          ) : doctors.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
              <p className="font-semibold text-muted-foreground text-sm">No doctors found matching the filters.</p>
              <p className="text-xs text-muted-foreground/80 mt-1">Try resetting search keywords or adjusting pricing thresholds.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {doctors.map((doctor) => (
                  <motion.div
                    key={doctor.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="shadow hover:shadow-md transition-all border-border/40 bg-card/60 backdrop-blur flex flex-col h-full">
                      <CardHeader className="pb-3 border-b border-border/20">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <CardTitle className="text-base font-bold">{doctor.name}</CardTitle>
                            <CardDescription className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                              {doctor.specialty}
                            </CardDescription>
                          </div>

                          {/* Availability status badge */}
                          <Badge variant={doctor.availabilityStatus === 'available' ? 'secondary' : 'outline'} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${doctor.availabilityStatus === 'available'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'border-border text-muted-foreground'
                            }`}>
                            {doctor.availabilityStatus === 'available' ? 'Available' : 'Busy'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-4 space-y-3 flex-grow text-xs text-muted-foreground leading-relaxed">

                        {/* Doctor info fields */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1.5">
                            <Award className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                            <span>{doctor.experience} Yrs Experience</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                            <span className="font-bold text-foreground">₹{doctor.consultationFee} Fee</span>
                          </div>
                        </div>

                        <div>
                          <span className="font-bold text-[10px] text-muted-foreground uppercase block mb-0.5">Qualification</span>
                          <p className="text-foreground font-medium">{doctor.qualification}</p>
                        </div>

                        <div>
                          <span className="font-bold text-[10px] text-muted-foreground uppercase block mb-0.5">Clinic Location</span>
                          <p className="text-foreground font-medium">{doctor.clinicName}, {doctor.clinicAddress}, {doctor.clinicCity}</p>
                        </div>

                        <div>
                          <span className="font-bold text-[10px] text-muted-foreground uppercase block mb-0.5">About Doctor</span>
                          <p className="line-clamp-2">{doctor.about}</p>
                        </div>

                      </CardContent>
                      <CardFooter className="pt-3 border-t border-border/20 bg-muted/10">
                        <Button
                          onClick={() => handleBookAppointment(doctor)}
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 flex items-center justify-center gap-1"
                        >
                          <Calendar className="h-4 w-4" />
                          Book Appointment
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

        </div>

      </div>

      {/* Appointment Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
              <Sparkles className="h-5 w-5" />
              Schedule Appointment
            </DialogTitle>
            <DialogDescription>
              Simulate an appointment booking with {selectedDoctor?.name}.
            </DialogDescription>
          </DialogHeader>

          {isBooked ? (
            <div className="py-6 text-center flex flex-col items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Star className="h-6 w-6 fill-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Appointment Confirmed!</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Your appointment with <strong className="text-foreground">{selectedDoctor?.name}</strong> at <strong className="text-foreground">{selectedDoctor?.clinicName}</strong> has been successfully simulated.
                </p>
                <div className="bg-muted border border-border/40 rounded-xl p-3 mt-4 text-xs font-semibold space-y-1 text-left">
                  <p>Date: {bookingDate}</p>
                  <p>Time: {bookingTime}</p>
                  <p>Consultation Fee: ₹{selectedDoctor?.consultationFee}</p>
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
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-[10px] text-muted-foreground uppercase">Select Time Slot</label>
                <Select value={bookingTime} onValueChange={(val) => setBookingTime(val || '')}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choose a slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10:00 AM">10:00 AM - Morning Slot</SelectItem>
                    <SelectItem value="11:30 AM">11:30 AM - Morning Slot</SelectItem>
                    <SelectItem value="02:30 PM">02:30 PM - Afternoon Slot</SelectItem>
                    <SelectItem value="04:00 PM">04:00 PM - Evening Slot</SelectItem>
                    <SelectItem value="05:30 PM">05:30 PM - Evening Slot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            {isBooked ? (
              <Button
                onClick={() => setIsBookingOpen(false)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold"
              >
                Close Dialog
              </Button>
            ) : (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => setIsBookingOpen(false)}
                  className="flex-1 font-bold border-border/50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitBooking}
                  disabled={!bookingDate || !bookingTime}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Confirm Booking
                </Button>
              </div>
            )}
          </DialogFooter>
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
