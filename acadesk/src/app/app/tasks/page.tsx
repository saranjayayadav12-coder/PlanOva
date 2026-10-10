"use client";

import { useState, useMemo } from "react";
import { Plus, ListTodo, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { DashboardShell } from "@/components/dashboard";
import { Button } from "@/components/ui";
import {
  TaskFilters,
  TaskList,
  TaskFormModal,
  DeleteTaskDialog,
  TaskBreakdownModal,
} from "@/components/tasks";
import { useTasks } from "@/contexts/task-context";
import {
  Task,
  TaskFormData,
  TaskFilterStatus,
  TaskFilterPriority,
  TaskSortOption,
} from "@/types/task";

export default function TasksPage() {
  const {
    tasks,
    breakdowns,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    setTaskStatus,
    resetToDefaults,
    saveBreakdown,
    toggleSubtaskCompletion,
  } = useTasks();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskFilterStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskFilterPriority>("all");
  const [sortOption, setSortOption] = useState<TaskSortOption>("deadline");

  // Modal Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [breakingDownTask, setBreakingDownTask] = useState<Task | null>(null);

  // Derived filter and sort
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Search query filter (title or subject)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOption === "deadline") {
        return a.deadline.localeCompare(b.deadline);
      }
      if (sortOption === "priority") {
        const priorityScore: Record<string, number> = { high: 3, medium: 2, low: 1 };
        return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
      }
      if (sortOption === "recently_updated") {
        return b.updatedAt.localeCompare(a.updatedAt);
      }
      if (sortOption === "duration") {
        return a.estimatedDurationMinutes - b.estimatedDurationMinutes;
      }
      return 0;
    });

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortOption]);

  // Overall counts for summary pills
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const pendingCount = tasks.filter((t) => t.status === "pending").length;

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortOption("deadline");
  };

  return (
    <DashboardShell
      headerTitle="My Tasks"
      headerSubtitle="Organize, prioritize, and track all your semester deliverables."
      headerBadge="Task Hub"
      headerAction={
        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAddModal}
          className="shadow-[var(--shadow-md)]"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </Button>
      }
    >
      {/* ── Status Metrics Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Total
            </span>
            <p className="text-xl font-bold text-[var(--color-text)]">{totalCount}</p>
          </div>
          <ListTodo className="h-4 w-4 text-[var(--color-primary)]" />
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Pending
            </span>
            <p className="text-xl font-bold text-[var(--color-text)]">{pendingCount}</p>
          </div>
          <Clock className="h-4 w-4 text-[var(--color-warning)]" />
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              In Progress
            </span>
            <p className="text-xl font-bold text-[var(--color-primary-dark)]">
              {inProgressCount}
            </p>
          </div>
          <RotateCcw className="h-4 w-4 text-[var(--color-primary)]" />
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Completed
            </span>
            <p className="text-xl font-bold text-[var(--color-success)]">
              {completedCount}
            </p>
          </div>
          <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
        onResetFilters={handleResetFilters}
        totalTasksCount={totalCount}
        filteredTasksCount={filteredAndSortedTasks.length}
      />

      {/* ── Task List & Empty States ── */}
      <TaskList
        tasks={filteredAndSortedTasks}
        totalTasksCount={totalCount}
        breakdowns={breakdowns}
        onToggleComplete={toggleTaskCompletion}
        onEdit={handleOpenEditModal}
        onDelete={(task) => setDeletingTask(task)}
        onStatusChange={setTaskStatus}
        onAddNewTask={handleOpenAddModal}
        onResetFilters={handleResetFilters}
        onResetDefaults={resetToDefaults}
        onOpenBreakdown={(task) => setBreakingDownTask(task)}
      />

      {/* ── Add / Edit Modal ── */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
      />

      {/* ── Delete Confirmation Dialog ── */}
      <DeleteTaskDialog
        isOpen={Boolean(deletingTask)}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={deleteTask}
      />

      {/* ── AI Breakdown Modal ── */}
      <TaskBreakdownModal
        isOpen={Boolean(breakingDownTask)}
        task={breakingDownTask}
        existingBreakdown={breakingDownTask ? breakdowns[breakingDownTask.id] : null}
        onClose={() => setBreakingDownTask(null)}
        onSave={saveBreakdown}
        onToggleSubtask={toggleSubtaskCompletion}
      />
    </DashboardShell>
  );
}
