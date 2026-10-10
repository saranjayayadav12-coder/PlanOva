"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input, Select } from "@/components/ui";
import { TaskFilterStatus, TaskFilterPriority, TaskSortOption } from "@/types/task";

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: TaskFilterStatus;
  onStatusFilterChange: (status: TaskFilterStatus) => void;
  priorityFilter: TaskFilterPriority;
  onPriorityFilterChange: (priority: TaskFilterPriority) => void;
  sortOption: TaskSortOption;
  onSortOptionChange: (sort: TaskSortOption) => void;
  onResetFilters: () => void;
  totalTasksCount: number;
  filteredTasksCount: number;
}

export function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortOption,
  onSortOptionChange,
  onResetFilters,
  totalTasksCount,
  filteredTasksCount,
}: TaskFiltersProps) {
  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    sortOption !== "deadline";

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 sm:p-5 shadow-[var(--shadow-xs)] space-y-4">
      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full flex-1">
          <Input
            placeholder="Search tasks by title or subject..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="p-1 hover:text-[var(--color-text)] transition-colors focus-visible:outline-none"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-56 shrink-0">
          <Select
            value={sortOption}
            onChange={(e) => onSortOptionChange(e.target.value as TaskSortOption)}
            aria-label="Sort tasks"
          >
            <option value="deadline">Sort: Deadline (Soonest)</option>
            <option value="priority">Sort: Priority (Highest)</option>
            <option value="recently_updated">Sort: Recently Updated</option>
            <option value="duration">Sort: Duration (Shortest)</option>
          </Select>
        </div>
      </div>

      {/* Filter Chips & Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--color-border)] text-xs">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-[var(--color-text-muted)] mr-1 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" /> Status:
          </span>
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
            { id: "in_progress", label: "In Progress" },
            { id: "completed", label: "Completed" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onStatusFilterChange(item.id as TaskFilterStatus)}
              className={`rounded-[var(--radius-full)] px-3 py-1 font-medium transition-colors ${
                statusFilter === item.id
                  ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-xs)]"
                  : "bg-[var(--color-background)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Priority Filter & Reset Button */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-36">
            <Select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value as TaskFilterPriority)}
              aria-label="Filter by priority"
            >
              <option value="all">Priority: All</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </Select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 rounded-[var(--radius-md)] px-2.5 py-1.5 text-xs font-semibold text-[var(--color-primary-dark)] bg-[var(--color-accent-lavender)]/60 hover:bg-[var(--color-accent-lavender)] transition-colors"
            >
              <X className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] pt-1">
        <span>
          Showing <strong>{filteredTasksCount}</strong> of <strong>{totalTasksCount}</strong> total tasks
        </span>
        {hasActiveFilters && filteredTasksCount < totalTasksCount && (
          <span className="italic">Filtered results active</span>
        )}
      </div>
    </div>
  );
}
