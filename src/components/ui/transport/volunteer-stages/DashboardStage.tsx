'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck, MapPin, Award, Activity, HeartPulse } from 'lucide-react';
import { useVolunteerStore } from '@/store/use-volunteer-store';
import { LiveNetworkMap } from '../LiveNetworkMap';
import { BadgesDisplay } from '../volunteer/BadgesDisplay';
import { StatsPanel } from '../volunteer/StatsPanel';
import { ImpactFeed } from '../volunteer/ImpactFeed';

export function DashboardStage({ onSelectIncident }: { onSelectIncident: (id: string) => void }) {
  const { stage, setStage, profile, activeIncidents } = useVolunteerStore();
  const isOnline = stage === 'ONLINE';

  const toggleOnline = () => {
    setStage(isOnline ? 'OFFLINE' : 'ONLINE');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top Bar Status */}
      <Card className="bg-black/80 backdrop-blur-md border-slate-800 shadow-2xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-slate-600'}`} />
            <div>
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                {isOnline ? 'ONLINE' : 'OFFLINE'}
                <span className="text-slate-500 font-normal text-sm mx-2">•</span>
                {profile?.name}
                <span className="text-slate-500 font-normal text-sm mx-2">•</span>
                Level {profile?.level} Volunteer
              </h2>
              <div className="flex items-center gap-2 text-xs text-amber-400 mt-1">
                ⭐ {profile?.rating} Rating
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-400">{isOnline ? 'Accepting SOS' : 'Set Away'}</span>
            <Switch checked={isOnline} onCheckedChange={toggleOnline} className="data-[state=checked]:bg-emerald-500" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stats & Badges Sidebar */}
        <div className="space-y-4">
          <BadgesDisplay earnedBadgeIds={['first_aid', 'fast_responder', 'life_saver_10']} />
          <StatsPanel />
          <ImpactFeed />
        </div>

        {/* Map & Incidents Feed */}
        <div className="md:col-span-2 space-y-4">
          <Card className="bg-slate-900/60 border-slate-800 overflow-hidden relative">
            <div className="h-64 relative">
              <LiveNetworkMap showVolunteers={false} radiusKm={5} />
              {!isOnline && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <p className="text-slate-400 font-medium">Go online to view live incidents map</p>
                </div>
              )}
              {isOnline && (
                 <div className="absolute top-2 right-2 bg-black/80 px-3 py-1 rounded-full text-xs font-bold text-white border border-slate-700 shadow-lg backdrop-blur-md flex items-center gap-2 z-10">
                 🗺️ LIVE INCIDENT MAP
               </div>
              )}
            </div>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-5">
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 animate-pulse" /> 
                Active Incidents Nearby ({isOnline ? activeIncidents.length : 0})
              </h3>
              
              {!isOnline ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  You are offline. Toggle status to start receiving alerts.
                </div>
              ) : activeIncidents.length === 0 ? (
                <div className="text-center py-8 text-emerald-500/70 text-sm">
                  No active incidents right now. Stay safe!
                </div>
              ) : (
                <div className="space-y-3">
                  {activeIncidents.map(incident => (
                    <div key={incident.id} className="p-4 bg-black border border-slate-800 rounded-xl hover:border-red-500/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full animate-pulse ${incident.urgency === 'serious' ? 'bg-red-500' : incident.urgency === 'urgent' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                          <span className={`text-xs font-bold uppercase tracking-wider ${incident.urgency === 'serious' ? 'text-red-400' : incident.urgency === 'urgent' ? 'text-amber-400' : 'text-blue-400'}`}>
                            {incident.urgency}
                          </span>
                          <span className="text-xs text-slate-500">• {incident.distanceKm} km away • {incident.timeAgo}</span>
                        </div>
                      </div>
                      <p className="text-white font-medium mb-1">{incident.symptoms}</p>
                      <p className="text-slate-400 text-sm mb-4">{incident.patientInfo}</p>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => onSelectIncident(incident.id)}
                          className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-900/50 h-8 text-xs font-bold"
                        >
                          View Details & Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
