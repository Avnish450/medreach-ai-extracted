import { symptomToSpecialty } from '../data/specialties';

/**
 * Matches symptoms to recommended medical specialties.
 * Returns a list of matched specialists with confidence scores.
 * 
 * @param symptoms List of symptoms detected
 * @returns Array of matches with specialty name and confidence score
 */
export function matchSymptomsToSpecialists(symptoms: string[]): Array<{ specialty: string; confidence: number }> {
  const matches: Record<string, number> = {};
  
  if (!symptoms || symptoms.length === 0) {
    return [{ specialty: 'General Medicine', confidence: 100 }];
  }

  symptoms.forEach(symptom => {
    const normalized = symptom.toLowerCase().trim();
    
    // Find closest keys
    Object.keys(symptomToSpecialty).forEach(key => {
      if (normalized.includes(key) || key.includes(normalized)) {
        const specs = symptomToSpecialty[key];
        specs.forEach((spec, index) => {
          // Primary match gets higher weight
          const weight = index === 0 ? 3 : 1;
          matches[spec] = (matches[spec] || 0) + weight;
        });
      }
    });
  });

  const matchedList = Object.entries(matches).map(([specialty, count]) => {
    // Basic confidence calculation based on count
    const baseConfidence = Math.min(40 + count * 20, 95);
    return {
      specialty,
      confidence: Math.round(baseConfidence)
    };
  });

  // Sort by confidence descending
  matchedList.sort((a, b) => b.confidence - a.confidence);

  if (matchedList.length === 0) {
    return [{ specialty: 'General Medicine', confidence: 90 }];
  }

  return matchedList;
}
