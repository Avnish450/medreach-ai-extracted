'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ShieldCheck, User, FileText, Car, CheckCircle2 } from 'lucide-react';
import { useVolunteerStore } from '@/store/use-volunteer-store';
import { motion, AnimatePresence } from 'framer-motion';

export function OnboardingStage() {
  const { setStage, setProfile } = useVolunteerStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleMake: '',
    vehicleModel: '',
    licensePlate: '',
    certifications: [] as string[],
    agreed: false
  });
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleNext = () => setStep(p => p + 1);
  
  const handleComplete = () => {
    setProfile({
      id: `vol_${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name || 'Anonymous Hero',
      phone: formData.phone || '555-0199',
      vehicleMake: formData.vehicleMake || 'Honda',
      vehicleModel: formData.vehicleModel || 'City',
      licensePlate: formData.licensePlate || 'MH-12-AB-1234',
      certifications: formData.certifications.length ? formData.certifications : ['First Aid'],
      rating: 5.0,
      level: 1,
      totalRescues: 0
    });
    setStage('OFFLINE'); // Proceed to offline dashboard
  };

  const toggleCert = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert) 
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-black/60 backdrop-blur-md border-blue-500/30 overflow-hidden shadow-2xl">
      <div className="flex h-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`flex-1 ${step >= i ? 'bg-blue-500' : 'bg-slate-800'}`} />
        ))}
      </div>
      
      <CardHeader className="bg-slate-900/50 pb-4 border-b border-slate-800">
        <CardTitle className="text-xl flex items-center gap-2 text-white">
          <ShieldCheck className="text-blue-500 w-6 h-6" />
          Volunteer Onboarding
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-full"><User className="text-blue-400 w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-white text-lg">Personal Details</h3>
                  <p className="text-xs text-slate-400">How should patients identify you?</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Full Name</Label>
                <Input className="bg-slate-900 border-slate-700 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Rahul Sharma" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Phone Number</Label>
                <Input className="bg-slate-900 border-slate-700 text-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 98765 43210" />
              </div>
              <Button 
                onClick={handleNext} 
                disabled={!formData.name.trim() || !formData.phone.trim()}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-4">
               <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-full"><FileText className="text-blue-400 w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-white text-lg">ID Verification</h3>
                  <p className="text-xs text-slate-400">Safety is our top priority.</p>
                </div>
              </div>
              
              <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl text-center bg-slate-900/50">
                <p className="text-slate-400 text-sm mb-4">Upload Government ID / Driver's License</p>
                <Button 
                  onClick={() => setFileUploaded(true)}
                  variant={fileUploaded ? "default" : "outline"}
                  className={`border-slate-600 ${fileUploaded ? "bg-emerald-600 text-white" : "text-slate-300"}`}
                >
                  {fileUploaded ? <><CheckCircle2 className="w-4 h-4 mr-2" /> ID_Uploaded.pdf</> : "Select File"}
                </Button>
                <p className="text-[10px] text-emerald-400 mt-4">(Simulated: Click to simulate upload for demo)</p>
              </div>
              
              <Button 
                onClick={handleNext} 
                disabled={!fileUploaded}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-full"><Car className="text-blue-400 w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-white text-lg">Vehicle Information</h3>
                  <p className="text-xs text-slate-400">Patients will look for this vehicle.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Make</Label>
                  <Input className="bg-slate-900 border-slate-700 text-white" value={formData.vehicleMake} onChange={e => setFormData({...formData, vehicleMake: e.target.value})} placeholder="Honda" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Model</Label>
                  <Input className="bg-slate-900 border-slate-700 text-white" value={formData.vehicleModel} onChange={e => setFormData({...formData, vehicleModel: e.target.value})} placeholder="City" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">License Plate</Label>
                <Input className="bg-slate-900 border-slate-700 text-white" value={formData.licensePlate} onChange={e => setFormData({...formData, licensePlate: e.target.value})} placeholder="MH-12-AB-1234" />
              </div>
              
              <Button 
                onClick={handleNext} 
                disabled={!formData.vehicleMake.trim() || !formData.vehicleModel.trim() || !formData.licensePlate.trim()}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="4" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/20 rounded-full"><CheckCircle2 className="text-emerald-400 w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-white text-lg">Certifications & Terms</h3>
                  <p className="text-xs text-slate-400">Boost your trust rating with badges.</p>
                </div>
              </div>

              <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <Label className="text-slate-300 mb-2 block">Select Badges</Label>
                {['First Aid', 'CPR', 'Medical Professional'].map(cert => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox id={cert} checked={formData.certifications.includes(cert)} onCheckedChange={() => toggleCert(cert)} className="border-slate-600 data-[state=checked]:bg-blue-500" />
                    <label htmlFor={cert} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300">
                      {cert}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex items-start space-x-2 mt-6">
                <Checkbox id="terms" checked={formData.agreed} onCheckedChange={(c) => setFormData({...formData, agreed: c as boolean})} className="mt-1 border-slate-600 data-[state=checked]:bg-blue-500" />
                <label htmlFor="terms" className="text-xs leading-tight text-slate-400">
                  I agree to the Good Samaritan legal disclaimer, liability protection agreement, and MedReach safety protocols.
                </label>
              </div>
              
              <Button onClick={handleComplete} disabled={!formData.agreed} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12">
                Complete Onboarding
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
