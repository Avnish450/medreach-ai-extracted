<div align="center">
  <img src="public/favicon.ico" alt="Logo" width="80" height="80">
  <h1 align="center">MedReach AI</h1>

  <p align="center">
    <strong>An intelligent medical triage, community rescue, and healthcare accessibility platform.</strong>
    <br />
    <br />
    <a href="#-key-features">View Features</a>
    ·
    <a href="#-getting-started">Getting Started</a>
    ·
    <a href="#-api-documentation">API Docs</a>
  </p>
</div>

<!-- Badges -->
<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer" alt="Framer Motion" />
</div>

<br />

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [What's New](#-whats-new-recent-updates)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Disclaimer](#-medical-disclaimer)

---

## 🩺 About the Project

**MedReach AI** is an intelligent, accessible healthcare platform designed to bridge the gap between patients, community responders, and medical professionals. By leveraging advanced Large Language Models (LLMs) and real-time geolocation, the platform provides real-time medical triage, assesses symptom severity, and guides users to the appropriate care—whether that's self-care, a specialist appointment, or immediate emergency dispatch.

**Target Audience:** 
- Patients seeking preliminary symptom analysis and directions to local healthcare providers.
- Community volunteers enrolling to provide emergency transport and assistance.
- Clinics looking to streamline their initial patient intake.

---

## 🚀 What's New (Recent Updates)

We've recently heavily refined the platform to ensure a premium, bug-free, and highly immersive user experience:

- 🌟 **Premium Volunteer Dispatch Dashboard:** A complete overhaul of the Volunteer interface. Now features a high-tech "radar" aesthetic with glassmorphism, dynamic dispatch alert animations (simulating active SOS calls), online/offline status toggles, and gamified progression tracking (badges and levels).
- 💬 **Refined Triage UX:** Resolved viewport glitches in the chat interface to ensure smooth, intelligent auto-scrolling only when active messages are present.
- 🎨 **Immersive Landing Page:** Upgraded the landing page hero section with radial gradient masking for a seamless, edge-blended UI experience.
- 🛡️ **Robust Architecture:** Achieved 100% type safety across critical UI components (Severity Sliders, Assessment Cards) and streamlined the project structure by removing deprecated simulators.

---

## ✨ Key Features

### 1. AI-Powered Conversational Triage
- **State Machine Engine:** Utilizes Google Gemini (`gemini-1.5-flash`) through a structured **5-state conversational engine** (GREETING → TRIAGE_INTAKE → CONTEXT → ASSESSMENT → FOLLOW_UP).
- **Clinical System Prompt:** A deeply engineered prompt modeled on ESI, Manchester Triage, and CTAS frameworks. Enforces strict JSON schema output and confidence calibration (0–100%).
- **Multi-Turn Context:** Tracks full chat history, enabling progressive clinical picture building before the final assessment.

### 2. Emergency Detection & Auto-Escalation
- **Heuristic Bypass:** Built-in heuristics instantly bypass the AI for life-threatening presentations (stroke, MI, anaphylaxis) before any API call is made.
- **Safety Integration:** Integrated with **Twilio** for emergency SMS broadcasting. Escalates to 112 if a volunteer doesn't accept a rescue within 3 minutes.

### 3. Community Rescue Transport (P2P Network)
- **Live SOS Dispatch:** A real-time peer-to-peer SOS system allowing patients to request emergency transport from nearby community volunteers.
- **Supabase Realtime:** Interactive dashboards for patients and volunteers with live browser event broadcasting.

### 4. High-Tech Volunteer Dashboard
- **Gamification:** Volunteers earn badges (First Responder, Speed Demon), level up through points, and view their dispatch history.
- **Dynamic UI:** Features pulsing alert cards, gradient backgrounds, and fluid `framer-motion` enter animations.

### 5. Interactive Healthcare Map
- Helps users find nearby clinics and hospitals using **Google Maps** integration, featuring manual address entry and live location tracking.

---

## 🛠 Tech Stack

**Frontend & UI**
- **Framework:** Next.js 16 (App Router) & React 19
- **Styling:** Tailwind CSS 4, Shadcn UI
- **Animations:** Framer Motion, React Three Fiber (3D Elements)
- **Icons:** Lucide React

**APIs & Backend**
- **AI Engine:** Google Generative AI (Gemini)
- **Realtime Database:** Supabase Realtime
- **Mapping:** Google Maps API
- **Communications:** Twilio (SMS Broadcasting)
- **State Management:** Zustand

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.17 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Avnish450/medreach-ai-extracted.git
   cd medreach-ai-extracted
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root directory and add your API keys:

```env
# Required for the AI Triage Engine
GEMINI_API_KEY=your_gemini_api_key_here

# Required for the Interactive Map features
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Required for Community Rescue Transport (Realtime)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required for Emergency SMS Broadcasts (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

### Quick Start

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 Usage Guide

1. **Symptom Assessment (`/assessment`):** Input your symptoms via text or use the Voice interface at `/voice`.
2. **Review Triage Results:** The AI will process symptoms and return an urgency score, possible conditions, and next steps.
3. **Find Care (`/map` or `/doctors`):** Find nearby, relevant healthcare providers if a specialist is recommended.
4. **Community Rescue (`/transport`):** Broadcast an SOS signal to local volunteers in your area.
5. **Volunteer Dashboard (`/volunteers`):** Volunteers can monitor their status, accept active dispatches, and track their gamified progress.

---

## 📂 Project Structure

```text
src/
├── app/                # Next.js App Router entry points
│   ├── api/            # Backend API Routes (triage, clinics, doctors)
│   ├── assessment/     # AI Symptom assessment triage UI
│   ├── volunteers/     # Premium Volunteer Dispatch Dashboard
│   ├── emergency/      # Emergency protocol page
│   ├── map/            # Interactive clinics map
│   └── voice/          # Voice interaction page
├── components/         # Reusable React components
│   ├── home/           # Landing page components
│   ├── layout/         # Navbar, Footer
│   ├── ui/             # Shadcn UI primitives & Custom animated cards
│   └── chat/           # Chat interfaces & Severity Sliders
├── lib/                # Core logic
│   └── ai/             # Gemini API integration & heuristic engine
└── types/              # Global TypeScript interfaces (FinalAssessment, etc.)
```

---

## 🔌 API Documentation

### `POST /api/triage`
Analyzes patient symptoms and returns structured triage data.

**Request Body:**
```json
{
  "userInput": "I have had a severe headache and mild fever for 2 days.",
  "userInfo": { "age": 30, "gender": "male" },
  "chatHistory": []
}
```

**Response (200 OK):**
```json
{
  "urgency": "urgent",
  "score": 65,
  "symptoms": ["headache", "fever"],
  "duration": "2 days",
  "severity": "severe",
  "possibleConditions": [
    {
      "name": "Migraine",
      "confidence": 80,
      "description": "A severe, throbbing headache..."
    }
  ],
  "recommendedSpecialist": "Neurologist",
  "nextSteps": ["Rest in a dark, quiet room.", "Take prescribed pain relief."]
}
```

---

## ⚠️ Medical Disclaimer

> **IMPORTANT:** MedReach AI is a tool designed for informational purposes and is **not a substitute for professional medical advice, diagnosis, or treatment.** Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application. If you think you may have a medical emergency, call your doctor, go to the emergency department, or call emergency services immediately.
