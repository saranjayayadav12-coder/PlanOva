"use client";

import { DayCalendarInfo, CalendarEvent } from "@/types/calendar";
import {
  Clock,
  Flag,
  CheckCircle2,
  AlertCircle,
  Plus,
  Calendar as CalendarIcon,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";

interface DayViewProps {
  dayInfo: DayCalendarInfo;
  onEventClick: (event: CalendarEvent) => void;
  onAddTask: () => void;
  onToggleTaskComplete?: (taskId: string) => void;
}

export function DayView({
  dayInfo,
  onEventClick,
  onAddTask,
  onToggleTaskComplete,
}: DayViewProps) {
  const deadlines = dayInfo.events.filter((e) => e.type === "task_deadline");
  const sessions = dayInfo.events
    .filter((e) => e.type === "study_session")
    .sort((a, b) =>
      (a.startTime || "00:00").localeCompare(b.startTime || "00:00")
    );

  const totalStudyMinutes = sessions.reduce(
    (sum, s) => sum + (s.durationMinutes || 0),
    0
  );
  const completedCount = dayInfo.events.filter((e) => e.isCompleted).length;

  return (
    <div className="space-y-4">
      {/* ── Day Summary Overview Card ── */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-accent-lavender)] text-[var(--color-primary-dark)] font-black text-xl shadow-[var(--shadow-xs)]">
              {dayInfo.dayOfMonth}
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--color-primary-dark)] uppercase tracking-wider">
                {dayInfo.isToday ? "Today's Schedule" : "Selected Day Schedule"}
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[var(--color-text)] tracking-tight">
                {dayInfo.date}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button
              variant="primary"
              size="sm"
              onClick={onAddTask}
              className="gap-1.5 text-xs shadow-[var(--shadow-sm)]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Task for this Date</span>
            </Button>
          </div>
        </div>

        {/* Quick Day Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="rounded-[var(--radius-md)] bg-[var(--color-background)]/60 p-2.5 border border-[var(--color-border)]">
            <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
              Deadlines Due
            </div>
            <div className="text-lg font-black text-[var(--color-text)]">
              {deadlines.length}
            </div>
          </div>

          <div className="rounded-[var(--radius-md)] bg-[var(--color-background)]/60 p-2.5 border border-[var(--color-border)]">
            <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
              Study Blocks
            </div>
            <div className="text-lg font-black text-purple-700">
              {sessions.length}
            </div>
          </div>

          <div className="rounded-[var(--radius-md)] bg-[var(--color-background)]/60 p-2.5 border border-[var(--color-border)]">
            <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
              Planned Focus
            </div>
            <div className="text-lg font-black text-[var(--color-text)]">
              {totalStudyMinutes}m
            </div>
          </div>

          <div className="rounded-[var(--radius-md)] bg-[var(--color-background)]/60 p-2.5 border border-[var(--color-border)]">
            <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
              Completed Items
            </div>
            <div className="text-lg font-black text-emerald-700">
              {completedCount}
            </div>
          </div>
        </div>
      </div>

      {/* ── Empty State if no events ── */}
      {dayInfo.events.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-background)] text-[var(--color-text-muted)] mb-1">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-[var(--color-text)]">
            No Events Scheduled for this Day
          </h4>
          <p className="text-xs text-[var(--color-text-muted)] max-w-md mx-auto">
            You have no assignments due or study blocks planned on {dayInfo.date}. Enjoy a well-deserved rest, or schedule a task or focus block.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={onAddTask} className="gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>Create Task</span>
            </Button>
            <Link href="/app/planner">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Open Planner</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ── Section A: Task Deadlines ── */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 shadow-[var(--shadow-sm)] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-1.5">
                <Flag className="h-4 w-4 text-[var(--color-primary)]" />
                <span>Deliverables & Deadlines ({deadlines.length})</span>
              </h4>
            </div>

            {deadlines.length === 0 ? (
              <p className="text-xs text-[var(--color-text-muted)] italic py-3">
                No assignment deadlines on this date.
              </p>
            ) : (
              <div className="space-y-2">
                {deadlines.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onEventClick(evt)}
                    className={`p-3 rounded-[var(--radius-lg)] border cursor-pointer transition-all hover:shadow-xs flex items-start justify-between gap-3 ${
                      evt.isCompleted
                        ? "bg-emerald-50/70 border-emerald-200 line-through opacity-80"
                        : evt.isOverdue
                        ? "bg-rose-50/80 border-rose-300"
                        : "bg-[var(--color-surface-elevated)] border-[var(--color-border)] hover:border-[var(--color-primary)]"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-[var(--color-text)] truncate">
                          {evt.title}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            evt.priority === "high"
                              ? "bg-rose-100 text-rose-800"
                              : evt.priority === "medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {evt.priority}
                        </span>
                        {evt.isOverdue && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-200 text-rose-900">
                            Overdue
                          </span>
                        )}
                        {evt.isCompleted && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--color-text-muted)]">
                        {evt.subject}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {onToggleTaskComplete && evt.task && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTaskComplete(evt.task!.id);
                          }}
                          className={`p-1 rounded-[var(--radius-sm)] border text-xs transition-colors ${
                            evt.isCompleted
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "border-[var(--color-border)] hover:bg-[var(--color-background)] text-[var(--color-text-muted)]"
                          }`}
                          aria-label={evt.isCompleted ? "Mark incomplete" : "Mark complete"}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Section B: Timed Study Sessions ── */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 shadow-[var(--shadow-sm)] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-purple-900 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-purple-600" />
                <span>Scheduled Study Blocks ({sessions.length})</span>
              </h4>
              <Link
                href="/app/planner"
                className="text-[11px] font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-0.5"
              >
                <span>Study Planner</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {sessions.length === 0 ? (
              <p className="text-xs text-[var(--color-text-muted)] italic py-3">
                No study blocks scheduled on this date.
              </p>
            ) : (
              <div className="space-y-2">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    onClick={() => onEventClick(sess)}
                    className={`p-3 rounded-[var(--radius-lg)] border cursor-pointer transition-all hover:shadow-xs flex items-start justify-between gap-3 ${
                      sess.isCompleted
                        ? "bg-emerald-50/70 border-emerald-200 line-through opacity-80"
                        : "bg-purple-50/60 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-[var(--color-text)] truncate">
                          {sess.title}
                        </span>
                        <span className="text-[10px] font-semibold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded">
                          {sess.startTime || "--:--"} – {sess.endTime || "--:--"}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--color-text-muted)]">
                        {sess.subject} • {sess.durationMinutes} mins
                        {sess.parentTaskTitle && (
                          <span className="ml-1 opacity-75">
                            (for {sess.parentTaskTitle})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          sess.status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : sess.status === "in_progress"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {sess.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
