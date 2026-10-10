"use client";

import { useState } from "react";
import { X, Clock, Check, RotateCcw } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { AvailabilityPreferences, DayOfWeek } from "@/types/planner";
import { DEFAULT_AVAILABILITY } from "@/lib/planner-storage";

interface AvailabilitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availability: AvailabilityPreferences;
  onSave: (updated: AvailabilityPreferences) => void;
}

const ORDERED_DAYS: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function AvailabilitySettingsModal({
  isOpen,
  onClose,
  availability,
  onSave,
}: AvailabilitySettingsModalProps) {
  const [formData, setFormData] = useState<AvailabilityPreferences>(availability);

  if (!isOpen) return null;

  const handleToggleDay = (day: DayOfWeek) => {
    setFormData((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          enabled: !prev.days[day].enabled,
        },
      },
    }));
  };

  const handleTimeChange = (
    day: DayOfWeek,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          [field]: value,
        },
      },
    }));
  };

  const handleDayCapChange = (day: DayOfWeek, minutes: number) => {
    setFormData((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          maxDailyMinutes: Math.max(15, minutes),
        },
      },
    }));
  };

  const handleResetDefaults = () => {
    setFormData(DEFAULT_AVAILABILITY);
  };

  const handleSave = () => {
    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  // Calculate total weekly hours available
  const totalWeeklyMinutes = Object.values(formData.days).reduce((acc, d) => {
    if (!d.enabled) return acc;
    return acc + Math.min(d.maxDailyMinutes, formData.maxDailyStudyMinutes);
  }, 0);

  const totalWeeklyHours = (totalWeeklyMinutes / 60).toFixed(1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="availability-modal-title"
    >
      <div
        className="w-full max-w-2xl rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 sm:p-7 shadow-2xl my-8 relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)]"
              style={{ backgroundColor: "var(--color-accent-lavender)" }}
            >
              <Clock className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h2
                id="availability-modal-title"
                className="text-lg sm:text-xl font-bold text-[var(--color-text)]"
              >
                Study Availability & Focus Limits
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Define when and for how long you prefer to study each day.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-md)] p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
          {/* Global Study Preferences */}
          <div className="rounded-[var(--radius-xl)] bg-[var(--color-background)] p-4 border border-[var(--color-border)] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-dark)]">
              Focus & Health Defaults
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Preferred Session
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={15}
                    max={120}
                    step={15}
                    value={formData.preferredSessionDurationMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredSessionDurationMinutes: Math.max(15, parseInt(e.target.value) || 45),
                      })
                    }
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">mins</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Recharge Break
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={5}
                    max={60}
                    step={5}
                    value={formData.preferredBreakDurationMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredBreakDurationMinutes: Math.max(0, parseInt(e.target.value) || 10),
                      })
                    }
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">mins</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Max Daily Cap
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={30}
                    max={480}
                    step={30}
                    value={formData.maxDailyStudyMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDailyStudyMinutes: Math.max(30, parseInt(e.target.value) || 180),
                      })
                    }
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Day-by-Day Schedule */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Daily Windows & Capacities
              </h3>
              <span className="text-xs font-semibold text-[var(--color-primary-dark)]">
                Total: {totalWeeklyHours} hours / week
              </span>
            </div>

            <div className="space-y-2">
              {ORDERED_DAYS.map((dayKey) => {
                const day = formData.days[dayKey];
                return (
                  <div
                    key={dayKey}
                    className={`p-3 rounded-[var(--radius-lg)] border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      day.enabled
                        ? "border-[var(--color-border)] bg-[var(--color-surface)]"
                        : "border-dashed border-[var(--color-border)] bg-[var(--color-background)] opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`check-${dayKey}`}
                        checked={day.enabled}
                        onChange={() => handleToggleDay(dayKey)}
                        className="h-4 w-4 rounded accent-[var(--color-primary)] cursor-pointer"
                      />
                      <label
                        htmlFor={`check-${dayKey}`}
                        className="text-sm font-semibold text-[var(--color-text)] cursor-pointer w-24"
                      >
                        {day.label}
                      </label>
                    </div>

                    {day.enabled ? (
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[var(--color-text-muted)]">Hours:</span>
                          <input
                            type="time"
                            value={day.startTime}
                            onChange={(e) => handleTimeChange(dayKey, "startTime", e.target.value)}
                            className="px-2 py-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-xs"
                          />
                          <span className="text-[var(--color-text-muted)]">to</span>
                          <input
                            type="time"
                            value={day.endTime}
                            onChange={(e) => handleTimeChange(dayKey, "endTime", e.target.value)}
                            className="px-2 py-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 pl-2 border-l border-[var(--color-border)]">
                          <span className="text-[var(--color-text-muted)]">Cap:</span>
                          <input
                            type="number"
                            min={15}
                            max={480}
                            step={15}
                            value={day.maxDailyMinutes}
                            onChange={(e) =>
                              handleDayCapChange(dayKey, parseInt(e.target.value) || 60)
                            }
                            className="w-16 px-2 py-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-xs"
                          />
                          <span className="text-[var(--color-text-muted)]">min</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--color-text-muted)] italic">
                        Rest / Non-study day
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Modal Footer ── */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetDefaults}
            className="text-[var(--color-text-muted)] gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5">
              <Check className="h-4 w-4" />
              <span>Save Availability</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
