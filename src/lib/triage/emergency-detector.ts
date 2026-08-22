import { emergencyPatterns } from '../data/emergency-keywords';

/**
 * Detects if the user input describes an emergency condition.
 * Checks against regex patterns for high-severity issues like chest pain, stroke, breathing difficulty, severe bleeding, etc.
 * 
 * @param text The user's input text (symptom description)
 * @returns An object indicating if it's an emergency and the matching emergency type
 */
export function detectEmergency(text: string): { isEmergency: boolean; emergencyType?: string } {
  const normalizedText = text.toLowerCase().trim();
  
  if (!normalizedText) {
    return { isEmergency: false };
  }

  for (const { pattern, type } of emergencyPatterns) {
    if (pattern.test(normalizedText)) {
      return {
        isEmergency: true,
        emergencyType: type
      };
    }
  }

  return { isEmergency: false };
}
