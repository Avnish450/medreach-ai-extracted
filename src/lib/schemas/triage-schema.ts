import { z } from 'zod';

export const UrgencyLevelSchema = z.enum([
  'emergency', 'urgent', 'routine', 'self-care',
  'EMERGENCY', 'URGENT', 'ROUTINE', 'SELF_CARE'
]);

export const TriageStateSchema = z.enum([
  'GREETING', 'TRIAGE_INTAKE', 'CONTEXT', 'ASSESSMENT', 'FOLLOW_UP'
]);

export const TriageQuestionSchema = z.object({
  text: z.string().nullable(),
  type: z.enum(['text', 'scale', 'choice', 'body_map', 'duration']),
  options: z.array(z.string()).optional(),
  why_asking: z.string().optional()
});

export const TriageProgressSchema = z.object({
  percent: z.number().min(0).max(100),
  completed_fields: z.array(z.string()),
  next_field: z.string()
});

export const PreliminaryAssessmentSchema = z.object({
  urgency: UrgencyLevelSchema,
  confidence: z.number().min(0).max(100),
  reasoning: z.string()
});

export const TriagePossibleConditionSchema = z.object({
  name: z.string(),
  medical_name: z.string(),
  likelihood: z.enum(['HIGH', 'MODERATE', 'LOW']),
  brief: z.string()
});

export const EmergencyActionSchema = z.object({
  call_emergency: z.boolean(),
  emergency_number: z.string(),
  message: z.string()
});

export const FinalAssessmentSchema = z.object({
  urgency: UrgencyLevelSchema,
  urgency_explanation: z.string(),
  time_to_care: z.enum(['NOW', 'Within 2 hours', 'Within 24 hours', 'Within a week', 'Self-manage']),
  summary: z.string(),
  possible_conditions: z.array(TriagePossibleConditionSchema),
  recommended_specialties: z.array(z.string()),
  do_now: z.array(z.string()),
  do_not: z.array(z.string()),
  watch_for_worsening: z.array(z.string()),
  self_care_advice: z.string().nullable(),
  emergency_action: EmergencyActionSchema
});

export const TriageResponseSchema = z.object({
  state: TriageStateSchema,
  message: z.string(),
  question: TriageQuestionSchema.nullable(),
  progress: TriageProgressSchema,
  preliminary_assessment: PreliminaryAssessmentSchema.optional(),
  final_assessment: FinalAssessmentSchema.optional(),
  disclaimer_reminder: z.boolean()
});

export type ZodTriageResponse = z.infer<typeof TriageResponseSchema>;
