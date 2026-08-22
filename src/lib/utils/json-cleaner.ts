import { jsonrepair } from "jsonrepair";

export function extractAndParseJSON(rawText: string) {
  try {
    let cleaned = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    const repaired = jsonrepair(cleaned);
    return JSON.parse(repaired);
  } catch (error) {
    console.error("JSON Parsing failed. Raw output:", rawText);
    throw new Error("Invalid JSON structure received from AI.");
  }
}
