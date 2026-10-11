"use client";

import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Filter,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui";
import { CalendarViewMode } from "@/types/calendar";

interface CalendarHeaderProps {
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  periodTitle: string;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  onToday: () => void;
  onAddTask: () => void;
  activeFilterCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  warningCount: number;
  showWarnings: boolean;
  onToggleWarnings: () => void;
}

export function CalendarHeader({
  viewMode,
  onViewModeChange,
  periodTitle,
  onPrevPeriod,
  onNextPeriod,
  onToday,
  onAddTask,
  activeFilterCount,
  showFilters,
  onToggleFilters,
  warningCount,
  showWarnings,
  onToggleWarnings,
}: CalendarHeaderProps) {
  return (
    <div className="space-y-4">
      {/* ── Top Title Row ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] shadow-[var(--shadow-xs)]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
              Academic Calendar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--color-accent-lavender)] text-[var(--color-primary-dark)]">
              Phase 10 • Adaptive Blocks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            See your deadlines, plan your study time, and stay one step ahead.
          </p>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex items-center gap-2 flex-wrap">
          {warningCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleWarnings}
              className={`gap-1.5 text-xs font-medium transition-colors ${
                showWarnings
                  ? "bg-amber-100/80 border-amber-300 text-amber-900"
                  : "bg-amber-50/70 border-amber-200 text-amber-800 hover:bg-amber-100/50"
              }`}
              aria-label={`${warningCount} scheduling warnings available. Click to ${
                showWarnings ? "hide" : "show"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              <span>{warningCount} Warning{warningCount > 1 ? "s" : ""}</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
            className={`gap-1.5 text-xs font-medium transition-colors ${
              showFilters
                ? "bg-[var(--color-accent-lavender)]/50 border-[var(--color-primary)] text-[var(--color-primary-dark)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
            aria-label="Toggle calendar filters"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onAddTask}
            className="gap-1.5 shadow-[var(--shadow-sm)] text-xs sm:text-sm"
            aria-label="Add a new academic task for the selected date"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      {/* ── Bottom Controls Row: Period Navigation & View Mode Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[var(--color-border)]">
        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
            className="text-xs font-semibold px-2.5 h-8 text-[var(--color-text)] hover:bg-[var(--color-accent-lavender)]/30"
            aria-label="Jump to today's date"
          >
            Today
          </Button>

          <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)]">
            <button
              type="button"
              onClick={onPrevPeriod}
              className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] rounded-l-[var(--radius-md)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              aria-label="Previous period"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-[var(--color-border)]" />
            <button
              type="button"
              onClick={onNextPeriod}
              className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] rounded-r-[var(--radius-md)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              aria-label="Next period"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)] tracking-tight ml-1">
            {periodTitle}
          </h2>
        </div>

        {/* View Mode Toggle: Month | Week | Day */}
        <div
          className="inline-flex items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5 shadow-[var(--shadow-xs)] self-start sm:self-center"
          role="tablist"
          aria-label="Calendar view options"
        >
          {(["month", "week", "day"] as CalendarViewMode[]).map((mode) => {
            const isActive = viewMode === mode;
            const labels: Record<CalendarViewMode, string> = {
              month: "Month",
              week: "Week",
              day: "Day",
            };

            return (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onViewModeChange(mode)}
                className={`px-3 py-1 text-xs font-semibold rounded-[var(--radius-sm)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-xs)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)]"
                }`}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
