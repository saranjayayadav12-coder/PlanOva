import Link from "next/link";
import { Calendar, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import { Task } from "@/types/task";

interface UpcomingDeadlinesProps {
  tasks?: Task[];
}

function calculateDaysRemaining(deadlineStr: string): number {
  // Demo anchor date: 2026-10-10
  const anchor = new Date("2026-10-10T00:00:00Z").getTime();
  const target = new Date(`${deadlineStr}T00:00:00Z`).getTime();
  const diffDays = Math.round((target - anchor) / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function UpcomingDeadlines({ tasks = [] }: UpcomingDeadlinesProps) {
  // Incomplete tasks with future or today deadlines
  const upcomingTasks = tasks
    .filter((t) => t.status !== "completed")
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 3);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle as="h2" className="text-lg font-bold text-[var(--color-text)]">
            Upcoming Deadlines
          </CardTitle>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Pacing milestones to prevent last-minute cramming.
          </p>
        </div>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-lavender)]"
          aria-hidden="true"
        >
          <Calendar className="h-4 w-4 text-[var(--color-primary)]" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pt-2">
        {upcomingTasks.length === 0 ? (
          <div className="p-6 text-center rounded-[var(--radius-lg)] bg-[var(--color-background)] border border-[var(--color-border)]">
            <p className="text-xs font-semibold text-[var(--color-text)]">
              No upcoming deadlines
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
              All tasks are completed or no milestones are scheduled.
            </p>
            <div className="mt-3">
              <Link
                href="/app/tasks"
                className="text-xs font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
              >
                <span>Add Deadlines in Task Manager</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ) : (
          upcomingTasks.map((task) => {
            const daysRemaining = calculateDaysRemaining(task.deadline);
            const isOverdue = daysRemaining < 0;
            const isUrgent = daysRemaining <= 2;

            return (
              <div
                key={task.id}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3.5 hover:shadow-[var(--shadow-xs)] transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-[var(--color-primary-dark)]">
                      {task.subject}
                    </span>
                    <h3 className="text-sm font-semibold text-[var(--color-text)] truncate mt-0.5">
                      {task.title}
                    </h3>
                  </div>
                  <div className="shrink-0">
                    {isOverdue ? (
                      <Badge variant="warning" size="sm">
                        Overdue ({Math.abs(daysRemaining)}d ago)
                      </Badge>
                    ) : isUrgent ? (
                      <Badge variant="warning" size="sm">
                        {daysRemaining === 0 ? "Due Today" : `Due in ${daysRemaining}d`}
                      </Badge>
                    ) : daysRemaining <= 5 ? (
                      <Badge variant="primary" size="sm">
                        Due in {daysRemaining}d
                      </Badge>
                    ) : (
                      <Badge variant="outline" size="sm">
                        Due in {daysRemaining}d
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="h-3 w-3 text-[var(--color-primary)]" />
                    {task.deadline}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Est. {(task.estimatedDurationMinutes / 60).toFixed(1)}h needed
                  </span>
                </div>
              </div>
            );
          })
        )}

        <div className="pt-1 flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-[var(--color-warning)]" />
            <span>Deadlines derived from active tasks</span>
          </div>
          <Link
            href="/app/tasks"
            className="text-[var(--color-primary)] hover:underline font-medium inline-flex items-center gap-0.5"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
