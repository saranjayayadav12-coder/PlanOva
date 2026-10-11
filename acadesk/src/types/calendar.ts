/**
 * types/calendar.ts
 *
 * Data contracts for Acadesk Interactive Academic Calendar.
 * Pure derived models that synthesize shared Task data and Study Planner sessions.
 * Never acts as a duplicate store of truth.
 */

import { Task, TaskPriority, TaskStatus } from "./task";
import { PlannedSession, SessionStatus } from "./planner";

export type CalendarViewMode = "month" | "week" | "day";

export type CalendarEventType = "task_deadline" | "study_session";

export interface CalendarEvent {
  /** Unique calendar event identifier (e.g. "deadline-task-123" or "session-sess-456") */
  id: string;
  /** Categorization: task deadline or scheduled study block */
  type: CalendarEventType;
  /** Primary event title */
  title: string;
  /** Associated academic subject / course */
  subject: string;
  /** Calendar date YYYY-MM-DD */
  date: string;
  /** Start time HH:MM if timed study session */
  startTime?: string;
  /** End time HH:MM if timed study session */
  endTime?: string;
  /** Duration in minutes */
  durationMinutes?: number;
  /** True for deadlines that apply to the full day; false for timed study blocks */
  isAllDay: boolean;
  /** Priority level */
  priority: TaskPriority;
  /** Completion / execution status */
  status: TaskStatus | SessionStatus;
  /** Convenience flag indicating item is completed */
  isCompleted: boolean;
  /** Convenience flag indicating task deadline is overdue */
  isOverdue: boolean;
  /** Original Task reference if event is a deadline */
  task?: Task;
  /** Original PlannedSession reference if event is a study block */
  session?: PlannedSession;
  /** Parent task title if session belongs to a subtask/task */
  parentTaskTitle?: string;
  /** Whether the session represents a subtask block */
  isSubtask?: boolean;
}

export type EventTypeFilter = "all" | "task_deadline" | "study_session";
export type PriorityFilter = "all" | TaskPriority;
export type StatusFilter = "all" | "active" | "completed" | "overdue";

export interface CalendarFilterState {
  eventType: EventTypeFilter;
  priority: PriorityFilter;
  subject: string; // "all" or specific subject
  status: StatusFilter;
  search: string;
}

export type WarningType =
  | "deadline_clustering"
  | "overloaded_day"
  | "planning_gap"
  | "schedule_conflict";

export interface AcademicWarning {
  id: string;
  type: WarningType;
  severity: "low" | "medium" | "high";
  title: string;
  message: string;
  date?: string;
  relatedTaskId?: string;
  actionLink?: string;
  actionLabel?: string;
}

export interface DayCalendarInfo {
  date: string; // YYYY-MM-DD
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
  deadlinesCount: number;
  sessionsCount: number;
  hasOverdue: boolean;
}
