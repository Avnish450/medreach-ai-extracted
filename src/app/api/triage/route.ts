import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MEDREACH_TRIAGE_SYSTEM_PROMPT } from "@/lib/prompts/triage-prompt";
import { detectEmergency } from "@/lib/triage/emergency-detector";
import { extractAndParseJSON } from "@/lib/utils/json-cleaner";
import { TriageResponseSchema } from "@/lib/schemas/triage-schema";
import { performTriage } from "@/lib/ai/triage-engine";

// ─── Clients ────────────────────────────────────────────────────────────────
const hfClient = new OpenAI({
  baseURL: "https://api-inference.huggingface.co/v1/",
  apiKey: process.env.HF_TOKEN ?? "no-token",
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function buildMessages(
  history: { role: string; content: unknown }[],
  userMessage: string,
  dynamicPrompt: string
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    { role: "system", content: dynamicPrompt },
    ...history.map((msg) => ({
      role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
      content:
        typeof msg.content === "object"
          ? JSON.stringify(msg.content)
          : (msg.content as string),
    })),
    { role: "user", content: userMessage },
  ];
}

// ─── Route ───────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { history = [], userMessage } = await req.json();

    // 1. FAST EMERGENCY BYPASS ------------------------------------------------
    const emergencyCheck = detectEmergency(userMessage);
    if (emergencyCheck.isEmergency) {
      return NextResponse.json({
        state: "ASSESSMENT",
        message: "🚨 EMERGENCY ALERT: Critical symptoms detected.",
        progress: { percent: 100, completed_fields: ["chief_complaint"], next_field: "NONE" },
        preliminary_assessment: { urgency: "EMERGENCY", confidence: 100, reasoning: "Heuristic triggered." },
        final_assessment: {
          urgency: "EMERGENCY",
          urgency_explanation: "Symptoms indicate immediate life risk.",
          time_to_care: "NOW",
          summary: "Call 112 / 911 immediately.",
          possible_conditions: [],
          recommended_specialties: ["Emergency Medicine"],
          do_now: ["Call 112 immediately"],
          do_not: ["Do not drive yourself"],
          watch_for_worsening: [],
          self_care_advice: null,
        },
        disclaimer_reminder: true,
      });
    }

    // 2. BUILD DYNAMIC PROMPT -------------------------------------------------
    const userTurnCount =
      history.filter((msg: { role: string }) => msg.role === "user").length + 1;
    const isFinalTurn = userTurnCount >= 4;

    const dynamicPrompt = isFinalTurn
      ? `${MEDREACH_TRIAGE_SYSTEM_PROMPT}\n\nCRITICAL INSTRUCTION: You have gathered enough information. You MUST transition the state to "ASSESSMENT" and fully populate the "final_assessment" JSON object.`
      : `${MEDREACH_TRIAGE_SYSTEM_PROMPT}\n\nCRITICAL INSTRUCTION: Continue the "TRIAGE_INTAKE" state. Ask exactly ONE follow-up question. Do NOT populate "final_assessment" yet.`;

    // 3. TRY HUGGING FACE (primary) -------------------------------------------
    if (process.env.HF_TOKEN) {
      try {
        const MODEL_ID = isFinalTurn
          ? "aaditya/Llama3-OpenBioLLM-70B"
          : "aaditya/Llama3-OpenBioLLM-8B";

        const completion = await hfClient.chat.completions.create({
          model: MODEL_ID,
          messages: buildMessages(history, userMessage, dynamicPrompt),
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1500,
        });

        const rawText = completion.choices[0]?.message?.content ?? "";
        const parsed = extractAndParseJSON(rawText);
        const validated = TriageResponseSchema.parse(parsed);
        console.log(`✅ HF (${MODEL_ID}) responded.`);
        return NextResponse.json(validated);
      } catch (hfErr) {
        console.warn("⚠️ HF failed, trying Gemini:", hfErr instanceof Error ? hfErr.message : hfErr);
      }
    }

    // 4. FALLBACK → GEMINI 1.5 FLASH ------------------------------------------
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const historyText = history
          .map((m: { role: string; content: unknown }) =>
            `${m.role === "user" ? "Patient" : "AI"}: ${typeof m.content === "object" ? JSON.stringify(m.content) : m.content}`
          )
          .join("\n");

        const fullPrompt = `${dynamicPrompt}\n\n--- CONVERSATION SO FAR ---\n${historyText}\n\nPatient: ${userMessage}\n\nAI (respond with strict JSON only):`;

        const result = await model.generateContent(fullPrompt);
        const rawText = result.response.text();
        const parsed = extractAndParseJSON(rawText);
        const validated = TriageResponseSchema.parse(parsed);
        console.log("✅ Gemini responded.");
        return NextResponse.json(validated);
      } catch (geminiErr) {
        console.warn("⚠️ Gemini failed, using local heuristics:", geminiErr instanceof Error ? geminiErr.message : geminiErr);
      }
    }

    // 5. FINAL FALLBACK → existing keyword-based triage engine ----------------
    // This has built-in multi-turn questions and urgency detection — never loops.
    console.warn("⚠️ All AI providers failed. Using local heuristic triage engine.");
    const chatHistoryFormatted = history.map((m: { role: string; content: unknown }) => ({
      role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
      content: typeof m.content === "object" ? JSON.stringify(m.content) : (m.content as string),
    }));

    const localResult = await performTriage(userMessage, undefined, chatHistoryFormatted);
    return NextResponse.json(localResult);

  } catch (error: unknown) {
    console.error("Triage Route Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process triage response.", details: message },
      { status: 500 }
    );
  }
}
