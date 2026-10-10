/**
 * lib/recovery-service.ts
 *
 * Deterministic Academic Recovery Engine for Acadesk (Phase 9).
 * Identifies recovery triggers, formulates a re-balanced recovery plan,
 * and compiles transparent before-vs-after comparisons with explicit trade-offs.
 */

import { Task } from "@/types/task";
import { TaskBreakdown } from "@/types/subtask";
import {
  AvailabilityPreferences,
  StudyPlan,
  PlannedSession,
} from "@/types/planner";
import {
  RecoveryDiagnosis,
  RecoveryTriggerItem,
  ProposedRecoveryPlan,
  RecoveryProposalComparison,
} from "@/types/recovery";
import {
  formatDateISO,
  parseDateISO,
  addDays,
  generateStudyPlan,
} from "./study-planner-service";
import {
  DEFAULT_ANCHOR_DATE,
  analyzeDailyWorkloadDistribution,
} from "./workload-service";

/**
 * Diagnoses whether academic recovery is needed and compiles contributing triggers
 */
export function diagnoseRecoveryNeeds(
  tasks: Task[],
  acceptedPlan: StudyPlan | null,
  availability: AvailabilityPreferences,
  todayStr: string = DEFAULT_ANCHOR_DATE
): RecoveryDiagnosis {
  const in3DaysStr = formatDateISO(addDays(parseDateISO(todayStr), 3));
  const triggers: RecoveryTriggerItem[] = [];

  const activeTasks = tasks.filter((t) => t.status !== "completed");
  const overdueTasks = activeTasks.filter((t) => Boolean(t.deadline) && t.deadline < todayStr);
  const urgentTasks = activeTasks.filter(
    (t) => Boolean(t.deadline) && t.deadline >= todayStr && t.deadline <= in3DaysStr
  );

  // 1. Overdue incomplete tasks
  if (overdueTasks.length > 0) {
    triggers.push({
      id: "trigger-overdue",
      type: "overdue_tasks",
      title: "Overdue Deliverables",
      description: `${overdueTasks.length} task${
        overdueTasks.length > 1 ? "s are" : " is"
      } past due date. They need to be comfortably re-slotted into your current schedule.`,
      severity: "high",
      itemCount: overdueTasks.length,
    });
  }

  // 2. Clustered upcoming deadlines
  if (urgentTasks.length >= 2) {
    triggers.push({
      id: "trigger-cluster",
      type: "deadline_cluster",
      title: "Clustered Deadlines",
      description: `${urgentTasks.length} assignments are due within the next 3 days, which can create concentrated workload bottlenecks.`,
      severity: "medium",
      itemCount: urgentTasks.length,
    });
  }

  // 3. Overloaded study days
  const dailyDistribution = analyzeDailyWorkloadDistribution(acceptedPlan, availability, 7);
  const overloadedDays = dailyDistribution.filter((d) => d.isOverloaded);
  if (overloadedDays.length > 0) {
    triggers.push({
      id: "trigger-overloaded-days",
      type: "overloaded_days",
      title: "Capacity Exceeded",
      description: `Planned study time exceeds daily capacity on ${overloadedDays.length} upcoming day${
        overloadedDays.length > 1 ? "s" : ""
      } (${overloadedDays.map((d) => d.dayName).join(", ")}).`,
      severity: "high",
      itemCount: overloadedDays.length,
    });
  }

  // 4. Incomplete study sessions
  const incompleteSessions: PlannedSession[] = acceptedPlan
    ? acceptedPlan.sessions.filter((s) => s.status === "incomplete")
    : [];
  if (incompleteSessions.length > 0) {
    triggers.push({
      id: "trigger-incomplete-sessions",
      type: "incomplete_sessions",
      title: "Unfinished Study Sessions",
      description: `${incompleteSessions.length} session${
        incompleteSessions.length > 1 ? "s were" : " was"
      } flagged as incomplete and left unfinished work that needs rescheduling.`,
      severity: "medium",
      itemCount: incompleteSessions.length,
    });
  }

  // 5. Unscheduled urgent tasks
  if (acceptedPlan) {
    const plannedTaskIds = new Set(acceptedPlan.sessions.map((s) => s.taskId));
    const unplannedUrgent = activeTasks.filter(
      (t) =>
        Boolean(t.deadline) &&
        t.deadline >= todayStr &&
        t.deadline <= in3DaysStr &&
        !plannedTaskIds.has(t.id)
    );
    if (unplannedUrgent.length > 0) {
      triggers.push({
        id: "trigger-planning-gap",
        type: "planning_gap",
        title: "Unplanned Urgent Assignments",
        description: `${unplannedUrgent.length} upcoming assignment${
          unplannedUrgent.length > 1 ? "s do" : " does"
        } not have scheduled study time before deadlines.`,
        severity: "high",
        itemCount: unplannedUrgent.length,
      });
    }
  }

  const isRecoveryNeeded = triggers.length > 0;

  // Compile contributing tasks
  const contributingTaskMap = new Map<string, Task>();
  for (const t of overdueTasks) contributingTaskMap.set(t.id, t);
  for (const t of urgentTasks) contributingTaskMap.set(t.id, t);
  for (const s of incompleteSessions) {
    const parent = tasks.find((t) => t.id === s.taskId);
    if (parent) contributingTaskMap.set(parent.id, parent);
  }

  // Compose empathetic summary
  let summary = "";
  if (!isRecoveryNeeded) {
    summary =
      "Your current study schedule is well-proportioned! All upcoming deadlines fit within your configured daily study caps without any overloaded days.";
  } else {
    const parts: string[] = [];
    if (overdueTasks.length > 0) {
      parts.push(`${overdueTasks.length} overdue task${overdueTasks.length > 1 ? "s" : ""}`);
    }
    if (urgentTasks.length >= 2) {
      parts.push(`${urgentTasks.length} clustered deadlines in the next 3 days`);
    }
    if (overloadedDays.length > 0) {
      parts.push(`${overloadedDays.length} day${overloadedDays.length > 1 ? "s" : ""} exceeding daily study limits`);
    }
    if (incompleteSessions.length > 0) {
      parts.push(`${incompleteSessions.length} unfinished study session${incompleteSessions.length > 1 ? "s" : ""}`);
    }
    summary = `Your workload indicates ${parts.join(" and ")}. Academic Recovery will re-balance your study blocks across the week so you can make consistent progress without burnout.`;
  }

  return {
    isRecoveryNeeded,
    summary,
    triggers,
    contributingTasks: Array.from(contributingTaskMap.values()),
    overloadedDays,
    incompleteSessions,
  };
}

/**
 * Generates an Academic Recovery Proposal by re-balancing workload across available capacity
 */
export function generateRecoveryProposal({
  tasks,
  breakdowns,
  acceptedPlan,
  availability,
  todayStr = DEFAULT_ANCHOR_DATE,
}: {
  tasks: Task[];
  breakdowns: Record<string, TaskBreakdown>;
  acceptedPlan: StudyPlan | null;
  availability: AvailabilityPreferences;
  todayStr?: string;
}): ProposedRecoveryPlan {
  const diagnosis = diagnoseRecoveryNeeds(tasks, acceptedPlan, availability, todayStr);
  const endDateStr = formatDateISO(addDays(parseDateISO(todayStr), 7));

  // 1. Separate completed sessions from the existing plan to preserve them
  const preservedCompletedSessions = acceptedPlan
    ? acceptedPlan.sessions.filter((s) => s.status === "completed")
    : [];

  // 2. Run the deterministic scheduler for the upcoming 7 days with adjusted pacing
  // We prioritize active tasks, give overdue tasks immediate slots, and spread work evenly
  const recoveryRawPlan = generateStudyPlan({
    tasks: tasks.filter((t) => t.status !== "completed"),
    breakdowns,
    availability,
    startDateStr: todayStr,
    endDateStr: endDateStr,
  });

  // 3. Mark sessions with diff tags for clear explainability
  const recoveredSessions: PlannedSession[] = [];
  const existingSessionMap = new Map<string, PlannedSession>();
  if (acceptedPlan) {
    for (const s of acceptedPlan.sessions) {
      existingSessionMap.set(`${s.taskId}-${s.subtaskId || "m"}`, s);
    }
  }

  // Add preserved completed sessions first
  for (const comp of preservedCompletedSessions) {
    recoveredSessions.push({
      ...comp,
      diffTag: "unchanged",
    });
  }

  let movedCount = 0;
  for (const s of recoveryRawPlan.sessions) {
    const prev = existingSessionMap.get(`${s.taskId}-${s.subtaskId || "m"}`);
    if (prev) {
      if (prev.date === s.date && prev.startTime === s.startTime) {
        recoveredSessions.push({ ...s, diffTag: "unchanged" });
      } else {
        movedCount++;
        recoveredSessions.push({ ...s, diffTag: "moved" });
      }
    } else {
      recoveredSessions.push({ ...s, diffTag: "added" });
    }
  }

  // Sort sessions chronologically
  recoveredSessions.sort((a, b) => {
    const dateComp = a.date.localeCompare(b.date);
    if (dateComp !== 0) return dateComp;
    return a.startTime.localeCompare(b.startTime);
  });

  // Re-index order
  recoveredSessions.forEach((s, idx) => {
    s.orderIndex = idx + 1;
  });

  // Calculate comparisons
  const originalPlannedMinutes = acceptedPlan ? acceptedPlan.totalPlannedMinutes : 0;
  const proposedPlannedMinutes = recoveredSessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  const originalDistribution = analyzeDailyWorkloadDistribution(acceptedPlan, availability, 7);
  const proposedDistribution = analyzeDailyWorkloadDistribution(
    {
      ...recoveryRawPlan,
      sessions: recoveredSessions,
      totalPlannedMinutes: proposedPlannedMinutes,
    },
    availability,
    7
  );

  const originalOverloadedDays = originalDistribution.filter((d) => d.isOverloaded).length;
  const proposedOverloadedDays = proposedDistribution.filter((d) => d.isOverloaded).length;

  const tradeOffs: string[] = [
    `Capped daily study to ${availability.maxDailyStudyMinutes} minutes/day to eliminate excessive study cramming.`,
    `Spreads study blocks into ${availability.preferredSessionDurationMinutes}-minute focus sessions separated by ${availability.preferredBreakDurationMinutes}-minute wellness breaks.`,
    "Preserves all previously completed study milestones intact.",
  ];

  const resolvedRisks: string[] = [];
  if (originalOverloadedDays > proposedOverloadedDays) {
    resolvedRisks.push(`Reduced overloaded days from ${originalOverloadedDays} to ${proposedOverloadedDays}.`);
  }
  if (diagnosis.incompleteSessions.length > 0) {
    resolvedRisks.push(`Re-allocated ${diagnosis.incompleteSessions.length} unfinished study sessions into fresh upcoming study blocks.`);
  }

  const remainingRisks: string[] = [];
  if (recoveryRawPlan.unscheduledTasks.length > 0) {
    remainingRisks.push(
      `${recoveryRawPlan.unscheduledTasks.length} task(s) could not fully fit before their deadlines within the 7-day study window. Consider extending daily study availability or adjusting deadlines.`
    );
  }

  const comparison: RecoveryProposalComparison = {
    originalPlannedMinutes,
    proposedPlannedMinutes,
    originalOverloadedDays,
    proposedOverloadedDays,
    movedSessionCount: movedCount,
    unscheduledTaskCount: recoveryRawPlan.unscheduledTasks.length,
    tradeOffs,
    resolvedRisks,
    remainingRisks,
  };

  const finalPlan: StudyPlan = {
    ...recoveryRawPlan,
    id: `plan-recovery-${Date.now()}`,
    status: "draft",
    sessions: recoveredSessions,
    totalPlannedMinutes: proposedPlannedMinutes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    plan: finalPlan,
    diagnosis,
    comparison,
  };
}
