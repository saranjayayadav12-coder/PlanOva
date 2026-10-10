"use client";

import {
  CheckSquare,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { WorkloadSummaryMetrics } from "@/types/workload";

interface WorkloadSummaryCardsProps {
  metrics: WorkloadSummaryMetrics;
}

export function WorkloadSummaryCards({ metrics }: WorkloadSummaryCardsProps) {
  const cards = [
    {
      id: "active-tasks",
      label: "Active Deliverables",
      value: metrics.totalActiveTasks,
      subtext: `${metrics.completedTasks} completed so far`,
      icon: CheckSquare,
      color: "var(--color-primary)",
      bgColor: "var(--color-accent-lavender)",
    },
    {
      id: "overdue",
      label: "Overdue Tasks",
      value: metrics.overdueTasks,
      subtext:
        metrics.overdueTasks > 0
          ? "Needs comfortable re-slotting"
          : "All deadlines up to date",
      icon: AlertTriangle,
      color: metrics.overdueTasks > 0 ? "#dc2626" : "var(--color-text-muted)",
      bgColor: metrics.overdueTasks > 0 ? "#fee2e2" : "var(--color-background)",
    },
    {
      id: "due-7-days",
      label: "Due Next 7 Days",
      value: metrics.dueWithin7Days,
      subtext: "Upcoming planning window",
      icon: Calendar,
      color: "var(--color-secondary-dark, #b45309)",
      bgColor: "var(--color-accent-pink)",
    },
    {
      id: "completed-tasks",
      label: "Completed Tasks",
      value: metrics.completedTasks,
      subtext: "Academic milestones done",
      icon: CheckCircle2,
      color: "#059669",
      bgColor: "#d1fae5",
    },
    {
      id: "scheduled-sessions",
      label: "Scheduled Study Hours",
      value: `${metrics.totalPlannedHours}h`,
      subtext: `${metrics.scheduledSessions} study blocks (${metrics.completedSessions} done)`,
      icon: Clock,
      color: "var(--color-primary-dark)",
      bgColor: "var(--color-accent-lavender)",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] line-clamp-1">
                {card.label}
              </span>
              <div
                className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] shrink-0"
                style={{ backgroundColor: card.bgColor }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: card.color }} />
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-black text-[var(--color-text)] tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 truncate">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
