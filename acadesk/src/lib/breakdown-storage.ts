import { TaskBreakdown, Subtask } from "@/types/subtask";

/**
 * breakdown-storage.ts
 *
 * Dedicated local storage persistence service for task breakdowns.
 * Key: "acadesk.breakdowns.v1"
 *
 * Storage schema: Record<string, TaskBreakdown> (keyed by taskId)
 */

export const BREAKDOWN_STORAGE_KEY = "acadesk.breakdowns.v1";

/**
 * Default sample breakdown for initial walkthrough experience (task-102).
 */
export const DEFAULT_BREAKDOWNS: Record<string, TaskBreakdown> = {
  "task-102": {
    taskId: "task-102",
    source: "ai_suggestion",
    createdAt: "2026-10-09T14:30:00.000Z",
    updatedAt: "2026-10-10T12:00:00.000Z",
    subtasks: [
      {
        id: "sub-102-1",
        title: "Review textbook definitions for eigenvalues and eigenvectors",
        description: "Study sections 4.1 and 4.2 in linear algebra textbook.",
        estimatedDurationMinutes: 15,
        order: 1,
        status: "completed",
        dependencyIds: [],
        createdAt: "2026-10-09T14:30:00.000Z",
        updatedAt: "2026-10-10T10:00:00.000Z",
      },
      {
        id: "sub-102-2",
        title: "Calculate characteristic polynomials for 3x3 matrices",
        description: "Solve det(A - lambda*I) = 0 for problem exercises 4.1 to 4.3.",
        estimatedDurationMinutes: 25,
        order: 2,
        status: "completed",
        dependencyIds: ["sub-102-1"],
        createdAt: "2026-10-09T14:30:00.000Z",
        updatedAt: "2026-10-10T11:30:00.000Z",
      },
      {
        id: "sub-102-3",
        title: "Solve eigenspaces and basis vectors for problems 4.4 - 4.7",
        description: "Row reduce (A - lambda*I)x = 0 to determine null space dimensions.",
        estimatedDurationMinutes: 25,
        order: 3,
        status: "pending",
        dependencyIds: ["sub-102-2"],
        createdAt: "2026-10-09T14:30:00.000Z",
        updatedAt: "2026-10-09T14:30:00.000Z",
      },
      {
        id: "sub-102-4",
        title: "Format clean handwritten proofs and check calculations",
        description: "Double check determinants and sign flips before scanning.",
        estimatedDurationMinutes: 10,
        order: 4,
        status: "pending",
        dependencyIds: ["sub-102-3"],
        createdAt: "2026-10-09T14:30:00.000Z",
        updatedAt: "2026-10-09T14:30:00.000Z",
      },
    ],
  },
};

function isValidSubtask(obj: unknown): obj is Subtask {
  if (!obj || typeof obj !== "object") return false;
  const s = obj as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.title === "string" &&
    typeof s.estimatedDurationMinutes === "number" &&
    typeof s.order === "number" &&
    ["pending", "completed"].includes(String(s.status)) &&
    Array.isArray(s.dependencyIds)
  );
}

function isValidBreakdown(obj: unknown): obj is TaskBreakdown {
  if (!obj || typeof obj !== "object") return false;
  const b = obj as Record<string, unknown>;
  return (
    typeof b.taskId === "string" &&
    Array.isArray(b.subtasks) &&
    b.subtasks.every(isValidSubtask)
  );
}

/**
 * Safely loads breakdowns from localStorage.
 */
export function loadBreakdownsFromStorage(): Record<string, TaskBreakdown> {
  if (typeof window === "undefined") {
    return DEFAULT_BREAKDOWNS;
  }

  try {
    const raw = window.localStorage.getItem(BREAKDOWN_STORAGE_KEY);
    if (!raw) {
      saveBreakdownsToStorage(DEFAULT_BREAKDOWNS);
      return DEFAULT_BREAKDOWNS;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return DEFAULT_BREAKDOWNS;
    }

    const validated: Record<string, TaskBreakdown> = {};
    for (const [key, val] of Object.entries(parsed)) {
      if (isValidBreakdown(val)) {
        validated[key] = val;
      }
    }

    return Object.keys(validated).length > 0 ? validated : DEFAULT_BREAKDOWNS;
  } catch (error) {
    console.error("Failed to load breakdowns from localStorage:", error);
    return DEFAULT_BREAKDOWNS;
  }
}

/**
 * Safely saves breakdowns to localStorage.
 */
export function saveBreakdownsToStorage(
  breakdowns: Record<string, TaskBreakdown>
): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(
      BREAKDOWN_STORAGE_KEY,
      JSON.stringify(breakdowns)
    );
    return true;
  } catch (error) {
    console.error("Failed to save breakdowns to localStorage:", error);
    return false;
  }
}
