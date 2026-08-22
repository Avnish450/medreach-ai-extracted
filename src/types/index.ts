// ============================================================
// MedReach AI — Type Definitions
// ============================================================

// --- Urgency Levels ---
export type UrgencyLevel = 'emergency' | 'urgent' | 'routine' | 'self-care';

export interface TriageResult {
  urgency: UrgencyLevel;
  score: number; // 0-100
  symptoms: string[];
  duration?: string;
  severity?: string;
  possibleConditions: PossibleCondition[];
  recommendedSpecialist: string;
  nextSteps: string[];
  followUpQuestions?: string[];
  disclaimer: string;
}

export interface PossibleCondition {
  name: string;
  confidence: number; // 0-100
  description: string;
}

// --- Chat Messages ---
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  triageResult?: TriageResult;
  isEmergency?: boolean;
}

// --- User Info ---
export interface UserInfo {
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  existingConditions?: string[];
  medications?: string[];
}

// --- Doctor ---
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number; // years
  qualification: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  availabilityStatus: 'available' | 'busy' | 'offline';
  nextAvailable?: string;
  consultationFee: number;
  clinicName: string;
  clinicAddress: string;
  clinicCity: string;
  location: {
    lat: number;
    lng: number;
  };
  languages: string[];
  about: string;
}

// --- Clinic ---
export interface Clinic {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'diagnostic-center' | 'emergency';
  address: string;
  distance: number; // km
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openHours: string;
  phone: string;
  specialties: string[];
  location: {
    lat: number;
    lng: number;
  };
  imageUrl?: string;
  isEmergency?: boolean;
}

// --- Symptom ---
export interface SymptomCategory {
  id: string;
  name: string;
  icon: string;
  bodyRegion: string;
  symptoms: Symptom[];
}

export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  isEmergency?: boolean;
}

// --- Specialty ---
export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  commonSymptoms: string[];
}

// --- Voice State ---
export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

// --- Map Filters ---
export interface MapFilters {
  specialty: string;
  maxDistance: number;
  minRating: number;
  openNow: boolean;
}

// --- Doctor Filters ---
export interface DoctorFilters {
  specialty: string;
  availableOnly: boolean;
  maxFee: number;
  minExperience: number;
  searchQuery: string;
}

// --- Language ---
export type SupportedLanguage = 'en' | 'hi' | 'bn';

export interface TranslationStrings {
  [key: string]: string;
}
