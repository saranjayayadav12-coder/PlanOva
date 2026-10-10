"use client";

import { TrendingUp, Info } from "lucide-react";
import { CompletionTrendMetrics } from "@/types/workload";

interface CompletionTrendsCardProps {
  trends: CompletionTrendMetrics;
}

export function CompletionTrendsCard({ trends }: CompletionTrendsCardProps) {
  return (
    <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 sm:p-6 shadow-[var(--shadow-xs)] space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-border)]">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] shrink-0"
          style={{ backgroundColor: "var(--color-accent-pink)" }}
        >
          <TrendingUp className="h-4 w-4 text-[var(--color-primary)]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[var(--color-text)]">
            Completion Rates & Momentum
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            Real-time execution across your academic assignments and scheduled study sessions.
          </p>
        </div>
      </div>

      {/* ── Rate Gauges ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Task Completion Rate */}
        <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--color-text-muted)]">
              Assignment Completion Rate
            </span>
            <span className="font-black text-emerald-700 text-sm">
              {trends.taskCompletionRate}%
            </span>
          </div>

          <div
            className="w-full h-2.5 rounded-full bg-[var(--color-background)] overflow-hidden border border-[var(--color-border)]"
            role="progressbar"
            aria-valuenow={trends.taskCompletionRate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Task completion rate: ${trends.taskCompletionRate}%`}
          >
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${trends.taskCompletionRate}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] pt-0.5">
            <span>{trends.completedTaskCount} completed</span>
            <span>{trends.totalTaskCount - trends.completedTaskCount} active</span>
          </div>
        </div>

        {/* Study Session Completion Rate */}
        <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--color-text-muted)]">
              Scheduled Study Session Execution
            </span>
            <span className="font-black text-[var(--color-primary-dark)] text-sm">
              {trends.sessionCompletionRate}%
            </span>
          </div>

          <div
            className="w-full h-2.5 rounded-full bg-[var(--color-background)] overflow-hidden border border-[var(--color-border)]"
            role="progressbar"
            aria-valuenow={trends.sessionCompletionRate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Session completion rate: ${trends.sessionCompletionRate}%`}
          >
            <div
              className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
              style={{ width: `${trends.sessionCompletionRate}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] pt-0.5">
            <span>{trends.completedSessionCount} sessions done</span>
            <span>{trends.totalSessionCount} total planned</span>
          </div>
        </div>
      </div>

      {/* ── Context & Safe Scope Note ── */}
      <div className="flex items-start gap-2 p-3 rounded-[var(--radius-lg)] bg-[var(--color-background)] border border-[var(--color-border)] text-[11px] text-[var(--color-text-muted)] leading-relaxed">
        <Info className="h-4 w-4 shrink-0 text-[var(--color-primary)] mt-0.5" />
        <p>
          {trends.trendNote} Trend data represents your current semester workspace. Acadesk evaluates real progress without predicting long-term performance from early data points.
        </p>
      </div>
    </div>
  );
}
