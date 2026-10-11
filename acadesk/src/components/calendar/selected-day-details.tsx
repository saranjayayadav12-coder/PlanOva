"use client";

import { DayCalendarInfo, CalendarEvent } from "@/types/calendar";
import {
  Calendar as CalendarIcon,
  Flag,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui";
import { formatDayTitle } from "@/lib/calendar-service";
import Link from "next/link";

interface SelectedDayDetailsProps {
  dayInfo: DayCalendarInfo;
  onAddTask: () => void;
  onEventClick: (event: CalendarEvent) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onViewDayMode: () => void;
}

export function SelectedDayDetails({
  dayInfo,
  onAddTask,
  onEventClick,
  onToggleTaskComplete,
  onViewDayMode,
}: SelectedDayDetailsProps) {
  const deadlines = dayInfo.events.filter((e) => e.type === "task_deadline");
  const sessions = dayInfo.events
    .filter((e) => e.type === "study_session")
    .sort((a, b) =>
      (a.startTime || "00:00").localeCompare(b.startTime || "00:00")
    );

  const formattedTitle = formatDayTitle(dayInfo.date);

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 shadow-[var(--shadow-sm)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--color-border)]">
        <div>
          <div className="text-[10px] font-bold text-[var(--color-primary-dark)] uppercase tracking-wider">
            {dayInfo.isToday ? "Today's Agenda" : "Day Agenda"}
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-[var(--color-text)] tracking-tight">
            {formattedTitle}
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDayMode}
            className="text-xs h-8 px-2.5"
            aria-label="Switch to Day View for this date"
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            <span>Day View</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onAddTask}
            className="text-xs h-8 px-2.5 shadow-[var(--shadow-xs)]"
            aria-label="Add task due on this date"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      {/* Deadlines Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--color-text)] flex items-center gap-1.5">
            <Flag className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Deliverables Due ({deadlines.length})</span>
          </span>
        </div>

        {deadlines.length === 0 ? (
          <p className="text-[11px] text-[var(--color-text-muted)] italic py-1">
            No deadlines due on this day.
          </p>
        ) : (
          <div className="space-y-1.5">
            {deadlines.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onEventClick(evt)}
                className={`p-2.5 rounded-[var(--radius-md)] border text-xs cursor-pointer transition-all hover:shadow-xs flex items-center justify-between gap-2 ${
                  evt.isCompleted
                    ? "bg-emerald-50/70 border-emerald-200 line-through opacity-80"
                    : evt.isOverdue
                    ? "bg-rose-50 border-rose-300"
                    : "bg-[var(--color-surface-elevated)] border-[var(--color-border)] hover:border-[var(--color-primary)]"
                }`}
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-[var(--color-text)] truncate">
                      {evt.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1 py-0.2 rounded ${
                        evt.priority === "high"
                          ? "bg-rose-100 text-rose-800"
                          : evt.priority === "medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {evt.priority}
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--color-text-muted)] truncate">
                    {evt.subject}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {evt.task && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTaskComplete(evt.task!.id);
                      }}
                      className={`p-1 rounded-[var(--radius-xs)] border transition-colors ${
                        evt.isCompleted
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "border-[var(--color-border)] hover:bg-[var(--color-background)] text-[var(--color-text-muted)]"
                      }`}
                      aria-label={
                        evt.isCompleted
                          ? "Mark deliverable as pending"
                          : "Mark deliverable as completed"
                      }
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Study Sessions Section */}
      <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-purple-600" />
            <span>Scheduled Study Blocks ({sessions.length})</span>
          </span>
          {sessions.length > 0 && (
            <Link
              href="/app/planner"
              className="text-[10px] font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-0.5"
            >
              <span>Planner</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          )}
        </div>

        {sessions.length === 0 ? (
          <p className="text-[11px] text-[var(--color-text-muted)] italic py-1">
            No study blocks scheduled on this day.
          </p>
        ) : (
          <div className="space-y-1.5">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => onEventClick(sess)}
                className={`p-2.5 rounded-[var(--radius-md)] border text-xs cursor-pointer transition-all hover:shadow-xs flex items-center justify-between gap-2 ${
                  sess.isCompleted
                    ? "bg-emerald-50/70 border-emerald-200 line-through opacity-80"
                    : "bg-purple-50/60 border-purple-200 hover:bg-purple-50"
                }`}
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-[var(--color-text)] truncate">
                      {sess.title}
                    </span>
                  </div>
                  <div className="text-[10px] text-purple-800 font-medium">
                    {sess.startTime || "--:--"} – {sess.endTime || "--:--"} • {sess.subject} ({sess.durationMinutes}m)
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`text-[9px] font-bold uppercase px-1 py-0.2 rounded ${
                      sess.status === "completed"
                        ? "bg-emerald-100 text-emerald-800"
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
  );
}
