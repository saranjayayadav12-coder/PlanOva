"use client";

import {
  Calendar,
  Clock,
  Check,
  Edit2,
  Trash2,
  Brain,
  BookOpen,
  Sparkles,
  ListTree,
} from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { Task, TaskDifficulty, TaskPriority, TaskStatus } from "@/types/task";
import { TaskBreakdown } from "@/types/subtask";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  breakdown?: TaskBreakdown;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onOpenBreakdown?: (task: Task) => void;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
  return `${hrs}h ${remaining}m`;
}

function getPriorityBadge(priority: TaskPriority) {
  switch (priority) {
    case "high":
      return <Badge variant="warning" size="sm">High Priority</Badge>;
    case "medium":
      return <Badge variant="primary" size="sm">Medium</Badge>;
    case "low":
      return <Badge variant="outline" size="sm">Low</Badge>;
  }
}

function getDifficultyBadge(diff: TaskDifficulty) {
  switch (diff) {
    case "hard":
      return (
        <span className="inline-flex items-center gap-1 rounded-[var(--radius-full)] bg-[#fdeeee] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-error)]">
          <Brain className="h-3 w-3" /> Hard
        </span>
      );
    case "medium":
      return (
        <span className="inline-flex items-center gap-1 rounded-[var(--radius-full)] bg-[var(--color-accent-lavender)]/50 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-primary-dark)]">
          <Brain className="h-3 w-3" /> Medium
        </span>
      );
    case "easy":
      return (
        <span className="inline-flex items-center gap-1 rounded-[var(--radius-full)] bg-[var(--color-success-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-success)]">
          <Brain className="h-3 w-3" /> Easy
        </span>
      );
  }
}

function getStatusBadge(status: TaskStatus) {
  switch (status) {
    case "completed":
      return <Badge variant="success" size="sm">Completed</Badge>;
    case "in_progress":
      return <Badge variant="primary" size="sm">In Progress</Badge>;
    case "pending":
      return <Badge variant="outline" size="sm">Pending</Badge>;
  }
}

export function TaskCard({
  task,
  breakdown,
  onToggleComplete,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenBreakdown,
}: TaskCardProps) {
  const isCompleted = task.status === "completed";

  // Check deadline relative to today (using 2026-10-10 demo anchor or current date)
  const todayStr = "2026-10-10";
  const isOverdue = !isCompleted && task.deadline < todayStr;
  const isDueToday = !isCompleted && task.deadline === todayStr;

  // Breakdown subtask metrics
  const hasBreakdown = Boolean(breakdown && breakdown.subtasks.length > 0);
  const totalSubtasks = breakdown?.subtasks.length || 0;
  const completedSubtasks =
    breakdown?.subtasks.filter((s) => s.status === "completed").length || 0;
  const breakdownPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between rounded-[var(--radius-xl)] border p-4 sm:p-5 transition-all duration-[var(--transition-base)]",
        isCompleted
          ? "border-[var(--color-border)] bg-[var(--color-surface)]/60 opacity-80 hover:opacity-100"
          : isOverdue
          ? "border-[var(--color-warning)]/40 bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)] hover:border-[var(--color-warning)]"
          : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)] hover:border-[var(--color-primary-light)] hover:shadow-[var(--shadow-md)]"
      )}
      aria-labelledby={`task-title-${task.id}`}
    >
      <div>
        {/* Header row: Checkbox, Course & Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Completion checkbox */}
            <button
              type="button"
              role="checkbox"
              aria-checked={isCompleted}
              onClick={() => onToggleComplete(task.id)}
              aria-label={`Mark task "${task.title}" as ${isCompleted ? "incomplete" : "completed"}`}
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                isCompleted
                  ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                  : "border-[var(--color-border-strong)] bg-white hover:border-[var(--color-primary)]"
              )}
            >
              {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </button>

            {/* Subject chip */}
            <div className="flex items-center gap-1.5 min-w-0">
              <BookOpen className="h-3.5 w-3.5 text-[var(--color-primary)] shrink-0" />
              <span className="text-xs font-bold text-[var(--color-primary-dark)] truncate">
                {task.subject}
              </span>
            </div>
          </div>

          {/* Status & Priority indicators */}
          <div className="flex items-center gap-1.5 shrink-0">
            {getPriorityBadge(task.priority)}
            {getStatusBadge(task.status)}
          </div>
        </div>

        {/* Task Title & Description */}
        <div className="mt-3 pl-7">
          <h3
            id={`task-title-${task.id}`}
            className={cn(
              "text-base font-semibold leading-snug transition-colors",
              isCompleted
                ? "text-[var(--color-text-muted)] line-through"
                : "text-[var(--color-text)]"
            )}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-xs text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Breakdown progress block if subtasks exist */}
          {hasBreakdown && (
            <div className="mt-2.5 rounded-[var(--radius-md)] bg-[var(--color-background)] p-2 border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <ListTree className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                <span className="font-semibold text-[var(--color-text)]">
                  Subtasks: {completedSubtasks} of {totalSubtasks} completed
                </span>
                <span className="text-[11px] font-bold text-[var(--color-primary-dark)]">
                  ({breakdownPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-white h-1.5 rounded-full overflow-hidden border border-[var(--color-border)]">
                  <div
                    className="h-full bg-[var(--color-success)] rounded-full transition-all duration-300"
                    style={{ width: `${breakdownPercent}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onOpenBreakdown?.(task)}
                  className="font-bold text-[var(--color-primary)] hover:underline text-[11px]"
                >
                  View Breakdown →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metadata & Actions Footer */}
      <div className="mt-4 pt-3 pl-7 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
        {/* Left: Deadline & Duration */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "flex items-center gap-1 font-medium",
              isOverdue
                ? "text-[var(--color-warning-dark)] font-semibold"
                : isDueToday
                ? "text-[var(--color-primary)] font-semibold"
                : ""
            )}
            title={`Due: ${task.deadline}`}
          >
            <Calendar className="h-3.5 w-3.5" />
            {isOverdue ? (
              <span>Overdue ({task.deadline})</span>
            ) : isDueToday ? (
              <span>Due Today</span>
            ) : (
              <span>Due {task.deadline}</span>
            )}
          </span>

          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(task.estimatedDurationMinutes)}
          </span>

          {getDifficultyBadge(task.difficulty)}

          {/* AI Breakdown action trigger button */}
          {!hasBreakdown && onOpenBreakdown && (
            <button
              type="button"
              onClick={() => onOpenBreakdown(task)}
              className="inline-flex items-center gap-1 rounded-[var(--radius-full)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-primary-dark)] bg-[var(--color-accent-lavender)]/60 hover:bg-[var(--color-accent-lavender)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            >
              <Sparkles className="h-3 w-3 text-[var(--color-primary)]" />
              <span>Break Down with AI</span>
            </button>
          )}
        </div>

        {/* Right: Quick actions (Status selector, Edit, Delete) */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Quick status cycle button */}
          <button
            type="button"
            onClick={() => {
              const nextStatus: TaskStatus =
                task.status === "pending"
                  ? "in_progress"
                  : task.status === "in_progress"
                  ? "completed"
                  : "pending";
              onStatusChange(task.id, nextStatus);
            }}
            className="rounded-[var(--radius-sm)] px-2 py-1 text-[11px] font-medium text-[var(--color-primary-dark)] hover:bg-[var(--color-accent-lavender)]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            title="Cycle task status"
          >
            Status ▾
          </button>

          {/* Edit button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
            onClick={() => onEdit(task)}
            aria-label={`Edit task "${task.title}"`}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
            onClick={() => onDelete(task)}
            aria-label={`Delete task "${task.title}"`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}
