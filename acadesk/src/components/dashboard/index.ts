/**
 * components/dashboard/index.ts
 *
 * Barrel export for Acadesk student dashboard components.
 */

export { DashboardShell } from "./dashboard-shell";
export { Sidebar } from "./sidebar";
export { Header } from "./header";
export { SummaryCards } from "./summary-cards";
export { TodaysPriorities } from "./todays-priorities";
export { UpcomingDeadlines } from "./upcoming-deadlines";
export { StudyPlanPreview } from "./study-plan-preview";
export { INITIAL_TASKS, INITIAL_DEADLINES, INITIAL_SCHEDULE } from "./mock-data";
export type { DemoTask, DemoDeadline, DemoScheduleBlock, PriorityLevel, DeadlineUrgency, ScheduleStatus } from "./types";
