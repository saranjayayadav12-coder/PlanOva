/**
 * types/recovery.ts
 *
 * Data contracts for Acadesk Academic Recovery Mode (Phase 9).
 * Fully deterministic, explainable, and empathetic recovery modeling.
 */

import { Task } from "./task";
import { StudyPlan, PlannedSession } from "./planner";
import { DailyWorkloadItem } from "./workload";

export type RecoveryTriggerCategory =
  | "overdue_tasks"
  | "deadline_cluster"
  | "overloaded_days"
  | "incomplete_sessions"
  | "planning_gap";

export interface RecoveryTriggerItem {
  id: string;
  type: RecoveryTriggerCategory;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  itemCount: number;
}

export interface RecoveryDiagnosis {
  isRecoveryNeeded: boolean;
  summary: string;
  triggers: RecoveryTriggerItem[];
  contributingTasks: Task[];
  overloadedDays: DailyWorkloadItem[];
  incompleteSessions: PlannedSession[];
}

export interface RecoveryProposalComparison {
  originalPlannedMinutes: number;
  proposedPlannedMinutes: number;
  originalOverloadedDays: number;
  proposedOverloadedDays: number;
  movedSessionCount: number;
  unscheduledTaskCount: number;
  tradeOffs: string[];
  resolvedRisks: string[];
  remainingRisks: string[];
}

export interface ProposedRecoveryPlan {
  plan: StudyPlan;
  diagnosis: RecoveryDiagnosis;
  comparison: RecoveryProposalComparison;
}
