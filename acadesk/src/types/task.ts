/**
 * types/task.ts
 *
 * Centralized Task data contract for Acadesk.
 * Designed for strict type safety, local persistence, and future backend parity.
 */

export type TaskDifficulty = "easy" | "medium" | "hard";
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  /** Unique identifier (e.g. "task-1728591234567" or UUID) */
  id: string;
  /** Primary task title / deliverable name */
  title: string;
  /** Optional extended description or instructions */
  description?: string;
  /** Academic course or subject name (e.g. "Operating Systems", "Linear Algebra") */
  subject: string;
  /** Due date formatted as YYYY-MM-DD */
  deadline: string;
  /** Estimated duration in minutes (positive integer, e.g. 45, 90) */
  estimatedDurationMinutes: number;
  /** Cognitive / workload difficulty level */
  difficulty: TaskDifficulty;
  /** Scheduling priority */
  priority: TaskPriority;
  /** Current progress status */
  status: TaskStatus;
  /** ISO timestamp when created */
  createdAt: string;
  /** ISO timestamp when last updated */
  updatedAt: string;
}

export type TaskFilterStatus = "all" | "pending" | "in_progress" | "completed";
export type TaskFilterPriority = "all" | "high" | "medium" | "low";
export type TaskSortOption = "deadline" | "priority" | "recently_updated" | "duration";

export interface TaskFormData {
  title: string;
  description: string;
  subject: string;
  deadline: string;
  estimatedDurationMinutes: number;
  difficulty: TaskDifficulty;
  priority: TaskPriority;
  status: TaskStatus;
}
