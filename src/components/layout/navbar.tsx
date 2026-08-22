'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  Activity, Sun, Moon, Menu, ShieldAlert, 
  X, ArrowRight, Stethoscope, MapPin, Mic, Settings, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { name: 'Symptom Triage', href: '/assessment', icon: <Activity className="w-3.5 h-3.5" /> },
    { name: 'Voice Assist', href: '/voice', icon: <Mic className="w-3.5 h-3.5" /> },
    { name: 'Rescue Transport', href: '/transport', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { name: 'Clinic Radar', href: '/map', icon: <MapPin className="w-3.5 h-3.5" /> },
    { name: 'Doctors', href: '/doctors', icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { name: 'Volunteers', href: '/volunteers', icon: <Heart className="w-3.5 h-3.5" /> },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed top-0 left-0 w-full z-50 grid place-items-center px-4 pt-4 md:pt-6 pointer-events-none">
      <header
        className={`pointer-events-auto w-full max-w-7xl transition-all duration-300 rounded-full ${
          scrolled
            ? 'framer-nav py-2 px-3 shadow-2xl'
            : 'bg-background/70 dark:bg-black/40 backdrop-blur-md border border-border py-2.5 px-4 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 pl-2 group">
            <img src="/logo.jpg" alt="MedReach AI Logo" className="w-8 h-8 rounded-full shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform object-cover" />
            <span className="font-semibold text-sm tracking-tight text-foreground flex items-center gap-1.5">
              MedReach
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-muted text-sky-600 dark:text-sky-300 border border-border">
                AI
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive(item.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {isActive(item.href) && (
                  <motion.div
                    layoutId="framer-nav-pill"
                    className="absolute inset-0 rounded-full bg-muted dark:bg-white/10 border border-border shadow-inner"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{item.icon}</span>
                <span className="relative z-10">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle Theme"
            >
              {mounted ? (
                theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />
              ) : (
                <span className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Emergency Hotline Button */}
            <Link href="/emergency">
              <button className="px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-all">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>112 / Emergency</span>
              </button>
            </Link>

            {/* Main CTA */}
            <Link href="/assessment">
              <button className="framer-btn-primary px-4 py-1.5 text-xs flex items-center gap-1.5 shadow-md">
                <span>Try Triage</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              {mounted ? (
                theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />
              ) : (
                <span className="w-3.5 h-3.5" />
              )}
            </button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger render={
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted bg-muted/60"
                  aria-label="Open Menu"
                />
              }>
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </SheetTrigger>

              <SheetContent
                side="top"
                className="w-full border-b border-border bg-background/95 dark:bg-black/95 backdrop-blur-2xl p-6 pt-12"
              >
                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
                        <Activity className="w-3.5 h-3.5 text-black" />
                      </div>
                      <span className="font-semibold text-foreground">MedReach AI</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-3 ${
                          isActive(item.href)
                            ? 'bg-muted text-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border flex flex-col gap-2.5">
                    <Link href="/assessment" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full framer-btn-primary py-5 text-sm">
                        Start AI Triage
                      </Button>
                    </Link>
                    <Link href="/emergency" onClick={() => setMobileOpen(false)}>
                      <Button variant="destructive" className="w-full rounded-full py-5 text-sm bg-rose-600">
                        Emergency Contacts (112)
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </header>
    </div>
  );
}
