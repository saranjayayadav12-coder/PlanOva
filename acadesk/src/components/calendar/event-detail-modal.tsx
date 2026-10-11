"use client";

import { useEffect } from "react";
import {
  X,
  Flag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit2,
  ExternalLink,
  BookOpen,
  ListTodo,
} from "lucide-react";
import { Button } from "@/components/ui";
import { CalendarEvent } from "@/types/calendar";
import { TaskBreakdown } from "@/types/subtask";
import Link from "next/link";

interface EventDetailModalProps {
  isOpen: boolean;
  event: CalendarEvent | null;
  breakdown?: TaskBreakdown;
  onClose: () => void;
  onEditTask?: (event: CalendarEvent) => void;
  onToggleTaskComplete?: (taskId: string) => void;
  onToggleSessionComplete?: (sessionId: string) => void;
}

export function EventDetailModal({
  isOpen,
  event,
  breakdown,
  onClose,
  onEditTask,
  onToggleTaskComplete,
  onToggleSessionComplete,
}: EventDetailModalProps) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const isDeadline = event.type === "task_deadline";
  const subtasks = breakdown?.subtasks || [];
  const completedSubtasksCount = subtasks.filter(
    (s) => s.status === "completed"
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-event-title"
    >
      <div className="relative w-full max-w-lg rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] ${
                isDeadline
                  ? "bg-rose-100 text-rose-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {isDeadline ? (
                <Flag className="h-5 w-5" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary-dark)]">
                {isDeadline ? "Assignment Deliverable" : "AI Study Block"}
              </span>
              <h3
                id="calendar-event-title"
                className="text-lg font-bold text-[var(--color-text)] leading-snug"
              >
                {event.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Badges / Meta Info */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--color-accent-lavender)] text-[var(--color-primary-dark)]">
            {event.subject}
          </span>

          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-[var(--radius-sm)] ${
              event.priority === "high"
                ? "bg-rose-100 text-rose-800"
                : event.priority === "medium"
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {event.priority.toUpperCase()} Priority
          </span>

          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-[var(--radius-sm)] ${
              event.isCompleted
                ? "bg-emerald-100 text-emerald-800"
                : event.isOverdue
                ? "bg-rose-100 text-rose-900"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {event.isCompleted
              ? "Completed"
              : event.isOverdue
              ? "Overdue"
              : event.status}
          </span>
        </div>

        {/* Detailed Attributes */}
        <div className="space-y-3 rounded-[var(--radius-lg)] bg-[var(--color-background)]/50 p-4 border border-[var(--color-border)] text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block">
                Target Date
              </span>
              <span className="font-bold text-[var(--color-text)]">
                {event.date}
              </span>
            </div>

            {!isDeadline && (
              <div>
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block">
                  Scheduled Time & Duration
                </span>
                <span className="font-bold text-purple-900">
                  {event.startTime || "--:--"} – {event.endTime || "--:--"} ({event.durationMinutes}m)
                </span>
              </div>
            )}

            {isDeadline && event.task?.estimatedDurationMinutes && (
              <div>
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block">
                  Estimated Total Work
                </span>
                <span className="font-bold text-[var(--color-text)]">
                  {event.task.estimatedDurationMinutes} minutes
                </span>
              </div>
            )}
          </div>

          {/* Task Description */}
          {isDeadline && event.task?.description && (
            <div className="pt-2 border-t border-[var(--color-border)]">
              <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block mb-1">
                Description / Notes
              </span>
              <p className="text-xs text-[var(--color-text)] leading-relaxed">
                {event.task.description}
              </p>
            </div>
          )}

          {/* Session Parent / Notes */}
          {!isDeadline && event.parentTaskTitle && (
            <div className="pt-2 border-t border-[var(--color-border)]">
              <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block mb-1">
                Parent Assignment
              </span>
              <span className="font-medium text-[var(--color-text)]">
                {event.parentTaskTitle}
              </span>
            </div>
          )}

          {!isDeadline && event.session?.outcomeNote && (
            <div className="pt-2 border-t border-[var(--color-border)]">
              <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block mb-1">
                Session Reflection / Notes
              </span>
              <p className="text-xs italic text-[var(--color-text)]">
                &ldquo;{event.session.outcomeNote}&rdquo;
              </p>
            </div>
          )}

          {/* Subtask Breakdown Summary if present */}
          {isDeadline && subtasks.length > 0 && (
            <div className="pt-2 border-t border-[var(--color-border)] space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[var(--color-text)] flex items-center gap-1">
                  <ListTodo className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                  <span>Subtask Progress</span>
                </span>
                <span className="font-bold text-[var(--color-primary-dark)]">
                  {completedSubtasksCount} / {subtasks.length} Completed
                </span>
              </div>
              <div className="w-full bg-[var(--color-border)] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--color-primary)] h-full transition-all duration-300"
                  style={{
                    width: `${Math.round(
                      (completedSubtasksCount / subtasks.length) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            {isDeadline && event.task && onToggleTaskComplete && (
              <Button
                variant={event.isCompleted ? "outline" : "primary"}
                size="sm"
                onClick={() => {
                  onToggleTaskComplete(event.task!.id);
                  onClose();
                }}
                className="text-xs gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  {event.isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                </span>
              </Button>
            )}

            {!isDeadline && event.session && onToggleSessionComplete && (
              <Button
                variant={event.isCompleted ? "outline" : "primary"}
                size="sm"
                onClick={() => {
                  onToggleSessionComplete(event.session!.id);
                  onClose();
                }}
                className="text-xs gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  {event.isCompleted ? "Mark Unfinished" : "Mark Completed"}
                </span>
              </Button>
            )}

            {isDeadline && onEditTask && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEditTask(event);
                }}
                className="text-xs gap-1.5"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Task & Deadline</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isDeadline ? (
              <Link href="/app/tasks" onClick={onClose}>
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                  <span>Go to Tasks</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            ) : (
              <Link href="/app/planner" onClick={onClose}>
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-purple-700 hover:text-purple-900">
                  <BookOpen className="h-3 w-3 mr-0.5" />
                  <span>Open Planner</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
