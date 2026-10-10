"use client";

import {
  DashboardShell,
  SummaryCards,
  TodaysPriorities,
  UpcomingDeadlines,
  StudyPlanPreview,
  INITIAL_SCHEDULE,
} from "@/components/dashboard";
import { useTasks } from "@/contexts/task-context";

/**
 * /app/dashboard — Acadesk Student Dashboard (Phase 5 Integrated)
 *
 * Fully integrated workspace deriving all task metrics, priorities,
 * and upcoming deadlines directly from the centralized TaskContext.
 * Changes made here or in /app/tasks synchronize in real time.
 */
export default function DashboardPage() {
  const { tasks, toggleTaskCompletion } = useTasks();

  // Derive dynamic dashboard metrics from shared task state
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const remainingMinutes = tasks
    .filter((t) => t.status !== "completed")
    .reduce((sum, t) => sum + t.estimatedDurationMinutes, 0);
  const totalPlannedMinutes = tasks.reduce(
    (sum, t) => sum + t.estimatedDurationMinutes,
    0
  );

  // Incomplete tasks with deadlines
  const incompleteTasks = tasks.filter((t) => t.status !== "completed");
  const upcomingDeadlinesCount = incompleteTasks.length;

  // Urgent deadlines: due within 2 days of demo date (2026-10-10)
  const urgentDeadlinesCount = incompleteTasks.filter((t) => {
    const anchor = new Date("2026-10-10T00:00:00Z").getTime();
    const target = new Date(`${t.deadline}T00:00:00Z`).getTime();
    const diffDays = Math.round((target - anchor) / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  }).length;

  return (
    <DashboardShell
      headerTitle="Overview"
      headerSubtitle="Welcome back. Here is your adaptive academic pace for today."
      headerBadge="Fall Semester '26"
    >
      {/* ── Metric Summary Cards (Live Synced with TaskContext) ── */}
      <SummaryCards
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        remainingMinutes={remainingMinutes}
        totalPlannedMinutes={totalPlannedMinutes}
        upcomingDeadlinesCount={upcomingDeadlinesCount}
        urgentDeadlinesCount={urgentDeadlinesCount}
      />

      {/* ── Main Workspace Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Today's Priorities (Shared State) */}
        <div className="lg:col-span-7">
          <TodaysPriorities
            tasks={tasks}
            onToggleTask={toggleTaskCompletion}
          />
        </div>

        {/* Right Column (5 cols): Upcoming Deadlines & Study Plan Timeline */}
        <div className="lg:col-span-5 space-y-6">
          <UpcomingDeadlines tasks={tasks} />
          <StudyPlanPreview schedule={INITIAL_SCHEDULE} />
        </div>
      </div>
    </DashboardShell>
  );
}
