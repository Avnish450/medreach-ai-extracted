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
// STATEFUL LOCAL TRIAGE ENGINE (CONTEXT-AWARE)
// Personalises every message with the actual symptoms the user described.
// ──────────────────────────────────────────────────────────────────────────────

/** Merge all user turns into one lowercase string for keyword analysis */
function getAllUserText(userInput: string, chatHistory: { role: string; content: string }[]): string {
  const past = chatHistory.filter(m => m.role === 'user').map(m => m.content).join(' ');
  return `${past} ${userInput}`.toLowerCase();
}

/** Return the very first thing the user said (their chief complaint) */
function getChiefComplaint(chatHistory: { role: string; content: string }[], fallback: string): string {
  return chatHistory.find(m => m.role === 'user')?.content || fallback;
}

interface SymptomProfile {
  label: string;
  bodyPart: string;
  conditions: Array<{ name: string; medical_name: string; likelihood: 'HIGH' | 'MODERATE' | 'LOW'; brief: string }>;
  specialties: string[];
  doNow: string[];
  doNot: string[];
  watchFor: string[];
  selfCare: string;
}

/** Map symptom keywords to a rich clinical profile */
function detectSymptomCategory(text: string): SymptomProfile {
  if (text.match(/chest|heart|palpitation|cardiac/)) return {
    label: 'chest discomfort', bodyPart: 'chest',
    conditions: [
      { name: 'Musculoskeletal Chest Pain', medical_name: 'Costochondritis / Chest Wall Strain', likelihood: 'MODERATE', brief: 'Cartilage inflammation connecting ribs — very common, usually benign.' },
      { name: 'Acid Reflux', medical_name: 'Gastroesophageal Reflux Disease (GERD)', likelihood: 'MODERATE', brief: 'Stomach acid rising upward can closely mimic chest pain.' },
      { name: 'Cardiac Cause', medical_name: 'Angina / Ischaemic Heart Disease', likelihood: 'LOW', brief: 'Must always be ruled out, especially with exertion, radiation to arm/jaw, or sweating.' },
    ],
    specialties: ['Cardiology', 'General Medicine'],
    doNow: ['See a doctor today — chest symptoms warrant same-day evaluation', 'Note if pain radiates to your arm, jaw, or back', 'Avoid physical exertion until evaluated'],
    doNot: ['Do not dismiss worsening or radiating chest pain', 'Do not self-medicate with aspirin without medical guidance'],
    watchFor: ['Pain spreading to left arm, jaw, or between shoulder blades', 'Shortness of breath, cold sweat, or nausea alongside chest pain', 'Lightheadedness or fainting'],
    selfCare: 'Sit upright, avoid heavy meals and caffeine, rest. Seek prompt care — chest symptoms should not wait.',
  };

  if (text.match(/head|migraine|skull|temple|forehead/)) return {
    label: 'headache', bodyPart: 'head',
    conditions: [
      { name: 'Tension Headache', medical_name: 'Tension-Type Cephalalgia', likelihood: 'HIGH', brief: 'Band-like pressure around the head — most common headache type, often from stress or posture.' },
      { name: 'Migraine', medical_name: 'Migraine with or without Aura', likelihood: 'MODERATE', brief: 'Throbbing, often one-sided pain that may include nausea, vomiting, or light sensitivity.' },
      { name: 'Sinus Headache', medical_name: 'Sinusitis-Associated Cephalalgia', likelihood: 'LOW', brief: 'Pressure/pain behind the forehead or cheekbones from sinus congestion.' },
    ],
    specialties: ['Neurology', 'General Medicine'],
    doNow: ['Rest in a quiet, dark room', 'Stay well hydrated — dehydration is a common trigger', 'Note whether this headache feels different from your usual ones'],
    doNot: ['Do not overuse pain relievers — daily use can cause rebound headaches', 'Do not ignore a sudden "worst headache of your life"'],
    watchFor: ['Sudden onset thunderclap headache', 'Headache with fever and stiff neck', 'Visual disturbances, one-sided weakness, or slurred speech'],
    selfCare: 'Drink water, rest in a dark room, apply a cool compress to your forehead. Paracetamol or ibuprofen as directed on packaging.',
  };

  if (text.match(/stomach|abdomen|belly|nausea|vomit|diarrhea|diarrhoea|bowel|gut|digest|cramp/)) return {
    label: 'stomach and digestive discomfort', bodyPart: 'abdomen',
    conditions: [
      { name: 'Gastroenteritis', medical_name: 'Acute Gastroenteritis (Stomach Flu)', likelihood: 'HIGH', brief: 'Viral or bacterial infection causing nausea, vomiting, or diarrhoea — usually short-lived.' },
      { name: 'Acid Reflux / Indigestion', medical_name: 'GERD / Dyspepsia', likelihood: 'MODERATE', brief: 'Burning or bloating after meals from stomach acid irritation.' },
      { name: 'Irritable Bowel Syndrome', medical_name: 'IBS', likelihood: 'LOW', brief: 'Chronic gut condition with alternating cramps, constipation, and diarrhoea.' },
    ],
    specialties: ['Gastroenterology', 'General Medicine'],
    doNow: ['Sip water or an oral rehydration solution (ORS) frequently', 'Eat bland foods — rice, toast, boiled potatoes, bananas', 'Rest and avoid strenuous activity'],
    doNot: ['Do not eat spicy, oily, or dairy-heavy foods while symptomatic', 'Do not take NSAIDs (ibuprofen) on an empty stomach — it can worsen irritation'],
    watchFor: ['Signs of dehydration — dry mouth, dark urine, dizziness', 'Blood in vomit or stool', 'Severe or rigid abdominal pain'],
    selfCare: 'Clear fluids first, then bland foods. Most gastroenteritis resolves within 1–3 days.',
  };

  if (text.match(/cough|throat|cold|sneeze|mucus|phlegm|respiratory|breath|lung|wheeze/)) return {
    label: 'respiratory symptoms', bodyPart: 'chest and throat',
    conditions: [
      { name: 'Upper Respiratory Infection', medical_name: 'Viral URI / Common Cold', likelihood: 'HIGH', brief: 'Most coughs and sore throats are viral — antibiotics will not help.' },
      { name: 'Allergic Rhinitis', medical_name: 'Allergic Rhinitis', likelihood: 'MODERATE', brief: 'Runny nose, sneezing, and congestion triggered by allergens like dust, pollen, or pets.' },
      { name: 'Bronchitis', medical_name: 'Acute Bronchitis', likelihood: 'LOW', brief: 'Airway inflammation producing a persistent, often productive cough lasting 1–3 weeks.' },
    ],
    specialties: ['Pulmonology', 'General Medicine', 'ENT'],
    doNow: ['Get plenty of rest', 'Drink warm fluids — honey and lemon in warm water soothes the throat', 'Use a humidifier if the air is dry'],
    doNot: ['Do not demand antibiotics for a viral infection — they won\'t help', 'Do not smoke or be around smoke or other irritants'],
    watchFor: ['High fever above 38.5°C lasting more than 3 days', 'Difficulty breathing or chest tightness at rest', 'Coughing up blood'],
    selfCare: 'Rest, warm fluids, steam inhalation. OTC lozenges and saline nasal spray can ease symptoms.',
  };

  if (text.match(/back|spine|lumbar|neck|shoulder|muscle|joint|knee|hip|arthritis|sciatica/)) return {
    label: 'musculoskeletal pain', bodyPart: 'back, joints, or muscles',
    conditions: [
      { name: 'Muscle Strain', medical_name: 'Myofascial Strain', likelihood: 'HIGH', brief: 'Overstretched or micro-torn muscle fibres — very common, usually resolves with rest.' },
      { name: 'Disc Irritation', medical_name: 'Intervertebral Disc Herniation', likelihood: 'MODERATE', brief: 'A disc pressing on a nearby nerve, causing pain that can radiate down the arm or leg.' },
      { name: 'Arthritis Flare', medical_name: 'Osteoarthritis / Inflammatory Arthritis', likelihood: 'LOW', brief: 'Joint inflammation causing stiffness and aching — often worse in the morning.' },
    ],
    specialties: ['Orthopedics', 'Physiotherapy', 'Rheumatology'],
    doNow: ['Apply ice for the first 48 hours, then switch to heat', 'Stay gently active — complete bed rest slows recovery', 'OTC anti-inflammatories (ibuprofen / naproxen) if not contraindicated'],
    doNot: ['Do not lift heavy objects or strain the affected area', 'Do not stay completely immobile — movement promotes healing'],
    watchFor: ['Pain radiating down arm or leg with tingling or numbness', 'Loss of bladder or bowel control — this is an emergency', 'Inability to bear weight or severe worsening'],
    selfCare: 'Ice/heat rotation, gentle movement, and over-the-counter pain relief. Most strains improve within 1–2 weeks.',
  };

  if (text.match(/skin|rash|itch|hive|burn|blister|wound|cut|sore|acne|spot/)) return {
    label: 'skin concerns', bodyPart: 'skin',
    conditions: [
      { name: 'Allergic Skin Reaction', medical_name: 'Contact Dermatitis / Urticaria', likelihood: 'HIGH', brief: 'Itchy rash or hives from contact with an allergen or irritant.' },
      { name: 'Eczema Flare', medical_name: 'Atopic Dermatitis', likelihood: 'MODERATE', brief: 'Chronic skin condition causing dry, itchy, and inflamed patches.' },
      { name: 'Fungal Infection', medical_name: 'Tinea / Dermatophytosis', likelihood: 'LOW', brief: 'Fungal overgrowth — common in warm, moist areas of the body.' },
    ],
    specialties: ['Dermatology', 'General Medicine'],
    doNow: ['Keep the area clean and dry', 'Avoid scratching — it can introduce infection', 'Note any recent new products, foods, or materials you may have contacted'],
    doNot: ['Do not apply random creams or oils without knowing the cause', 'Do not pop blisters or pick at sores'],
    watchFor: ['Rash spreading rapidly or blistering extensively', 'Signs of infection — pus, increasing warmth, swelling', 'Throat swelling or breathing difficulty (anaphylaxis — seek immediate help)'],
    selfCare: 'Gentle cleansing with mild soap, moisturise if dry. Antihistamines for itching. See a dermatologist if not improving within 1 week.',
  };

  if (text.match(/fever|temperature|chills|hot|sweat|malaise|flu/)) return {
    label: 'fever and systemic illness', bodyPart: 'whole body',
    conditions: [
      { name: 'Viral Syndrome', medical_name: 'Viral Febrile Illness', likelihood: 'HIGH', brief: 'Fever is the body\'s immune response — most commonly triggered by a virus.' },
      { name: 'Bacterial Infection', medical_name: 'Bacterial Infection (site unspecified)', likelihood: 'MODERATE', brief: 'Some infections — UTI, throat, chest — are bacterial and may require antibiotics.' },
      { name: 'Dengue / Malaria', medical_name: 'Arborviral / Parasitic Fever', likelihood: 'LOW', brief: 'Relevant if you have been in a mosquito-prone area recently.' },
    ],
    specialties: ['General Medicine', 'Infectious Disease'],
    doNow: ['Take paracetamol as directed to reduce fever and discomfort', 'Drink plenty of fluids — fever causes significant fluid loss', 'Rest completely and avoid strenuous activity'],
    doNot: ['Do not give aspirin to children under 16', 'Do not use cold water immersion to cool a fever'],
    watchFor: ['Fever above 39.5°C for more than 3 days', 'Stiff neck or a rash with fever — urgent', 'Confusion, extreme difficulty waking, or severe lethargy'],
    selfCare: 'Paracetamol, rest, and fluids. Most viral fevers break on their own within 2–3 days.',
  };

  // Generic fallback
  return {
    label: 'general symptoms', bodyPart: 'general',
    conditions: [
      { name: 'General Symptom Complex', medical_name: 'Unspecified Symptom Cluster', likelihood: 'MODERATE', brief: 'Symptoms described do not clearly match a single pattern — clinical evaluation is recommended.' },
    ],
    specialties: ['General Medicine'],
    doNow: ['Document your symptoms carefully — include timing, severity, and any triggers', 'Book a consultation with a General Physician', 'Stay hydrated and rest'],
    doNot: ['Do not self-diagnose or take unguided medication', 'Do not ignore persisting or worsening symptoms'],
    watchFor: ['Any sudden or significant worsening', 'New symptoms developing alongside current ones', 'Symptoms that don\'t improve within 5 days'],
    selfCare: 'Rest, stay hydrated, and monitor. See a doctor if symptoms do not improve within 3 days.',
  };
}

/** Score overall urgency from all collected user text */
function scoreUrgency(allText: string): { urgency: UrgencyLevel; confidence: number } {
  const high = ['severe', 'excruciating', 'unbearable', 'worst', 'blood', 'faint', 'dizzy', 'vomiting', 'numbness', 'weakness', 'swelling', 'pregnant', ' 8', ' 9', '10'];
  const moderate = ['pain', 'ache', 'fever', 'cough', 'sore', 'nausea', 'rash', 'burning', 'stiff', 'cramp', 'swollen', 'tender', ' 5', ' 6', ' 7'];
  const low = ['mild', 'slight', 'little', 'minor', 'occasional', 'sometimes', 'dull', ' 1', ' 2', ' 3'];

  let score = 0;
  high.forEach(k => { if (allText.includes(k)) score += 3; });
  moderate.forEach(k => { if (allText.includes(k)) score += 1; });
  low.forEach(k => { if (allText.includes(k)) score -= 1; });

  if (score >= 8) return { urgency: 'URGENT', confidence: 76 };
  if (score >= 4) return { urgency: 'ROUTINE', confidence: 62 };
  return { urgency: 'SELF_CARE', confidence: 52 };
}

/** Build personalised OPQRST questions that reference the patient's chief complaint */
function buildIntakeQuestions(chiefComplaint: string) {
  // Trim to a concise label for embedding in messages
  const label = chiefComplaint.length > 60 ? chiefComplaint.slice(0, 57) + '…' : chiefComplaint;

  return [
    {
      field: 'onset',
      message: `I hear you — "${label}" can be really concerning. Let me ask a few quick questions so I can understand exactly what's going on.`,
      question: {
        text: 'When did this start, and did it come on suddenly or gradually?',
        type: 'choice',
        options: ['Just now, very suddenly', 'Within the last few hours', 'Started today', 'A few days ago', 'More than a week ago'],
        why_asking: 'Sudden vs. gradual onset often points to very different underlying causes.'
      }
    },
    {
      field: 'severity',
      message: `Thanks for that context. Now let me understand how much "${label}" is affecting you right now.`,
      question: {
        text: 'On a scale of 0 to 10, how severe is it — where 0 is no discomfort and 10 is the worst you can imagine?',
        type: 'scale',
        options: ['0–2 (Barely noticeable)', '3–4 (Mild, manageable)', '5–6 (Moderate, distracting)', '7–8 (Severe, hard to function)', '9–10 (Unbearable)'],
        why_asking: 'Severity helps determine how urgently you need medical attention.'
      }
    },
    {
      field: 'quality',
      message: 'Got it — that helps a lot. Now, describing the sensation will help me narrow down what might be causing this.',
      question: {
        text: 'How would you best describe what it feels like?',
        type: 'choice',
        options: ['Sharp or stabbing', 'Dull and aching', 'Burning or hot', 'Pressure or tightness', 'Throbbing or pulsating', 'Tingling or numbness', 'Just generally unwell / hard to describe'],
        why_asking: 'The nature of the sensation is a key diagnostic clue.'
      }
    },
    {
      field: 'associated_symptoms',
      message: 'Almost done — this last question helps me see the full picture before giving you my assessment.',
      question: {
        text: 'Are you experiencing any of these alongside your main symptom?',
        type: 'choice',
        options: ['Fever or chills', 'Nausea or vomiting', 'Fatigue or weakness', 'Headache', 'Difficulty breathing', 'Dizziness or lightheadedness', 'None of these'],
        why_asking: 'Associated symptoms often reveal whether something more serious is happening.'
      }
    }
  ];
}

function getStatefulTriageResult(
  userInput: string,
  chatHistory: { role: string; content: string }[],
  userInfo?: UserInfo
): TriageResponse {
  const userTurnCount = chatHistory.filter(m => m.role === 'user').length;
  const allText = getAllUserText(userInput, chatHistory);
  const chiefComplaint = getChiefComplaint(chatHistory, userInput);
  const symptomProfile = detectSymptomCategory(allText);
  const matchedSpecialists = matchSymptomsToSpecialists(
    chatHistory.filter(m => m.role === 'user').map(m => m.content).concat(userInput)
  );
  const INTAKE_QUESTIONS = buildIntakeQuestions(chiefComplaint);

  // ── TURN 0: Chief complaint received → ask first OPQRST question
  if (userTurnCount === 0) {
    const q = INTAKE_QUESTIONS[0];
    return {
      state: 'TRIAGE_INTAKE',
      message: q.message,
      question: { text: q.question.text, type: q.question.type as any, options: q.question.options, why_asking: q.question.why_asking },
      progress: { percent: 15, completed_fields: ['chief_complaint'], next_field: q.field },
      preliminary_assessment: { urgency: 'ROUTINE', confidence: 20, reasoning: 'Chief complaint noted — gathering onset and severity details.' },
      disclaimer_reminder: true
    };
  }

  // ── TURNS 1–3: Continue OPQRST intake with personalised messages
  if (userTurnCount < INTAKE_QUESTIONS.length) {
    const q = INTAKE_QUESTIONS[userTurnCount];
    const completedFields = ['chief_complaint', ...INTAKE_QUESTIONS.slice(0, userTurnCount).map(iq => iq.field)];
    const progressPercent = Math.min(15 + userTurnCount * 22, 80);
    const { urgency, confidence } = scoreUrgency(allText);

    return {
      state: 'TRIAGE_INTAKE',
      message: q.message,
      question: { text: q.question.text, type: q.question.type as any, options: q.question.options, why_asking: q.question.why_asking },
      progress: { percent: progressPercent, completed_fields: completedFields, next_field: q.field },
      preliminary_assessment: { urgency, confidence, reasoning: `Pattern is consistent with ${symptomProfile.label} — ${completedFields.length} data points collected.` },
      disclaimer_reminder: true
    };
  }

  // ── TURN 4+: Deliver contextual FINAL ASSESSMENT
  const { urgency, confidence } = scoreUrgency(allText);

  const urgencyExplanation =
    urgency === 'URGENT'
      ? `Based on the ${symptomProfile.label} you described — combined with the severity and associated symptoms — you should be seen by a doctor within the next few hours. Please do not delay.`
      : urgency === 'SELF_CARE'
      ? `Your ${symptomProfile.label} appears relatively mild based on what you've shared. You can likely manage this at home for now, but keep monitoring for any changes.`
      : `Your ${symptomProfile.label} warrants a medical consultation within a few days. There is no immediate emergency, but please don't delay if symptoms worsen.`;

  const timeTocare: 'NOW' | 'Within 2 hours' | 'Within 24 hours' | 'Within a week' | 'Self-manage' =
    urgency === 'URGENT' ? 'Within 24 hours' : urgency === 'SELF_CARE' ? 'Self-manage' : 'Within a week';

  const specialties =
    matchedSpecialists.slice(0, 2).map(m => m.specialty).length > 0
      ? matchedSpecialists.slice(0, 2).map(m => m.specialty)
      : symptomProfile.specialties;

  return {
    state: 'ASSESSMENT',
    message: `Thank you for sharing all of that with me. Based on everything you've told me about your ${symptomProfile.label}, here is my triage assessment. Please remember — this is guidance only, not a medical diagnosis.`,
    question: null,
    progress: { percent: 100, completed_fields: ['chief_complaint', 'onset', 'severity', 'quality', 'associated_symptoms'], next_field: 'none' },
    final_assessment: {
      urgency,
      urgency_explanation: urgencyExplanation,
      time_to_care: timeTocare,
      summary: `Patient described ${symptomProfile.label} affecting the ${symptomProfile.bodyPart}. Chief complaint: "${chiefComplaint}". Assessed over ${userTurnCount + 1} turns covering onset, severity, sensation quality, and associated symptoms.`,
      possible_conditions: symptomProfile.conditions,
      recommended_specialties: specialties as string[],
      do_now: symptomProfile.doNow,
      do_not: symptomProfile.doNot,
      watch_for_worsening: symptomProfile.watchFor,
      self_care_advice: urgency === 'SELF_CARE' ? symptomProfile.selfCare : null,
      emergency_action: { call_emergency: false, emergency_number: '', message: '' }
    },
    disclaimer_reminder: true
  };
}
