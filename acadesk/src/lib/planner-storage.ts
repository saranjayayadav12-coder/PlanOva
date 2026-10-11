/**
 * lib/planner-storage.ts
 *
 * Dedicated local storage persistence for study availability preferences
 * and accepted/draft study plans.
 *
 * Keys:
 * - "acadesk.planner_availability.v1"
 * - "acadesk.planner_plan.v1"
 *
 * Features:
 * - SSR hydration safe (checks typeof window !== "undefined")
 * - Schema validation for stored models
 * - Fallbacks gracefully on corrupt/empty data
 * - Quota error & private browsing protections
 */

import {
  AvailabilityPreferences,
  StudyPlan,
  PlannedSession,
  AdaptationHistoryEvent,
} from "@/types/planner";

export const AVAILABILITY_STORAGE_KEY = "acadesk.planner_availability.v1";
export const PLAN_STORAGE_KEY = "acadesk.planner_plan.v1";
export const HISTORY_STORAGE_KEY = "acadesk.planner_history.v1";
export const DISMISSED_TRIGGERS_KEY = "acadesk.planner_dismissed_triggers.v1";

/**
 * Sensible, realistic default study availability.
 * Weekdays 3 hours, Saturday 2 hours, Sunday off.
 */
export const DEFAULT_AVAILABILITY: AvailabilityPreferences = {
  days: {
    monday: {
      day: "monday",
      label: "Monday",
      enabled: true,
      startTime: "09:00",
      endTime: "17:00",
      maxDailyMinutes: 180,
    },
    tuesday: {
      day: "tuesday",
      label: "Tuesday",
      enabled: true,
      startTime: "09:00",
      endTime: "17:00",
      maxDailyMinutes: 180,
    },
    wednesday: {
      day: "wednesday",
      label: "Wednesday",
      enabled: true,
      startTime: "09:00",
      endTime: "17:00",
      maxDailyMinutes: 180,
    },
    thursday: {
      day: "thursday",
      label: "Thursday",
      enabled: true,
      startTime: "09:00",
      endTime: "17:00",
      maxDailyMinutes: 180,
    },
    friday: {
      day: "friday",
      label: "Friday",
      enabled: true,
      startTime: "09:00",
      endTime: "16:00",
      maxDailyMinutes: 150,
    },
    saturday: {
      day: "saturday",
      label: "Saturday",
      enabled: true,
      startTime: "10:00",
      endTime: "14:00",
      maxDailyMinutes: 120,
    },
    sunday: {
      day: "sunday",
      label: "Sunday",
      enabled: false,
      startTime: "10:00",
      endTime: "14:00",
      maxDailyMinutes: 0,
    },
  },
  preferredSessionDurationMinutes: 45,
  preferredBreakDurationMinutes: 15,
  maxDailyStudyMinutes: 180,
  updatedAt: "2026-10-10T00:00:00.000Z",
};

export interface StoredPlans {
  acceptedPlan: StudyPlan | null;
  draftPlan: StudyPlan | null;
}

const DEFAULT_STORED_PLANS: StoredPlans = {
  acceptedPlan: null,
  draftPlan: null,
};

/**
 * Load availability preferences from localStorage.
 */
export function loadAvailabilityFromStorage(): AvailabilityPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_AVAILABILITY;
  }

  try {
    const raw = window.localStorage.getItem(AVAILABILITY_STORAGE_KEY);
    if (!raw) return DEFAULT_AVAILABILITY;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.days) {
      return DEFAULT_AVAILABILITY;
    }

    return {
      days: {
        ...DEFAULT_AVAILABILITY.days,
        ...parsed.days,
      },
      preferredSessionDurationMinutes:
        typeof parsed.preferredSessionDurationMinutes === "number" &&
        parsed.preferredSessionDurationMinutes > 0
          ? parsed.preferredSessionDurationMinutes
          : DEFAULT_AVAILABILITY.preferredSessionDurationMinutes,
      preferredBreakDurationMinutes:
        typeof parsed.preferredBreakDurationMinutes === "number" &&
        parsed.preferredBreakDurationMinutes >= 0
          ? parsed.preferredBreakDurationMinutes
          : DEFAULT_AVAILABILITY.preferredBreakDurationMinutes,
      maxDailyStudyMinutes:
        typeof parsed.maxDailyStudyMinutes === "number" &&
        parsed.maxDailyStudyMinutes > 0
          ? parsed.maxDailyStudyMinutes
          : DEFAULT_AVAILABILITY.maxDailyStudyMinutes,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.warn("Acadesk: Failed to load planner availability from storage, falling back to defaults.", err);
    return DEFAULT_AVAILABILITY;
  }
}

/**
 * Save availability preferences to localStorage.
 */
export function saveAvailabilityToStorage(avail: AvailabilityPreferences): boolean {
  if (typeof window === "undefined") return false;

  try {
    const serialized = JSON.stringify(avail);
    window.localStorage.setItem(AVAILABILITY_STORAGE_KEY, serialized);
    return true;
  } catch (err) {
    console.error("Acadesk: Could not write planner availability to localStorage.", err);
    return false;
  }
}

/**
 * Normalizes a StudyPlan by ensuring:
 * 1. Every distinct session has a unique, stable ID.
 * 2. Exact identical duplicates (same session mistakenly inserted twice) are deduplicated.
 * 3. Legitimate distinct sessions with collided IDs are disambiguated with stable, unique IDs.
 * 4. Preserves legitimate sessions, completion states, and plan metadata.
 */
export function normalizeStudyPlan(plan: StudyPlan | null): StudyPlan | null {
  if (!plan || !Array.isArray(plan.sessions)) {
    return plan;
  }

  const seenSessionSignatures = new Set<string>();
  const seenIds = new Set<string>();
  const normalizedSessions: PlannedSession[] = [];
  let modified = false;

  for (let i = 0; i < plan.sessions.length; i++) {
    const session = plan.sessions[i];
    if (!session || typeof session !== "object") continue;

    // Signature to identify exact identical duplicates (same session inserted twice)
    const signature = `${session.id}__${session.taskId}__${session.subtaskId || ""}__${session.date}__${session.startTime}__${session.endTime}__${session.status}__${session.title}__${session.durationMinutes}`;

    if (seenSessionSignatures.has(signature)) {
      // Exact identical clone already present; safely skip duplicate insertion
      modified = true;
      continue;
    }
    seenSessionSignatures.add(signature);

    let finalId = session.id;
    if (seenIds.has(finalId)) {
      modified = true;
      // Legitimate distinct session that received a colliding ID; disambiguate safely
      let counter = 1;
      let candidateId = `${session.id}-s${session.orderIndex || i + 1}`;
      while (seenIds.has(candidateId)) {
        candidateId = `${session.id}-dup${counter++}`;
      }
      finalId = candidateId;
    }

    seenIds.add(finalId);
    if (finalId !== session.id) {
      normalizedSessions.push({
        ...session,
        id: finalId,
      });
    } else {
      normalizedSessions.push(session);
    }
  }

  if (!modified && normalizedSessions.length === plan.sessions.length) {
    return plan;
  }

  const totalPlannedMinutes = normalizedSessions.reduce(
    (acc, s) => acc + (s.durationMinutes || 0),
    0
  );

  return {
    ...plan,
    sessions: normalizedSessions,
    totalPlannedMinutes,
  };
}

/**
 * Load study plans (accepted and draft) from localStorage.
 */
export function loadPlansFromStorage(): StoredPlans {
  if (typeof window === "undefined") {
    return DEFAULT_STORED_PLANS;
  }

  try {
    const raw = window.localStorage.getItem(PLAN_STORAGE_KEY);
    if (!raw) return DEFAULT_STORED_PLANS;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return DEFAULT_STORED_PLANS;
    }

    const rawAccepted = parsed.acceptedPlan && Array.isArray(parsed.acceptedPlan.sessions) ? parsed.acceptedPlan : null;
    const rawDraft = parsed.draftPlan && Array.isArray(parsed.draftPlan.sessions) ? parsed.draftPlan : null;

    const acceptedPlan = normalizeStudyPlan(rawAccepted);
    const draftPlan = normalizeStudyPlan(rawDraft);

    // If normalization migrated legacy data with duplicate IDs, update localStorage safely
    if (
      (acceptedPlan && acceptedPlan !== rawAccepted) ||
      (draftPlan && draftPlan !== rawDraft)
    ) {
      savePlansToStorage({ acceptedPlan, draftPlan });
    }

    return {
      acceptedPlan,
      draftPlan,
    };
  } catch (err) {
    console.warn("Acadesk: Failed to load plans from storage, resetting to empty state.", err);
    return DEFAULT_STORED_PLANS;
  }
}

/**
 * Save study plans (accepted and draft) to localStorage.
 */
export function savePlansToStorage(plans: StoredPlans): boolean {
  if (typeof window === "undefined") return false;

  try {
    const normalizedPlans: StoredPlans = {
      acceptedPlan: normalizeStudyPlan(plans.acceptedPlan),
      draftPlan: normalizeStudyPlan(plans.draftPlan),
    };
    const serialized = JSON.stringify(normalizedPlans);
    window.localStorage.setItem(PLAN_STORAGE_KEY, serialized);
    return true;
  } catch (err) {
    console.error("Acadesk: Could not write study plans to localStorage.", err);
    return false;
  }
}

/**
 * Default sample adaptation events for initial view
 */
export const DEFAULT_HISTORY_EVENTS: AdaptationHistoryEvent[] = [
  {
    id: "hist-101",
    type: "plan_created",
    title: "Initial Semester Plan Formed",
    summary: "Balanced schedule generated for mid-October assignments across OS, Linear Algebra, and Data Structures.",
    timestamp: "2026-10-10T10:00:00.000Z",
  },
  {
    id: "hist-102",
    type: "plan_accepted",
    title: "Active Study Schedule Activated",
    summary: "Accepted 7-day study plan with 45-minute focus intervals and 15-minute breaks.",
    timestamp: "2026-10-10T10:05:00.000Z",
  },
];

/**
 * Load adaptation history from localStorage.
 */
export function loadHistoryFromStorage(): AdaptationHistoryEvent[] {
  if (typeof window === "undefined") {
    return DEFAULT_HISTORY_EVENTS;
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return DEFAULT_HISTORY_EVENTS;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_HISTORY_EVENTS;

    return parsed.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.type === "string"
    );
  } catch (err) {
    console.warn("Acadesk: Failed to load adaptation history, falling back to defaults.", err);
    return DEFAULT_HISTORY_EVENTS;
  }
}

/**
 * Save adaptation history to localStorage.
 */
export function saveHistoryToStorage(events: AdaptationHistoryEvent[]): boolean {
  if (typeof window === "undefined") return false;

  try {
    const serialized = JSON.stringify(events);
    window.localStorage.setItem(HISTORY_STORAGE_KEY, serialized);
    return true;
  } catch (err) {
    console.error("Acadesk: Could not write adaptation history to localStorage.", err);
    return false;
  }
}

/**
 * Record a new adaptation history event.
 */
export function recordHistoryEvent(
  event: Omit<AdaptationHistoryEvent, "id" | "timestamp">
): AdaptationHistoryEvent[] {
  const current = loadHistoryFromStorage();
  const newEntry: AdaptationHistoryEvent = {
    ...event,
    id: `hist-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  const updated = [newEntry, ...current].slice(0, 30); // keep last 30 events
  saveHistoryToStorage(updated);
  return updated;
}

/**
 * Load dismissed trigger IDs to avoid repeating dismissed prompts.
 */
export function loadDismissedTriggers(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(DISMISSED_TRIGGERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Record a dismissed trigger ID.
 */
export function saveDismissedTrigger(triggerId: string): void {
  if (typeof window === "undefined") return;

  try {
    const current = loadDismissedTriggers();
    if (!current.includes(triggerId)) {
      const updated = [...current, triggerId].slice(-20);
      window.localStorage.setItem(DISMISSED_TRIGGERS_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn("Acadesk: Failed to persist dismissed trigger ID.", err);
  }
}

