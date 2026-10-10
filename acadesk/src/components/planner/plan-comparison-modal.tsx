"use client";

import { X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";
import { StudyPlan, ProposedRevisedPlan, PlannedSession } from "@/types/planner";
import { parseDateISO } from "@/lib/study-planner-service";

interface PlanComparisonModalProps {
  isOpen: boolean;
  currentPlan: StudyPlan;
  revisedProposal: ProposedRevisedPlan | null;
  onClose: () => void;
  onAcceptRevised: () => void;
  onRejectChanges: () => void;
}

export function PlanComparisonModal({
  isOpen,
  currentPlan,
  revisedProposal,
  onClose,
  onAcceptRevised,
  onRejectChanges,
}: PlanComparisonModalProps) {
  if (!isOpen || !revisedProposal) return null;

  const { plan: revisedPlan, comparison, trigger } = revisedProposal;

  const currentTotalHours = (currentPlan.totalPlannedMinutes / 60).toFixed(1);
  const revisedTotalHours = (revisedPlan.totalPlannedMinutes / 60).toFixed(1);

  // Group current sessions by date
  const currentByDate: Record<string, PlannedSession[]> = {};
  for (const s of currentPlan.sessions) {
    if (!currentByDate[s.date]) currentByDate[s.date] = [];
    currentByDate[s.date].push(s);
  }

  // Group revised sessions by date
  const revisedByDate: Record<string, PlannedSession[]> = {};
  for (const s of revisedPlan.sessions) {
    if (!revisedByDate[s.date]) revisedByDate[s.date] = [];
    revisedByDate[s.date].push(s);
  }

  // Distinct dates in comparison
  const allDates = Array.from(
    new Set([...Object.keys(currentByDate), ...Object.keys(revisedByDate)])
  ).sort();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
    >
      <div
        className="w-full max-w-6xl rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 sm:p-7 shadow-2xl my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)]"
              style={{ backgroundColor: "var(--color-accent-lavender)" }}
            >
              <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="comparison-title"
                  className="text-lg sm:text-xl font-bold text-[var(--color-text)]"
                >
                  Plan Adjustment Comparison
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)]">
                  Side-by-Side Review
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {trigger.title}: {trigger.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-md)] p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Change Highlights Summary ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-4 border-b border-[var(--color-border)]">
          <div className="p-2.5 rounded-[var(--radius-lg)] bg-[var(--color-background)] border border-[var(--color-border)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Unchanged Sessions
            </span>
            <p className="text-base font-bold text-[var(--color-text)]">
              {comparison.unchangedSessions.length}
            </p>
          </div>

          <div className="p-2.5 rounded-[var(--radius-lg)] bg-amber-50/60 border border-amber-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              Shifted Sessions
            </span>
            <p className="text-base font-bold text-amber-900">
              {comparison.movedSessions.length}
            </p>
          </div>

          <div className="p-2.5 rounded-[var(--radius-lg)] bg-emerald-50/60 border border-emerald-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Rescheduled / Added
            </span>
            <p className="text-base font-bold text-emerald-900">
              {comparison.addedSessions.length}
            </p>
          </div>

          <div className="p-2.5 rounded-[var(--radius-lg)] bg-[var(--color-background)] border border-[var(--color-border)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Total Work Hours
            </span>
            <p className="text-base font-bold text-[var(--color-primary-dark)]">
              {currentTotalHours}h → {revisedTotalHours}h
            </p>
          </div>
        </div>

        {/* ── Comparison Views (Desktop Side-by-Side, Mobile Stacked) ── */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* ── Left Column: Current Accepted Plan ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                  <h3 className="text-sm font-bold text-[var(--color-text)]">
                    Current Accepted Schedule
                  </h3>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {currentPlan.sessions.length} sessions • {currentTotalHours}h
                </span>
              </div>

              <div className="space-y-3">
                {allDates.map((dateStr) => {
                  const sessions = currentByDate[dateStr] || [];
                  if (sessions.length === 0) return null;

                  const dateObj = parseDateISO(dateStr);
                  const dayName = dateObj.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={`curr-${dateStr}`}
                      className="p-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-2 text-xs"
                    >
                      <span className="font-bold text-[var(--color-text-muted)] block">
                        {dayName}
                      </span>
                      {sessions.map((s) => (
                        <div
                          key={s.id}
                          className="p-2 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-between"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-semibold text-[var(--color-text)] truncate">
                              {s.title}
                            </p>
                            <p className="text-[10px] text-[var(--color-primary-dark)] font-medium">
                              {s.subject} ({s.durationMinutes}m)
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-[var(--color-text-muted)] shrink-0">
                            {s.startTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Right Column: Proposed Revised Plan ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-primary-light)]">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                  <h3 className="text-sm font-bold text-[var(--color-primary-dark)]">
                    Proposed Revised Schedule
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[var(--color-primary-dark)]">
                  {revisedPlan.sessions.length} sessions • {revisedTotalHours}h
                </span>
              </div>

              <div className="space-y-3">
                {allDates.map((dateStr) => {
                  const sessions = revisedByDate[dateStr] || [];
                  if (sessions.length === 0) return null;

                  const dateObj = parseDateISO(dateStr);
                  const dayName = dateObj.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={`rev-${dateStr}`}
                      className="p-3 rounded-[var(--radius-lg)] border border-[var(--color-primary-light)]/70 bg-[var(--color-surface)] space-y-2 text-xs"
                    >
                      <span className="font-bold text-[var(--color-primary-dark)] block">
                        {dayName}
                      </span>
                      {sessions.map((s) => {
                        const isAdded = s.diffTag === "added" || s.diffTag === "rescheduled";
                        const isMoved = s.diffTag === "moved";

                        return (
                          <div
                            key={s.id}
                            className={`p-2 rounded-[var(--radius-md)] border flex items-center justify-between transition-colors ${
                              isAdded
                                ? "bg-emerald-50/70 border-emerald-200"
                                : isMoved
                                ? "bg-amber-50/70 border-amber-200"
                                : "bg-[var(--color-background)] border-[var(--color-border)]"
                            }`}
                          >
                            <div className="min-w-0 pr-2 space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="font-semibold text-[var(--color-text)] truncate">
                                  {s.title}
                                </p>
                                {isAdded && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-200 text-emerald-900">
                                    Rescheduled
                                  </span>
                                )}
                                {isMoved && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200 text-amber-900">
                                    Shifted
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-[var(--color-primary-dark)] font-medium">
                                {s.subject} ({s.durationMinutes}m)
                              </p>
                            </div>
                            <span className="text-[10px] font-mono text-[var(--color-text-muted)] shrink-0">
                              {s.startTime}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Modal Footer ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-[var(--color-text-muted)]"
          >
            Return to Current Plan
          </Button>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onRejectChanges}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            >
              Reject Changes
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onAcceptRevised}
              className="gap-1.5 shadow-[var(--shadow-sm)] text-xs font-semibold"
            >
              <Check className="h-4 w-4" />
              <span>Accept Revised Plan</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
