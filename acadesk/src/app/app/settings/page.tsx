"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Settings as SettingsIcon,
  Clock,
  Palette,
  FileJson,
  ShieldCheck,
  Check,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard";
import { useTasks } from "@/contexts/task-context";
import {
  loadAvailabilityFromStorage,
  saveAvailabilityToStorage,
  DEFAULT_AVAILABILITY,
} from "@/lib/planner-storage";
import { AvailabilityPreferences } from "@/types/planner";
import {
  StudentPreferences,
  DEFAULT_STUDENT_PREFERENCES,
  AcadeskExportPayload,
} from "@/types/settings";
import {
  loadStudentPreferences,
  saveStudentPreferences,
} from "@/lib/settings-storage";
import {
  StudyPreferencesSection,
  DisplayPreferencesSection,
  NotificationsDisclosureSection,
  DataManagementSection,
} from "@/components/settings";

export default function SettingsPage() {
  const { importTasksAndBreakdowns, clearAllTasksAndBreakdowns } = useTasks();

  const [availability, setAvailability] = useState<AvailabilityPreferences>(DEFAULT_AVAILABILITY);
  const [preferences, setPreferences] = useState<StudentPreferences>(DEFAULT_STUDENT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state safely on client mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const storedAvail = loadAvailabilityFromStorage();
      const storedPrefs = loadStudentPreferences();
      setAvailability(storedAvail);
      setPreferences(storedPrefs);
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save Availability Preferences
  const handleSaveAvailability = useCallback(
    (newAvail: AvailabilityPreferences) => {
      setAvailability(newAvail);
      saveAvailabilityToStorage(newAvail);
    },
    []
  );

  // Save Display Preferences
  const handleSavePreferences = useCallback(
    (newPrefs: StudentPreferences) => {
      setPreferences(newPrefs);
      saveStudentPreferences(newPrefs);
    },
    []
  );

  // Handle Full Workspace Import
  const handleDataImported = useCallback(
    (payload: AcadeskExportPayload) => {
      // 1. Update shared task context
      importTasksAndBreakdowns(payload.tasks, payload.breakdowns);

      // 2. Update local state
      setAvailability(payload.availability);
      setPreferences(payload.preferences || DEFAULT_STUDENT_PREFERENCES);
    },
    [importTasksAndBreakdowns]
  );

  // Handle Full Workspace Data Erasure
  const handleDataCleared = useCallback(() => {
    clearAllTasksAndBreakdowns();
    setAvailability(DEFAULT_AVAILABILITY);
    setPreferences(DEFAULT_STUDENT_PREFERENCES);
  }, [clearAllTasksAndBreakdowns]);

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-5xl mx-auto pb-16">
        {/* ── Page Header ── */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] shadow-[var(--shadow-xs)]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <SettingsIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
              Settings & Preferences
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--color-accent-lavender)] text-[var(--color-primary-dark)]">
              Phase 12 • Final Integration
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Customize study duration limits, calendar views, and manage your portable workspace data.
          </p>
        </div>

        {/* ── Settings Sections ── */}
        <div className="space-y-6">
          {/* 1. Study Preferences */}
          <StudyPreferencesSection
            initialAvailability={availability}
            onSave={handleSaveAvailability}
          />

          {/* 2. Workspace Display & Calendar Settings */}
          <DisplayPreferencesSection
            initialPreferences={preferences}
            onSave={handleSavePreferences}
          />

          {/* 3. Notifications Architecture Disclosure */}
          <NotificationsDisclosureSection />

          {/* 4. Student Data Management (Export / Import / Clear) */}
          <DataManagementSection
            onDataImported={handleDataImported}
            onDataCleared={handleDataCleared}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
