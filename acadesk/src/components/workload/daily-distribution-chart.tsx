"use client";

import Link from "next/link";
import { BarChart3, AlertTriangle, CheckCircle, Sliders, Clock } from "lucide-react";
import { DailyWorkloadItem } from "@/types/workload";

interface DailyDistributionChartProps {
  distribution: DailyWorkloadItem[];
}

export function DailyDistributionChart({ distribution }: DailyDistributionChartProps) {
  const totalPlannedMinutes = distribution.reduce((sum, d) => sum + d.plannedMinutes, 0);
  const totalAvailableMinutes = distribution.reduce((sum, d) => sum + d.availableMinutes, 0);
  const overloadedDaysCount = distribution.filter((d) => d.isOverloaded).length;

  return (
    <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 sm:p-6 shadow-[var(--shadow-xs)] space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] shrink-0"
            style={{ backgroundColor: "var(--color-accent-lavender)" }}
          >
            <BarChart3 className="h-4 w-4 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--color-text)]">
              Daily Workload vs. Available Capacity
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Comparing your planned study hours with configured daily capacity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {overloadedDaysCount > 0 ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
              <AlertTriangle className="h-3 w-3" />
              <span>{overloadedDaysCount} day{overloadedDaysCount > 1 ? "s" : ""} overloaded</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle className="h-3 w-3" />
              <span>Within daily capacity</span>
            </span>
          )}
        </div>
      </div>

      {/* ── High-Level Distribution Summary ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-[var(--radius-lg)] bg-[var(--color-background)] border border-[var(--color-border)] text-xs">
        <div>
          <span className="text-[var(--color-text-muted)] block text-[11px]">
            Planned Study Time
          </span>
          <span className="font-bold text-[var(--color-text)] text-sm">
            {(totalPlannedMinutes / 60).toFixed(1)} hrs ({totalPlannedMinutes}m)
          </span>
        </div>
        <div>
          <span className="text-[var(--color-text-muted)] block text-[11px]">
            Total Available Study Capacity
          </span>
          <span className="font-bold text-[var(--color-text)] text-sm">
            {(totalAvailableMinutes / 60).toFixed(1)} hrs ({totalAvailableMinutes}m)
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[var(--color-text-muted)] block text-[11px]">
            7-Day Utilization
          </span>
          <span className="font-bold text-[var(--color-primary-dark)] text-sm">
            {totalAvailableMinutes > 0
              ? `${Math.round((totalPlannedMinutes / totalAvailableMinutes) * 100)}% of capacity`
              : "No capacity configured"}
          </span>
        </div>
      </div>

      {/* ── Daily Breakdown Bars ── */}
      <div className="space-y-3.5" role="region" aria-label="Daily workload distribution bars">
        {distribution.map((day) => {
          const plannedHrs = (day.plannedMinutes / 60).toFixed(1);
          const availHrs = (day.availableMinutes / 60).toFixed(1);
          const percentWidth = Math.min(100, day.utilizationPercent);

          let barColor = "bg-[var(--color-primary)]";
          let badgeColor = "bg-[var(--color-accent-lavender)] text-[var(--color-primary-dark)]";

          if (day.isOverloaded) {
            barColor = "bg-rose-500";
            badgeColor = "bg-rose-100 text-rose-800 border border-rose-300";
          } else if (day.utilizationPercent >= 85) {
            barColor = "bg-amber-500";
            badgeColor = "bg-amber-100 text-amber-800 border border-amber-300";
          } else if (day.availableMinutes === 0) {
            barColor = "bg-gray-300";
            badgeColor = "bg-gray-100 text-gray-600";
          }

          return (
            <div
              key={day.date}
              className={`p-3 rounded-[var(--radius-lg)] border transition-all ${
                day.isOverloaded
                  ? "bg-rose-50/40 border-rose-200"
                  : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary-light)]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-[var(--color-text)]">
                    {day.dayName}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    ({day.formattedDate})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-[var(--color-text)]">
                    <span className="font-bold">{plannedHrs}h</span> planned /{" "}
                    <span className="text-[var(--color-text-muted)]">{availHrs}h max</span>
                  </span>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}>
                    {day.isOverloaded
                      ? `Overloaded by ${day.plannedMinutes - day.availableMinutes}m`
                      : day.availableMinutes === 0
                      ? "Day Off"
                      : `${day.remainingMinutes}m open`}
                  </span>
                </div>
              </div>

              {/* Accessible Progress Bar */}
              <div
                className="w-full h-3 rounded-full bg-[var(--color-background)] overflow-hidden border border-[var(--color-border)]"
                role="progressbar"
                aria-valuenow={day.plannedMinutes}
                aria-valuemin={0}
                aria-valuemax={day.availableMinutes || 1}
                aria-label={`${day.dayName} study load: ${day.plannedMinutes} minutes of ${day.availableMinutes} minutes capacity`}
              >
                <div
                  className={`h-full transition-all duration-300 rounded-full ${barColor}`}
                  style={{ width: `${percentWidth}%` }}
                />
              </div>

              {/* Sessions indicator */}
              {day.sessions.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5 flex-wrap text-[11px] text-[var(--color-text-muted)]">
                  <Clock className="h-3 w-3 text-[var(--color-primary)]" />
                  <span>{day.sessions.length} session{day.sessions.length > 1 ? "s" : ""}:</span>
                  {day.sessions.map((s) => (
                    <span
                      key={s.id}
                      className="px-1.5 py-0.5 rounded bg-[var(--color-accent-lavender)]/60 text-[10px] font-medium text-[var(--color-text)] truncate max-w-[150px]"
                      title={s.title}
                    >
                      {s.title} ({s.durationMinutes}m)
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer Link ── */}
      <div className="pt-2 flex items-center justify-between text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
        <span>Capacity is controlled by your Study Planner settings.</span>
        <Link
          href="/app/planner"
          className="flex items-center gap-1 font-semibold text-[var(--color-primary-dark)] hover:underline"
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Edit Availability</span>
        </Link>
      </div>
    </div>
  );
}
