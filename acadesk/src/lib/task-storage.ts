import { Task } from "@/types/task";

/**
 * task-storage.ts
 *
 * Dedicated local storage service for task persistence.
 * Key: "acadesk.tasks.v1"
 *
 * Features:
 * - SSR safe (checks typeof window !== "undefined")
 * - Validates schema of stored items
 * - Fallbacks gracefully to default seed tasks on empty / corrupted state
 * - Protects against storage quota or permission errors
 */

export const STORAGE_KEY = "acadesk.tasks.v1";

/**
 * Default sample tasks provided on first run experience.
 * Fully editable and removable by the student.
 */
export const DEFAULT_TASKS: Task[] = [
  {
    id: "task-101",
    title: "Review Virtual Memory & Paging lecture notes",
    description: "Go over TLB misses, page table structures, and inverted page tables before tomorrow's seminar.",
    subject: "Operating Systems",
    deadline: "2026-10-10",
    estimatedDurationMinutes: 45,
    difficulty: "medium",
    priority: "high",
    status: "completed",
    createdAt: "2026-10-08T09:00:00.000Z",
    updatedAt: "2026-10-10T11:00:00.000Z",
  },
  {
    id: "task-102",
    title: "Draft Problem Set 4: Eigenvalues & Transformations",
    description: "Complete exercises 4.1 through 4.7. Verify characteristic polynomial solutions.",
    subject: "Linear Algebra",
    deadline: "2026-10-12",
    estimatedDurationMinutes: 75,
    difficulty: "hard",
    priority: "high",
    status: "in_progress",
    createdAt: "2026-10-09T14:30:00.000Z",
    updatedAt: "2026-10-10T12:00:00.000Z",
  },
  {
    id: "task-103",
    title: "Binary Search Tree traversal implementation",
    description: "Implement iterative and recursive in-order, pre-order, and post-order traversal algorithms in C++.",
    subject: "Data Structures",
    deadline: "2026-10-14",
    estimatedDurationMinutes: 90,
    difficulty: "hard",
    priority: "medium",
    status: "pending",
    createdAt: "2026-10-09T16:00:00.000Z",
    updatedAt: "2026-10-09T16:00:00.000Z",
  },
  {
    id: "task-104",
    title: "Source evaluation for term paper bibliography",
    description: "Find 4 peer-reviewed sources comparing microkernel vs monolithic performance benchmarks.",
    subject: "Academic Writing",
    deadline: "2026-10-10",
    estimatedDurationMinutes: 30,
    difficulty: "easy",
    priority: "low",
    status: "completed",
    createdAt: "2026-10-07T11:15:00.000Z",
    updatedAt: "2026-10-10T10:30:00.000Z",
  },
  {
    id: "task-105",
    title: "Practice proof by induction exercise set",
    description: "Solve recurrence relation problems 3 through 8 from chapter 5.",
    subject: "Discrete Math",
    deadline: "2026-10-15",
    estimatedDurationMinutes: 45,
    difficulty: "medium",
    priority: "medium",
    status: "pending",
    createdAt: "2026-10-10T08:00:00.000Z",
    updatedAt: "2026-10-10T08:00:00.000Z",
  },
];

/**
 * Validates that an object conforms to the Task contract.
 */
function isValidTask(obj: unknown): obj is Task {
  if (!obj || typeof obj !== "object") return false;
  const t = obj as Record<string, unknown>;

  return (
    typeof t.id === "string" &&
    typeof t.title === "string" &&
    typeof t.subject === "string" &&
    typeof t.deadline === "string" &&
    typeof t.estimatedDurationMinutes === "number" &&
    t.estimatedDurationMinutes > 0 &&
    ["easy", "medium", "hard"].includes(String(t.difficulty)) &&
    ["low", "medium", "high"].includes(String(t.priority)) &&
    ["pending", "in_progress", "completed"].includes(String(t.status))
  );
}

/**
 * Safely loads tasks from browser localStorage.
 * Returns default seed tasks if not found, corrupted, or during SSR.
 */
export function loadTasksFromStorage(): Task[] {
  if (typeof window === "undefined") {
    return DEFAULT_TASKS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First visit: save default tasks to establish storage
      saveTasksToStorage(DEFAULT_TASKS);
      return DEFAULT_TASKS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn("Storage data for tasks is not an array, falling back to defaults.");
      return DEFAULT_TASKS;
    }

    const validated = parsed.filter(isValidTask);
    if (validated.length === 0 && parsed.length > 0) {
      console.warn("No valid tasks found in stored data, falling back to defaults.");
      return DEFAULT_TASKS;
    }

    return validated;
  } catch (error) {
    console.error("Failed to load tasks from localStorage:", error);
    return DEFAULT_TASKS;
  }
}

/**
 * Safely saves tasks to browser localStorage.
 */
export function saveTasksToStorage(tasks: Task[]): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Failed to save tasks to localStorage:", error);
    return false;
  }
}
