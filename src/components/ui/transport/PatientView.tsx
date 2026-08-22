'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Car, MapPin, CheckCircle, Phone, ArrowRight, Loader2, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGeolocation } from '@/hooks/use-geolocation';

export function PatientView() {
  const { location, loading: geoLoading } = useGeolocation();
  const [sosState, setSosState] = useState<'idle' | 'broadcasting' | 'accepted'>('idle');
  const [driverName, setDriverName] = useState('');
  const [eta, setEta] = useState('');

  const handleBroadcast = () => {
    setSosState('broadcasting');
    
    // Publish a custom event to simulate real-time transport request
    const event = new CustomEvent('medreach-sos-broadcast', {
      detail: { lat: location.lat, lng: location.lng, timestamp: Date.now() }
    });
    window.dispatchEvent(event);

    // Simulate finding a driver after 5 seconds if no one accepts via local storage (mock for demo)
    setTimeout(() => {
      // In a real app, this would be a WebSocket listener. We simulate it resolving.
      setSosState(prev => {
        if (prev === 'broadcasting') {
          setDriverName('Rahul K. (Volunteer)');
          setEta('4 mins');
          return 'accepted';
        }
        return prev;
      });
    }, 6000);
  };

  const handleCancel = () => {
    setSosState('idle');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <Card className="shadow-lg border-border/40 overflow-hidden relative">
        {/* Background gradient pulses when broadcasting */}
        <AnimatePresence>
          {sosState === 'broadcasting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-red-500/20 z-0 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <CardHeader className="relative z-10 border-b border-border/40 bg-muted/20 pb-4">
          <CardTitle className="text-xl font-extrabold flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            Request Community Rescue
          </CardTitle>
          <CardDescription>
            Broadcast an SOS to verified community volunteers nearby who can safely transport you to the nearest hospital.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 relative z-10 min-h-[300px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            
            {sosState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center gap-6"
              >
                <div className="bg-red-500/10 p-6 rounded-full border-4 border-red-500/20">
                  <Car className="h-12 w-12 text-red-500" />
                </div>
                
                <div>
                  <h3 className="text-lg font-bold mb-2">Need a ride to the hospital?</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    In non-critical emergencies where waiting for an ambulance takes too long, community volunteers can help bridge the gap.
                  </p>
                </div>

                <div className="flex flex-col w-full gap-3 mt-2">
                  <Button 
                    size="lg" 
                    onClick={handleBroadcast}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-14 text-lg shadow-lg hover:shadow-red-500/25 transition-all"
                  >
                    Broadcast SOS (Community)
                  </Button>
                  <Button variant="outline" className="w-full h-12">
                    Call 112 / Professional Ambulance
                  </Button>
                </div>
              </motion.div>
            )}

            {sosState === 'broadcasting' && (
              <motion.div
                key="broadcasting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center text-center gap-8 w-full"
              >
                <div className="relative flex items-center justify-center h-32 w-32">
                  {/* Radar rings */}
                  <motion.div
                    animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-red-500/30"
                  />
                  <motion.div
                    animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-red-500/30"
                  />
                  <div className="relative bg-red-600 p-4 rounded-full z-10 shadow-lg">
                    <ShieldAlert className="h-8 w-8 text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Broadcasting SOS...</h3>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Pinging nearby volunteers...
                  </p>
                </div>

                <Button variant="outline" onClick={handleCancel} className="mt-4 border-border/50">
                  Cancel Request
                </Button>
              </motion.div>
            )}

            {sosState === 'accepted' && (
              <motion.div
                key="accepted"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col w-full gap-6"
              >
                <div className="flex items-center gap-3 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="h-8 w-8 shrink-0" />
                  <div>
                    <h3 className="font-bold">Rescue Accepted!</h3>
                    <p className="text-xs font-medium opacity-80">A community volunteer is on their way.</p>
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-border">
                        <HeartHandshake className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{driverName}</p>
                        <p className="text-[10px] text-muted-foreground">Verified Volunteer • Hyundai Creta</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                      ETA: {eta}
                    </Badge>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">Pickup Location</p>
                      <p className="text-sm mt-0.5">Your Current Location</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Driver
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20">
                    Cancel Rescue
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

    </div>
  );
}
