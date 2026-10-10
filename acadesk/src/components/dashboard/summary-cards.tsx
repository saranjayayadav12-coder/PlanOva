import { ListTodo, CheckCircle2, Clock, Hourglass } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

interface SummaryCardsProps {
  totalTasks: number;
  completedTasks: number;
  remainingMinutes: number;
  totalPlannedMinutes: number;
  upcomingDeadlinesCount: number;
  urgentDeadlinesCount: number;
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function SummaryCards({
  totalTasks,
  completedTasks,
  remainingMinutes,
  totalPlannedMinutes,
  upcomingDeadlinesCount,
  urgentDeadlinesCount,
}: SummaryCardsProps) {
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <section aria-label="Academic Summary Overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* ── CARD 1: Today's Tasks ── */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between hover:shadow-[var(--shadow-md)] transition-shadow">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                Today&apos;s Tasks
              </span>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]"
                style={{ backgroundColor: "var(--color-accent-lavender)" }}
                aria-hidden="true"
              >
                <ListTodo className="h-4 w-4 text-[var(--color-primary)]" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
                  {totalTasks}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  total scheduled
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                {totalTasks - completedTasks} remaining for today
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── CARD 2: Completed Tasks ── */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between hover:shadow-[var(--shadow-md)] transition-shadow">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                Completed Tasks
              </span>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-success-light)]"
                aria-hidden="true"
              >
                <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
                  {completedTasks}
                </span>
                <span className="text-xs font-semibold text-[var(--color-success-dark)]">
                  {completionPercentage}% complete
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="w-full bg-[var(--color-background)] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[var(--color-success)] h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── CARD 3: Upcoming Deadlines ── */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between hover:shadow-[var(--shadow-md)] transition-shadow">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                Upcoming Deadlines
              </span>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-warning-light)]"
                aria-hidden="true"
              >
                <Clock className="h-4 w-4 text-[var(--color-warning)]" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
                  {upcomingDeadlinesCount}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  this cycle
                </span>
              </div>
              <p className="text-[11px] font-medium text-[var(--color-warning-dark)] mt-1">
                {urgentDeadlinesCount} urgent milestone due soon
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── CARD 4: Planned Study Time ── */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between hover:shadow-[var(--shadow-md)] transition-shadow">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                Planned Study Time
              </span>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]"
                style={{ backgroundColor: "var(--color-accent-pink)" }}
                aria-hidden="true"
              >
                <Hourglass className="h-4 w-4 text-[var(--color-primary-dark)]" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
                  {formatMinutes(remainingMinutes)}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  remaining
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                {formatMinutes(totalPlannedMinutes)} total allocated today
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
