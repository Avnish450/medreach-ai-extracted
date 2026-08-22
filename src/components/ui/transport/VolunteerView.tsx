'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Clock, User, AlertTriangle, Search, Activity, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SosRequest {
  id: string;
  distance: string;
  eta: string;
  urgency: 'high' | 'medium';
  lat: number;
  lng: number;
  timestamp: number;
}

export function VolunteerView() {
  const [isOnline, setIsOnline] = useState(false);
  const [activeRequests, setActiveRequests] = useState<SosRequest[]>([]);
  const [acceptedRequest, setAcceptedRequest] = useState<SosRequest | null>(null);

  // Listen for the custom SOS broadcast event
  useEffect(() => {
    if (!isOnline) return;

    const handleSos = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newRequest: SosRequest = {
        id: `sos-${Date.now()}`,
        distance: '1.2 km away',
        eta: '4 mins',
        urgency: 'high',
        lat: customEvent.detail.lat,
        lng: customEvent.detail.lng,
        timestamp: customEvent.detail.timestamp,
      };
      setActiveRequests(prev => [newRequest, ...prev]);
    };

    window.addEventListener('medreach-sos-broadcast', handleSos);
    return () => window.removeEventListener('medreach-sos-broadcast', handleSos);
  }, [isOnline]);

  const toggleOnline = () => {
    setIsOnline(!isOnline);
    if (isOnline) {
      setActiveRequests([]); // clear requests if going offline
    } else {
      // If going online, mock an existing nearby request just for demo purposes
      setTimeout(() => {
        setActiveRequests([{
          id: 'mock-1',
          distance: '0.8 km away',
          eta: '2 mins',
          urgency: 'high',
          lat: 0,
          lng: 0,
          timestamp: Date.now()
        }]);
      }, 2000);
    }
  };

  const acceptRequest = (req: SosRequest) => {
    setAcceptedRequest(req);
    // In a real app, send a message to backend to assign this driver.
  };

  const cancelAcceptance = () => {
    setAcceptedRequest(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <Card className="shadow-lg border-border/40 overflow-hidden relative">
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-extrabold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
              Volunteer Dashboard
            </CardTitle>
            <CardDescription className="mt-1">
              Help transport nearby patients to the hospital.
            </CardDescription>
          </div>
          
          <Button 
            variant={isOnline ? "default" : "outline"}
            className={`rounded-full transition-colors ${isOnline ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
            onClick={toggleOnline}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-white animate-pulse' : 'bg-muted-foreground'}`} />
            {isOnline ? 'You are Online' : 'Go Online'}
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 min-h-[400px] flex flex-col bg-muted/5">
          {!isOnline ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border border-border">
                <Navigation className="h-8 w-8 opacity-50" />
              </div>
              <div>
                <p className="font-medium text-foreground">You are currently offline</p>
                <p className="text-sm mt-1 max-w-sm">Go online to receive SOS alerts from nearby patients needing transport.</p>
              </div>
            </div>
          ) : acceptedRequest ? (
            // Accepted Request View
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="p-6 flex flex-col h-full gap-6"
            >
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-4 text-emerald-700 dark:text-emerald-400">
                <div className="bg-emerald-500/20 p-2 rounded-full">
                  <Navigation className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Navigation Started</h3>
                  <p className="text-xs">Proceed to the pickup location immediately.</p>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm space-y-4 flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-border">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Emergency Request</p>
                      <p className="text-[10px] text-muted-foreground">{acceptedRequest.distance}</p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="animate-pulse">URGENT</Badge>
                </div>

                {/* Simulated Map View Block */}
                <div className="w-full h-40 bg-muted/50 rounded-lg border border-border/50 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  <div className="flex flex-col items-center z-10 text-muted-foreground">
                    <MapPin className="h-8 w-8 text-rose-500 mb-2 drop-shadow-md" />
                    <span className="text-xs font-medium">Navigating via Maps API...</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>ETA: <strong className="text-foreground">{acceptedRequest.eta}</strong></span>
                  </div>
                </div>
              </div>

              <Button variant="outline" onClick={cancelAcceptance} className="w-full text-rose-500 border-rose-500/20 hover:bg-rose-500/10">
                Cancel / Reassign
              </Button>
            </motion.div>
          ) : (
            // Scanning for requests
            <div className="flex flex-col h-full">
              {activeRequests.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-6">
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute inset-0 rounded-full bg-emerald-500/30"
                    />
                    <div className="relative bg-emerald-500/10 p-4 rounded-full border border-emerald-500/30">
                      <Search className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Scanning for SOS requests...</p>
                    <p className="text-sm mt-1">Make sure your volume is on.</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-4 flex-1">
                  <div className="flex items-center gap-2 px-2 pb-2">
                    <Activity className="h-4 w-4 text-rose-500 animate-pulse" />
                    <h3 className="text-sm font-bold">Active Alerts ({activeRequests.length})</h3>
                  </div>
                  
                  <AnimatePresence>
                    {activeRequests.map((req) => (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-card border-2 border-rose-500/30 rounded-xl p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                        <div className="flex justify-between items-start mb-3 pl-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="h-4 w-4 text-rose-500" />
                              <h4 className="font-bold text-foreground">Transport Needed</h4>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <MapPin className="h-3 w-3" />
                              {req.distance} away
                            </p>
                          </div>
                          <Badge variant="destructive" className="bg-rose-500 text-[10px] px-2 py-0.5 rounded-full">
                            HIGH URGENCY
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3 pl-2 mt-4">
                          <Button 
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                            onClick={() => acceptRequest(req)}
                          >
                            Accept & Go
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
