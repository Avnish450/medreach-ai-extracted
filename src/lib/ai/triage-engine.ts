import { TriageResult, UrgencyLevel, UserInfo } from '@/types';
import { getGeminiClient } from './gemini';
import { detectEmergency } from './emergency-detector';
import { matchSymptomsToSpecialists } from './symptom-matcher';

// System prompt for medical triage
const SYSTEM_PROMPT = `You are an expert AI clinical triage assistant. Your goal is to analyze the patient's symptoms, duration, severity, and basic demographics, then categorize their urgency level and recommend suitable medical specialties.

URGENCY CATEGORIES:
1. "emergency" - Life-threatening conditions (e.g., severe chest pain, breathing difficulty, signs of stroke, heavy bleeding). Needs immediate care.
2. "urgent" - Needs prompt care within 24-48 hours but not immediately life-threatening (e.g., high fever, deep laceration, severe abdominal pain, persistent vomiting).
3. "routine" - Non-urgent conditions that can wait for a regular appointment (e.g., mild rash, chronic back pain, minor cough, general health query).
4. "self-care" - Mild, self-limiting symptoms that can be managed at home (e.g., mild cold, minor cut, muscle soreness).

CRITICAL RULE:
- NEVER provide a direct medical diagnosis. Only suggest "possible conditions" with confidence levels.
- Always include this EXACT medical disclaimer in the disclaimer field: "This tool is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."

OUTPUT FORMAT:
You must respond with a JSON object matching this structure:
{
  "urgency": "emergency" | "urgent" | "routine" | "self-care",
  "score": number (0-100, where 100 is most critical),
  "symptoms": string[] (clean, list of extracted symptoms),
  "duration": string (e.g., "3 days"),
  "severity": string (e.g., "moderate"),
  "possibleConditions": [
    { "name": string, "confidence": number (1-100), "description": string }
  ],
  "recommendedSpecialist": string (e.g., "Cardiologist", "Dermatologist"),
  "nextSteps": string[] (bullet points of clear action items),
  "followUpQuestions": string[] (1-3 questions asking for missing critical details if needed, e.g., age, other symptoms, specific triggers),
  "disclaimer": "This tool is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
}`;

export async function performTriage(
  userInput: string,
  userInfo?: UserInfo,
  chatHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<TriageResult> {
  // 1. Check for immediate local emergencies first
  const emergencyCheck = detectEmergency(userInput);
  if (emergencyCheck.isEmergency) {
    const matchedSpecialists = matchSymptomsToSpecialists([userInput]);
    return {
      urgency: 'emergency',
      score: 95,
      symptoms: [userInput],
      duration: 'unknown',
      severity: 'severe',
      possibleConditions: [
        {
          name: emergencyCheck.emergencyType || 'Critical Condition',
          confidence: 90,
          description: 'This is a potentially life-threatening medical situation requiring immediate emergency attention.'
        }
      ],
      recommendedSpecialist: matchedSpecialists[0]?.specialty || 'Emergency Medicine',
      nextSteps: [
        'Call 112 or 108 immediately for an ambulance.',
        'Do not drive yourself to the hospital.',
        'Unlock your front door so emergency responders can enter.',
        'Rest in a comfortable position while waiting for help.'
      ],
      disclaimer: 'This tool is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.'
    };
  }

  // 2. Call Gemini API if available
  const genAI = getGeminiClient();
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        }
      });

      const promptParts = [
        SYSTEM_PROMPT,
        `User Info: ${JSON.stringify(userInfo || {})}`,
        `Chat History: ${JSON.stringify(chatHistory)}`,
        `Current User Input: "${userInput}"`,
        `Analyze and respond in JSON format:`
      ];

      const result = await model.generateContent(promptParts.join('\n\n'));
      const text = result.response.text();
      const parsedResult = JSON.parse(text) as TriageResult;

      // Enforce disclaimer is present
      parsedResult.disclaimer = "This tool is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.";

      return parsedResult;
    } catch (error) {
      console.error("Gemini API Error, falling back to local heuristic rules:", error);
    }
  }

  // 3. Fallback to Local Heuristic / Mock Engine (Offline / Demo mode)
  return getMockTriageResult(userInput, userInfo);
}

function getMockTriageResult(input: string, userInfo?: UserInfo): TriageResult {
  const normalized = input.toLowerCase();
  let urgency: UrgencyLevel = 'routine';
  let score = 30;
  const symptoms: string[] = [];
  const possibleConditions: { name: string; confidence: number; description: string }[] = [];

  let recommendedSpecialist = 'General Medicine';
  let nextSteps: string[] = [];
  let followUpQuestions: string[] = [];

  // Local matching rules for demo
  if (normalized.includes('fever') || normalized.includes('temp') || normalized.includes('warm')) {
    symptoms.push('Fever');
    if (normalized.includes('high') || normalized.includes('103') || normalized.includes('104')) {
      urgency = 'urgent';
      score = 70;
      possibleConditions.push({
        name: 'High Grade Fever',
        confidence: 85,
        description: 'An elevated body temperature which could indicate an active infection.'
      });
      nextSteps = [
        'Take paracetamol or ibuprofen as advised by a doctor to reduce fever.',
        'Stay hydrated by drinking plenty of water, ORS, or clear broths.',
        'Rest in a cool room and apply a damp cloth to your forehead.',
        'Consult a general physician if the fever stays high for more than 48 hours.'
      ];
    } else {
      urgency = 'routine';
      score = 40;
      possibleConditions.push({
        name: 'Mild Viral Fever / Cold',
        confidence: 80,
        description: 'A common viral illness affecting the upper respiratory tract.'
      });
      nextSteps = [
        'Get plenty of rest and drink warm fluids.',
        'Monitor temperature regularly.',
        'Use over-the-counter fever reducers if necessary.'
      ];
    }
  }

  if (normalized.includes('cough') || normalized.includes('cold') || normalized.includes('throat')) {
    symptoms.push('Cough');
    if (normalized.includes('breath') || normalized.includes('wheez')) {
      urgency = 'urgent';
      score = 75;
      possibleConditions.push({
        name: 'Bronchitis or Asthmatic Flare-up',
        confidence: 75,
        description: 'Inflammation of the airways which can make breathing difficult.'
      });
      recommendedSpecialist = 'Pulmonologist';
      nextSteps = [
        'Use your inhaler if you are a diagnosed asthmatic.',
        'Avoid physical exertion and allergens.',
        'Seek immediate care if breathing difficulty worsens.'
      ];
    } else {
      symptoms.push('Mild Cold');
      possibleConditions.push({
        name: 'Upper Respiratory Tract Infection',
        confidence: 85,
        description: 'Common cold or viral infection of the throat.'
      });
      nextSteps = [
        'Steam inhalation twice a day.',
        'Warm salt water gargles for throat pain.',
        'Stay warm and hydrated.'
      ];
    }
  }

  if (normalized.includes('rash') || normalized.includes('skin') || normalized.includes('itch')) {
    symptoms.push('Skin Rash / Itching');
    urgency = 'routine';
    score = 35;
    possibleConditions.push({
      name: 'Contact Dermatitis or Eczema',
      confidence: 70,
      description: 'Skin irritation or allergic response to an external substance.'
    });
    recommendedSpecialist = 'Dermatologist';
    nextSteps = [
      'Avoid scratching the affected area to prevent secondary infection.',
      'Apply a cool compress or calamine lotion to soothe itching.',
      'Identify and avoid any new soaps, detergents, or cosmetics.',
      'Consult a dermatologist for a prescription cream.'
    ];
  }

  if (normalized.includes('stomach') || normalized.includes('belly') || normalized.includes('abdominal')) {
    symptoms.push('Abdominal Pain');
    if (normalized.includes('severe') || normalized.includes('sharp') || normalized.includes('vomit')) {
      urgency = 'urgent';
      score = 65;
      possibleConditions.push({
        name: 'Acute Gastroenteritis or Appendicitis Suspect',
        confidence: 60,
        description: 'Inflammation of the stomach/intestines or potential appendix issue.'
      });
      recommendedSpecialist = 'Gastroenterologist';
      nextSteps = [
        'Avoid solid foods; sip clear liquids like water or coconut water.',
        'Do not take pain relievers without consulting a doctor as it can mask appendicitis.',
        'Seek medical help if the pain migrates to the lower right abdomen or worsens.'
      ];
    } else {
      urgency = 'routine';
      score = 30;
      possibleConditions.push({
        name: 'Indigestion / Acid Reflux',
        confidence: 80,
        description: 'Stomach irritation due to acid buildup or food sensitivity.'
      });
      nextSteps = [
        'Avoid spicy, fatty, or acidic foods.',
        'Drink small sips of water or warm ginger tea.',
        'Do not lie down immediately after eating.'
      ];
    }
  }

  // Fallback if no matching keywords
  if (symptoms.length === 0) {
    symptoms.push(input.substring(0, 30) + '...');
    possibleConditions.push({
      name: 'Undetermined Symptom',
      confidence: 50,
      description: 'Your symptoms require clinical examination for proper evaluation.'
    });
    nextSteps = [
      'Keep a log of when symptoms occur and what makes them better or worse.',
      'Schedule a routine checkup with a general physician.'
    ];
    followUpQuestions = [
      'How long have you been experiencing these symptoms?',
      'On a scale of 1-10, how severe is the pain or discomfort?',
      'Are you experiencing any other symptoms like fever, nausea, or dizziness?'
    ];
  }

  return {
    urgency,
    score,
    symptoms,
    duration: 'unknown',
    severity: urgency === 'urgent' ? 'moderate' : 'mild',
    possibleConditions,
    recommendedSpecialist,
    nextSteps,
    followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : undefined,
    disclaimer: 'This tool is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.'
  };
}
