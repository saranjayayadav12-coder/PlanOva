/**
 * types/wellbeing.ts
 *
 * Data contracts for Acadesk Optional Student Well-being Check-ins
 * and Student Support Insights.
 * Pure self-reported signals and non-clinical, supportive planning guidance.
 */

export type WellbeingRating = 1 | 2 | 3 | 4 | 5;

export interface WellbeingCheckin {
  /** Unique check-in record ID, e.g. "checkin-2026-10-11" or "wb-172859..." */
  id: string;
  /** ISO date string: YYYY-MM-DD (determined by local date conventions) */
  date: string;
  /** Stress level rating: 1 (Very low) to 5 (Very high) */
  stress: WellbeingRating;
  /** Energy level rating: 1 (Very low) to 5 (Very high) */
  energy: WellbeingRating;
  /** Sleep quality rating: 1 (Very poor) to 5 (Very good) */
  sleep: WellbeingRating;
  /** Workload manageability rating: 1 (Not manageable) to 5 (Very manageable) */
  workloadManageability: WellbeingRating;
  /** Optional personal reflection or context note */
  note?: string;
  /** ISO timestamp when created */
  createdAt: string;
  /** ISO timestamp when updated */
  updatedAt: string;
}

export interface WellbeingFormData {
  stress: WellbeingRating;
  energy: WellbeingRating;
  sleep: WellbeingRating;
  workloadManageability: WellbeingRating;
  note: string;
}

export type WellbeingInsightSeverity = "info" | "attention" | "positive";

export interface WellbeingInsight {
  id: string;
  category: "signal" | "workload_synthesis";
  severity: WellbeingInsightSeverity;
  title: string;
  message: string;
  actionLink?: string;
  actionLabel?: string;
}

export interface RatingOptionMeta {
  value: WellbeingRating;
  label: string;
  shortLabel: string;
}
