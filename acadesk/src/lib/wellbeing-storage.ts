/**
 * lib/wellbeing-storage.ts
 *
 * Dedicated local storage persistence for optional student well-being check-ins.
 * Key: "acadesk.wellbeing_checkins.v1"
 *
 * Characteristics:
 * - Browser-local only (not sent to any external server or API).
 * - SSR hydration safe (checks typeof window !== "undefined").
 * - Validates ratings (1-5) and ISO date formats.
 * - Does NOT store or mutate academic task records.
 */

import { WellbeingCheckin, WellbeingFormData, WellbeingRating } from "@/types/wellbeing";

export const WELLBEING_STORAGE_KEY = "acadesk.wellbeing_checkins.v1";

/**
 * Validate that a number is an integer between 1 and 5
 */
function isValidRating(val: unknown): val is WellbeingRating {
  return typeof val === "number" && Number.isInteger(val) && val >= 1 && val <= 5;
}

/**
 * Validate that a date string is YYYY-MM-DD format
 */
function isValidDateStr(val: unknown): val is string {
  return typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val);
}

/**
 * Load well-being check-in history from localStorage
 */
export function loadCheckinsFromStorage(): WellbeingCheckin[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(WELLBEING_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter and sanitize valid records
    const validRecords: WellbeingCheckin[] = [];
    for (const item of parsed) {
      if (
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        isValidDateStr(item.date) &&
        isValidRating(item.stress) &&
        isValidRating(item.energy) &&
        isValidRating(item.sleep) &&
        isValidRating(item.workloadManageability)
      ) {
        validRecords.push({
          id: item.id,
          date: item.date,
          stress: item.stress,
          energy: item.energy,
          sleep: item.sleep,
          workloadManageability: item.workloadManageability,
          note: typeof item.note === "string" ? item.note : undefined,
          createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
          updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : new Date().toISOString(),
        });
      }
    }

    // Sort descending by date (most recent first)
    return validRecords.sort((a, b) => b.date.localeCompare(a.date));
  } catch (err) {
    console.warn("Acadesk: Failed to load well-being check-ins from storage.", err);
    return [];
  }
}

/**
 * Save well-being check-in history to localStorage
 */
export function saveCheckinsToStorage(checkins: WellbeingCheckin[]): boolean {
  if (typeof window === "undefined") return false;

  try {
    const serialized = JSON.stringify(checkins);
    window.localStorage.setItem(WELLBEING_STORAGE_KEY, serialized);
    return true;
  } catch (err) {
    console.error("Acadesk: Could not write well-being check-ins to localStorage.", err);
    return false;
  }
}

/**
 * Find check-in for a specific date (YYYY-MM-DD)
 */
export function getCheckinForDate(
  checkins: WellbeingCheckin[],
  dateStr: string
): WellbeingCheckin | undefined {
  return checkins.find((c) => c.date === dateStr);
}

/**
 * Save or update a daily check-in (prevents duplicate submissions for the same day)
 */
export function saveOrUpdateCheckin(
  formData: WellbeingFormData,
  dateStr: string
): { checkin: WellbeingCheckin; isNew: boolean; checkins: WellbeingCheckin[] } {
  const current = loadCheckinsFromStorage();
  const existingIndex = current.findIndex((c) => c.date === dateStr);

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    // Update existing daily record
    const existing = current[existingIndex];
    const updated: WellbeingCheckin = {
      ...existing,
      stress: formData.stress,
      energy: formData.energy,
      sleep: formData.sleep,
      workloadManageability: formData.workloadManageability,
      note: formData.note.trim() || undefined,
      updatedAt: now,
    };

    const nextList = [...current];
    nextList[existingIndex] = updated;
    saveCheckinsToStorage(nextList);

    return { checkin: updated, isNew: false, checkins: nextList };
  } else {
    // Create new daily check-in
    const newRecord: WellbeingCheckin = {
      id: `checkin-${dateStr}-${Date.now()}`,
      date: dateStr,
      stress: formData.stress,
      energy: formData.energy,
      sleep: formData.sleep,
      workloadManageability: formData.workloadManageability,
      note: formData.note.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    const nextList = [newRecord, ...current].sort((a, b) => b.date.localeCompare(a.date));
    saveCheckinsToStorage(nextList);

    return { checkin: newRecord, isNew: true, checkins: nextList };
  }
}

/**
 * Delete a specific check-in record
 */
export function deleteCheckinFromStorage(id: string): WellbeingCheckin[] {
  const current = loadCheckinsFromStorage();
  const nextList = current.filter((c) => c.id !== id);
  saveCheckinsToStorage(nextList);
  return nextList;
}

/**
 * Clear all well-being history
 */
export function clearAllCheckinsFromStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(WELLBEING_STORAGE_KEY);
  } catch (err) {
    console.warn("Acadesk: Could not clear well-being history from localStorage.", err);
  }
}
