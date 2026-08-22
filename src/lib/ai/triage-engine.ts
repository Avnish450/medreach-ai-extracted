import { TriageResponse, UrgencyLevel, UserInfo } from '@/types';
import { getGeminiClient } from './gemini';
import { detectEmergency } from '../triage/emergency-detector';
import { matchSymptomsToSpecialists } from './symptom-matcher';
import { MEDREACH_TRIAGE_SYSTEM_PROMPT } from '../prompts/triage-prompt';
import { TriageResponseSchema } from '../schemas/triage-schema';

export async function performTriage(
  userInput: string,
  userInfo?: UserInfo,
  chatHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<TriageResponse> {
  // 1. Check for immediate local emergencies first
  const emergencyCheck = detectEmergency(userInput);
  if (emergencyCheck.isEmergency) {
    const matchedSpecialists = matchSymptomsToSpecialists([userInput]);
    return {
      state: 'ASSESSMENT',
      message: 'Critical emergency detected based on your input. Please seek immediate help.',
      question: null,
      progress: { percent: 100, completed_fields: ['chief_complaint'], next_field: 'none' },
      final_assessment: {
        urgency: 'EMERGENCY',
        urgency_explanation: 'Your symptoms indicate a potentially life-threatening situation.',
        time_to_care: 'NOW',
        summary: `User reported: ${userInput}`,
        possible_conditions: [
          {
            name: emergencyCheck.emergencyType || 'Critical Condition',
            medical_name: 'Emergency',
            likelihood: 'HIGH',
            brief: 'Immediate medical attention required.'
          }
        ],
        recommended_specialties: [matchedSpecialists[0]?.specialty || 'Emergency Medicine'],
        do_now: [
          'Call emergency services immediately.',
          'Do not drive yourself to the hospital.',
          'Unlock your front door so emergency responders can enter.',
          'Rest in a comfortable position.'
        ],
        do_not: ['Do not exert yourself.', 'Do not eat or drink anything unless instructed.'],
        watch_for_worsening: ['Loss of consciousness', 'Severe difficulty breathing'],
        self_care_advice: null,
        emergency_action: {
          call_emergency: true,
          emergency_number: '112',
          message: 'Call 112 immediately for an ambulance.'
        }
      },
      disclaimer_reminder: true
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
        MEDREACH_TRIAGE_SYSTEM_PROMPT,
        `User Info: ${JSON.stringify(userInfo || {})}`,
        `Chat History: ${JSON.stringify(chatHistory)}`,
        `Current User Input: "${userInput}"`,
        `Analyze and respond in strictly valid JSON format matching the schema:`
      ];

      const result = await model.generateContent(promptParts.join('\n\n'));
      const text = result.response.text();
      
      // Attempt to parse and validate with Zod
      const rawJson = JSON.parse(text);
      const parsedResult = TriageResponseSchema.parse(rawJson);

      // Enforce disclaimer is present
      parsedResult.disclaimer_reminder = true;

      return parsedResult as TriageResponse;
    } catch (error) {
      console.error("Gemini API Error, falling back to local heuristic rules:", error);
    }
  }

  // 3. Fallback to Local Heuristic / Mock Engine (Offline / Demo mode)
  return getMockTriageResult(userInput, userInfo);
}

function getMockTriageResult(input: string, userInfo?: UserInfo): TriageResponse {
  // A simplified mock response that just jumps to assessment for demo purposes
  const normalized = input.toLowerCase();
  
  if (normalized.includes('fever')) {
      return {
          state: 'ASSESSMENT',
          message: "Based on your report of a fever, here is my assessment.",
          question: null,
          progress: { percent: 100, completed_fields: [], next_field: '' },
          final_assessment: {
              urgency: 'URGENT',
              urgency_explanation: 'High fever requires prompt medical evaluation.',
              time_to_care: 'Within 24 hours',
              summary: 'Patient reports fever.',
              possible_conditions: [
                  { name: 'Viral Fever', medical_name: 'Viral Infection', likelihood: 'HIGH', brief: 'Common viral illness' }
              ],
              recommended_specialties: ['General Medicine'],
              do_now: ['Take paracetamol', 'Stay hydrated'],
              do_not: ['Do not take antibiotics without prescription'],
              watch_for_worsening: ['Difficulty breathing', 'Confusion'],
              self_care_advice: 'Rest and fluids',
              emergency_action: { call_emergency: false, emergency_number: '', message: '' }
          },
          disclaimer_reminder: true
      };
  }

  // Default question state for fallback if not immediately recognizing something
  return {
      state: 'TRIAGE_INTAKE',
      message: "I understand. Could you tell me more about how long this has been going on?",
      question: {
          text: "How long have you had these symptoms?",
          type: "choice",
          options: ["Just started", "A few hours", "A few days", "More than a week"],
          why_asking: "Duration helps determine urgency."
      },
      progress: { percent: 50, completed_fields: ['chief_complaint'], next_field: 'duration' },
      preliminary_assessment: {
          urgency: 'ROUTINE',
          confidence: 30,
          reasoning: 'Need more information.'
      },
      disclaimer_reminder: true
  };
}
