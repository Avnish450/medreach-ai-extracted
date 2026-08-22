'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Clock, MapPin, Phone, ShieldAlert, 
  Activity, Star, ChevronRight, Navigation, Bell,
  CheckCircle2, Car, Target, HeartPulse, Shield, 
  Zap, Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function VolunteerDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const volunteerStats = {
    name: "Alex Chen",
    role: "Emergency Transport Volunteer",
    level: 4,
    points: 1250,
    nextLevel: 1500,
    totalRides: 24,
    hoursActive: 48,
    rating: 4.9
  };

  const activeRequest = {
    id: "REQ-0982",
    type: "Code Amber - Urgent Transport",
    distance: "1.2 km away",
    location: "452 Medical Center Blvd",
    timeEstimate: "5 mins",
    status: "Awaiting Confirmation",
    patient: "Female, 34 (Suspected Appendicitis)"
  };

  const badges = [
    { name: "First Responder", icon: <ShieldAlert className="w-4 h-4 text-rose-500" />, desc: "Completed 10 emergency transports", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { name: "Night Owl", icon: <Clock className="w-4 h-4 text-indigo-500" />, desc: "Completed 5 night shifts", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { name: "Top Rated", icon: <Star className="w-4 h-4 text-amber-500" />, desc: "Maintained 4.8+ rating", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { name: "Speed Demon", icon: <Zap className="w-4 h-4 text-sky-500" />, desc: "Avg response time under 3 mins", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  ];

  const recentRides = [
    { id: "R-882", date: "Today, 10:30 AM", type: "Clinic Transfer", status: "Completed", points: "+50", duration: "18m" },
    { id: "R-881", date: "Yesterday, 2:15 PM", type: "Emergency ER", status: "Completed", points: "+100", duration: "12m" },
    { id: "R-875", date: "Aug 20, 9:00 AM", type: "Routine Checkup", status: "Completed", points: "+30", duration: "25m" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12 selection:bg-sky-500/30 selection:text-foreground relative overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 p-6 rounded-3xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full blur opacity-50 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 p-[2px]">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-sky-400 to-emerald-400">
                    AC
                  </span>
                </div>
              </div>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">{volunteerStats.name}</h1>
                <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20 transition-colors">
                  Level {volunteerStats.level}
                </Badge>
              </div>
              <p className="text-sm text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                {volunteerStats.role}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
              <span className="ml-2 flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            </Button>
            <Button 
              onClick={() => setIsOnline(!isOnline)}
              className={`w-full md:w-auto transition-all duration-300 ${
                isOnline 
                  ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 shadow-lg shadow-emerald-500/20'
              }`}
            >
              <Activity className={`w-4 h-4 mr-2 ${isOnline ? 'animate-pulse' : ''}`} />
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Button>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Main Dashboard Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active Request (Only show if online) */}
            <AnimatePresence mode="popLayout">
              {isOnline && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, height: 0 }}
                  animate={{ opacity: 1, scale: 1, height: 'auto' }}
                  exit={{ opacity: 0, scale: 0.95, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <Card className="relative overflow-hidden border-amber-500/40 bg-slate-900/80 backdrop-blur-sm shadow-[0_0_40px_-10px_rgba(245,158,11,0.15)]">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <CardHeader className="pb-3 relative z-10">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 uppercase tracking-wider text-[10px] font-bold">
                              Incoming Dispatch
                            </Badge>
                          </div>
                          <CardTitle className="text-xl md:text-2xl font-bold text-white tracking-tight">
                            {activeRequest.type}
                          </CardTitle>
                        </div>
                        <div className="text-left sm:text-right bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
                          <div className="text-2xl font-bold text-amber-400">{activeRequest.timeEstimate}</div>
                          <div className="text-xs font-medium text-slate-400">{activeRequest.distance} ETA</div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative z-10 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                          <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-0.5">Location</div>
                            <div className="text-sm font-medium text-slate-200">{activeRequest.location}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                          <HeartPulse className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-0.5">Patient Info</div>
                            <div className="text-sm font-medium text-slate-200">{activeRequest.patient}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex gap-3 relative z-10 pt-2">
                      <Button className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20 text-sm md:text-base transition-all active:scale-[0.98]">
                        <Navigation className="w-4 h-4 mr-2" />
                        Accept & Navigate
                      </Button>
                      <Button variant="outline" className="flex-none w-24 h-12 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white">
                        Decline
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Car, label: "Total Rides", value: volunteerStats.totalRides, color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20" },
                { icon: Clock, label: "Hours Active", value: `${volunteerStats.hoursActive}h`, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
                { icon: Star, label: "Avg Rating", value: volunteerStats.rating, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" }
              ].map((stat, i) => (
                <Card key={i} className="bg-slate-900/40 border-slate-800/60 backdrop-blur-sm hover:bg-slate-900/60 transition-colors">
                  <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                    <div className={`w-10 h-10 rounded-full ${stat.bg} ${stat.border} border flex items-center justify-center mb-3`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Recent History */}
            <motion.div variants={itemVariants}>
              <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-sky-400" />
                    Dispatch History
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs text-sky-400 hover:text-sky-300 hover:bg-sky-400/10">
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-800/60">
                    {recentRides.map((ride, idx) => (
                      <div key={ride.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-colors">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">{ride.type}</div>
                            <div className="text-xs text-slate-500 mt-0.5 font-medium">{ride.date} • ID: {ride.id}</div>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div className="hidden sm:block text-xs font-medium text-slate-500">{ride.duration}</div>
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 font-bold px-2.5 py-1">
                            {ride.points} pts
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Level & Progress */}
            <motion.div variants={itemVariants}>
              <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    Progression
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Level</div>
                      <div className="text-3xl font-bold text-white">{volunteerStats.level}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Points</div>
                      <div className="text-xl font-bold text-sky-400">{volunteerStats.points.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="relative pt-4 pb-2">
                    <Progress 
                      value={(volunteerStats.points / volunteerStats.nextLevel) * 100} 
                      className="h-2.5 bg-slate-800" 
                      // Customizing the progress indicator color if your UI component allows it, 
                      // otherwise it falls back to primary. Assuming tailwind support:
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mt-2">
                      <span>Lvl {volunteerStats.level}</span>
                      <span>{volunteerStats.nextLevel - volunteerStats.points} to Lvl {volunteerStats.level + 1}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Badges & Achievements */}
            <motion.div variants={itemVariants}>
              <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {badges.map((badge, idx) => {
                    return (
                      <motion.div 
                        key={badge.name}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center gap-4 p-3.5 rounded-xl ${badge.bg} border ${badge.border} transition-all cursor-default`}
                      >
                        <div className={`w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800 shadow-inner`}>
                          {badge.icon}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-200 mb-0.5">{badge.name}</div>
                          <div className="text-xs font-medium text-slate-400 leading-tight">{badge.desc}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="ghost" className="w-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800">
                    View All Badges <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
