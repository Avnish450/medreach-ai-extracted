import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client
// Since we might be running in a mock/demo mode if no key is provided,
// we will handle it gracefully.
const apiKey = process.env.GOOGLE_GEMINI_API_KEY || '';

export const getGeminiClient = () => {
  if (!apiKey) {
    console.warn("GOOGLE_GEMINI_API_KEY is not defined. Running in Demo Mock Mode.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};
