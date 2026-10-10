"use client";

import { AlertCircle, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { UnscheduledTask } from "@/types/planner";

interface UnscheduledTasksCardProps {
  tasks: UnscheduledTask[];
  onOpenAvailability: () => void;
}

export function UnscheduledTasksCard({
  tasks,
  onOpenAvailability,
}: UnscheduledTasksCardProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="rounded-[var(--radius-xl)] border border-amber-200 bg-amber-50/50 p-4 sm:p-5 shadow-[var(--shadow-xs)] space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 text-amber-900">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold">
              {tasks.length} Deliverable(s) Could Not Be Scheduled
            </h4>
            <p className="text-xs text-amber-800">
              Your available study slots in this planning period were fully utilized. No work was discarded.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAvailability}
          className="border-amber-300 text-amber-900 hover:bg-amber-100 gap-1.5 text-xs bg-white"
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Expand Study Availability</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
        {tasks.map((task) => (
          <div
            key={`${task.taskId}-${task.subtaskId || "t"}`}
            className="p-3 rounded-[var(--radius-lg)] bg-white border border-amber-200/80 shadow-2xs space-y-1 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--color-text)] truncate max-w-[200px]">
                {task.title}
              </span>
              <span className="text-[10px] font-semibold text-[var(--color-primary-dark)]">
                {task.subject}
              </span>
            </div>

            <p className="text-[11px] text-amber-800 leading-snug">
              {task.reason}
            </p>

            <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-muted)] pt-1">
              <span>Duration: {task.estimatedDurationMinutes}m</span>
              {task.deadline && <span>Deadline: {task.deadline}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
