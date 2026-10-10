"use client";

import Link from "next/link";
import { Check, Clock, AlertCircle, ArrowRight, ListTodo } from "lucide-react";
import { Badge, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { Task, TaskPriority } from "@/types/task";
import { cn } from "@/lib/utils";

interface TodaysPrioritiesProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
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

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (rem === 0) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
  return `${hrs}h ${rem}m`;
}

export function TodaysPriorities({ tasks, onToggleTask }: TodaysPrioritiesProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle as="h2" className="text-lg font-bold text-[var(--color-text)]">
              Today&apos;s Priorities
            </CardTitle>
            <Badge variant="outline" size="sm">
              Live Sync
            </Badge>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Check off completed work to dynamically adjust remaining study hours.
          </p>
        </div>
        <Link
          href="/app/tasks"
          className="text-xs font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
        >
          <span>Manage All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="flex-1 space-y-2.5 pt-2">
        {tasks.length === 0 ? (
          <div className="p-8 text-center rounded-[var(--radius-lg)] bg-[var(--color-background)] border border-[var(--color-border)]">
            <ListTodo className="h-8 w-8 text-[var(--color-primary)] mx-auto mb-2 opacity-70" />
            <p className="text-sm font-semibold text-[var(--color-text)]">
              No tasks scheduled for today
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Add your coursework in the Task Manager to populate your daily priorities.
            </p>
            <div className="mt-4">
              <Link
                href="/app/tasks"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary-dark)] bg-[var(--color-accent-lavender)]/60 px-3 py-1.5 rounded-[var(--radius-full)] hover:bg-[var(--color-accent-lavender)] transition-colors"
              >
                Go to Task Manager →
              </Link>
            </div>
          </div>
        ) : (
          tasks.map((task) => {
            const isCompleted = task.status === "completed";

            return (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={cn(
                  "group flex items-start gap-3 rounded-[var(--radius-lg)] p-3.5 border transition-all cursor-pointer select-none",
                  isCompleted
                    ? "bg-[var(--color-surface)]/70 border-[var(--color-border)] opacity-75 hover:opacity-100"
                    : "bg-[var(--color-surface-elevated)] border-[var(--color-border)] hover:border-[var(--color-primary-light)] hover:shadow-[var(--shadow-xs)]"
                )}
                role="checkbox"
                aria-checked={isCompleted}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    onToggleTask(task.id);
                  }
                }}
              >
                {/* Checkbox box */}
                <button
                  type="button"
                  aria-label={`Mark "${task.title}" as ${isCompleted ? "incomplete" : "completed"}`}
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                    isCompleted
                      ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                      : "border-[var(--color-border-strong)] bg-white group-hover:border-[var(--color-primary)]"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTask(task.id);
                  }}
                >
                  {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </button>

                {/* Task Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isCompleted
                          ? "text-[var(--color-text-muted)] line-through"
                          : "text-[var(--color-text)]"
                      )}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--color-text-muted)]">
                    <span className="font-semibold text-[var(--color-primary-dark)]">
                      {task.subject}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatMinutes(task.estimatedDurationMinutes)}
                    </span>
                    <span>·</span>
                    <span className={isCompleted ? "text-[var(--color-success)] font-medium" : ""}>
                      {isCompleted ? "Completed" : "Scheduled"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div className="pt-2 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Click any task to toggle status</span>
          </div>
          <span className="italic">Synced with /app/tasks</span>
        </div>
      </CardContent>
    </Card>
  );
}
