/**
 * types/workload.ts
 *
 * Data contracts for Acadesk Workload Insights (Phase 9).
 * Provides clean, strongly typed interfaces for workload aggregation,
 * deadline analysis, daily capacity distribution, and deterministic insights.
 */

import { Task } from "./task";
import { PlannedSession } from "./planner";

export interface WorkloadSummaryMetrics {
  /** Count of non-completed tasks */
  totalActiveTasks: number;
  /** Incomplete tasks whose deadline is strictly before today */
  overdueTasks: number;
  /** Incomplete tasks due in [today, today + 7 days] */
  dueWithin7Days: number;
  /** Tasks marked completed */
  completedTasks: number;
  /** Study sessions currently scheduled in active plan */
  scheduledSessions: number;
  /** Study sessions marked completed in active plan */
  completedSessions: number;
  /** Total planned study hours in active plan */
  totalPlannedHours: number;
}

export interface ClusteredDeadlineDay {
  date: string;
  formattedDate: string;
  tasks: Task[];
}

export interface DeadlinePressureAnalysis {
  overdueTasks: Task[];
  dueTodayTasks: Task[];
  dueWithin3DaysTasks: Task[];
  /** Days with 2 or more active deadlines clustering */
  clusterDays: ClusteredDeadlineDay[];
}

export interface DailyWorkloadItem {
  date: string;
  dayName: string;
  formattedDate: string;
  plannedMinutes: number;
  availableMinutes: number;
  remainingMinutes: number;
  isOverloaded: boolean;
  utilizationPercent: number;
  sessions: PlannedSession[];
}

export interface CompletionTrendMetrics {
  completedTaskCount: number;
  totalTaskCount: number;
  taskCompletionRate: number;
  completedSessionCount: number;
  totalSessionCount: number;
  sessionCompletionRate: number;
  trendNote: string;
}

export type WorkloadInsightCategory =
  | "pressure"
  | "overload"
  | "gap"
  | "progress"
  | "opportunity";

export type WorkloadInsightSeverity =
  | "info"
  | "warning"
  | "opportunity"
  | "positive";

export interface ActionableInsight {
  id: string;
  category: WorkloadInsightCategory;
  title: string;
  description: string;
  severity: WorkloadInsightSeverity;
  actionLabel?: string;
  actionHref?: string;
}
