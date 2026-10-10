/**
 * lib/workload-service.ts
 *
 * Deterministic aggregation and insight computation for Acadesk Workload Insights.
 * Operates purely on shared task state and planner persistence.
 * Zero mocked/fabricated metrics; 100% computed from actual data.
 */

import { Task } from "@/types/task";
import { AvailabilityPreferences, StudyPlan, DayOfWeek } from "@/types/planner";
import {
  WorkloadSummaryMetrics,
  DeadlinePressureAnalysis,
  DailyWorkloadItem,
  CompletionTrendMetrics,
  ActionableInsight,
  ClusteredDeadlineDay,
} from "@/types/workload";
import {
  formatDateISO,
  parseDateISO,
  addDays,
} from "./study-planner-service";

export const DEFAULT_ANCHOR_DATE = "2026-10-11";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_INDEX_MAP: Record<number, DayOfWeek> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

/**
 * Returns today's ISO date string (YYYY-MM-DD), defaulting to stable anchor date
 */
export function getTodayISO(customDate?: string): string {
  return customDate || DEFAULT_ANCHOR_DATE;
}

/**
 * Compute high-level workload summary metrics from actual tasks and plan data
 */
export function computeWorkloadSummary(
  tasks: Task[],
  acceptedPlan: StudyPlan | null,
  todayStr: string = DEFAULT_ANCHOR_DATE
): WorkloadSummaryMetrics {
  const in7DaysStr = formatDateISO(addDays(parseDateISO(todayStr), 7));

  const activeTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const overdueTasks = activeTasks.filter(
    (t) => Boolean(t.deadline) && t.deadline < todayStr
  );

  const dueWithin7Days = activeTasks.filter(
    (t) => Boolean(t.deadline) && t.deadline >= todayStr && t.deadline <= in7DaysStr
  );

  const scheduledSessions = acceptedPlan
    ? acceptedPlan.sessions.filter((s) => s.status !== "completed").length
    : 0;

  const completedSessions = acceptedPlan
    ? acceptedPlan.sessions.filter((s) => s.status === "completed").length
    : 0;

  const totalPlannedHours = acceptedPlan
    ? Number((acceptedPlan.totalPlannedMinutes / 60).toFixed(1))
    : 0;

  return {
    totalActiveTasks: activeTasks.length,
    overdueTasks: overdueTasks.length,
    dueWithin7Days: dueWithin7Days.length,
    completedTasks: completedTasks.length,
    scheduledSessions,
    completedSessions,
    totalPlannedHours,
  };
}

/**
 * Analyze deadline pressure points: overdue, today, next 3 days, and deadline clusters
 */
export function analyzeDeadlinePressure(
  tasks: Task[],
  todayStr: string = DEFAULT_ANCHOR_DATE
): DeadlinePressureAnalysis {
  const in3DaysStr = formatDateISO(addDays(parseDateISO(todayStr), 3));

  const activeTasks = tasks.filter((t) => t.status !== "completed" && Boolean(t.deadline));

  const overdueTasks = activeTasks
    .filter((t) => t.deadline < todayStr)
    .sort((a, b) => a.deadline.localeCompare(b.deadline));

  const dueTodayTasks = activeTasks
    .filter((t) => t.deadline === todayStr)
    .sort((a, b) => a.title.localeCompare(b.title));

  const dueWithin3DaysTasks = activeTasks
    .filter((t) => t.deadline > todayStr && t.deadline <= in3DaysStr)
    .sort((a, b) => a.deadline.localeCompare(b.deadline));

  // Find date clusters (days with 2 or more upcoming active deadlines)
  const dateGroups: Record<string, Task[]> = {};
  for (const t of activeTasks) {
    if (t.deadline >= todayStr) {
      if (!dateGroups[t.deadline]) dateGroups[t.deadline] = [];
      dateGroups[t.deadline].push(t);
    }
  }

  const clusterDays: ClusteredDeadlineDay[] = Object.entries(dateGroups)
    .filter(([, taskList]) => taskList.length >= 2)
    .map(([date, taskList]) => {
      const dObj = parseDateISO(date);
      const formattedDate = dObj.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      return {
        date,
        formattedDate,
        tasks: taskList,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    overdueTasks,
    dueTodayTasks,
    dueWithin3DaysTasks,
    clusterDays,
  };
}

/**
 * Computes daily workload distribution across the planning window (default 7 days)
 */
export function analyzeDailyWorkloadDistribution(
  acceptedPlan: StudyPlan | null,
  availability: AvailabilityPreferences,
  windowDays: number = 7,
  todayStr: string = DEFAULT_ANCHOR_DATE
): DailyWorkloadItem[] {
  const startDate = parseDateISO(todayStr);
  const result: DailyWorkloadItem[] = [];

  for (let i = 0; i < windowDays; i++) {
    const current = addDays(startDate, i);
    const dateStr = formatDateISO(current);
    const dayOfWeek = DAY_INDEX_MAP[current.getDay()];
    const dayName = DAY_NAMES[current.getDay()];
    const dayConfig = availability.days[dayOfWeek];

    const availableMinutes =
      dayConfig && dayConfig.enabled
        ? Math.min(dayConfig.maxDailyMinutes, availability.maxDailyStudyMinutes)
        : 0;

    const sessions = acceptedPlan
      ? acceptedPlan.sessions.filter((s) => s.date === dateStr)
      : [];

    const plannedMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const isOverloaded = availableMinutes > 0 && plannedMinutes > availableMinutes;
    const remainingMinutes = Math.max(0, availableMinutes - plannedMinutes);
    const utilizationPercent =
      availableMinutes > 0
        ? Math.round((plannedMinutes / availableMinutes) * 100)
        : plannedMinutes > 0
        ? 100
        : 0;

    const formattedDate = current.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    result.push({
      date: dateStr,
      dayName,
      formattedDate,
      plannedMinutes,
      availableMinutes,
      remainingMinutes,
      isOverloaded,
      utilizationPercent,
      sessions,
    });
  }

  return result;
}

/**
 * Computes completion trends and productivity context
 */
export function computeCompletionTrends(
  tasks: Task[],
  acceptedPlan: StudyPlan | null
): CompletionTrendMetrics {
  const completedTaskCount = tasks.filter((t) => t.status === "completed").length;
  const totalTaskCount = tasks.length;
  const taskCompletionRate =
    totalTaskCount > 0 ? Math.round((completedTaskCount / totalTaskCount) * 100) : 0;

  const totalSessionCount = acceptedPlan ? acceptedPlan.sessions.length : 0;
  const completedSessionCount = acceptedPlan
    ? acceptedPlan.sessions.filter((s) => s.status === "completed").length
    : 0;
  const sessionCompletionRate =
    totalSessionCount > 0
      ? Math.round((completedSessionCount / totalSessionCount) * 100)
      : 0;

  return {
    completedTaskCount,
    totalTaskCount,
    taskCompletionRate,
    completedSessionCount,
    totalSessionCount,
    sessionCompletionRate,
    trendNote:
      totalTaskCount > 0 || totalSessionCount > 0
        ? "Completion metrics reflect your active workspace tasks and current study plan."
        : "Add assignments and generate a study plan to track completion progress over time.",
  };
}

/**
 * Deterministic insight engine generating actionable, supportive guidance
 */
export function generateWorkloadInsights(
  tasks: Task[],
  acceptedPlan: StudyPlan | null,
  availability: AvailabilityPreferences,
  todayStr: string = DEFAULT_ANCHOR_DATE
): ActionableInsight[] {
  const insights: ActionableInsight[] = [];
  const in3DaysStr = formatDateISO(addDays(parseDateISO(todayStr), 3));
  const in7DaysStr = formatDateISO(addDays(parseDateISO(todayStr), 7));

  const activeTasks = tasks.filter((t) => t.status !== "completed");
  const overdueTasks = activeTasks.filter((t) => Boolean(t.deadline) && t.deadline < todayStr);
  const urgentTasks = activeTasks.filter(
    (t) => Boolean(t.deadline) && t.deadline >= todayStr && t.deadline <= in3DaysStr
  );

  // 1. Deadline Pressure Insight
  if (overdueTasks.length > 0) {
    insights.push({
      id: "insight-overdue",
      category: "pressure",
      title: "Overdue Deliverables Need Re-Anchoring",
      description: `You have ${overdueTasks.length} assignment${
        overdueTasks.length > 1 ? "s" : ""
      } past due. Academic Recovery can help re-distribute this work into manageable slots.`,
      severity: "warning",
      actionLabel: "Open Academic Recovery",
      actionHref: "/app/recovery",
    });
  } else if (urgentTasks.length >= 2) {
    insights.push({
      id: "insight-urgent-cluster",
      category: "pressure",
      title: "Approaching Deadline Cluster",
      description: `You have ${urgentTasks.length} active assignments due within the next 3 days. Focus on high-priority milestones first to maintain momentum.`,
      severity: "warning",
      actionLabel: "View Upcoming Tasks",
      actionHref: "/app/tasks",
    });
  }

  // 2. Overloaded Day Insight
  const dailyDistribution = analyzeDailyWorkloadDistribution(
    acceptedPlan,
    availability,
    7,
    todayStr
  );
  const overloadedDays = dailyDistribution.filter((d) => d.isOverloaded);
  if (overloadedDays.length > 0) {
    const firstOverloaded = overloadedDays[0];
    insights.push({
      id: "insight-overloaded-day",
      category: "overload",
      title: `Heavy Load on ${firstOverloaded.dayName}`,
      description: `Planned study time (${firstOverloaded.plannedMinutes}m) exceeds your available capacity (${firstOverloaded.availableMinutes}m) on ${firstOverloaded.formattedDate}. Moving a session to a lighter day will help keep your study pace sustainable.`,
      severity: "warning",
      actionLabel: "Adjust in Study Planner",
      actionHref: "/app/planner",
    });
  }

  // 3. Planning Gap Insight
  if (acceptedPlan) {
    const plannedTaskIds = new Set(acceptedPlan.sessions.map((s) => s.taskId));
    const tasksDueSoonWithoutSessions = activeTasks.filter(
      (t) =>
        Boolean(t.deadline) &&
        t.deadline >= todayStr &&
        t.deadline <= in7DaysStr &&
        !plannedTaskIds.has(t.id)
    );

    if (tasksDueSoonWithoutSessions.length > 0) {
      insights.push({
        id: "insight-planning-gap",
        category: "gap",
        title: "Unscheduled Upcoming Assignments",
        description: `${tasksDueSoonWithoutSessions.length} assignment${
          tasksDueSoonWithoutSessions.length > 1 ? "s" : ""
        } due within 7 days do not currently have study sessions scheduled. Regenerate your study plan to make sure they get dedicated focus time.`,
        severity: "opportunity",
        actionLabel: "Regenerate Study Plan",
        actionHref: "/app/planner",
      });
    }
  }

  // 4. Recovery Progress Insight
  if (acceptedPlan && acceptedPlan.sessions.length > 0) {
    const completedSessions = acceptedPlan.sessions.filter((s) => s.status === "completed");
    if (completedSessions.length > 0) {
      insights.push({
        id: "insight-recovery-progress",
        category: "progress",
        title: "Consistent Study Execution",
        description: `Great progress! You have completed ${completedSessions.length} of ${acceptedPlan.sessions.length} scheduled study blocks. Keep up this steady routine.`,
        severity: "positive",
        actionLabel: "Review Study Plan",
        actionHref: "/app/planner",
      });
    }
  }

  // 5. Workload Opportunity Insight
  const openCapacityDay = dailyDistribution.find(
    (d) => d.availableMinutes >= 120 && d.remainingMinutes >= 60 && d.plannedMinutes < d.availableMinutes * 0.5
  );
  if (openCapacityDay && activeTasks.length > 0) {
    insights.push({
      id: "insight-opportunity-day",
      category: "opportunity",
      title: `Study Window Available on ${openCapacityDay.dayName}`,
      description: `${openCapacityDay.formattedDate} has ${openCapacityDay.remainingMinutes} minutes of open study capacity. You can use this space to get an early start on upcoming coursework.`,
      severity: "opportunity",
      actionLabel: "Explore in Planner",
      actionHref: "/app/planner",
    });
  }

  return insights;
}
