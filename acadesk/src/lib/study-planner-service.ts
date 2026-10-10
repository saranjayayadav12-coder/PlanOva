/**
 * lib/study-planner-service.ts
 *
 * Deterministic, explainable academic scheduling engine for Acadesk.
 *
 * This engine constructs a balanced study plan by reconciling:
 * 1. Active academic tasks & subtask breakdowns (shared state)
 * 2. Student availability preferences (days, hours, session caps, breaks)
 * 3. Urgent deadlines, cognitive difficulty, and task priorities
 *
 * Fully transparent: Does not claim to call a real AI model. Provides
 * concrete explanations ("Why this plan?") for every scheduling choice.
 */

import { Task } from "@/types/task";
import { TaskBreakdown } from "@/types/subtask";
import {
  AvailabilityPreferences,
  StudyPlan,
  PlannedSession,
  UnscheduledTask,
  PlanWarning,
  PlanExplanation,
  DayOfWeek,
  PlanAdjustmentTrigger,
  ProposedRevisedPlan,
  PlanComparisonDiff,
  MovedSessionDiff,
  WhatIfParameters,
  SimulationResult,
} from "@/types/planner";

/**
 * Days of week index map (0 = Sunday, 1 = Monday, ... 6 = Saturday)
 */
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
 * Helper: Parse "HH:MM" into total minutes from midnight
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Helper: Convert minutes from midnight to "HH:MM"
 */
function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

/**
 * Helper: Format a Date object to "YYYY-MM-DD"
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Helper: Parse "YYYY-MM-DD" to Date
 */
export function parseDateISO(isoStr: string): Date {
  const [year, month, day] = isoStr.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

/**
 * Helper: Add days to date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Candidate item to be scheduled
 */
interface ScheduleCandidate {
  taskId: string;
  subtaskId?: string;
  title: string;
  parentTaskTitle?: string;
  subject: string;
  deadline?: string;
  durationMinutes: number;
  priority: Task["priority"];
  difficulty: Task["difficulty"];
  isSubtask: boolean;
  order: number;
  isOverdue: boolean;
  hasNoDeadline: boolean;
}

/**
 * Generate a study plan deterministically
 */
export function generateStudyPlan({
  tasks,
  breakdowns,
  availability,
  startDateStr,
  endDateStr,
}: {
  tasks: Task[];
  breakdowns: Record<string, TaskBreakdown>;
  availability: AvailabilityPreferences;
  startDateStr?: string;
  endDateStr?: string;
}): StudyPlan {
  // Establish date bounds
  const now = new Date();
  const start = startDateStr ? parseDateISO(startDateStr) : now;
  const end = endDateStr ? parseDateISO(endDateStr) : addDays(start, 6); // default 7-day window

  const activeStartDateStr = formatDateISO(start);
  const activeEndDateStr = formatDateISO(end);

  const warnings: PlanWarning[] = [];
  const explanations: PlanExplanation[] = [];
  const unscheduledTasks: UnscheduledTask[] = [];
  const sessions: PlannedSession[] = [];

  // Step 1: Collect candidates (ignoring completed tasks)
  const candidates: ScheduleCandidate[] = [];

  for (const task of tasks) {
    if (task.status === "completed") {
      continue; // Never schedule completed tasks
    }

    const isOverdue = Boolean(task.deadline && task.deadline < activeStartDateStr);
    const hasNoDeadline = !task.deadline || task.deadline.trim() === "";

    if (isOverdue) {
      warnings.push({
        id: `warn-overdue-${task.id}`,
        type: "deadline_risk",
        severity: "high",
        taskId: task.id,
        message: `"${task.title}" has a deadline of ${task.deadline}, which is already past. Prioritizing immediate recovery.`,
      });
    }

    if (hasNoDeadline) {
      warnings.push({
        id: `warn-nodeadline-${task.id}`,
        type: "no_deadline",
        severity: "low",
        taskId: task.id,
        message: `"${task.title}" has no deadline specified. It was scheduled based on priority.`,
      });
    }

    const breakdown = breakdowns[task.id];

    // Prefer scheduling pending subtasks if breakdown exists
    if (breakdown && breakdown.subtasks.length > 0) {
      const pendingSubtasks = breakdown.subtasks.filter((st) => st.status !== "completed");

      if (pendingSubtasks.length > 0) {
        explanations.push({
          id: `exp-subtasks-${task.id}`,
          category: "dependency",
          title: `Step-by-step breakdown used for ${task.subject}`,
          detail: `Scheduled ${pendingSubtasks.length} actionable subtasks for "${task.title}" sequentially to respect procedural dependencies.`,
        });

        for (const st of pendingSubtasks) {
          candidates.push({
            taskId: task.id,
            subtaskId: st.id,
            title: st.title,
            parentTaskTitle: task.title,
            subject: task.subject,
            deadline: task.deadline,
            durationMinutes: st.estimatedDurationMinutes || 30,
            priority: task.priority,
            difficulty: task.difficulty,
            isSubtask: true,
            order: st.order,
            isOverdue,
            hasNoDeadline,
          });
        }
        continue;
      }
    }

    // Otherwise, check if task is very large and split if exceeds 90 minutes
    const maxFocusBlock = availability.preferredSessionDurationMinutes || 45;
    if (task.estimatedDurationMinutes > maxFocusBlock * 1.5 && task.estimatedDurationMinutes >= 75) {
      const numSessions = Math.ceil(task.estimatedDurationMinutes / maxFocusBlock);
      const chunkDuration = Math.round(task.estimatedDurationMinutes / numSessions);

      explanations.push({
        id: `exp-split-${task.id}`,
        category: "split",
        title: `Chunked large task: ${task.title}`,
        detail: `Split into ${numSessions} focus sessions of ~${chunkDuration}m to align with your preferred session duration (${maxFocusBlock}m).`,
      });

      for (let i = 1; i <= numSessions; i++) {
        candidates.push({
          taskId: task.id,
          title: `${task.title} (Part ${i} of ${numSessions})`,
          parentTaskTitle: task.title,
          subject: task.subject,
          deadline: task.deadline,
          durationMinutes: chunkDuration,
          priority: task.priority,
          difficulty: task.difficulty,
          isSubtask: false,
          order: i,
          isOverdue,
          hasNoDeadline,
        });
      }
    } else {
      candidates.push({
        taskId: task.id,
        title: task.title,
        subject: task.subject,
        deadline: task.deadline,
        durationMinutes: task.estimatedDurationMinutes || 45,
        priority: task.priority,
        difficulty: task.difficulty,
        isSubtask: false,
        order: 1,
        isOverdue,
        hasNoDeadline,
      });
    }
  }

  // Step 2: Sort candidates by explainable academic priority
  candidates.sort((a, b) => {
    // 1. Overdue tasks first
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;

    // 2. Deadline proximity (tasks with valid deadlines due sooner come first)
    if (a.deadline && b.deadline) {
      if (a.deadline !== b.deadline) {
        return a.deadline.localeCompare(b.deadline);
      }
    } else if (a.deadline && !b.deadline) {
      return -1;
    } else if (!a.deadline && b.deadline) {
      return 1;
    }

    // 3. Priority weight (high > medium > low)
    const priorityWeights: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const pDiff = (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
    if (pDiff !== 0) return pDiff;

    // 4. Subtask ordering within same parent
    if (a.taskId === b.taskId) {
      return a.order - b.order;
    }

    // 5. Difficulty weight (hard tasks tackled earlier)
    const diffWeights: Record<string, number> = { hard: 3, medium: 2, easy: 1 };
    return (diffWeights[b.difficulty] || 0) - (diffWeights[a.difficulty] || 0);
  });

  // Step 3: Iterate through days in window and assign study sessions
  let currentDate = new Date(start);
  let totalAvailableMinutes = 0;
  let orderCounter = 1;

  // Track dates and remaining daily study capacity
  const remainingCandidates = [...candidates];

  while (currentDate <= end) {
    const dayStr = formatDateISO(currentDate);
    const dayOfWeek = DAY_INDEX_MAP[currentDate.getDay()];
    const dayConfig = availability.days[dayOfWeek];

    if (dayConfig && dayConfig.enabled) {
      const windowStartMins = timeToMinutes(dayConfig.startTime);
      const windowEndMins = timeToMinutes(dayConfig.endTime);
      const windowCapacity = Math.max(0, windowEndMins - windowStartMins);

      // Daily capacity is capped by maxDailyMinutes and global maxDailyStudyMinutes
      const dailyCap = Math.min(
        dayConfig.maxDailyMinutes,
        availability.maxDailyStudyMinutes,
        windowCapacity
      );

      totalAvailableMinutes += dailyCap;

      let scheduledMinutesToday = 0;
      let currentClockMinutes = windowStartMins;

      // Fill day's capacity with candidate items
      let i = 0;
      while (i < remainingCandidates.length) {
        const item = remainingCandidates[i];
        const canFit = scheduledMinutesToday + item.durationMinutes <= dailyCap;
        const fitsInWindow = currentClockMinutes + item.durationMinutes <= windowEndMins;

        if (canFit && fitsInWindow) {
          // Check if scheduled after deadline
          if (item.deadline && dayStr > item.deadline) {
            warnings.push({
              id: `warn-late-${item.taskId}-${orderCounter}`,
              type: "deadline_risk",
              severity: "medium",
              taskId: item.taskId,
              date: dayStr,
              message: `"${item.title}" is scheduled on ${dayStr}, which is after its deadline (${item.deadline}). Consider extending daily study availability.`,
            });
          }

          const sessionStartTime = minutesToTime(currentClockMinutes);
          const sessionEndTime = minutesToTime(currentClockMinutes + item.durationMinutes);

          sessions.push({
            id: `session-${item.taskId}-${item.subtaskId || "t"}-${orderCounter}`,
            taskId: item.taskId,
            subtaskId: item.subtaskId,
            title: item.title,
            parentTaskTitle: item.parentTaskTitle,
            subject: item.subject,
            date: dayStr,
            startTime: sessionStartTime,
            endTime: sessionEndTime,
            durationMinutes: item.durationMinutes,
            priority: item.priority,
            difficulty: item.difficulty,
            status: "scheduled",
            deadline: item.deadline,
            isSubtask: item.isSubtask,
            orderIndex: orderCounter++,
          });

          scheduledMinutesToday += item.durationMinutes;
          // Advance clock by session duration + break duration
          currentClockMinutes += item.durationMinutes + (availability.preferredBreakDurationMinutes || 10);

          // Remove scheduled candidate
          remainingCandidates.splice(i, 1);
        } else {
          // Cannot fit this candidate today, check next candidate or wait for next day
          i++;
        }
      }
    }

    // Move to next calendar day
    currentDate = addDays(currentDate, 1);
  }

  // Step 4: Handle unscheduled tasks
  for (const unassigned of remainingCandidates) {
    unscheduledTasks.push({
      taskId: unassigned.taskId,
      subtaskId: unassigned.subtaskId,
      title: unassigned.title,
      subject: unassigned.subject,
      reason: unassigned.isOverdue
        ? "Deadline passed before planning period; needs rescheduled deadline."
        : "Available study time within planning window was exhausted. Increase daily study hours or extend the date range.",
      estimatedDurationMinutes: unassigned.durationMinutes,
      deadline: unassigned.deadline,
      priority: unassigned.priority,
      difficulty: unassigned.difficulty,
      isOverdue: unassigned.isOverdue,
      hasNoDeadline: unassigned.hasNoDeadline,
    });
  }

  // Step 5: Generate overall explainability statements
  if (sessions.length > 0) {
    explanations.push({
      id: "exp-priorities",
      category: "priority",
      title: "Deadlines & Priority Balancing",
      detail: "Urgent assignments and high-priority deliverables were prioritized for earlier slots in your schedule.",
    });

    explanations.push({
      id: "exp-daily-limits",
      category: "workload",
      title: "Sustainable Daily Study Caps",
      detail: `Daily study time is strictly capped at ${availability.maxDailyStudyMinutes} minutes with ${availability.preferredBreakDurationMinutes}-minute recharge buffers to prevent academic burnout.`,
    });
  }

  if (unscheduledTasks.length > 0) {
    warnings.push({
      id: "warn-unscheduled",
      type: "overload",
      severity: "medium",
      message: `${unscheduledTasks.length} task session(s) could not fit within the current study window without exceeding your configured limits.`,
    });
  }

  const totalPlannedMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  return {
    id: `plan-${Date.now()}`,
    status: "draft",
    startDate: activeStartDateStr,
    endDate: activeEndDateStr,
    sessions,
    unscheduledTasks,
    warnings,
    explanations,
    totalPlannedMinutes,
    totalAvailableMinutes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/* ─────────────────────────────────────────────────────────────
 * Phase 8: Trigger Detection Engine
 * ───────────────────────────────────────────────────────────── */

/**
 * Evaluates whether the active accepted plan needs adjustment.
 * Checks for:
 * 1. Incomplete sessions (student marked a session incomplete or unfinished)
 * 2. Availability changes (sessions booked on newly disabled days or exceeding caps)
 * 3. Deadline shifts (deliverable deadlines moved closer than scheduled dates)
 * 4. New high-priority tasks (active high priority task not in plan)
 */
export function detectPlanAdjustmentTriggers({
  acceptedPlan,
  tasks,
  availability,
  dismissedTriggerIds = [],
}: {
  acceptedPlan: StudyPlan | null;
  tasks: Task[];
  availability: AvailabilityPreferences;
  dismissedTriggerIds?: string[];
}): PlanAdjustmentTrigger | null {
  if (!acceptedPlan || acceptedPlan.sessions.length === 0) return null;

  // 1. Check for incomplete sessions
  const incompleteSession = acceptedPlan.sessions.find(
    (s) => s.status === "incomplete"
  );
  if (incompleteSession) {
    const triggerId = `trigger-incomplete-${incompleteSession.id}`;
    if (!dismissedTriggerIds.includes(triggerId)) {
      const remainingMins = incompleteSession.remainingMinutes || incompleteSession.durationMinutes;
      return {
        id: triggerId,
        type: "incomplete_session",
        title: "Incomplete Session Needs Rescheduling",
        description: `"${incompleteSession.title}" was marked incomplete with ~${remainingMins}m of work left to finish. Let's find a comfortable slot to reschedule it.`,
        detectedAt: new Date().toISOString(),
        affectedSessionId: incompleteSession.id,
        affectedTaskId: incompleteSession.taskId,
        remainingMinutes: remainingMins,
      };
    }
  }

  // 2. Check for availability conflicts
  for (const session of acceptedPlan.sessions) {
    if (session.status === "completed") continue;
    const sessionDate = parseDateISO(session.date);
    const dayOfWeek = DAY_INDEX_MAP[sessionDate.getDay()];
    const dayConfig = availability.days[dayOfWeek];

    if (!dayConfig || !dayConfig.enabled) {
      const triggerId = `trigger-avail-disabled-${session.date}`;
      if (!dismissedTriggerIds.includes(triggerId)) {
        return {
          id: triggerId,
          type: "availability_changed",
          title: "Study Availability Changed",
          description: `You have active study sessions booked on ${dayConfig ? dayConfig.label : "a day"} (${session.date}), which is currently marked as a rest day.`,
          detectedAt: new Date().toISOString(),
        };
      }
    }
  }

  // 3. Check for deadline changes on active tasks
  for (const session of acceptedPlan.sessions) {
    if (session.status === "completed") continue;
    const matchedTask = tasks.find((t) => t.id === session.taskId);
    if (matchedTask && matchedTask.deadline && session.date > matchedTask.deadline) {
      const triggerId = `trigger-deadline-${session.taskId}-${matchedTask.deadline}`;
      if (!dismissedTriggerIds.includes(triggerId)) {
        return {
          id: triggerId,
          type: "deadline_changed",
          title: "Deadline Risk Detected",
          description: `"${session.title}" is currently scheduled on ${session.date}, but its deadline is ${matchedTask.deadline}.`,
          detectedAt: new Date().toISOString(),
          affectedTaskId: session.taskId,
        };
      }
    }
  }

  // 4. Check for new high-priority tasks not scheduled
  const scheduledTaskIds = new Set(acceptedPlan.sessions.map((s) => s.taskId));
  const newHighPriorityTask = tasks.find(
    (t) =>
      t.status !== "completed" &&
      t.priority === "high" &&
      !scheduledTaskIds.has(t.id)
  );

  if (newHighPriorityTask) {
    const triggerId = `trigger-new-task-${newHighPriorityTask.id}`;
    if (!dismissedTriggerIds.includes(triggerId)) {
      return {
        id: triggerId,
        type: "new_high_priority_task",
        title: "New High-Priority Assignment Added",
        description: `"${newHighPriorityTask.title}" (${newHighPriorityTask.subject}) is a high-priority deliverable that has not yet been scheduled.`,
        detectedAt: new Date().toISOString(),
        affectedTaskId: newHighPriorityTask.id,
      };
    }
  }

  return null;
}

/* ─────────────────────────────────────────────────────────────
 * Phase 8: Adaptive Replanning Engine
 * ───────────────────────────────────────────────────────────── */

/**
 * Re-plans an active study schedule adaptively:
 * - Freezes already completed sessions on their original dates/times.
 * - Extracts incomplete sessions and remaining task work.
 * - Fits remaining work into available capacity without exceeding daily limits.
 * - Computes a full PlanComparisonDiff for student review.
 */
export function generateAdaptivePlan({
  currentPlan,
  tasks,
  breakdowns,
  availability,
  trigger,
}: {
  currentPlan: StudyPlan;
  tasks: Task[];
  breakdowns: Record<string, TaskBreakdown>;
  availability: AvailabilityPreferences;
  trigger?: PlanAdjustmentTrigger | null;
}): ProposedRevisedPlan {
  // 1. Separate completed sessions (frozen history) and incomplete sessions
  const completedSessions = currentPlan.sessions.filter((s) => s.status === "completed");
  const incompleteSessions = currentPlan.sessions.filter((s) => s.status === "incomplete");

  // Track completed minutes per task to avoid duplicating completed work
  const completedMinutesByTask: Record<string, number> = {};
  const completedSubtaskIds = new Set<string>();

  for (const cs of completedSessions) {
    completedMinutesByTask[cs.taskId] = (completedMinutesByTask[cs.taskId] || 0) + cs.durationMinutes;
    if (cs.subtaskId) {
      completedSubtaskIds.add(cs.subtaskId);
    }
  }

  // 2. Identify remaining work to be scheduled
  const candidates: ScheduleCandidate[] = [];

  // A. First priority: Re-schedule incomplete sessions
  for (const inc of incompleteSessions) {
    const remMins = inc.remainingMinutes || inc.durationMinutes;
    candidates.push({
      taskId: inc.taskId,
      subtaskId: inc.subtaskId,
      title: `${inc.title} (Continuation)`,
      parentTaskTitle: inc.parentTaskTitle,
      subject: inc.subject,
      deadline: inc.deadline,
      durationMinutes: remMins,
      priority: inc.priority,
      difficulty: inc.difficulty,
      isSubtask: inc.isSubtask,
      order: inc.orderIndex,
      isOverdue: Boolean(inc.deadline && inc.deadline < currentPlan.startDate),
      hasNoDeadline: !inc.deadline,
    });
  }

  // B. For all active tasks, schedule remaining work not already covered by completed sessions
  for (const task of tasks) {
    if (task.status === "completed") continue; // Never schedule completed tasks

    const isOverdue = Boolean(task.deadline && task.deadline < currentPlan.startDate);
    const hasNoDeadline = !task.deadline || task.deadline.trim() === "";
    const breakdown = breakdowns[task.id];

    if (breakdown && breakdown.subtasks.length > 0) {
      // Find pending subtasks that haven't been completed in history
      const remainingSubtasks = breakdown.subtasks.filter(
        (st) => st.status !== "completed" && !completedSubtaskIds.has(st.id)
      );

      for (const st of remainingSubtasks) {
        // Check if this subtask was already queued from incompleteSessions above
        const alreadyQueued = candidates.some((c) => c.subtaskId === st.id);
        if (!alreadyQueued) {
          candidates.push({
            taskId: task.id,
            subtaskId: st.id,
            title: st.title,
            parentTaskTitle: task.title,
            subject: task.subject,
            deadline: task.deadline,
            durationMinutes: st.estimatedDurationMinutes || 30,
            priority: task.priority,
            difficulty: task.difficulty,
            isSubtask: true,
            order: st.order,
            isOverdue,
            hasNoDeadline,
          });
        }
      }
    } else {
      // Task without subtasks: calculate remaining duration
      const alreadyCompleted = completedMinutesByTask[task.id] || 0;
      const remainingMinutes = Math.max(0, task.estimatedDurationMinutes - alreadyCompleted);

      // Check if already queued from incompleteSessions
      const alreadyQueued = candidates.some((c) => c.taskId === task.id);
      if (!alreadyQueued && remainingMinutes > 0) {
        const maxFocusBlock = availability.preferredSessionDurationMinutes || 45;
        if (remainingMinutes > maxFocusBlock * 1.5 && remainingMinutes >= 75) {
          const numSessions = Math.ceil(remainingMinutes / maxFocusBlock);
          const chunkDuration = Math.round(remainingMinutes / numSessions);

          for (let i = 1; i <= numSessions; i++) {
            candidates.push({
              taskId: task.id,
              title: `${task.title} (Part ${i} of ${numSessions})`,
              parentTaskTitle: task.title,
              subject: task.subject,
              deadline: task.deadline,
              durationMinutes: chunkDuration,
              priority: task.priority,
              difficulty: task.difficulty,
              isSubtask: false,
              order: i,
              isOverdue,
              hasNoDeadline,
            });
          }
        } else {
          candidates.push({
            taskId: task.id,
            title: task.title,
            subject: task.subject,
            deadline: task.deadline,
            durationMinutes: remainingMinutes,
            priority: task.priority,
            difficulty: task.difficulty,
            isSubtask: false,
            order: 1,
            isOverdue,
            hasNoDeadline,
          });
        }
      }
    }
  }

  // 3. Sort candidates by academic priority
  candidates.sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;

    if (a.deadline && b.deadline) {
      if (a.deadline !== b.deadline) return a.deadline.localeCompare(b.deadline);
    } else if (a.deadline && !b.deadline) {
      return -1;
    } else if (!a.deadline && b.deadline) {
      return 1;
    }

    const priorityWeights: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const pDiff = (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
    if (pDiff !== 0) return pDiff;

    if (a.taskId === b.taskId) return a.order - b.order;

    const diffWeights: Record<string, number> = { hard: 3, medium: 2, easy: 1 };
    return (diffWeights[b.difficulty] || 0) - (diffWeights[a.difficulty] || 0);
  });

  // 4. Allocate newly scheduled sessions around frozen completed sessions
  const start = parseDateISO(currentPlan.startDate);
  const end = parseDateISO(currentPlan.endDate);

  const revisedSessions: PlannedSession[] = [...completedSessions.map(cs => ({ ...cs, diffTag: "unchanged" as const }))];
  const unscheduledTasks: UnscheduledTask[] = [];
  const warnings: PlanWarning[] = [];
  const explanations: PlanExplanation[] = [];

  let currentDate = new Date(start);
  let totalAvailableMinutes = 0;
  let orderCounter = completedSessions.length + 1;
  const remainingCandidates = [...candidates];

  while (currentDate <= end) {
    const dayStr = formatDateISO(currentDate);
    const dayOfWeek = DAY_INDEX_MAP[currentDate.getDay()];
    const dayConfig = availability.days[dayOfWeek];

    if (dayConfig && dayConfig.enabled) {
      const windowStartMins = timeToMinutes(dayConfig.startTime);
      const windowEndMins = timeToMinutes(dayConfig.endTime);
      const windowCapacity = Math.max(0, windowEndMins - windowStartMins);

      const dailyCap = Math.min(
        dayConfig.maxDailyMinutes,
        availability.maxDailyStudyMinutes,
        windowCapacity
      );

      totalAvailableMinutes += dailyCap;

      // Minutes already used by frozen completed sessions on this day
      const alreadyUsedOnDay = completedSessions
        .filter((cs) => cs.date === dayStr)
        .reduce((sum, cs) => sum + cs.durationMinutes, 0);

      let scheduledMinutesToday = alreadyUsedOnDay;
      let currentClockMinutes = windowStartMins;

      // If completed sessions existed, advance clock past them
      const completedOnDay = completedSessions.filter((cs) => cs.date === dayStr);
      if (completedOnDay.length > 0) {
        const latestCompletedEnd = Math.max(
          ...completedOnDay.map((cs) => timeToMinutes(cs.endTime))
        );
        currentClockMinutes = Math.max(currentClockMinutes, latestCompletedEnd + (availability.preferredBreakDurationMinutes || 10));
      }

      let i = 0;
      while (i < remainingCandidates.length) {
        const item = remainingCandidates[i];
        const canFit = scheduledMinutesToday + item.durationMinutes <= dailyCap;
        const fitsInWindow = currentClockMinutes + item.durationMinutes <= windowEndMins;

        if (canFit && fitsInWindow) {
          if (item.deadline && dayStr > item.deadline) {
            warnings.push({
              id: `warn-late-${item.taskId}-${orderCounter}`,
              type: "deadline_risk",
              severity: "high",
              taskId: item.taskId,
              date: dayStr,
              message: `"${item.title}" rescheduled for ${dayStr}, which is past its deadline (${item.deadline}).`,
            });
          }

          const sessionStartTime = minutesToTime(currentClockMinutes);
          const sessionEndTime = minutesToTime(currentClockMinutes + item.durationMinutes);

          revisedSessions.push({
            id: `session-revised-${item.taskId}-${item.subtaskId || "t"}-${orderCounter}`,
            taskId: item.taskId,
            subtaskId: item.subtaskId,
            title: item.title,
            parentTaskTitle: item.parentTaskTitle,
            subject: item.subject,
            date: dayStr,
            startTime: sessionStartTime,
            endTime: sessionEndTime,
            durationMinutes: item.durationMinutes,
            priority: item.priority,
            difficulty: item.difficulty,
            status: "scheduled",
            deadline: item.deadline,
            isSubtask: item.isSubtask,
            orderIndex: orderCounter++,
            diffTag: "rescheduled",
          });

          scheduledMinutesToday += item.durationMinutes;
          currentClockMinutes += item.durationMinutes + (availability.preferredBreakDurationMinutes || 10);
          remainingCandidates.splice(i, 1);
        } else {
          i++;
        }
      }
    }

    currentDate = addDays(currentDate, 1);
  }

  // 5. Remaining unscheduled items
  for (const unassigned of remainingCandidates) {
    unscheduledTasks.push({
      taskId: unassigned.taskId,
      subtaskId: unassigned.subtaskId,
      title: unassigned.title,
      subject: unassigned.subject,
      reason: unassigned.isOverdue
        ? "Deadline passed; needs urgent reschedule."
        : "Could not fit within available study time without exceeding daily fatigue limits.",
      estimatedDurationMinutes: unassigned.durationMinutes,
      deadline: unassigned.deadline,
      priority: unassigned.priority,
      difficulty: unassigned.difficulty,
      isOverdue: unassigned.isOverdue,
      hasNoDeadline: unassigned.hasNoDeadline,
    });
  }

  // 6. Generate supportive, non-shaming explanations
  if (incompleteSessions.length > 0) {
    explanations.push({
      id: "exp-incomplete-reschedule",
      category: "workload",
      title: "Rescheduled Unfinished Work Comfortably",
      detail: `Adjusted your schedule to give you fresh time for unfinished exercises from "${incompleteSessions[0].title}", fitting it seamlessly alongside your upcoming deadlines.`,
    });
  }

  if (completedSessions.length > 0) {
    explanations.push({
      id: "exp-completed-preserved",
      category: "priority",
      title: "Preserved Completed Study Milestones",
      detail: `${completedSessions.length} completed session(s) were protected and kept on their original dates.`,
    });
  }

  explanations.push({
    id: "exp-limits-protected",
    category: "workload",
    title: "Respects Sustainable Daily Caps",
    detail: `Study blocks were kept under ${availability.maxDailyStudyMinutes} minutes/day to maintain high cognitive retention without overload.`,
  });

  const totalPlannedMinutes = revisedSessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  const revisedPlan: StudyPlan = {
    id: `plan-revised-${Date.now()}`,
    status: "draft",
    startDate: currentPlan.startDate,
    endDate: currentPlan.endDate,
    sessions: revisedSessions,
    unscheduledTasks,
    warnings,
    explanations,
    totalPlannedMinutes,
    totalAvailableMinutes,
    createdAt: currentPlan.createdAt,
    updatedAt: new Date().toISOString(),
  };

  // 7. Calculate Plan Comparison Diff
  const unchangedSessions: PlannedSession[] = [];
  const movedSessions: MovedSessionDiff[] = [];
  const addedSessions: PlannedSession[] = [];
  const removedSessions: PlannedSession[] = [];

  const previousSessionMap = new Map<string, PlannedSession>();
  for (const s of currentPlan.sessions) {
    previousSessionMap.set(`${s.taskId}-${s.subtaskId || "t"}`, s);
  }

  for (const rev of revisedSessions) {
    const prev = previousSessionMap.get(`${rev.taskId}-${rev.subtaskId || "t"}`);
    if (prev) {
      if (prev.date === rev.date && prev.startTime === rev.startTime && prev.status === rev.status) {
        rev.diffTag = "unchanged";
        unchangedSessions.push(rev);
      } else {
        rev.diffTag = "moved";
        movedSessions.push({
          previous: prev,
          current: rev,
          changeReason: prev.date !== rev.date
            ? `Shifted from ${prev.date} to ${rev.date} to balance daily limits`
            : `Time shifted from ${prev.startTime} to ${rev.startTime}`,
        });
      }
      previousSessionMap.delete(`${rev.taskId}-${rev.subtaskId || "t"}`);
    } else {
      rev.diffTag = "added";
      addedSessions.push(rev);
    }
  }

  // Any leftover previous sessions that weren't included were removed (e.g. task completed)
  previousSessionMap.forEach((prev) => {
    removedSessions.push(prev);
  });

  // Calculate daily hour differences
  const dailyHourChanges: Record<string, { previousMinutes: number; revisedMinutes: number }> = {};
  for (const s of currentPlan.sessions) {
    if (!dailyHourChanges[s.date]) {
      dailyHourChanges[s.date] = { previousMinutes: 0, revisedMinutes: 0 };
    }
    dailyHourChanges[s.date].previousMinutes += s.durationMinutes;
  }
  for (const s of revisedSessions) {
    if (!dailyHourChanges[s.date]) {
      dailyHourChanges[s.date] = { previousMinutes: 0, revisedMinutes: 0 };
    }
    dailyHourChanges[s.date].revisedMinutes += s.durationMinutes;
  }

  const comparison: PlanComparisonDiff = {
    unchangedSessions,
    movedSessions,
    addedSessions,
    removedSessions,
    dailyHourChanges,
    deadlineRisks: warnings.filter((w) => w.type === "deadline_risk"),
  };

  const finalTrigger: PlanAdjustmentTrigger = trigger || {
    id: `trigger-auto-${Date.now()}`,
    type: "session_overrun",
    title: "Schedule Recalibration",
    description: "Re-allocated remaining deliverables across your study week.",
    detectedAt: new Date().toISOString(),
  };

  return {
    plan: revisedPlan,
    trigger: finalTrigger,
    comparison,
  };
}

/* ─────────────────────────────────────────────────────────────
 * Phase 8: What-If Simulation Engine
 * ───────────────────────────────────────────────────────────── */

/**
 * Runs a hypothetical simulation without modifying the real plan or tasks.
 */
export function runWhatIfSimulation({
  currentPlan,
  tasks,
  breakdowns,
  availability,
  parameters,
}: {
  currentPlan: StudyPlan;
  tasks: Task[];
  breakdowns: Record<string, TaskBreakdown>;
  availability: AvailabilityPreferences;
  parameters: WhatIfParameters;
}): SimulationResult {
  // Deep clone inputs
  const simTasks = tasks.map((t) => ({ ...t }));
  const simAvailability: AvailabilityPreferences = {
    ...availability,
    days: { ...availability.days },
  };

  let impactSummary = "";

  switch (parameters.scenario) {
    case "reduce_availability": {
      const targetDateStr = parameters.targetDate || currentPlan.startDate;
      const targetDateObj = parseDateISO(targetDateStr);
      const dayOfWeek = DAY_INDEX_MAP[targetDateObj.getDay()];
      const dayConfig = simAvailability.days[dayOfWeek];

      if (dayConfig) {
        const reduction = parameters.reducedMinutes || 60;
        const newCap = Math.max(0, dayConfig.maxDailyMinutes - reduction);
        simAvailability.days[dayOfWeek] = {
          ...dayConfig,
          maxDailyMinutes: newCap,
        };
        impactSummary = `Reduced study time on ${dayConfig.label} (${targetDateStr}) by ${reduction} minutes.`;
      }
      break;
    }

    case "add_task": {
      const dur = parameters.simulatedTaskDurationMinutes || 90;
      const simTask: Task = {
        id: `sim-task-${Date.now()}`,
        title: parameters.simulatedTaskTitle || "Hypothetical Project Assignment",
        subject: parameters.simulatedTaskSubject || "Computer Networks",
        deadline: parameters.simulatedTaskDeadline || currentPlan.endDate,
        estimatedDurationMinutes: dur,
        difficulty: "hard",
        priority: parameters.simulatedTaskPriority || "high",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      simTasks.push(simTask);
      impactSummary = `Simulated adding a new ${dur}m assignment due ${simTask.deadline}.`;
      break;
    }

    case "change_deadline": {
      if (parameters.selectedTaskId && parameters.newDeadline) {
        const target = simTasks.find((t) => t.id === parameters.selectedTaskId);
        if (target) {
          const oldDeadline = target.deadline;
          target.deadline = parameters.newDeadline;
          impactSummary = `Moved "${target.title}" deadline earlier from ${oldDeadline} to ${parameters.newDeadline}.`;
        }
      }
      break;
    }

    case "task_duration_increase": {
      if (parameters.selectedTaskId) {
        const target = simTasks.find((t) => t.id === parameters.selectedTaskId);
        if (target) {
          const mult = parameters.durationMultiplier || 1.5;
          const newDur = Math.round(target.estimatedDurationMinutes * mult);
          const diff = newDur - target.estimatedDurationMinutes;
          target.estimatedDurationMinutes = newDur;
          impactSummary = `Increased "${target.title}" duration estimate by ${diff}m (${Math.round((mult - 1) * 100)}% increase).`;
        }
      }
      break;
    }
  }

  // Run the scheduler on simulated inputs
  const simulatedPlan = generateStudyPlan({
    tasks: simTasks,
    breakdowns,
    availability: simAvailability,
    startDateStr: currentPlan.startDate,
    endDateStr: currentPlan.endDate,
  });

  const netMinuteDifference = simulatedPlan.totalPlannedMinutes - currentPlan.totalPlannedMinutes;

  let feasibility: "feasible" | "tight" | "overloaded" = "feasible";
  const newDeadlineRisks: string[] = [];

  for (const w of simulatedPlan.warnings) {
    if (w.type === "deadline_risk") {
      newDeadlineRisks.push(w.message);
    }
  }

  if (simulatedPlan.unscheduledTasks.length > 0 || newDeadlineRisks.length > 0) {
    feasibility = "overloaded";
  } else if (simulatedPlan.totalPlannedMinutes > simulatedPlan.totalAvailableMinutes * 0.85) {
    feasibility = "tight";
  }

  return {
    simulatedPlan,
    impactSummary,
    feasibility,
    netMinuteDifference,
    newDeadlineRisks,
  };
}

