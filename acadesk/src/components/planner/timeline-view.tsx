"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui";
import { PlannedSession, StudyPlan } from "@/types/planner";
import { parseDateISO } from "@/lib/study-planner-service";

interface TimelineViewProps {
  plan: StudyPlan | null;
  onEditSession: (session: PlannedSession) => void;
  onToggleSessionStatus: (sessionId: string) => void;
  onMarkIncomplete?: (sessionId: string) => void;
  onRemoveSession: (sessionId: string) => void;
}

export function TimelineView({
  plan,
  onEditSession,
  onToggleSessionStatus,
  onMarkIncomplete,
  onRemoveSession,
}: TimelineViewProps) {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

  if (!plan || plan.sessions.length === 0) {
    return (
      <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-12 text-center shadow-[var(--shadow-xs)]">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full mb-4"
          style={{ backgroundColor: "var(--color-accent-lavender)" }}
        >
          <Calendar className="h-7 w-7 text-[var(--color-primary)]" />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text)]">
          No Study Sessions Scheduled Yet
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)] max-w-sm mx-auto">
          Click <strong>Generate Study Plan</strong> above to intelligently assemble sessions tailored to your deadlines and study hours.
        </p>
      </div>
    );
  }

  // Group sessions by date
  const sessionsByDate: Record<string, PlannedSession[]> = {};
  for (const session of plan.sessions) {
    if (!sessionsByDate[session.date]) {
      sessionsByDate[session.date] = [];
    }
    sessionsByDate[session.date].push(session);
  }

  // Sort dates
  const sortedDates = Object.keys(sessionsByDate).sort();

  return (
    <div className="space-y-4">
      {/* ── View Mode Controls ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[var(--color-primary)]" />
          <h3 className="text-sm font-bold text-[var(--color-text)]">
            Study Schedule Timeline
          </h3>
          <span className="text-xs text-[var(--color-text-muted)]">
            ({plan.sessions.length} sessions)
          </span>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setViewMode("daily")}
            className={`px-3 py-1 rounded-[var(--radius-md)] text-xs font-semibold transition-all ${
              viewMode === "daily"
                ? "bg-[var(--color-primary)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Daily Detailed
          </button>
          <button
            type="button"
            onClick={() => setViewMode("weekly")}
            className={`px-3 py-1 rounded-[var(--radius-md)] text-xs font-semibold transition-all ${
              viewMode === "weekly"
                ? "bg-[var(--color-primary)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Weekly Grid
          </button>
        </div>
      </div>

      {/* ── Daily Detailed View ── */}
      {viewMode === "daily" ? (
        <div className="space-y-4">
          {sortedDates.map((dateStr) => {
            const dateObj = parseDateISO(dateStr);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            });

            const daySessions = sessionsByDate[dateStr];
            const dayTotalMinutes = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

            return (
              <div
                key={dateStr}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden shadow-[var(--shadow-xs)]"
              >
                {/* Day Header */}
                <div className="px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                    <span className="text-sm font-bold text-[var(--color-text)]">
                      {formattedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)]">
                    <span>{daySessions.length} sessions</span>
                    <span>•</span>
                    <span className="text-[var(--color-primary-dark)]">{dayTotalMinutes} mins</span>
                  </div>
                </div>

                {/* Session Items */}
                <div className="p-3 sm:p-4 space-y-2.5">
                  {daySessions.map((session) => {
                    const isDone = session.status === "completed";
                    const isIncomplete = session.status === "incomplete";

                    return (
                      <div
                        key={session.id}
                        className={`p-3 rounded-[var(--radius-lg)] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isDone
                            ? "border-[var(--color-border)] bg-[var(--color-background)]/60 opacity-75"
                            : isIncomplete
                            ? "border-amber-300 bg-amber-50/50"
                            : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary-light)]"
                        }`}
                      >
                        {/* Left: Status Toggle + Title + Meta */}
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={() => onToggleSessionStatus(session.id)}
                            className="mt-0.5 rounded-full p-0.5 text-[var(--color-primary)] hover:opacity-80 transition-opacity"
                            aria-label={isDone ? "Mark pending" : isIncomplete ? "Mark completed" : "Mark completed"}
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-5 w-5 text-[var(--color-success)] fill-green-100" />
                            ) : isIncomplete ? (
                              <AlertCircle className="h-5 w-5 text-amber-600 fill-amber-100" />
                            ) : (
                              <Circle className="h-5 w-5 text-[var(--color-text-muted)]" />
                            )}
                          </button>

                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs sm:text-sm font-semibold truncate ${
                                  isDone
                                    ? "line-through text-[var(--color-text-muted)]"
                                    : "text-[var(--color-text)]"
                                }`}
                              >
                                {session.title}
                              </span>

                              {session.isSubtask && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-accent-lavender)] text-[var(--color-primary-dark)]">
                                  Subtask
                                </span>
                              )}

                              {isIncomplete && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                                  Incomplete ({session.remainingMinutes || session.durationMinutes}m left)
                                </span>
                              )}

                              {session.diffTag === "added" && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                  Rescheduled
                                </span>
                              )}
                              {session.diffTag === "moved" && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                  Shifted
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)] flex-wrap">
                              <span className="font-semibold text-[var(--color-primary-dark)]">
                                {session.subject}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 font-mono">
                                <Clock className="h-3 w-3" />
                                {session.startTime} – {session.endTime} ({session.durationMinutes}m)
                              </span>
                              {session.deadline && (
                                <>
                                  <span>•</span>
                                  <span>Due: {session.deadline}</span>
                                </>
                              )}
                            </div>

                            {session.outcomeNote && (
                              <p className="text-[10px] text-amber-800 italic pt-0.5">
                                Note: {session.outcomeNote}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                          {onMarkIncomplete && !isDone && !isIncomplete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onMarkIncomplete(session.id)}
                              className="h-8 px-2 text-xs text-amber-700 hover:text-amber-800 hover:bg-amber-100/60"
                              title="Mark incomplete with remaining work to reschedule"
                            >
                              <AlertCircle className="h-3.5 w-3.5 mr-1 text-amber-600" />
                              <span>Need More Time</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditSession(session)}
                            className="h-8 px-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                          >
                            <Edit2 className="h-3.5 w-3.5 mr-1" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveSession(session.id)}
                            className="h-8 px-2 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Weekly Grid View ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedDates.map((dateStr) => {
            const dateObj = parseDateISO(dateStr);
            const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
            const dayNum = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const daySessions = sessionsByDate[dateStr];
            const dayMins = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

            return (
              <div
                key={dateStr}
                className="p-3.5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] space-y-2.5 shadow-[var(--shadow-xs)]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                  <div>
                    <span className="text-xs font-bold text-[var(--color-text)]">
                      {dayName}, {dayNum}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[var(--color-primary-dark)]">
                    {dayMins} mins
                  </span>
                </div>

                <div className="space-y-1.5">
                  {daySessions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => onEditSession(s)}
                      className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition-all cursor-pointer text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[var(--color-text)] truncate max-w-[170px]">
                          {s.title}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                          {s.startTime}
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--color-primary-dark)] mt-0.5">
                        {s.subject} ({s.durationMinutes}m)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
