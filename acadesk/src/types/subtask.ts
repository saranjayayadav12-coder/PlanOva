/**
 * types/subtask.ts
 *
 * Data contracts for AI-assisted task breakdown and subtask progress tracking.
 * Designed for strict type safety, local persistence, and future backend compatibility.
 */

export type SubtaskStatus = "pending" | "completed";

export interface Subtask {
  /** Unique identifier for the subtask */
  id: string;
  /** Actionable title */
  title: string;
  /** Detailed instructions or subtask context */
  description?: string;
  /** Estimated duration in minutes (positive integer) */
  estimatedDurationMinutes: number;
  /** Step order sequence (1, 2, 3...) */
  order: number;
  /** Progress status */
  status: SubtaskStatus;
  /** IDs of subtasks that should precede this subtask */
  dependencyIds: string[];
  /** ISO timestamp when created */
  createdAt: string;
  /** ISO timestamp when last updated */
  updatedAt: string;
}

export interface TaskBreakdown {
  /** ID of parent task */
  taskId: string;
  /** Ordered list of subtasks */
  subtasks: Subtask[];
  /** Generation origin */
  source: "ai_suggestion" | "custom";
  /** ISO timestamp when created */
  createdAt: string;
  /** ISO timestamp when last updated */
  updatedAt: string;
}

export interface SubtaskSuggestion {
  title: string;
  description?: string;
  estimatedDurationMinutes: number;
  order: number;
  dependencyIds?: string[];
}
