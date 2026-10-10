"use client";

import { Clock, Calendar, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { StudyPlan } from "@/types/planner";

interface PlanSummaryMetricsProps {
  plan: StudyPlan | null;
}

export function PlanSummaryMetrics({ plan }: PlanSummaryMetricsProps) {
  if (!plan) return null;

  const plannedHours = (plan.totalPlannedMinutes / 60).toFixed(1);
  const availableHours = (plan.totalAvailableMinutes / 60).toFixed(1);
  const remainingHours = Math.max(
    0,
    parseFloat(availableHours) - parseFloat(plannedHours)
  ).toFixed(1);

  const completedSessions = plan.sessions.filter((s) => s.status === "completed").length;
  const progressPercent =
    plan.sessions.length > 0
      ? Math.round((completedSessions / plan.sessions.length) * 100)
      : 0;

  const highWarnings = plan.warnings.filter((w) => w.severity === "high");

  return (
    <div className="space-y-4">
      {/* ── High Severity Warning Alert ── */}
      {highWarnings.length > 0 && (
        <div className="p-3.5 rounded-[var(--radius-xl)] bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3 shadow-[var(--shadow-xs)] animate-in fade-in">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Deadline Conflict Alert</p>
            {highWarnings.map((w) => (
              <p key={w.id} className="text-rose-800 leading-relaxed">
                • {w.message}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ── Metric Cards Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Planned Time */}
        <div className="p-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-xs)]">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
            <span>Planned Study</span>
            <Clock className="h-4 w-4 text-[var(--color-primary)]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[var(--color-text)] mt-1.5">
            {plannedHours} hrs
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            across {plan.sessions.length} sessions
          </p>
        </div>

        {/* Capacity Remaining */}
        <div className="p-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-xs)]">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
            <span>Available Buffer</span>
            <Calendar className="h-4 w-4 text-[var(--color-primary-dark)]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[var(--color-primary-dark)] mt-1.5">
            {remainingHours} hrs
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            out of {availableHours} hrs total
          </p>
        </div>

        {/* Completion Progress */}
        <div className="p-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-xs)]">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
            <span>Session Progress</span>
            <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[var(--color-text)] mt-1.5">
            {completedSessions} / {plan.sessions.length}
          </p>
          <div className="w-full bg-[var(--color-border)] h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-[var(--color-success)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Unscheduled Count */}
        <div className="p-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-xs)]">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
            <span>Unscheduled</span>
            <AlertCircle className={`h-4 w-4 ${plan.unscheduledTasks.length > 0 ? "text-[var(--color-warning)]" : "text-[var(--color-text-muted)]"}`} />
          </div>
          <p className={`text-xl sm:text-2xl font-bold mt-1.5 ${plan.unscheduledTasks.length > 0 ? "text-[var(--color-warning-dark)]" : "text-[var(--color-text)]"}`}>
            {plan.unscheduledTasks.length}
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            {plan.unscheduledTasks.length === 0 ? "All tasks scheduled!" : "Tasks need more study time"}
          </p>
        </div>
      </div>
    </div>
  );
}
