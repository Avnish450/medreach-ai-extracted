import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatientView } from '@/components/ui/transport/PatientView';
import { VolunteerView } from '@/components/ui/transport/VolunteerView';

export const metadata = {
  title: 'Community Rescue | MedReach AI',
  description: 'Request or offer emergency transport in your community.',
};

export default function TransportPage() {
  return (
    <div className="flex-1 w-full relative min-h-screen pb-12 pt-8">
      {/* Background styling */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/10 via-background to-background" />

      <div className="relative z-10 container max-w-4xl mx-auto px-4">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Community Rescue Network
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            A peer-to-peer volunteer transport network for non-critical emergencies. 
            Request a ride to the nearest hospital or go online to help someone in need.
          </p>
        </div>

        <Tabs defaultValue="patient" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
              <TabsTrigger value="patient" className="text-sm font-bold">
                I Need Help
              </TabsTrigger>
              <TabsTrigger value="volunteer" className="text-sm font-bold">
                I Can Help
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="patient" className="focus-visible:outline-none focus-visible:ring-0">
            <PatientView />
          </TabsContent>

          <TabsContent value="volunteer" className="focus-visible:outline-none focus-visible:ring-0">
            <VolunteerView />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
