<div align="center">
  <img src="public/favicon.ico" alt="Logo" width="80" height="80">
  <h1 align="center">MedReach AI</h1>

  <p align="center">
    An intelligent medical triage and healthcare accessibility platform.
    <br />
    <br />
    <a href="#features">View Features</a>
    ·
    <a href="#getting-started">Getting Started</a>
    ·
    <a href="#api-documentation">API Docs</a>
  </p>
</div>

<!-- Badges -->
<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</div>

## 📖 Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## 🩺 About the Project

**MedReach AI** is an intelligent, accessible healthcare platform designed to bridge the gap between patients and medical professionals. By leveraging advanced Large Language Models (LLMs), the platform provides real-time medical triage, assesses symptom severity, and guides users to the appropriate care—whether that's self-care, a specialist appointment, or immediate emergency services.

**Target Audience:** Patients seeking preliminary symptom analysis and directions to local healthcare providers, as well as clinics looking to streamline their initial patient intake.

## ✨ Features

- **🤖 AI-Powered Conversational Triage (State Machine):** Utilizes Google Gemini (`gemini-1.5-flash`) through a structured **5-state conversational engine** (GREETING → TRIAGE_INTAKE → CONTEXT → ASSESSMENT → FOLLOW_UP). Each turn gathers OPQRST symptom data before delivering a structured clinical assessment.
- **🧠 Clinical System Prompt (MEDREACH_TRIAGE_SYSTEM_PROMPT):** A deeply engineered clinical prompt modeled on ESI, Manchester Triage, and CTAS frameworks. Enforces strict JSON schema output, confidence calibration (0–100%), and instant red-flag escalation.
- **🚨 Emergency Detection:** Built-in heuristics instantly bypass the AI for life-threatening presentations (stroke, MI, anaphylaxis, self-harm) before any API call is made.
- **💬 Multi-Turn Conversation:** Tracks full chat history across turns, enabling follow-up questions and progressive clinical picture building before the final assessment.
- **📊 Structured Assessment Output:** Final triage delivers: urgency level + explanation, possible conditions with likelihood scores, recommended specialties, do/do-not actions, warning signs, and time-to-care guidance.
- **🩺 Specialist Recommendations:** Intelligently matches symptom patterns to the correct medical specialties (e.g., Cardiology, Neurology, Emergency Medicine).
- **🚑 Community Rescue Transport:** A real-time peer-to-peerSOS system allowing patients to request emergency transport from nearby community volunteers. Includes interactive tabs for patients and volunteers with live browser event broadcasting.
- **🗺️ Interactive Healthcare Map:** Helps users find nearby clinics and hospitals using Google Maps integration, now featuring manual address entry capabilities.
- **🎙️ Voice Interface:** Multi-turn hands-free voice triage — speaks questions aloud and listens to answers, now with full conversation history support.
- **⚡ Modern & Responsive UI:** Built with Tailwind CSS and Shadcn UI, featuring smooth transitions via Framer Motion and interactive 3D elements powered by React Three Fiber.

## 🛠 Tech Stack

**Frontend Framework**
- [Next.js (App Router)](https://nextjs.org/)
- [React 19](https://react.dev/)

**Styling & UI**
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Three.js & React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) (3D Visuals)

**APIs & Services**
- [Google Generative AI (Gemini)](https://ai.google.dev/) (Triage Engine)
- [Google Maps API](https://developers.google.com/maps) (Location & Routing)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.17 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository** (if you haven't already):
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
```

### Quick Start

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 💡 Usage Guide

1. **Symptom Assessment:** Navigate to `/assessment` and input your symptoms (or use the Voice interface at `/voice`).
2. **Review Triage Results:** The AI will process the symptoms and return an urgency score, possible conditions, and recommended next steps.
3. **Find Care:** If a specialist is recommended, navigate to the `/map` or `/doctors` route to find nearby, relevant healthcare providers.
4. **Community Rescue Transport:** In emergencies where ambulances are unavailable, navigate to `/transport` to broadcast an SOS signal to local volunteers in your area.
5. **Emergency:** If critical keywords are detected, the UI will immediately redirect or show the `/emergency` protocol.

---

## 📂 Project Structure

```text
medreach-ai/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/                # Next.js App Router entry points
│   │   ├── api/            # Backend API Routes (triage, clinics, doctors)
│   │   ├── assessment/     # Symptom assessment page
│   │   ├── doctors/        # Doctor recommendation page
│   │   ├── emergency/      # Emergency protocol page
│   │   ├── map/            # Interactive clinics map
│   │   ├── recommendations/# AI next-steps recommendations
│   │   ├── transport/      # Community rescue transport page
│   │   └── voice/          # Voice interaction page
│   ├── components/         # Reusable React components
│   │   ├── home/           # Landing page components (Hero, Bento grids)
│   │   ├── layout/         # Header, Footer, Navigation
│   │   ├── shared/         # Common UI elements
│   │   ├── transport/      # SOS Patient & Volunteer Views
│   │   └── ui/             # Shadcn UI primitives
│   ├── lib/                # Core logic & utilities
│   │   ├── ai/             # Gemini API integration, heuristic engine
│   │   └── data/           # Mock data or data fetchers
│   └── types/              # Global TypeScript interfaces
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🔌 API Documentation

### `POST /api/triage`
Analyzes patient symptoms and returns structured triage data.

**Request Body:**
```json
{
  "userInput": "I have had a severe headache and mild fever for 2 days.",
  "userInfo": {
    "age": 30,
    "gender": "male"
  },
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
  "nextSteps": ["Rest in a dark, quiet room.", "Take prescribed pain relief."],
  "disclaimer": "This tool is not a substitute for professional medical advice..."
}
```

---

## 🛠 Troubleshooting

**Common Issues:**
- **Map not loading / Watermarked:** Ensure your `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is valid and has billing enabled on the Google Cloud Console.
- **AI Triage failing:** Check your `GEMINI_API_KEY`. If the API fails, the system will automatically fall back to local keyword-based heuristics.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## ⚠️ Medical Disclaimer

> **IMPORTANT:** MedReach AI is a tool designed for informational purposes and is **not a substitute for professional medical advice, diagnosis, or treatment.** Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application. If you think you may have a medical emergency, call your doctor, go to the emergency department, or call emergency services immediately.
