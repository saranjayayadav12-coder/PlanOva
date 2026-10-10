"use client";

import Link from "next/link";
import {
  AlertCircle,
  Clock,
  Calendar,
  Layers,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui";
import { DeadlinePressureAnalysis } from "@/types/workload";

interface DeadlinePressureCardProps {
  analysis: DeadlinePressureAnalysis;
}

export function DeadlinePressureCard({ analysis }: DeadlinePressureCardProps) {
  const { overdueTasks, dueTodayTasks, dueWithin3DaysTasks, clusterDays } = analysis;
  const totalPressureCount =
    overdueTasks.length + dueTodayTasks.length + dueWithin3DaysTasks.length;

  if (totalPressureCount === 0 && clusterDays.length === 0) {
    return (
      <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-xs)]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-[var(--color-primary)]" />
            <h2 className="text-base font-bold text-[var(--color-text)]">
              Deadline Pressure Analysis
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Balanced
          </span>
        </div>

        <div className="text-center py-6">
          <div className="h-10 w-10 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-sm font-bold text-[var(--color-text)]">
            No Immediate Deadline Pressure
          </p>
          <p className="text-xs text-[var(--color-text-muted)] max-w-md mx-auto mt-1">
            You have no overdue or urgent deliverables due within the next 3 days. Your academic schedule is currently well-paced.
          </p>
          <div className="mt-4">
            <Link href="/app/tasks">
              <Button variant="outline" size="sm" className="text-xs">
                View All Deliverables
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 sm:p-6 shadow-[var(--shadow-xs)] space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] shrink-0"
            style={{ backgroundColor: "var(--color-accent-pink)" }}
          >
            <Clock className="h-4 w-4 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--color-text)]">
              Deadline Pressure Points
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Track deliverables needing timely attention before due dates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {overdueTasks.length > 0 && (
            <Link href="/app/recovery">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1 text-rose-700 border-rose-300 hover:bg-rose-50"
              >
                <span>Academic Recovery</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ── Overdue Section ── */}
      {overdueTasks.length > 0 && (
        <div className="p-3.5 rounded-[var(--radius-lg)] bg-rose-50/70 border border-rose-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span className="text-xs font-bold text-rose-900">
                Overdue Tasks ({overdueTasks.length})
              </span>
            </div>
            <span className="text-[11px] font-semibold text-rose-700">
              Needs re-slotting
            </span>
          </div>

          <div className="space-y-1.5">
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-white/90 p-2 rounded-[var(--radius-md)] text-xs border border-rose-100"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-semibold text-gray-900 truncate block">
                    {task.title}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {task.subject} • {task.estimatedDurationMinutes} mins
                  </span>
                </div>
                <span className="shrink-0 text-[11px] font-bold text-rose-700 font-mono">
                  Due: {task.deadline}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Due Today Section ── */}
      {dueTodayTasks.length > 0 && (
        <div className="p-3.5 rounded-[var(--radius-lg)] bg-amber-50/70 border border-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              <span className="text-xs font-bold text-amber-900">
                Due Today ({dueTodayTasks.length})
              </span>
            </div>
            <span className="text-[11px] font-semibold text-amber-700">
              Top priority for today
            </span>
          </div>

          <div className="space-y-1.5">
            {dueTodayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-white/90 p-2 rounded-[var(--radius-md)] text-xs border border-amber-100"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-semibold text-gray-900 truncate block">
                    {task.title}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {task.subject} • {task.estimatedDurationMinutes} mins
                  </span>
                </div>
                <span className="shrink-0 text-[11px] font-bold text-amber-800 font-mono">
                  Today
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Due in 3 Days Section ── */}
      {dueWithin3DaysTasks.length > 0 && (
        <div className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--color-accent-lavender)]/40 border border-[var(--color-primary-light)]/50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
              <span className="text-xs font-bold text-[var(--color-text)]">
                Approaching Deadlines (Next 3 Days) ({dueWithin3DaysTasks.length})
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[var(--color-primary-dark)]">
              Upcoming focus
            </span>
          </div>

          <div className="space-y-1.5">
            {dueWithin3DaysTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-white/90 p-2 rounded-[var(--radius-md)] text-xs border border-purple-100"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-semibold text-gray-900 truncate block">
                    {task.title}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {task.subject} • {task.estimatedDurationMinutes} mins
                  </span>
                </div>
                <span className="shrink-0 text-[11px] font-semibold text-gray-700 font-mono">
                  {task.deadline}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Clustered Deadline Days ── */}
      {clusterDays.length > 0 && (
        <div className="p-3.5 rounded-[var(--radius-lg)] bg-purple-50/50 border border-purple-200/70 space-y-2">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-purple-700 shrink-0" />
            <span className="text-xs font-bold text-purple-950">
              Clustered Deadline Days ({clusterDays.length})
            </span>
          </div>
          <p className="text-[11px] text-purple-800">
            These dates have multiple active assignments due concurrently. Spacing out your preparation avoids high-stress cramming.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {clusterDays.map((cluster) => (
              <div
                key={cluster.date}
                className="p-2.5 rounded-[var(--radius-md)] bg-white border border-purple-100 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-purple-900">
                  <span>{cluster.formattedDate}</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-100 text-[10px] text-purple-800">
                    {cluster.tasks.length} due
                  </span>
                </div>
                <ul className="text-[11px] text-gray-600 list-disc list-inside">
                  {cluster.tasks.map((t) => (
                    <li key={t.id} className="truncate">
                      {t.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
