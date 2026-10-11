/**
 * lib/wellbeing-service.ts
 *
 * Deterministic, supportive insight engine and rating metadata for Acadesk Well-being.
 * Pure non-clinical, non-judgmental guidance that connects self-reported signals
 * with actual academic workload information.
 * Zero medical diagnosis or clinical risk classification.
 */

import { Task } from "@/types/task";
import { StudyPlan, AvailabilityPreferences, DayOfWeek } from "@/types/planner";
import {
  WellbeingCheckin,
  WellbeingInsight,
  WellbeingRating,
  RatingOptionMeta,
} from "@/types/wellbeing";
import { parseDateISO } from "./study-planner-service";

export const STRESS_OPTIONS: RatingOptionMeta[] = [
  { value: 1, label: "Very low — feeling calm and grounded", shortLabel: "Very low" },
  { value: 2, label: "Low — manageable background pressure", shortLabel: "Low" },
  { value: 3, label: "Moderate — noticeable academic pressure", shortLabel: "Moderate" },
  { value: 4, label: "High — feeling strained or stretched", shortLabel: "High" },
  { value: 5, label: "Very high — feeling overwhelmed", shortLabel: "Very high" },
];

export const ENERGY_OPTIONS: RatingOptionMeta[] = [
  { value: 1, label: "Very low — physically or mentally drained", shortLabel: "Very low" },
  { value: 2, label: "Low — feeling sluggish or tired", shortLabel: "Low" },
  { value: 3, label: "Moderate — steady, average energy", shortLabel: "Moderate" },
  { value: 4, label: "High — alert, focused, and motivated", shortLabel: "High" },
  { value: 5, label: "Very high — highly energized and ready", shortLabel: "Very high" },
];

export const SLEEP_OPTIONS: RatingOptionMeta[] = [
  { value: 1, label: "Very poor — restless or insufficient sleep", shortLabel: "Very poor" },
  { value: 2, label: "Poor — disrupted or unrefreshing sleep", shortLabel: "Poor" },
  { value: 3, label: "Okay — adequate but could be better", shortLabel: "Okay" },
  { value: 4, label: "Good — rested and refreshed", shortLabel: "Good" },
  { value: 5, label: "Very good — deep, restful, quality sleep", shortLabel: "Very good" },
];

export const WORKLOAD_OPTIONS: RatingOptionMeta[] = [
  { value: 1, label: "Not manageable — deadlines feel out of control", shortLabel: "Not manageable" },
  { value: 2, label: "Difficult — struggling to keep up with pace", shortLabel: "Difficult" },
  { value: 3, label: "Somewhat manageable — keeping afloat with effort", shortLabel: "Somewhat manageable" },
  { value: 4, label: "Manageable — comfortable progress on track", shortLabel: "Manageable" },
  { value: 5, label: "Very manageable — well ahead and confident", shortLabel: "Very manageable" },
];

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
 * Generate transparent, supportive insights connecting self-reported check-in
 * with actual academic workload data.
 */
export function generateWellbeingInsights({
  checkin,
  tasks,
  acceptedPlan,
  availability,
  todayStr,
}: {
  checkin: WellbeingCheckin | null;
  tasks: Task[];
  acceptedPlan: StudyPlan | null;
  availability: AvailabilityPreferences;
  todayStr: string;
}): WellbeingInsight[] {
  if (!checkin) {
    return [];
  }

  const insights: WellbeingInsight[] = [];

  // ── 1. Direct Self-Reported Signals ──

  if (checkin.stress >= 4) {
    insights.push({
      id: "insight-stress-high",
      category: "signal",
      severity: "attention",
      title: "Noticeable Stress Reported",
      message:
        "You're reporting a high level of stress today. Consider reviewing your workload and choosing one manageable next step rather than taking on everything at once.",
      actionLink: "/app/workload",
      actionLabel: "View Workload Insights",
    });
  }

  if (checkin.energy <= 2) {
    insights.push({
      id: "insight-energy-low",
      category: "signal",
      severity: "attention",
      title: "Low Energy Day",
      message:
        "Your energy feels low today. You could review your study plan and consider a shorter, manageable session with extra wellness breaks.",
      actionLink: "/app/planner",
      actionLabel: "Adjust Study Blocks",
    });
  }

  if (checkin.sleep <= 2) {
    insights.push({
      id: "insight-sleep-low",
      category: "signal",
      severity: "info",
      title: "Rest Needed",
      message:
        "You reported that your sleep wasn't great. Consider reviewing today's workload and pacing yourself with mindful breaks throughout the day.",
    });
  }

  if (checkin.workloadManageability <= 2) {
    insights.push({
      id: "insight-workload-unmanageable",
      category: "signal",
      severity: "attention",
      title: "Workload Feels Difficult to Manage",
      message:
        "Your workload feels difficult to manage today. Academic Recovery Mode is available to help re-balance deadlines into a calm, realistic schedule.",
      actionLink: "/app/recovery",
      actionLabel: "Explore Academic Recovery",
    });
  }

  if (
    checkin.stress <= 2 &&
    checkin.energy >= 4 &&
    checkin.workloadManageability >= 4
  ) {
    insights.push({
      id: "insight-positive-momentum",
      category: "signal",
      severity: "positive",
      title: "Positive Momentum",
      message:
        "Your check-in suggests that today's workload feels manageable and your energy is strong. Continue at a pace that works for you and celebrate your steady progress.",
    });
  }

  // ── 2. Workload Synthesis (Self-Report + Real Academic Workload) ──

  // Check today's planned study time against daily capacity
  const todayDateObj = parseDateISO(todayStr);
  const dayOfWeek = DAY_INDEX_MAP[todayDateObj.getDay()];
  const dayConfig = availability.days[dayOfWeek];
  const maxDailyMinutes =
    dayConfig && dayConfig.enabled
      ? Math.min(dayConfig.maxDailyMinutes, availability.maxDailyStudyMinutes)
      : 0;

  const todaySessions = acceptedPlan
    ? acceptedPlan.sessions.filter((s) => s.date === todayStr && s.status !== "completed")
    : [];
  const todayPlannedMinutes = todaySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const isTodayOverloaded = maxDailyMinutes > 0 && todayPlannedMinutes > maxDailyMinutes;

  if (isTodayOverloaded && (checkin.stress >= 4 || checkin.energy <= 2)) {
    insights.push({
      id: "insight-synth-overloaded-strain",
      category: "workload_synthesis",
      severity: "attention",
      title: "Schedule Exceeds Capacity on a High-Strain Day",
      message:
        `Your check-in indicates high stress or low energy, and today's planned study time (${todayPlannedMinutes}m) exceeds your configured capacity (${maxDailyMinutes}m). You may want to review a more manageable plan in Academic Recovery.`,
      actionLink: "/app/recovery",
      actionLabel: "Review Recovery Options",
    });
  }

  // Check upcoming clustered deadlines
  const activeUpcomingTasks = tasks.filter(
    (t) => t.status !== "completed" && Boolean(t.deadline) && t.deadline >= todayStr
  );
  const deadlineCountNext3Days = activeUpcomingTasks.filter((t) => {
    const diffDays = Math.ceil(
      (parseDateISO(t.deadline).getTime() - todayDateObj.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays >= 0 && diffDays <= 3;
  }).length;

  if (deadlineCountNext3Days >= 2 && checkin.workloadManageability <= 3) {
    insights.push({
      id: "insight-synth-clustered-pressure",
      category: "workload_synthesis",
      severity: "attention",
      title: "Upcoming Deadline Concentration",
      message:
        `You have ${deadlineCountNext3Days} assignments due in the next 3 days while feeling stretched. Breaking them into subtask chunks or asking for schedule readjustment can help relieve the peak.`,
      actionLink: "/app/tasks",
      actionLabel: "Review Due Tasks",
    });
  }

  return insights;
}

/**
 * Filter check-ins to recent window (e.g. 7 days)
 */
export function getRecentCheckins(
  checkins: WellbeingCheckin[],
  count: number = 7
): WellbeingCheckin[] {
  return checkins.slice(0, count);
}

/**
 * Compute average rating safely without fabricating
 */
export function computeAverageRating(
  checkins: WellbeingCheckin[],
  key: keyof Pick<
    WellbeingCheckin,
    "stress" | "energy" | "sleep" | "workloadManageability"
  >
): number | null {
  if (checkins.length === 0) return null;
  const sum = checkins.reduce((acc, c) => acc + (c[key] || 0), 0);
  return Number((sum / checkins.length).toFixed(1));
}
