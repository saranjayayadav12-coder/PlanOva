/**
 * lib/settings-storage.ts
 *
 * Dedicated storage and data-management utility for Acadesk.
 * Handles Student Preferences, complete Workspace Data Export & Import (v1.0 schema),
 * deep schema validation, and local data erasure.
 */

import {
  StudentPreferences,
  DEFAULT_STUDENT_PREFERENCES,
  AcadeskExportPayload,
  ImportValidationResult,
} from "@/types/settings";
import { Task } from "@/types/task";
import { TaskBreakdown } from "@/types/subtask";
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  STORAGE_KEY as TASK_STORAGE_KEY,
} from "./task-storage";
import {
  loadBreakdownsFromStorage,
  saveBreakdownsToStorage,
  BREAKDOWN_STORAGE_KEY,
} from "./breakdown-storage";
import {
  loadAvailabilityFromStorage,
  saveAvailabilityToStorage,
  loadPlansFromStorage,
  savePlansToStorage,
  loadHistoryFromStorage,
  saveHistoryToStorage,
  AVAILABILITY_STORAGE_KEY,
  PLAN_STORAGE_KEY,
  HISTORY_STORAGE_KEY,
  DISMISSED_TRIGGERS_KEY,
} from "./planner-storage";
import {
  loadCheckinsFromStorage,
  saveCheckinsToStorage,
  WELLBEING_STORAGE_KEY,
} from "./wellbeing-storage";

export const PREFERENCES_STORAGE_KEY = "acadesk.preferences.v1";

/**
 * Load student preferences from localStorage
 */
export function loadStudentPreferences(): StudentPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_STUDENT_PREFERENCES;
  }

  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_STUDENT_PREFERENCES;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return DEFAULT_STUDENT_PREFERENCES;
    }

    return {
      defaultCalendarView:
        parsed.defaultCalendarView === "week" || parsed.defaultCalendarView === "day"
          ? parsed.defaultCalendarView
          : "month",
      weekStartsOn: parsed.weekStartsOn === "sunday" ? "sunday" : "monday",
      enableOverloadWarnings:
        typeof parsed.enableOverloadWarnings === "boolean"
          ? parsed.enableOverloadWarnings
          : true,
      enableClusteringWarnings:
        typeof parsed.enableClusteringWarnings === "boolean"
          ? parsed.enableClusteringWarnings
          : true,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.warn("Acadesk: Could not load preferences, using defaults.", err);
    return DEFAULT_STUDENT_PREFERENCES;
  }
}

/**
 * Save student preferences to localStorage
 */
export function saveStudentPreferences(prefs: StudentPreferences): boolean {
  if (typeof window === "undefined") return false;

  try {
    const serialized = JSON.stringify(prefs);
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, serialized);
    return true;
  } catch (err) {
    console.error("Acadesk: Could not write preferences to localStorage.", err);
    return false;
  }
}

/**
 * Compile complete workspace data export into JSON payload
 */
export function exportAllStudentData(): AcadeskExportPayload {
  const tasks = loadTasksFromStorage();
  const breakdowns = loadBreakdownsFromStorage();
  const availability = loadAvailabilityFromStorage();
  const storedPlans = loadPlansFromStorage();
  const adaptationHistory = loadHistoryFromStorage();
  const wellbeingCheckins = loadCheckinsFromStorage();
  const preferences = loadStudentPreferences();

  return {
    schemaVersion: "1.0",
    appName: "Acadesk",
    exportedAt: new Date().toISOString(),
    tasks,
    breakdowns,
    availability,
    acceptedPlan: storedPlans.acceptedPlan,
    adaptationHistory,
    wellbeingCheckins,
    preferences,
  };
}

/**
 * Trigger browser file download of exported workspace data
 */
export function downloadExportFile(payload: AcadeskExportPayload): void {
  if (typeof window === "undefined") return;

  const dateStr = payload.exportedAt.slice(0, 10);
  const fileName = `acadesk-backup-${dateStr}.json`;
  const jsonContent = JSON.stringify(payload, null, 2);

  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Deeply validate imported JSON content
 */
export function validateImportPayload(rawJson: string): ImportValidationResult {
  const errors: string[] = [];

  if (!rawJson || !rawJson.trim()) {
    return { isValid: false, errors: ["The selected file is empty."] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return {
      isValid: false,
      errors: ["Invalid JSON syntax. The file could not be parsed as JSON."],
    };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      isValid: false,
      errors: ["Invalid format: root of exported file must be an object."],
    };
  }

  const obj = parsed as Record<string, unknown>;

  // Schema version check
  if (obj.schemaVersion !== "1.0") {
    errors.push(
      `Unsupported schema version '${String(obj.schemaVersion)}'. Acadesk currently supports version '1.0'.`
    );
  }

  // App identifier
  if (obj.appName !== "Acadesk") {
    errors.push("Missing or unrecognized app name identifier.");
  }

  // Tasks validation
  if (!Array.isArray(obj.tasks)) {
    errors.push("Missing or malformed 'tasks' array.");
  } else {
    for (let i = 0; i < obj.tasks.length; i++) {
      const t = obj.tasks[i];
      if (
        !t ||
        typeof t !== "object" ||
        typeof t.id !== "string" ||
        typeof t.title !== "string" ||
        typeof t.subject !== "string" ||
        typeof t.deadline !== "string" ||
        typeof t.estimatedDurationMinutes !== "number" ||
        !["low", "medium", "high"].includes(t.priority) ||
        !["easy", "medium", "hard"].includes(t.difficulty) ||
        !["pending", "in_progress", "completed"].includes(t.status)
      ) {
        errors.push(`Task at index ${i} has missing or invalid required properties.`);
        break; // don't flood with errors
      }
    }
  }

  // Breakdowns validation
  if (!obj.breakdowns || typeof obj.breakdowns !== "object" || Array.isArray(obj.breakdowns)) {
    errors.push("Missing or malformed 'breakdowns' object.");
  }

  // Availability validation
  const availObj = obj.availability as Record<string, unknown> | undefined;
  if (
    !availObj ||
    typeof availObj !== "object" ||
    !availObj.days ||
    typeof availObj.days !== "object"
  ) {
    errors.push("Missing or malformed 'availability' preferences.");
  }

  // Accepted plan validation
  if (obj.acceptedPlan !== null) {
    if (
      !obj.acceptedPlan ||
      typeof obj.acceptedPlan !== "object" ||
      !Array.isArray((obj.acceptedPlan as { sessions?: unknown }).sessions)
    ) {
      errors.push("Malformed 'acceptedPlan': must be null or an object with a 'sessions' array.");
    }
  }

  // Well-being checkins validation
  if (obj.wellbeingCheckins !== undefined) {
    if (!Array.isArray(obj.wellbeingCheckins)) {
      errors.push("'wellbeingCheckins' must be an array.");
    } else {
      for (let i = 0; i < obj.wellbeingCheckins.length; i++) {
        const c = obj.wellbeingCheckins[i];
        if (
          !c ||
          typeof c !== "object" ||
          typeof c.id !== "string" ||
          typeof c.date !== "string" ||
          typeof c.stress !== "number" ||
          c.stress < 1 ||
          c.stress > 5 ||
          typeof c.energy !== "number" ||
          c.energy < 1 ||
          c.energy > 5
        ) {
          errors.push(`Check-in record at index ${i} has invalid ratings or structure.`);
          break;
        }
      }
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const payload = obj as unknown as AcadeskExportPayload;

  return {
    isValid: true,
    errors: [],
    payload,
    summary: {
      taskCount: payload.tasks.length,
      breakdownCount: Object.keys(payload.breakdowns).length,
      hasAcceptedPlan: Boolean(payload.acceptedPlan),
      adaptationHistoryCount: Array.isArray(payload.adaptationHistory)
        ? payload.adaptationHistory.length
        : 0,
      wellbeingCount: Array.isArray(payload.wellbeingCheckins)
        ? payload.wellbeingCheckins.length
        : 0,
    },
  };
}

/**
 * Execute workspace data import to localStorage
 */
export function executeDataImport(payload: AcadeskExportPayload): boolean {
  if (typeof window === "undefined") return false;

  try {
    saveTasksToStorage(payload.tasks);
    saveBreakdownsToStorage(payload.breakdowns);
    saveAvailabilityToStorage(payload.availability);

    // Save plan preserving existing draftPlan if none in export
    const existingPlans = loadPlansFromStorage();
    savePlansToStorage({
      acceptedPlan: payload.acceptedPlan || null,
      draftPlan: existingPlans.draftPlan,
    });

    if (Array.isArray(payload.adaptationHistory)) {
      saveHistoryToStorage(payload.adaptationHistory);
    }

    if (Array.isArray(payload.wellbeingCheckins)) {
      saveCheckinsToStorage(payload.wellbeingCheckins);
    }

    if (payload.preferences) {
      saveStudentPreferences(payload.preferences);
    }

    return true;
  } catch (err) {
    console.error("Acadesk: Could not write imported data to storage.", err);
    return false;
  }
}

/**
 * Clear all Acadesk local data from localStorage
 */
export function executeDataClear(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(TASK_STORAGE_KEY);
    window.localStorage.removeItem(BREAKDOWN_STORAGE_KEY);
    window.localStorage.removeItem(AVAILABILITY_STORAGE_KEY);
    window.localStorage.removeItem(PLAN_STORAGE_KEY);
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    window.localStorage.removeItem(DISMISSED_TRIGGERS_KEY);
    window.localStorage.removeItem(WELLBEING_STORAGE_KEY);
    window.localStorage.removeItem(PREFERENCES_STORAGE_KEY);
  } catch (err) {
    console.warn("Acadesk: Error clearing local data from storage.", err);
  }
}
