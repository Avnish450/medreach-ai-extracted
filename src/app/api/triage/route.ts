import { NextResponse } from "next/server";
import OpenAI from "openai";
import { MEDREACH_TRIAGE_SYSTEM_PROMPT } from "@/lib/prompts/triage-prompt";
import { detectEmergency } from "@/lib/triage/emergency-detector";
import { extractAndParseJSON } from "@/lib/utils/json-cleaner";
import { TriageResponseSchema } from "@/lib/schemas/triage-schema";

// Setup OpenAI SDK to point to Hugging Face
const hfClient = new OpenAI({
  baseURL: "https://api-inference.huggingface.co/v1/",
  apiKey: process.env.HF_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { history = [], userMessage } = await req.json();

    // 1. FAST EMERGENCY BYPASS
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
          clinical_summary: `Triggered by: "${emergencyCheck.emergencyType ?? "critical symptom pattern"}"`,
          patient_summary: "Call 112 / 911 immediately.",
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

    // 2. HYBRID MODEL ROUTING LOGIC
    // Calculate how many times the user has sent a message
    const userTurnCount = history.filter((msg: { role: string }) => msg.role === "user").length + 1;

    // Switch to 70B after 3 user messages to generate the final assessment. Otherwise, use 8B for speed.
    const MODEL_ID =
      userTurnCount >= 4
        ? "aaditya/Llama3-OpenBioLLM-70B"
        : "aaditya/Llama3-OpenBioLLM-8B";

    // Dynamic prompt addition to force the model to wrap up if it's using 70B
    const dynamicPrompt =
      userTurnCount >= 4
        ? `${MEDREACH_TRIAGE_SYSTEM_PROMPT}\n\nCRITICAL INSTRUCTION: You have gathered enough information. You MUST transition the state to "ASSESSMENT" and fully populate the "final_assessment" JSON object.`
        : `${MEDREACH_TRIAGE_SYSTEM_PROMPT}\n\nCRITICAL INSTRUCTION: Continue the "TRIAGE_INTAKE" state. Ask exactly ONE follow-up question. Do NOT populate "final_assessment" yet.`;

    // 3. Format messages for Llama 3
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: dynamicPrompt },
      ...history.map((msg: { role: string; content: unknown }) => ({
        role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
        content:
          typeof msg.content === "object"
            ? JSON.stringify(msg.content)
            : (msg.content as string),
      })),
      { role: "user", content: userMessage },
    ];

    // 4. Call Hugging Face API
    const completion = await hfClient.chat.completions.create({
      model: MODEL_ID,
      messages,
      temperature: 0.2, // Low temp for clinical accuracy
      top_p: 0.9,
      max_tokens: 1500,
    });

    const rawResponseText = completion.choices[0]?.message?.content || "";

    // 5. Parse, Clean, and Validate
    const parsedJSON = extractAndParseJSON(rawResponseText);
    const validatedData = TriageResponseSchema.parse(parsedJSON);

    // 6. Return to Frontend
    return NextResponse.json(validatedData);
  } catch (error: unknown) {
    console.error("OpenBioLLM API Error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process triage response.", details: message },
      { status: 500 }
    );
  }
}
