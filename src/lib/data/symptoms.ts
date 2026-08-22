import { SymptomCategory } from '@/types';

export const symptomCategories: SymptomCategory[] = [
  {
    id: 'head', name: 'Head & Brain', icon: '🧠', bodyRegion: 'Head',
    symptoms: [
      { id: 'headache', name: 'Headache', severity: 'mild' },
      { id: 'migraine', name: 'Severe Migraine', severity: 'moderate' },
      { id: 'dizziness', name: 'Dizziness', severity: 'moderate' },
      { id: 'confusion', name: 'Confusion / Disorientation', severity: 'severe' },
      { id: 'fainting', name: 'Fainting / Loss of Consciousness', severity: 'severe', isEmergency: true },
      { id: 'seizure', name: 'Seizures', severity: 'severe', isEmergency: true },
      { id: 'vision-changes', name: 'Sudden Vision Changes', severity: 'severe' },
      { id: 'memory-loss', name: 'Memory Loss', severity: 'moderate' },
    ]
  },
  {
    id: 'chest', name: 'Chest & Heart', icon: '❤️', bodyRegion: 'Chest',
    symptoms: [
      { id: 'chest-pain', name: 'Chest Pain', severity: 'severe', isEmergency: true },
      { id: 'palpitations', name: 'Heart Palpitations', severity: 'moderate' },
      { id: 'shortness-of-breath', name: 'Shortness of Breath', severity: 'severe', isEmergency: true },
      { id: 'cough', name: 'Persistent Cough', severity: 'mild' },
      { id: 'wheezing', name: 'Wheezing', severity: 'moderate' },
      { id: 'coughing-blood', name: 'Coughing Blood', severity: 'severe', isEmergency: true },
    ]
  },
  {
    id: 'abdomen', name: 'Abdomen & Digestive', icon: '🫁', bodyRegion: 'Abdomen',
    symptoms: [
      { id: 'stomach-pain', name: 'Stomach Pain', severity: 'mild' },
      { id: 'nausea', name: 'Nausea / Vomiting', severity: 'mild' },
      { id: 'diarrhea', name: 'Diarrhea', severity: 'mild' },
      { id: 'constipation', name: 'Constipation', severity: 'mild' },
      { id: 'bloating', name: 'Bloating', severity: 'mild' },
      { id: 'blood-stool', name: 'Blood in Stool', severity: 'severe' },
      { id: 'severe-abdominal', name: 'Severe Abdominal Pain', severity: 'severe', isEmergency: true },
      { id: 'appetite-loss', name: 'Loss of Appetite', severity: 'mild' },
    ]
  },
  {
    id: 'respiratory', name: 'Throat & Respiratory', icon: '🫁', bodyRegion: 'Throat',
    symptoms: [
      { id: 'sore-throat', name: 'Sore Throat', severity: 'mild' },
      { id: 'difficulty-swallowing', name: 'Difficulty Swallowing', severity: 'moderate' },
      { id: 'runny-nose', name: 'Runny / Stuffy Nose', severity: 'mild' },
      { id: 'sneezing', name: 'Frequent Sneezing', severity: 'mild' },
      { id: 'voice-hoarseness', name: 'Voice Hoarseness', severity: 'mild' },
      { id: 'difficulty-breathing', name: 'Difficulty Breathing', severity: 'severe', isEmergency: true },
    ]
  },
  {
    id: 'skin', name: 'Skin & Hair', icon: '🧴', bodyRegion: 'Skin',
    symptoms: [
      { id: 'rash', name: 'Skin Rash', severity: 'mild' },
      { id: 'itching', name: 'Itching', severity: 'mild' },
      { id: 'acne', name: 'Acne', severity: 'mild' },
      { id: 'hair-loss', name: 'Hair Loss', severity: 'mild' },
      { id: 'skin-discoloration', name: 'Skin Discoloration', severity: 'moderate' },
      { id: 'wound-infection', name: 'Wound / Infection', severity: 'moderate' },
      { id: 'severe-burn', name: 'Severe Burns', severity: 'severe', isEmergency: true },
      { id: 'allergic-reaction', name: 'Severe Allergic Reaction', severity: 'severe', isEmergency: true },
    ]
  },
  {
    id: 'musculoskeletal', name: 'Bones & Joints', icon: '🦴', bodyRegion: 'Limbs',
    symptoms: [
      { id: 'joint-pain', name: 'Joint Pain', severity: 'mild' },
      { id: 'back-pain', name: 'Back Pain', severity: 'mild' },
      { id: 'muscle-pain', name: 'Muscle Pain', severity: 'mild' },
      { id: 'stiffness', name: 'Stiffness', severity: 'mild' },
      { id: 'swelling', name: 'Joint Swelling', severity: 'moderate' },
      { id: 'fracture', name: 'Suspected Fracture', severity: 'severe' },
      { id: 'numbness', name: 'Numbness / Tingling', severity: 'moderate' },
      { id: 'weakness', name: 'Sudden Weakness', severity: 'severe', isEmergency: true },
    ]
  },
  {
    id: 'eyes-ears', name: 'Eyes & Ears', icon: '👁️', bodyRegion: 'Head',
    symptoms: [
      { id: 'eye-pain', name: 'Eye Pain', severity: 'moderate' },
      { id: 'blurred-vision', name: 'Blurred Vision', severity: 'moderate' },
      { id: 'ear-pain', name: 'Ear Pain', severity: 'mild' },
      { id: 'hearing-loss', name: 'Hearing Loss', severity: 'moderate' },
      { id: 'tinnitus', name: 'Ringing in Ears', severity: 'mild' },
      { id: 'eye-redness', name: 'Red / Irritated Eyes', severity: 'mild' },
      { id: 'sudden-vision-loss', name: 'Sudden Vision Loss', severity: 'severe', isEmergency: true },
    ]
  },
  {
    id: 'general', name: 'General / Whole Body', icon: '🌡️', bodyRegion: 'General',
    symptoms: [
      { id: 'fever', name: 'Fever', severity: 'mild' },
      { id: 'high-fever', name: 'High Fever (>103°F)', severity: 'severe' },
      { id: 'fatigue', name: 'Fatigue / Tiredness', severity: 'mild' },
      { id: 'weight-loss', name: 'Unexplained Weight Loss', severity: 'moderate' },
      { id: 'weight-gain', name: 'Unexplained Weight Gain', severity: 'mild' },
      { id: 'night-sweats', name: 'Night Sweats', severity: 'moderate' },
      { id: 'chills', name: 'Chills', severity: 'mild' },
      { id: 'dehydration', name: 'Severe Dehydration', severity: 'severe' },
    ]
  },
  {
    id: 'mental', name: 'Mental Health', icon: '🧘', bodyRegion: 'Mental',
    symptoms: [
      { id: 'anxiety', name: 'Anxiety', severity: 'moderate' },
      { id: 'depression', name: 'Depression', severity: 'moderate' },
      { id: 'insomnia', name: 'Insomnia', severity: 'mild' },
      { id: 'panic-attacks', name: 'Panic Attacks', severity: 'moderate' },
      { id: 'mood-swings', name: 'Mood Swings', severity: 'mild' },
      { id: 'stress', name: 'Chronic Stress', severity: 'mild' },
      { id: 'suicidal-thoughts', name: 'Suicidal Thoughts', severity: 'severe', isEmergency: true },
    ]
  },
];
