"use client";

import { X, Search, RotateCcw } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import {
  CalendarFilterState,
  EventTypeFilter,
  PriorityFilter,
  StatusFilter,
} from "@/types/calendar";

interface CalendarFiltersBarProps {
  filters: CalendarFilterState;
  onFilterChange: (filters: CalendarFilterState) => void;
  subjects: string[];
  onReset: () => void;
  isFiltered: boolean;
}

export function CalendarFiltersBar({
  filters,
  onFilterChange,
  subjects,
  onReset,
  isFiltered,
}: CalendarFiltersBarProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 shadow-[var(--shadow-xs)] animate-in fade-in duration-150 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-muted)] pointer-events-none" />
          <input
            type="text"
            placeholder="Search deliverables, subjects, or study blocks..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
            aria-label="Search calendar events"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, search: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Event Type Filter */}
          <select
            value={filters.eventType}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                eventType: e.target.value as EventTypeFilter,
              })
            }
            className="text-xs px-2.5 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            aria-label="Filter by event category"
          >
            <option value="all">All Event Types</option>
            <option value="task_deadline">📌 Task Deadlines Only</option>
            <option value="study_session">⏱️ Study Sessions Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                status: e.target.value as StatusFilter,
              })
            }
            className="text-xs px-2.5 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="completed">Completed Only</option>
            <option value="overdue">Overdue Only</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                priority: e.target.value as PriorityFilter,
              })
            }
            className="text-xs px-2.5 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Subject Filter */}
          {subjects.length > 0 && (
            <select
              value={filters.subject}
              onChange={(e) =>
                onFilterChange({ ...filters, subject: e.target.value })
              }
              className="text-xs px-2.5 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              aria-label="Filter by subject"
            >
              <option value="all">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          )}

          {/* Reset Action */}
          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-xs text-[var(--color-text-muted)] hover:text-rose-600 gap-1 px-2.5 h-8 border-dashed"
              aria-label="Reset all calendar filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
