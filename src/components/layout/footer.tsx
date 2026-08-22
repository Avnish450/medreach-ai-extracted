'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, ShieldAlert, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname === '/map' || pathname === '/voice') {
    return null;
  }

  const links = {
    product: [
      { name: 'Symptom Triage', href: '/assessment' },
      { name: 'Voice Assistant', href: '/voice' },
      { name: 'Live Clinic Radar', href: '/map' },
      { name: 'Doctor Directory', href: '/doctors' },
      { name: 'Emergency Sentinel', href: '/emergency' }
    ],
    specialties: [
      { name: 'Emergency Medicine', href: '/doctors' },
      { name: 'Cardiology', href: '/doctors' },
      { name: 'Pediatrics', href: '/doctors' },
      { name: 'Neurology', href: '/doctors' },
      { name: 'Orthopedics', href: '/doctors' }
    ],
    emergency: [
      { name: 'National Toll-Free (112)', href: 'tel:112' },
      { name: 'Ambulance Dispatch (108)', href: 'tel:108' },
      { name: 'Emergency Protocol Guide', href: '/emergency' }
    ]
  };

  return (
    <footer className="relative border-t border-border bg-background dark:bg-black overflow-hidden">
      
      {/* Ambient gradient spotlight at the bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-sky-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 py-16 relative z-10 max-w-7xl">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-border">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 via-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Activity className="w-4.5 h-4.5 text-black" />
              </div>
              <span className="font-semibold text-lg text-foreground tracking-tight">
                MedReach AI
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Clinical-grade AI triage &amp; real-time clinic navigation platform. Engineered for speed, clinical accuracy, and emergency safety.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-xs font-mono text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Triage Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Links: Product */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              {links.product.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                    <span>{l.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Specialties */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Specialties
            </h4>
            <ul className="space-y-2.5 text-sm">
              {links.specialties.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Emergency */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Emergency 24/7</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              {links.emergency.map((l) => (
                <li key={l.name}>
                  <a href={l.href} className="text-rose-600/80 dark:text-rose-300/80 hover:text-rose-600 dark:hover:text-rose-300 transition-colors flex items-center gap-1">
                    <span>{l.name}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Medical Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <p className="max-w-2xl leading-relaxed text-center md:text-left">
            <strong className="text-foreground">Clinical Disclaimer:</strong> MedReach AI is an intelligent clinical routing and information system. It is not intended to replace licensed medical examination, diagnosis, or emergency dispatch. For life-threatening emergencies, dial 112 or 108 immediately.
          </p>

          <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
            <span>© {currentYear} MedReach AI Inc.</span>
            <span>•</span>
            <span>Built for Next-Gen Healthcare</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
