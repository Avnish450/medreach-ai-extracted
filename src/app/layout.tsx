import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MedReach AI - AI Healthcare Triage & Clinic Recommendations',
  description: 'Understand your symptoms, get urgency triage scoring, match with specialists, find nearby clinics & book appointments in real time.',
  keywords: 'healthcare, AI triage, symptom checker, medical specialist, clinic recommendations, telemedicine',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>
          <Navbar />
          <main className="flex-grow flex flex-col pt-24">
            {children}
          </main>
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
