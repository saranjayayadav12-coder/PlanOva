"use client";

import { useState } from "react";
import { Sliders, Check, Palette, BellRing, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";
import { StudentPreferences } from "@/types/settings";
import { CalendarViewMode } from "@/types/calendar";

interface DisplayPreferencesSectionProps {
  initialPreferences: StudentPreferences;
  onSave: (prefs: StudentPreferences) => void;
}

export function DisplayPreferencesSection({
  initialPreferences,
  onSave,
}: DisplayPreferencesSectionProps) {
  const [defaultCalendarView, setDefaultCalendarView] = useState<CalendarViewMode>(
    initialPreferences.defaultCalendarView || "month"
  );
  const [weekStartsOn, setWeekStartsOn] = useState<"monday" | "sunday">(
    initialPreferences.weekStartsOn || "monday"
  );
  const [enableOverloadWarnings, setEnableOverloadWarnings] = useState<boolean>(
    initialPreferences.enableOverloadWarnings !== false
  );
  const [enableClusteringWarnings, setEnableClusteringWarnings] = useState<boolean>(
    initialPreferences.enableClusteringWarnings !== false
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      defaultCalendarView,
      weekStartsOn,
      enableOverloadWarnings,
      enableClusteringWarnings,
      updatedAt: new Date().toISOString(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-[var(--shadow-sm)] space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700">
            <Palette className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--color-text)]">
              Workspace & Calendar Preferences
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Tailor calendar layouts and automated academic notices.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 self-start sm:self-center">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span>Preferences Saved</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Default Calendar View */}
        <div className="space-y-1.5 p-3.5 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
          <label className="text-xs font-bold text-[var(--color-text)] block">
            Default Calendar View
          </label>
          <select
            value={defaultCalendarView}
            onChange={(e) =>
              setDefaultCalendarView(e.target.value as CalendarViewMode)
            }
            className="w-full text-xs p-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="month">Month View (35-day grid)</option>
            <option value="week">Week View (7-day timeline)</option>
            <option value="day">Day View (Daily agenda)</option>
          </select>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            Initial view shown when visiting the Academic Calendar.
          </p>
        </div>

        {/* First Day of Week */}
        <div className="space-y-1.5 p-3.5 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
          <label className="text-xs font-bold text-[var(--color-text)] block">
            Calendar Week Starts On
          </label>
          <select
            value={weekStartsOn}
            onChange={(e) =>
              setWeekStartsOn(e.target.value as "monday" | "sunday")
            }
            className="w-full text-xs p-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="monday">Monday (Academic standard)</option>
            <option value="sunday">Sunday</option>
          </select>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            Determines the first column alignment on calendar grids.
          </p>
        </div>
      </div>

      {/* Warning Toggles */}
      <div className="space-y-3 pt-1">
        <label className="text-xs font-bold text-[var(--color-text)] block">
          Proactive Academic Diagnostic Banners
        </label>
        <div className="space-y-2">
          <label className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] cursor-pointer">
            <input
              type="checkbox"
              checked={enableOverloadWarnings}
              onChange={(e) => setEnableOverloadWarnings(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[var(--color-text)] block">
                Daily Capacity Overload Notices
              </span>
              <p className="text-[11px] text-[var(--color-text-muted)] leading-tight">
                Highlights calendar days where total planned study hours exceed your configured daily study limit.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] cursor-pointer">
            <input
              type="checkbox"
              checked={enableClusteringWarnings}
              onChange={(e) => setEnableClusteringWarnings(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[var(--color-text)] block">
                Deadline Clustering Warnings
              </span>
              <p className="text-[11px] text-[var(--color-text-muted)] leading-tight">
                Proactively highlights dates where 2 or more major assignment deliverables fall on the same day.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end pt-3 border-t border-[var(--color-border)]">
        <Button type="submit" variant="primary" size="md" className="gap-1.5 text-xs shadow-[var(--shadow-xs)]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Save Workspace Preferences</span>
        </Button>
      </div>
    </form>
  );
}
