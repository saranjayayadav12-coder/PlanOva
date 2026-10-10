"use client";

import { TaskCard } from "./task-card";
import { Task, TaskStatus } from "@/types/task";
import { TaskBreakdown } from "@/types/subtask";
import { Plus, SearchX, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";

interface TaskListProps {
  tasks: Task[];
  totalTasksCount: number;
  breakdowns?: Record<string, TaskBreakdown>;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onAddNewTask: () => void;
  onResetFilters: () => void;
  onResetDefaults?: () => void;
  onOpenBreakdown?: (task: Task) => void;
}

export function TaskList({
  tasks,
  totalTasksCount,
  breakdowns,
  onToggleComplete,
  onEdit,
  onDelete,
  onStatusChange,
  onAddNewTask,
  onResetFilters,
  onResetDefaults,
  onOpenBreakdown,
}: TaskListProps) {
  // Empty state: No tasks in system at all
  if (totalTasksCount === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-12 text-center shadow-[var(--shadow-xs)]">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full mb-4"
          style={{ backgroundColor: "var(--color-accent-lavender)" }}
        >
          <CheckCircle className="h-7 w-7 text-[var(--color-primary)]" />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text)]">
          No Tasks in Your Workspace
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)] max-w-sm mx-auto">
          Start building your academic plan by adding your current course deliverables, problem sets, or readings.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" size="md" onClick={onAddNewTask}>
            <Plus className="h-4 w-4" />
            <span>Add Your First Task</span>
          </Button>
          {onResetDefaults && (
            <Button variant="outline" size="md" onClick={onResetDefaults}>
              <RotateCcw className="h-4 w-4" />
              <span>Load Sample Academic Tasks</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Empty state: Tasks exist, but none match current search/filter criteria
  if (tasks.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-12 text-center shadow-[var(--shadow-xs)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-background)] mb-4 text-[var(--color-text-muted)]">
          <SearchX className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text)]">
          No Matching Tasks Found
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)] max-w-sm mx-auto">
          No assignments match your search query or active filter criteria. Try adjusting your filters.
        </p>
        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            Clear All Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          breakdown={breakdowns?.[task.id]}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onOpenBreakdown={onOpenBreakdown}
        />
      ))}
    </div>
  );
}
