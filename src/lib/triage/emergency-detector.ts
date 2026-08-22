export function detectEmergency(text: string): { isEmergency: boolean; emergencyType?: string } {
  const lowerText = text.toLowerCase();
  
  // Basic heuristic for demo purposes
  const criticalKeywords = [
    "heart attack", "chest pain", "can't breathe", "cannot breathe", 
    "bleeding out", "unconscious", "stroke", "not breathing", "fainted"
  ];

  for (const keyword of criticalKeywords) {
    if (lowerText.includes(keyword)) {
      return { 
        isEmergency: true, 
        emergencyType: keyword 
      };
    }
  }

  return { isEmergency: false };
}
