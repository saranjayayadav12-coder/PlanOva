/**
 * types/planner.ts
 *
 * Data contracts for Acadesk AI Study Planner, Adaptive Replanning & Simulation.
 * Designed for strict type safety, local persistence, and explainable scheduling.
 */

import { TaskPriority, TaskDifficulty } from "./task";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface DayAvailability {
  day: DayOfWeek;
  label: string;
  enabled: boolean;
  /** Start time of available study window, e.g. "09:00" */
  startTime: string;
  /** End time of available study window, e.g. "17:00" */
  endTime: string;
  /** Max study minutes for this day (capped by availability window) */
  maxDailyMinutes: number;
}

export interface AvailabilityPreferences {
  days: Record<DayOfWeek, DayAvailability>;
  /** Preferred duration for a single focus study session (e.g. 45 mins) */
  preferredSessionDurationMinutes: number;
  /** Preferred buffer/break between consecutive sessions (e.g. 15 mins) */
  preferredBreakDurationMinutes: number;
  /** Global daily study cap in minutes (e.g. 180 = 3 hours) */
  maxDailyStudyMinutes: number;
  updatedAt: string;
}

export type SessionStatus = "scheduled" | "in_progress" | "completed" | "incomplete";

export interface PlannedSession {
  id: string;
  taskId: string;
  subtaskId?: string;
  title: string;
  parentTaskTitle?: string;
  subject: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM e.g. "09:00" */
  startTime: string;
  /** HH:MM e.g. "09:45" */
  endTime: string;
  durationMinutes: number;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  status: SessionStatus;
  deadline?: string;
  isSubtask: boolean;
  orderIndex: number;
  /** Estimated minutes of remaining unfinished work (e.g. if marked incomplete or overrun) */
  remainingMinutes?: number;
  /** ISO timestamp when outcome was recorded */
  outcomeRecordedAt?: string;
  /** Optional notes or reflections (e.g. "Exercises 4-7 left to finish") */
  outcomeNote?: string;
  /** Diff tag when comparing revised plan with accepted plan */
  diffTag?: "unchanged" | "moved" | "added" | "rescheduled";
}

export interface UnscheduledTask {
  taskId: string;
  subtaskId?: string;
  title: string;
  subject: string;
  reason: string;
  estimatedDurationMinutes: number;
  deadline?: string;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  isOverdue: boolean;
  hasNoDeadline: boolean;
}

export interface PlanWarning {
  id: string;
  type: "deadline_risk" | "overload" | "unmet_availability" | "no_deadline";
  message: string;
  taskId?: string;
  date?: string;
  severity: "low" | "medium" | "high";
}

export interface PlanExplanation {
  id: string;
  title: string;
  detail: string;
  category: "priority" | "deadline" | "split" | "workload" | "dependency";
}

export type PlanStatus = "draft" | "accepted";

export interface StudyPlan {
  id: string;
  status: PlanStatus;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD */
  endDate: string;
  sessions: PlannedSession[];
  unscheduledTasks: UnscheduledTask[];
  warnings: PlanWarning[];
  explanations: PlanExplanation[];
  totalPlannedMinutes: number;
  totalAvailableMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredPlannerState {
  version: number;
  acceptedPlan: StudyPlan | null;
  draftPlan: StudyPlan | null;
  availability: AvailabilityPreferences;
  updatedAt: string;
}

/* ─────────────────────────────────────────────────────────────
 * Phase 8: Adaptive Scheduling & Plan Comparison Types
 * ───────────────────────────────────────────────────────────── */

export type AdaptationTriggerType =
  | "incomplete_session"
  | "session_overrun"
  | "availability_changed"
  | "deadline_changed"
  | "new_high_priority_task";

export interface PlanAdjustmentTrigger {
  id: string;
  type: AdaptationTriggerType;
  title: string;
  description: string;
  detectedAt: string;
  affectedTaskId?: string;
  affectedSessionId?: string;
  remainingMinutes?: number;
}

export interface MovedSessionDiff {
  previous: PlannedSession;
  current: PlannedSession;
  changeReason: string;
}

export interface PlanComparisonDiff {
  unchangedSessions: PlannedSession[];
  movedSessions: MovedSessionDiff[];
  addedSessions: PlannedSession[];
  removedSessions: PlannedSession[];
  dailyHourChanges: Record<string, { previousMinutes: number; revisedMinutes: number }>;
  deadlineRisks: PlanWarning[];
}

export interface ProposedRevisedPlan {
  plan: StudyPlan;
  trigger: PlanAdjustmentTrigger;
  comparison: PlanComparisonDiff;
}

/* ─────────────────────────────────────────────────────────────
 * Phase 8: What-If Simulation Types
 * ───────────────────────────────────────────────────────────── */

export type WhatIfScenarioType =
  | "reduce_availability"
  | "add_task"
  | "change_deadline"
  | "task_duration_increase";

export interface WhatIfParameters {
  scenario: WhatIfScenarioType;
  /** Target date for availability reduction e.g. tomorrow */
  targetDate?: string;
  /** Reduction in study minutes e.g. 60 or 90 */
  reducedMinutes?: number;
  /** Hypothetical assignment details */
  simulatedTaskTitle?: string;
  simulatedTaskSubject?: string;
  simulatedTaskDurationMinutes?: number;
  simulatedTaskDeadline?: string;
  simulatedTaskPriority?: TaskPriority;
  /** Existing task ID for deadline change or duration increase */
  selectedTaskId?: string;
  newDeadline?: string;
  durationMultiplier?: number;
}

export interface SimulationResult {
  simulatedPlan: StudyPlan;
  impactSummary: string;
  feasibility: "feasible" | "tight" | "overloaded";
  netMinuteDifference: number;
  newDeadlineRisks: string[];
}

/* ─────────────────────────────────────────────────────────────
 * Phase 8: Adaptation History Types
 * ───────────────────────────────────────────────────────────── */

export type AdaptationHistoryEventType =
  | "plan_created"
  | "plan_accepted"
  | "session_completed"
  | "session_marked_incomplete"
  | "plan_revised_proposed"
  | "plan_revised_accepted"
  | "plan_revised_rejected"
  | "recovery_plan_accepted"
  | "recovery_plan_rejected";

export interface AdaptationHistoryEvent {
  id: string;
  type: AdaptationHistoryEventType;
  title: string;
  summary: string;
  timestamp: string;
  sessionTitle?: string;
  subject?: string;
}
