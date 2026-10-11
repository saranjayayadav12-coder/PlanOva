"use client";

import { useMemo } from "react";
import {
  DayCalendarInfo,
  CalendarEvent,
} from "@/types/calendar";
import { Clock, Flag, CheckCircle2, AlertCircle } from "lucide-react";

interface MonthViewProps {
  days: DayCalendarInfo[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthView({
  days,
  selectedDate,
  onSelectDate,
  onEventClick,
}: MonthViewProps) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] overflow-hidden">
      {/* ── Weekday Headers ── */}
      <div className="grid grid-cols-7 border-b border-[var(--color-border)] bg-[var(--color-background)]/60 text-center text-xs font-bold text-[var(--color-text-muted)] py-2.5">
        {WEEKDAY_NAMES.map((name) => (
          <div key={name} className="uppercase tracking-wider text-[11px]">
            {name}
          </div>
        ))}
      </div>

      {/* ── 7-Column Calendar Grid ── */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[var(--color-border)]">
        {days.map((day) => {
          const isSelected = day.date === selectedDate;
          const maxVisibleEvents = 2;
          const visibleEvents = day.events.slice(0, maxVisibleEvents);
          const hiddenCount = Math.max(0, day.events.length - maxVisibleEvents);

          return (
            <div
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectDate(day.date);
                }
              }}
              aria-label={`${day.date}, ${day.events.length} event${
                day.events.length === 1 ? "" : "s"
              }`}
              className={`min-h-[92px] sm:min-h-[110px] md:min-h-[124px] p-1.5 sm:p-2 transition-all flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                !day.isCurrentMonth
                  ? "bg-slate-50/50 text-[var(--color-text-muted)] opacity-60 hover:opacity-90"
                  : "bg-[var(--color-surface)] hover:bg-[var(--color-accent-lavender)]/15"
              } ${
                isSelected
                  ? "ring-2 ring-inset ring-[var(--color-primary)] bg-[var(--color-accent-lavender)]/25"
                  : ""
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <span
                  className={`inline-flex items-center justify-center text-xs font-bold rounded-full h-6 w-6 transition-colors ${
                    day.isToday
                      ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-xs)]"
                      : isSelected
                      ? "text-[var(--color-primary-dark)] font-extrabold"
                      : day.isCurrentMonth
                      ? "text-[var(--color-text)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {day.dayOfMonth}
                </span>

                {/* Overdue / Deadlines Indicator Dot */}
                {day.hasOverdue && (
                  <span
                    className="inline-block h-2 w-2 rounded-full bg-rose-500 shadow-xs animate-pulse"
                    title="Contains overdue deliverable"
                  />
                )}
              </div>

              {/* Event Chips List */}
              <div className="space-y-1 flex-1 overflow-hidden">
                {visibleEvents.map((evt) => {
                  const isDeadline = evt.type === "task_deadline";

                  let chipStyle = "";
                  if (evt.isCompleted) {
                    chipStyle = "bg-emerald-50 text-emerald-800 border-emerald-200 line-through opacity-75";
                  } else if (evt.isOverdue) {
                    chipStyle = "bg-rose-50 text-rose-900 border-rose-300 font-semibold";
                  } else if (isDeadline) {
                    chipStyle =
                      evt.priority === "high"
                        ? "bg-rose-50/90 text-rose-800 border-rose-200"
                        : "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200";
                  } else {
                    chipStyle = "bg-purple-50 text-purple-900 border-purple-200";
                  }

                  return (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDate(day.date);
                        onEventClick(evt);
                      }}
                      className={`w-full text-left truncate px-1.5 py-0.5 rounded-[var(--radius-xs)] border text-[10px] sm:text-[11px] leading-tight flex items-center gap-1 transition-all hover:scale-[1.01] hover:shadow-xs ${chipStyle}`}
                      title={`${evt.title} (${isDeadline ? "Deadline" : `Study Session ${evt.startTime || ""}`})`}
                    >
                      {evt.isCompleted ? (
                        <CheckCircle2 className="h-2.5 w-2.5 shrink-0 text-emerald-600" />
                      ) : evt.isOverdue ? (
                        <AlertCircle className="h-2.5 w-2.5 shrink-0 text-rose-600" />
                      ) : isDeadline ? (
                        <Flag className="h-2.5 w-2.5 shrink-0 text-[var(--color-primary)]" />
                      ) : (
                        <Clock className="h-2.5 w-2.5 shrink-0 text-purple-600" />
                      )}
                      <span className="truncate">
                        {!isDeadline && evt.startTime ? `${evt.startTime} ` : ""}
                        {evt.title}
                      </span>
                    </button>
                  );
                })}

                {/* +N More indicator */}
                {hiddenCount > 0 && (
                  <div
                    className="text-[10px] font-bold text-[var(--color-primary-dark)] px-1 hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDate(day.date);
                    }}
                  >
                    +{hiddenCount} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
