# MedReach AI

MedReach AI is an intelligent medical triage and healthcare accessibility platform built with modern web technologies. It leverages artificial intelligence to analyze patient symptoms, determine medical urgency, and recommend appropriate next steps and specialists.

## Features

- **AI-Powered Clinical Triage:** Utilizes Google Gemini (`gemini-1.5-flash`) to analyze symptoms, assess severity, and categorize urgency (Emergency, Urgent, Routine, Self-care).
- **Emergency Detection:** Built-in heuristics for immediate detection of life-threatening conditions to bypass standard AI processing and provide immediate emergency instructions.
- **Specialist Recommendations:** Intelligently matches analyzed symptoms to the right medical specialties (e.g., Cardiology, Dermatology).
- **Interactive Healthcare Map:** Helps users find nearby clinics and hospitals using Google Maps integration.
- **Voice Interface:** Voice-based interaction capabilities for seamless and accessible symptom reporting.
- **Beautiful & Modern UI:** Built with Next.js App Router, Tailwind CSS, Shadcn UI, and smooth animations powered by Framer Motion. Also includes interactive 3D elements powered by Three.js/React Three Fiber.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router)
- **Library:** [React](https://reactjs.org/) 19
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- **AI Integration:** [Google Generative AI](https://ai.google.dev/) (Gemini)
- **Mapping:** [@react-google-maps/api](https://react-google-maps-api-docs.netlify.app/)

## Getting Started

First, make sure to install dependencies:

```bash
npm install
```

Set up your environment variables. You will likely need API keys for Google Gemini and Google Maps. Create a `.env.local` file in the root directory:

```env
# Example environment variables needed (update with actual keys)
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Contains all the Next.js routes (`/assessment`, `/doctors`, `/emergency`, `/map`, `/recommendations`, `/voice`, `/api/triage`).
- `src/components`: Reusable UI components grouped by feature (home, layout, shared, ui).
- `src/lib/ai`: Contains the core logic for the AI Triage Engine, Emergency Detector, and Gemini API integration.
- `src/types`: TypeScript definitions for the project.

## Note on Medical Disclaimer

**MedReach AI is a tool designed for informational purposes and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition.**
