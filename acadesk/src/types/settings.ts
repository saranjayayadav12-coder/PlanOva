/**
 * types/settings.ts
 *
 * Data contracts for Acadesk Student Preferences, Data Management (Export/Import),
 * and System Settings.
 */

import { Task } from "./task";
import { TaskBreakdown } from "./subtask";
import {
  AvailabilityPreferences,
  StudyPlan,
  AdaptationHistoryEvent,
} from "./planner";
import { WellbeingCheckin } from "./wellbeing";
import { CalendarViewMode } from "./calendar";

export interface StudentPreferences {
  defaultCalendarView: CalendarViewMode;
  weekStartsOn: "monday" | "sunday";
  enableOverloadWarnings: boolean;
  enableClusteringWarnings: boolean;
  updatedAt: string;
}

export const DEFAULT_STUDENT_PREFERENCES: StudentPreferences = {
  defaultCalendarView: "month",
  weekStartsOn: "monday",
  enableOverloadWarnings: true,
  enableClusteringWarnings: true,
  updatedAt: "2026-10-11T00:00:00.000Z",
};

export interface AcadeskExportPayload {
  schemaVersion: "1.0";
  appName: "Acadesk";
  exportedAt: string;
  tasks: Task[];
  breakdowns: Record<string, TaskBreakdown>;
  availability: AvailabilityPreferences;
  acceptedPlan: StudyPlan | null;
  adaptationHistory: AdaptationHistoryEvent[];
  wellbeingCheckins: WellbeingCheckin[];
  preferences: StudentPreferences;
}

export interface ImportValidationResult {
  isValid: boolean;
  errors: string[];
  payload?: AcadeskExportPayload;
  summary?: {
    taskCount: number;
    breakdownCount: number;
    hasAcceptedPlan: boolean;
    adaptationHistoryCount: number;
    wellbeingCount: number;
  };
}
