/**
 * components/dashboard/types.ts
 *
 * TypeScript types and data contracts for the Acadesk student dashboard.
 * All models represent demonstrative client-side state for Phase 4.
 */

export type PriorityLevel = "high" | "medium" | "low";

export interface DemoTask {
  id: string;
  title: string;
  course: string;
  durationMinutes: number;
  durationLabel: string;
  priority: PriorityLevel;
  completed: boolean;
}

export type DeadlineUrgency = "urgent" | "moderate" | "normal";

export interface DemoDeadline {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  daysRemaining: number;
  estimatedHours: number;
  urgency: DeadlineUrgency;
}

export type ScheduleStatus = "completed" | "in-progress" | "scheduled";

export interface DemoScheduleBlock {
  id: string;
  timeSlot: string;
  activity: string;
  course: string;
  duration: string;
  status: ScheduleStatus;
}
