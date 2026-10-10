import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Flame,
  ListTodo,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Container,
  SectionHeading,
} from "@/components/ui";

/**
 * ProductPreview — Section 4
 *
 * Displays three polished preview cards showcasing core interface concepts:
 * 1. Today's Study Plan (tasks, durations, progress)
 * 2. Upcoming Deadlines (urgency, countdowns, priorities)
 * 3. Academic Progress (weekly completion, visual stats)
 *
 * All figures and items are explicitly marked as illustrative demo content.
 */
export function ProductPreview() {
  return (
    <section
      id="product-preview"
      className="py-16 sm:py-24 relative"
      aria-labelledby="preview-heading"
    >
      <Container size="lg">
        <SectionHeading
          id="preview-heading"
          eyebrow="Adaptive Interface"
          title="Designed for Academic Flow"
          description="Experience an interface engineered to eliminate friction, balance cognitive load, and keep your goals in sight without overwhelming your day."
          align="center"
          className="mb-12 sm:mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* ──────────────── CARD A: Today's Study Plan ──────────────── */}
          <Card
            hoverable
            className="flex flex-col border border-[var(--color-border)] shadow-[var(--shadow-sm)]"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary-dark)]">
                  <ListTodo className="h-4 w-4 text-[var(--color-primary)]" />
                  Daily Agenda
                </span>
                <Badge variant="outline" size="sm">
                  Demo Preview
                </Badge>
              </div>
              <CardTitle as="h3" className="text-lg">
                Today&apos;s Study Plan
              </CardTitle>
              <CardDescription>
                Smart task pacing mapped around your available energy.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between pt-0 space-y-4">
              {/* Task list items */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-success-light)] border border-[var(--color-success)]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="h-4 w-4 text-[var(--color-success)] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[var(--color-text-muted)] line-through truncate">
                        Review lecture notes
                      </p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">
                        Operating Systems
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                    45m
                  </span>
                </div>

                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-4 w-4 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center shrink-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[var(--color-text)] truncate">
                        Complete assignment draft
                      </p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">
                        Linear Algebra · In progress
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[var(--color-primary)]">
                    1h
                  </span>
                </div>

                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-between opacity-80">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-4 w-4 rounded-full border border-[var(--color-border-strong)] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[var(--color-text)] truncate">
                        Prepare for upcoming quiz
                      </p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">
                        Data Structures · Scheduled
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                    1.5h
                  </span>
                </div>
              </div>

              {/* Progress summary */}
              <div className="pt-3 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[var(--color-text-muted)]">Today&apos;s Target</span>
                  <span className="font-semibold text-[var(--color-text)]">
                    1 hr 45 min of 3.25 hrs (54%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--color-background)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: "54%",
                      background:
                        "linear-gradient(90deg, var(--color-primary), var(--color-accent-pink))",
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ──────────────── CARD B: Upcoming Deadlines ──────────────── */}
          <Card
            hoverable
            className="flex flex-col border border-[var(--color-border)] shadow-[var(--shadow-sm)]"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary-dark)]">
                  <Calendar className="h-4 w-4 text-[var(--color-primary)]" />
                  Horizon Tracking
                </span>
                <Badge variant="outline" size="sm">
                  Demo Preview
                </Badge>
              </div>
              <CardTitle as="h3" className="text-lg">
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>
                Proactive scheduling alerts before time crunches hit.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between pt-0 space-y-4">
              <div className="space-y-3">
                {/* Deadline 1 */}
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border-l-4 border-l-[var(--color-accent-pink)] border border-[var(--color-border)]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-text)]">
                        CS 210 Research Paper
                      </p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                        Final submission · 4 subtasks left
                      </p>
                    </div>
                    <Badge variant="warning" size="sm">
                      2 Days
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)] mt-2">
                    <Clock className="h-3 w-3" />
                    <span>Est. remaining: 3.5 hrs</span>
                  </div>
                </div>

                {/* Deadline 2 */}
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border-l-4 border-l-[var(--color-primary)] border border-[var(--color-border)]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-text)]">
                        MATH 302 Midterm Exam
                      </p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                        Units 1-4 comprehensive review
                      </p>
                    </div>
                    <Badge variant="primary" size="sm">
                      5 Days
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)] mt-2">
                    <Clock className="h-3 w-3" />
                    <span>Est. remaining: 6.0 hrs</span>
                  </div>
                </div>

                {/* Deadline 3 */}
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border-l-4 border-l-[var(--color-secondary)] border border-[var(--color-border)]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-text)]">
                        ENG 105 Project Milestone
                      </p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                        Group bibliography & outline
                      </p>
                    </div>
                    <Badge variant="outline" size="sm">
                      8 Days
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)] mt-2">
                    <Clock className="h-3 w-3" />
                    <span>Est. remaining: 2.0 hrs</span>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="pt-3 border-t border-[var(--color-border)] flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <AlertCircle className="h-3.5 w-3.5 text-[var(--color-primary)] shrink-0" />
                <span>Paced automatically without weekend cramming.</span>
              </div>
            </CardContent>
          </Card>

          {/* ──────────────── CARD C: Academic Progress ──────────────── */}
          <Card
            hoverable
            className="flex flex-col border border-[var(--color-border)] shadow-[var(--shadow-sm)]"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary-dark)]">
                  <TrendingUp className="h-4 w-4 text-[var(--color-primary)]" />
                  Weekly Cadence
                </span>
                <Badge variant="outline" size="sm">
                  Demo Preview
                </Badge>
              </div>
              <CardTitle as="h3" className="text-lg">
                Academic Progress
              </CardTitle>
              <CardDescription>
                Celebrate consistency without guilt over missed hours.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between pt-0 space-y-4">
              {/* Stat summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)] text-center">
                  <p className="text-2xl font-bold text-[var(--color-text)]">18/22</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                    Tasks Completed
                  </p>
                </div>
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)] text-center">
                  <p className="text-2xl font-bold text-[var(--color-primary-dark)]">82%</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                    Plan Adherence
                  </p>
                </div>
              </div>

              {/* Mini weekly bars visualization */}
              <div>
                <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2 flex items-center justify-between">
                  <span>Daily Study Distribution</span>
                  <span className="text-[11px] text-[var(--color-primary-dark)] font-semibold flex items-center gap-1">
                    <Flame className="h-3 w-3 text-[var(--color-accent-pink)]" /> 5-Day Streak
                  </span>
                </p>
                <div className="grid grid-cols-7 gap-1.5 items-end h-20 pt-2 px-1 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)]">
                  {[
                    { day: "M", height: "70%", active: true },
                    { day: "T", height: "85%", active: true },
                    { day: "W", height: "60%", active: true },
                    { day: "T", height: "90%", active: true },
                    { day: "F", height: "75%", active: true },
                    { day: "S", height: "40%", active: false },
                    { day: "S", height: "20%", active: false },
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center h-full justify-end gap-1">
                      <div
                        className="w-full rounded-t-[var(--radius-xs)] transition-all duration-300"
                        style={{
                          height: bar.height,
                          backgroundColor: bar.active
                            ? "var(--color-primary)"
                            : "var(--color-secondary)",
                          opacity: bar.active ? 1 : 0.6,
                        }}
                      />
                      <span className="text-[10px] text-[var(--color-text-muted)] font-medium">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Note */}
              <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <span>Planned vs Completed</span>
                <span className="font-semibold text-[var(--color-success-dark)]">
                  +2.5 hrs ahead of schedule
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
