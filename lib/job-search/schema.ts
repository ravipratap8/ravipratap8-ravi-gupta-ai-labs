import { z } from "zod";

export const PROMPT_VERSION = "job-search/1.0.0";
export const statuses = [
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
] as const;
export const statusSchema = z.enum(statuses);
export const profileSchema = z.object({
  cv: z.string().trim().min(80).max(40000),
  goals: z.string().trim().min(10).max(4000),
  constraints: z.string().trim().max(4000),
  writingStyle: z.string().trim().max(2000),
});
export type CandidateProfile = z.infer<typeof profileSchema>;
export const jobSchema = z.object({
  company: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(200),
  url: z.union([
    z.literal(""),
    z
      .string()
      .url()
      .max(2000)
      .refine((s) => new URL(s).protocol === "https:", "Use an HTTPS job link"),
  ]),
  posting: z.string().trim().min(80).max(40000),
  notes: z.string().max(5000).default(""),
  followUp: z
    .union([
      z.literal(""),
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .refine((s) => !Number.isNaN(Date.parse(s)), "Invalid date"),
    ])
    .default(""),
});
export type JobInput = z.infer<typeof jobSchema>;
const gate = z.object({
  verdict: z.enum(["pass", "fail", "unverified"]),
  evidence: z.string(),
});
const dimension = z.object({
  score: z.number().int().min(0).max(100).nullable(),
  evidence: z.string(),
});
export const evaluationSchema = z.object({
  eligibility: gate,
  language: gate,
  logistics: gate,
  technical: dimension,
  experience: dimension,
  culture: dimension,
  career: dimension,
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  recommendation: z.string(),
  confidence: z.number().int().min(0).max(100),
  risk: z.enum(["low", "medium", "high"]),
  questions: z.array(z.string()),
});
export type Evaluation = z.infer<typeof evaluationSchema>;
export const draftSchema = z.object({
  cv: z.string(),
  coverLetter: z.string(),
  review: z.string(),
  warnings: z.array(z.string()),
});
export const interviewSchema = z.object({
  preparation: z.string(),
  gaps: z.array(z.string()),
});
export type Application = JobInput & {
  id: string;
  status: (typeof statuses)[number];
  version: number;
  updated_at: string;
  evaluation: Evaluation | null;
  draft: z.infer<typeof draftSchema> | null;
  interview: z.infer<typeof interviewSchema> | null;
  reviewed: boolean;
};
export function overallScore(e: Evaluation): number | null {
  if (
    [e.eligibility, e.language, e.logistics].some((g) => g.verdict === "fail")
  )
    return null;
  const scores = [
    e.technical.score,
    e.experience.score,
    e.culture.score,
    e.career.score,
  ];
  if (scores.some((s) => s === null)) return null;
  return Math.round(
    scores[0]! * 0.3 + scores[1]! * 0.25 + scores[2]! * 0.15 + scores[3]! * 0.3,
  );
}
export function canDraft(e: Evaluation | null): boolean {
  return (
    !!e &&
    ![e.eligibility, e.language, e.logistics].some((g) => g.verdict === "fail")
  );
}
export function postingWarnings(posting: string): string[] {
  const warnings: string[] = [];
  if (/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/u.test(posting))
    warnings.push(
      "Invisible or direction-changing characters detected. Inspect the source text.",
    );
  if (/<\/?[a-z][^>]*>/i.test(posting))
    warnings.push(
      "HTML detected. Paste visible plain text from the job advert.",
    );
  if (
    /(ignore (all |previous |prior )?instructions|system\s*prompt|developer\s*message|reveal.*(key|secret)|send.*(credentials|api key))/i.test(
      posting,
    )
  )
    warnings.push(
      "Instruction-like text detected. Review the job advert before analysis.",
    );
  return warnings;
}
