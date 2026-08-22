// ============================================================
// MedReach AI — Type Definitions
// ============================================================

// --- Urgency Levels ---
export type UrgencyLevel = 'emergency' | 'urgent' | 'routine' | 'self-care' | 'EMERGENCY' | 'URGENT' | 'ROUTINE' | 'SELF_CARE';

export type TriageState = 'GREETING' | 'TRIAGE_INTAKE' | 'CONTEXT' | 'ASSESSMENT' | 'FOLLOW_UP';

export interface TriageQuestion {
  text: string | null;
  type: 'text' | 'scale' | 'choice' | 'body_map' | 'duration';
  options?: string[];
  why_asking?: string;
}

export interface TriageProgress {
  percent: number;
  completed_fields: string[];
  next_field: string;
}

export interface PreliminaryAssessment {
  urgency: UrgencyLevel;
  confidence: number;
  reasoning: string;
}

export interface TriagePossibleCondition {
  name: string;
  medical_name: string;
  likelihood: 'HIGH' | 'MODERATE' | 'LOW';
  brief: string;
}

export interface EmergencyAction {
  call_emergency: boolean;
  emergency_number: string;
  message: string;
}

export interface FinalAssessment {
  urgency: UrgencyLevel;
  urgency_explanation: string;
  time_to_care: 'NOW' | 'Within 2 hours' | 'Within 24 hours' | 'Within a week' | 'Self-manage';
  summary: string;
  possible_conditions: TriagePossibleCondition[];
  recommended_specialties: string[];
  do_now: string[];
  do_not: string[];
  watch_for_worsening: string[];
  self_care_advice: string | null;
  emergency_action: EmergencyAction;
}

export interface TriageResponse {
  state: TriageState;
  message: string;
  question: TriageQuestion | null;
  progress: TriageProgress;
  preliminary_assessment?: PreliminaryAssessment;
  final_assessment?: FinalAssessment;
  disclaimer_reminder: boolean;
}

// --- Chat Messages ---
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  triageResponse?: TriageResponse; // Updated from triageResult
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
  clinicState?: string;
  location: {
    lat: number;
    lng: number;
  };
  languages: string[];
  about: string;
  isEmergencyAvailable?: boolean;
  hospitalPhone?: string;
  emergencyDesk?: string;
  traumaLevel?: string;
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
  city?: string;
  availableOnly: boolean;
  emergencyOnly?: boolean;
  maxFee: number;
  minExperience: number;
  searchQuery: string;
}

// --- Emergency Notification ---
export interface EmergencyNotificationData {
  alertId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalCity: string;
  hospitalPhone: string;
  patientName: string;
  patientAge: string | number;
  patientGender?: string;
  contactPhone: string;
  emergencyType: string;
  urgencyCode: 'Code Red' | 'Code Amber';
  etaMinutes: string;
  transportMode: string;
  symptomsNotes: string;
  timestamp: string;
  status: 'dispatched' | 'acknowledged' | 'bay_ready';
  traumaBay?: string;
}

// --- Language ---
export type SupportedLanguage = 'en' | 'hi' | 'bn';

export interface TranslationStrings {
  [key: string]: string;
}

