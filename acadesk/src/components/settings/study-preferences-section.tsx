"use client";

import { useState } from "react";
import {
  Clock,
  Sparkles,
  Check,
  RotateCcw,
  Info,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui";
import {
  AvailabilityPreferences,
  DayAvailability,
  DayOfWeek,
} from "@/types/planner";
import { DEFAULT_AVAILABILITY } from "@/lib/planner-storage";

interface StudyPreferencesSectionProps {
  initialAvailability: AvailabilityPreferences;
  onSave: (availability: AvailabilityPreferences) => void;
}

const DAYS_ORDER: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function StudyPreferencesSection({
  initialAvailability,
  onSave,
}: StudyPreferencesSectionProps) {
  const [sessionDuration, setSessionDuration] = useState<number>(
    initialAvailability.preferredSessionDurationMinutes || 45
  );
  const [breakDuration, setBreakDuration] = useState<number>(
    initialAvailability.preferredBreakDurationMinutes || 15
  );
  const [maxDailyMinutes, setMaxDailyMinutes] = useState<number>(
    initialAvailability.maxDailyStudyMinutes || 180
  );
  const [days, setDays] = useState<Record<DayOfWeek, DayAvailability>>(
    initialAvailability.days || DEFAULT_AVAILABILITY.days
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleDay = (dayKey: DayOfWeek) => {
    setDays((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        enabled: !prev[dayKey].enabled,
      },
    }));
  };

  const handleDayTimeChange = (
    dayKey: DayOfWeek,
    field: "startTime" | "endTime",
    val: string
  ) => {
    setDays((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: val,
      },
    }));
  };

  const handleDayLimitChange = (dayKey: DayOfWeek, mins: number) => {
    setDays((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        maxDailyMinutes: Math.max(0, mins),
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AvailabilityPreferences = {
      days,
      preferredSessionDurationMinutes: Number(sessionDuration),
      preferredBreakDurationMinutes: Number(breakDuration),
      maxDailyStudyMinutes: Number(maxDailyMinutes),
      updatedAt: new Date().toISOString(),
    };
    onSave(updated);
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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--color-text)]">
              Study Rhythm & Availability Preferences
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Configure session lengths, break intervals, and active study hours.
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

      {/* Plan Safety Notice */}
      <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] flex items-start gap-2.5 leading-relaxed">
        <Info className="h-4 w-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[var(--color-text)] font-semibold">
            Accepted Plan Protection:
          </strong>{" "}
          Updating these preferences adjusts scheduling parameters for future plan proposals generated in the AI Study Planner and Academic Recovery. Your currently accepted schedule will remain unchanged until you choose to review and accept a revision.
        </div>
      </div>

      {/* Primary Duration Sliders / Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Focus Block Duration */}
        <div className="space-y-1.5 p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
          <label className="text-xs font-bold text-[var(--color-text)] block">
            Focus Block Duration
          </label>
          <select
            value={sessionDuration}
            onChange={(e) => setSessionDuration(Number(e.target.value))}
            className="w-full text-xs p-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value={25}>25 minutes (Pomodoro)</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes (Recommended)</option>
            <option value={60}>60 minutes (1 hour)</option>
            <option value={90}>90 minutes (Deep Work)</option>
          </select>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            Duration of an uninterrupted study sprint.
          </p>
        </div>

        {/* Break Duration */}
        <div className="space-y-1.5 p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
          <label className="text-xs font-bold text-[var(--color-text)] block">
            Wellness Break Interval
          </label>
          <select
            value={breakDuration}
            onChange={(e) => setBreakDuration(Number(e.target.value))}
            className="w-full text-xs p-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes (Recommended)</option>
            <option value={20}>20 minutes</option>
            <option value={30}>30 minutes</option>
          </select>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            Rest interval scheduled between consecutive sessions.
          </p>
        </div>

        {/* Daily Study Cap */}
        <div className="space-y-1.5 p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
          <label className="text-xs font-bold text-[var(--color-text)] block">
            Max Daily Study Cap
          </label>
          <select
            value={maxDailyMinutes}
            onChange={(e) => setMaxDailyMinutes(Number(e.target.value))}
            className="w-full text-xs p-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value={60}>60 mins (1 hour)</option>
            <option value={120}>120 mins (2 hours)</option>
            <option value={180}>180 mins (3 hours — Default)</option>
            <option value={240}>240 mins (4 hours)</option>
            <option value={300}>300 mins (5 hours)</option>
            <option value={360}>360 mins (6 hours)</option>
          </select>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            Prevents scheduling days exceeding healthy study limits.
          </p>
        </div>
      </div>

      {/* Daily Schedule Windows */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[var(--color-text)] block">
          Weekly Study Availability Window
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
          {DAYS_ORDER.map((dayKey) => {
            const day = days[dayKey];
            return (
              <div
                key={dayKey}
                className={`p-2.5 rounded-[var(--radius-md)] border text-xs space-y-2 transition-all ${
                  day.enabled
                    ? "bg-[var(--color-surface-elevated)] border-[var(--color-primary-light)]"
                    : "bg-slate-50/60 border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[var(--color-text)]">
                    {day.label.slice(0, 3)}
                  </span>
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={() => handleToggleDay(dayKey)}
                    className="h-3.5 w-3.5 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                    aria-label={`Enable study time on ${day.label}`}
                  />
                </div>

                {day.enabled ? (
                  <div className="space-y-1.5 pt-1 text-[10px]">
                    <div>
                      <span className="text-[var(--color-text-muted)] block">Hours</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="time"
                          value={day.startTime}
                          onChange={(e) =>
                            handleDayTimeChange(dayKey, "startTime", e.target.value)
                          }
                          className="w-full p-1 rounded border border-[var(--color-border)] text-[10px] bg-[var(--color-background)]"
                        />
                        <span>–</span>
                        <input
                          type="time"
                          value={day.endTime}
                          onChange={(e) =>
                            handleDayTimeChange(dayKey, "endTime", e.target.value)
                          }
                          className="w-full p-1 rounded border border-[var(--color-border)] text-[10px] bg-[var(--color-background)]"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[var(--color-text-muted)] block">Cap (mins)</span>
                      <input
                        type="number"
                        min={0}
                        max={720}
                        step={15}
                        value={day.maxDailyMinutes}
                        onChange={(e) =>
                          handleDayLimitChange(dayKey, Number(e.target.value))
                        }
                        className="w-full p-1 rounded border border-[var(--color-border)] text-[10px] bg-[var(--color-background)]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-[10px] text-[var(--color-text-muted)] italic">
                    Rest Day
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end pt-3 border-t border-[var(--color-border)]">
        <Button type="submit" variant="primary" size="md" className="gap-1.5 text-xs shadow-[var(--shadow-xs)]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Save Study Preferences</span>
        </Button>
      </div>
    </form>
  );
}
