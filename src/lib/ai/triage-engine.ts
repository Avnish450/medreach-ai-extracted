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

  // 3. Fallback to stateful local heuristic engine
  return getStatefulTriageResult(userInput, chatHistory, userInfo);
}

// ──────────────────────────────────────────────────────────────────────────────
// STATEFUL LOCAL TRIAGE ENGINE
// Tracks conversation turn count and progresses through OPQRST questions,
// gathering information from user answers, and producing a final assessment.
// ──────────────────────────────────────────────────────────────────────────────

// Collect all user messages from chat history into a single blob for keyword analysis
function getAllUserText(userInput: string, chatHistory: { role: string; content: string }[]): string {
  const pastUserMessages = chatHistory
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join(' ');
  return `${pastUserMessages} ${userInput}`.toLowerCase();
}

// Simple keyword urgency scorer
function scoreUrgency(allText: string): { urgency: UrgencyLevel; confidence: number } {
  const high = ['severe', 'excruciating', 'unbearable', 'worst', 'blood', 'faint', 'dizzy', 'vomit', 'numbness', 'weakness', 'swelling', 'pregnant'];
  const moderate = ['pain', 'ache', 'fever', 'cough', 'sore', 'nausea', 'rash', 'burning', 'stiff', 'cramp', 'swollen', 'tender'];
  const low = ['mild', 'slight', 'little', 'minor', 'occasional', 'sometimes', 'dull'];

  let score = 0;
  high.forEach(k => { if (allText.includes(k)) score += 3; });
  moderate.forEach(k => { if (allText.includes(k)) score += 1; });
  low.forEach(k => { if (allText.includes(k)) score -= 1; });

  if (score >= 8) return { urgency: 'URGENT', confidence: 75 };
  if (score >= 4) return { urgency: 'ROUTINE', confidence: 60 };
  return { urgency: 'SELF_CARE', confidence: 45 };
}

// The ordered intake questions following OPQRST
const INTAKE_QUESTIONS: Array<{
  field: string;
  message: string;
  question: { text: string; type: string; options: string[]; why_asking: string };
}> = [
  {
    field: 'onset',
    message: "Thank you for sharing that. Let me understand the timeline.",
    question: {
      text: "When did this start, and was it sudden or gradual?",
      type: "choice",
      options: ["Just now, suddenly", "Within the last few hours", "A few days ago", "More than a week ago", "It's been gradual"],
      why_asking: "Sudden vs. gradual onset helps narrow down possible causes."
    }
  },
  {
    field: 'severity',
    message: "Got it. Let me assess how much this is affecting you.",
    question: {
      text: "On a scale of 0-10, how would you rate the severity right now?",
      type: "scale",
      options: ["0-2 (Barely noticeable)", "3-4 (Mild)", "5-6 (Moderate)", "7-8 (Severe)", "9-10 (Worst imaginable)"],
      why_asking: "Severity helps us gauge how urgently you need care."
    }
  },
  {
    field: 'quality',
    message: "I appreciate you bearing with me. One more question to help narrow things down.",
    question: {
      text: "How would you describe the sensation?",
      type: "choice",
      options: ["Sharp or stabbing", "Dull or aching", "Burning", "Pressure or tightness", "Throbbing", "Tingling or numbness", "Other"],
      why_asking: "The type of sensation helps differentiate between possible conditions."
    }
  },
  {
    field: 'associated_symptoms',
    message: "Almost there. This will help me put the full picture together.",
    question: {
      text: "Are you experiencing any of these alongside your main symptom?",
      type: "choice",
      options: ["Fever or chills", "Nausea or vomiting", "Fatigue or weakness", "Headache", "Difficulty breathing", "Dizziness", "None of these"],
      why_asking: "Associated symptoms can indicate if something more serious is going on."
    }
  }
];

function getStatefulTriageResult(
  userInput: string,
  chatHistory: { role: string; content: string }[],
  userInfo?: UserInfo
): TriageResponse {
  // Count how many times the USER has spoken (not counting the current message)
  const userTurnCount = chatHistory.filter(m => m.role === 'user').length;
  // userTurnCount=0 means this is the first user message (chief complaint)
  // userTurnCount=1 means chief complaint was given, now answer to Q1
  // etc.

  const allText = getAllUserText(userInput, chatHistory);
  const matchedSpecialists = matchSymptomsToSpecialists(
    chatHistory.filter(m => m.role === 'user').map(m => m.content).concat(userInput)
  );

  // ── TURN 0: User just gave their chief complaint → ask first OPQRST question
  if (userTurnCount === 0) {
    const q = INTAKE_QUESTIONS[0];
    return {
      state: 'TRIAGE_INTAKE',
      message: `Thank you for telling me about that. I'd like to ask a few questions to understand your situation better.`,
      question: { text: q.question.text, type: q.question.type as any, options: q.question.options, why_asking: q.question.why_asking },
      progress: { percent: 20, completed_fields: ['chief_complaint'], next_field: q.field },
      preliminary_assessment: { urgency: 'ROUTINE', confidence: 25, reasoning: 'Initial symptom reported, gathering more details.' },
      disclaimer_reminder: true
    };
  }

  // ── TURNS 1-3: Continue OPQRST intake
  const questionIndex = Math.min(userTurnCount, INTAKE_QUESTIONS.length - 1);
  
  if (userTurnCount < INTAKE_QUESTIONS.length) {
    const q = INTAKE_QUESTIONS[questionIndex];
    const completedFields = ['chief_complaint', ...INTAKE_QUESTIONS.slice(0, questionIndex).map(iq => iq.field)];
    const progressPercent = Math.min(20 + (questionIndex * 20), 80);
    const { urgency, confidence } = scoreUrgency(allText);

    return {
      state: 'TRIAGE_INTAKE',
      message: q.message,
      question: { text: q.question.text, type: q.question.type as any, options: q.question.options, why_asking: q.question.why_asking },
      progress: { percent: progressPercent, completed_fields: completedFields, next_field: q.field },
      preliminary_assessment: { urgency, confidence, reasoning: `Gathered ${completedFields.length} fields so far.` },
      disclaimer_reminder: true
    };
  }

  // ── TURN 4+: Enough info gathered → deliver FINAL ASSESSMENT
  const { urgency, confidence } = scoreUrgency(allText);
  const topSpecialty = matchedSpecialists[0]?.specialty || 'General Medicine';

  // Extract chief complaint from the very first user message
  const chiefComplaint = chatHistory.find(m => m.role === 'user')?.content || userInput;

  return {
    state: 'ASSESSMENT',
    message: `Based on what you've told me, here is my assessment. Please remember this is for guidance only.`,
    question: null,
    progress: { percent: 100, completed_fields: ['chief_complaint', 'onset', 'severity', 'quality', 'associated_symptoms'], next_field: 'none' },
    final_assessment: {
      urgency,
      urgency_explanation: urgency === 'URGENT'
        ? 'Your symptoms suggest you should see a doctor within the next 24 hours.'
        : urgency === 'SELF_CARE'
        ? 'Your symptoms appear manageable at home with monitoring.'
        : 'Your symptoms warrant a medical consultation within a few days.',
      time_to_care: urgency === 'URGENT' ? 'Within 24 hours' : urgency === 'SELF_CARE' ? 'Self-manage' : 'Within a week',
      summary: `Patient reported: "${chiefComplaint}". Additional details gathered over ${userTurnCount + 1} turns.`,
      possible_conditions: [
        {
          name: allText.includes('headache') ? 'Tension Headache' : allText.includes('stomach') || allText.includes('nausea') ? 'Gastritis' : allText.includes('cough') ? 'Upper Respiratory Infection' : allText.includes('back') ? 'Musculoskeletal Strain' : 'General Symptom Complex',
          medical_name: allText.includes('headache') ? 'Cephalalgia' : allText.includes('stomach') ? 'Gastritis' : allText.includes('cough') ? 'URI' : allText.includes('back') ? 'Myalgia' : 'Unspecified',
          likelihood: 'MODERATE' as const,
          brief: 'Most likely based on the symptoms described.'
        }
      ],
      recommended_specialties: matchedSpecialists.slice(0, 2).map(m => m.specialty).length > 0
        ? matchedSpecialists.slice(0, 2).map(m => m.specialty)
        : [topSpecialty],
      do_now: [
        'Schedule an appointment with a healthcare provider.',
        'Keep track of your symptoms and any changes.',
        'Stay hydrated and get adequate rest.'
      ],
      do_not: [
        'Do not ignore worsening symptoms.',
        'Do not self-medicate without consulting a doctor.'
      ],
      watch_for_worsening: [
        'Sudden increase in severity',
        'New symptoms like difficulty breathing or high fever',
        'Symptoms that don\'t improve within 48 hours'
      ],
      self_care_advice: urgency === 'SELF_CARE' ? 'Rest, stay hydrated, and monitor. If symptoms persist beyond 3 days, see a doctor.' : null,
      emergency_action: { call_emergency: false, emergency_number: '', message: '' }
    },
    disclaimer_reminder: true
  };
}
