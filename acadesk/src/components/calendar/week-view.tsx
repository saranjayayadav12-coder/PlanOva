"use client";

import { DayCalendarInfo, CalendarEvent } from "@/types/calendar";
import {
  Clock,
  Flag,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui";

interface WeekViewProps {
  weekDays: DayCalendarInfo[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddTaskForDate: (dateStr: string) => void;
}

const WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Check if session overlaps with any other session in the same list
 */
function isSessionOverlapping(
  session: CalendarEvent,
  allDaySessions: CalendarEvent[]
): boolean {
  if (!session.startTime || !session.endTime) return false;
  const [sH, sM] = session.startTime.split(":").map(Number);
  const [eH, eM] = session.endTime.split(":").map(Number);
  const startMins = (sH || 0) * 60 + (sM || 0);
  const endMins = (eH || 0) * 60 + (eM || 0);

  return allDaySessions.some((other) => {
    if (other.id === session.id) return false;
    if (!other.startTime || !other.endTime) return false;
    const [oS, oSM] = other.startTime.split(":").map(Number);
    const [oE, oEM] = other.endTime.split(":").map(Number);
    const otherStart = (oS || 0) * 60 + (oSM || 0);
    const otherEnd = (oE || 0) * 60 + (oEM || 0);

    return Math.max(startMins, otherStart) < Math.min(endMins, otherEnd);
  });
}

export function WeekView({
  weekDays,
  selectedDate,
  onSelectDate,
  onEventClick,
  onAddTaskForDate,
}: WeekViewProps) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] overflow-hidden">
      {/* ── 7-Day Header Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)] border-b border-[var(--color-border)] bg-[var(--color-background)]/60">
        {weekDays.map((day, idx) => {
          const isSelected = day.date === selectedDate;
          return (
            <div
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              className={`p-3 text-center cursor-pointer transition-colors ${
                isSelected
                  ? "bg-[var(--color-accent-lavender)]/35 ring-2 ring-inset ring-[var(--color-primary)]"
                  : "hover:bg-[var(--color-accent-lavender)]/15"
              }`}
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                {WEEKDAY_NAMES[idx]}
              </div>
              <div className="mt-1 flex items-center justify-center">
                <span
                  className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-all ${
                    day.isToday
                      ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-xs)]"
                      : isSelected
                      ? "text-[var(--color-primary-dark)] font-black text-sm"
                      : "text-[var(--color-text)]"
                  }`}
                >
                  {day.dayOfMonth}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── All-Day Task Deadlines Row ── */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary-dark)] mb-2 flex items-center gap-1.5">
          <Flag className="h-3.5 w-3.5 text-[var(--color-primary)]" />
          <span>All-Day Deliverables & Deadlines</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
          {weekDays.map((day) => {
            const deadlines = day.events.filter(
              (e) => e.type === "task_deadline"
            );

            return (
              <div
                key={`deadlines-${day.date}`}
                className="space-y-1.5 min-h-[44px] pt-1 sm:pt-0 sm:px-1.5"
              >
                {deadlines.length === 0 ? (
                  <span className="text-[10px] text-[var(--color-text-muted)] italic block py-1">
                    No deadlines
                  </span>
                ) : (
                  deadlines.map((evt) => (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => {
                        onSelectDate(day.date);
                        onEventClick(evt);
                      }}
                      className={`w-full text-left p-1.5 rounded-[var(--radius-sm)] border text-[11px] transition-all hover:scale-[1.01] hover:shadow-xs ${
                        evt.isCompleted
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 line-through opacity-75"
                          : evt.isOverdue
                          ? "bg-rose-50 text-rose-900 border-rose-300 font-semibold"
                          : evt.priority === "high"
                          ? "bg-rose-50/90 text-rose-800 border-rose-200 font-medium"
                          : "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200"
                      }`}
                    >
                      <div className="flex items-center gap-1 font-semibold truncate">
                        {evt.isCompleted ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                        ) : evt.isOverdue ? (
                          <AlertCircle className="h-3 w-3 text-rose-600 shrink-0" />
                        ) : (
                          <Flag className="h-3 w-3 text-[var(--color-primary)] shrink-0" />
                        )}
                        <span className="truncate">{evt.title}</span>
                      </div>
                      <div className="text-[10px] opacity-80 truncate pl-4">
                        {evt.subject}
                      </div>
                    </button>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Timed Study Sessions Columns ── */}
      <div className="p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-purple-800 mb-2.5 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-purple-600" />
          <span>Scheduled Study Blocks (Accepted Plan)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
          {weekDays.map((day) => {
            const sessions = day.events
              .filter((e) => e.type === "study_session")
              .sort((a, b) =>
                (a.startTime || "00:00").localeCompare(b.startTime || "00:00")
              );

            return (
              <div
                key={`sessions-${day.date}`}
                className="space-y-2 min-h-[140px] pt-1 sm:pt-0 sm:px-1.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5 flex-1">
                  {sessions.length === 0 ? (
                    <div className="text-center py-6 text-[11px] text-[var(--color-text-muted)] italic">
                      No study sessions
                    </div>
                  ) : (
                    sessions.map((sess) => {
                      const isOverlapping = isSessionOverlapping(
                        sess,
                        sessions
                      );

                      return (
                        <button
                          key={sess.id}
                          type="button"
                          onClick={() => {
                            onSelectDate(day.date);
                            onEventClick(sess);
                          }}
                          className={`w-full text-left p-2 rounded-[var(--radius-md)] border text-xs transition-all hover:shadow-xs ${
                            sess.isCompleted
                              ? "bg-emerald-50/80 text-emerald-900 border-emerald-200 line-through opacity-75"
                              : isOverlapping
                              ? "bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-400"
                              : "bg-purple-50/80 text-purple-950 border-purple-200 hover:bg-purple-100/60"
                          }`}
                        >
                          {/* Time tag */}
                          <div className="flex items-center justify-between gap-1 text-[10px] font-bold text-purple-700 mb-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />
                              {sess.startTime || "--:--"} – {sess.endTime || "--:--"}
                            </span>
                            {isOverlapping && (
                              <span
                                className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-amber-200 text-amber-900 text-[9px] font-extrabold"
                                title="Overlaps with another study block on this date"
                              >
                                <AlertTriangle className="h-2.5 w-2.5" />
                                Overlap
                              </span>
                            )}
                          </div>

                          {/* Session title */}
                          <div className="font-semibold text-[11px] truncate leading-tight">
                            {sess.title}
                          </div>

                          {/* Subject / Duration */}
                          <div className="text-[10px] text-[var(--color-text-muted)] truncate mt-0.5">
                            {sess.subject} • {sess.durationMinutes}m
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Quick Add Task button on hover */}
                <button
                  type="button"
                  onClick={() => onAddTaskForDate(day.date)}
                  className="w-full mt-2 py-1 text-[10px] font-medium text-[var(--color-primary)] hover:bg-[var(--color-accent-lavender)]/30 rounded border border-dashed border-[var(--color-border)] flex items-center justify-center gap-1 transition-colors"
                  aria-label={`Add task for ${day.date}`}
                >
                  <Plus className="h-2.5 w-2.5" />
                  <span>Add Task</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
