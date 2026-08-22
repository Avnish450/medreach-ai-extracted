'use client';

import React from 'react';
import { ShieldAlert, Phone, MapPin, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { emergencyContacts } from '@/lib/data/emergency-keywords';
import { demoClinics } from '@/lib/data/clinics';

export default function EmergencyPage() {
  // Filter only clinics that support emergency
  const emergencyHospitals = demoClinics.filter(c => c.isEmergency || c.type === 'hospital');

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
              <CardDescription>Hospitals with 24/7 emergency & trauma facilities.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/40 p-0">
              {emergencyHospitals.map((hospital, idx) => (
                <div key={idx} className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{hospital.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{hospital.address}</p>
                    </div>
                    <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                      24/7 ER
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground font-semibold">
                      Distance: {hospital.distance} km
                    </span>
                    <div className="flex gap-2">
                      <a href={`tel:${hospital.phone}`}>
                        <Button size="sm" variant="outline" className="h-8 border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs font-bold">
                          Call Hospital
                        </Button>
                      </a>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`}
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
