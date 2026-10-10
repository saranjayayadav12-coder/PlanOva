import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  CalendarClock,
  TrendingUp,
  Brain,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui";

/* ──────────────────────────────────────────────────────────────
 * HeroSection — Two-column hero for the Acadesk landing page.
 *
 * LEFT:  Headline, subtext, CTAs
 * RIGHT: Layered academic-planner illustration using HTML/CSS
 *
 * Server component — no browser APIs needed here.
 * ────────────────────────────────────────────────────────────── */

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28 lg:py-32"
      aria-labelledby="hero-heading"
    >
      {/* ── Decorative background shapes ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Large lavender blob — top right */}
        <div
          className="absolute -top-40 -right-40 h-[700px] w-[700px] rounded-full opacity-50 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent-lavender) 0%, var(--color-secondary) 50%, transparent 80%)",
          }}
        />
        {/* Pink glow — bottom left */}
        <div
          className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full opacity-40 blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent-pink) 0%, var(--color-secondary) 60%, transparent 85%)",
          }}
        />
        {/* Central soft glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full opacity-20 blur-[90px]"
          style={{
            background:
              "radial-gradient(circle, var(--color-primary-light), transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[var(--content-max-width)] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">

          {/* ── LEFT: Text content ── */}
          <div className="flex flex-col items-start gap-6 max-w-xl lg:max-w-none">
            {/* Eyebrow badge */}
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-full)] border px-4 py-1.5 text-xs font-semibold"
                style={{
                  borderColor: "var(--color-border-strong)",
                  backgroundColor: "var(--color-surface-elevated)",
                  color: "var(--color-primary-dark)",
                }}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Your AI Academic Companion
              </span>
            </div>

            {/* Main headline */}
            <h1
              id="hero-heading"
              className="text-display text-[var(--color-text)]"
            >
              Your Study Plan{" "}
              <br className="hidden sm:block" />
              Should{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(130deg, var(--color-primary) 0%, var(--color-primary-light) 50%, var(--color-accent-pink) 100%)",
                }}
              >
                Adapt to You.
              </span>
            </h1>

            {/* Supporting text */}
            <p
              className="text-base sm:text-lg leading-relaxed max-w-lg"
              style={{ color: "var(--color-text-muted)" }}
            >
              Plan smarter, manage deadlines, and build a study routine that
              adapts when your workload or schedule changes. No guilt, no
              overwhelm — just a plan that works.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/app/dashboard"
                className="inline-flex items-center justify-center gap-2.5 rounded-[var(--radius-full)] px-7 py-3.5 text-base font-semibold text-white transition-all duration-[var(--transition-fast)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                style={{
                  backgroundColor: "var(--color-primary)",
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Start Your Journey
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-full)] border px-7 py-3.5 text-base font-semibold transition-all duration-[var(--transition-fast)] hover:border-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                style={{
                  borderColor: "var(--color-border-strong)",
                  color: "var(--color-primary-dark)",
                  backgroundColor: "var(--color-surface-elevated)",
                }}
              >
                Explore Features
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {/* Trust micro-copy */}
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              A planner built around your schedule — not the other way around.
            </p>
          </div>

          {/* ── RIGHT: Academic planner illustration ── */}
          <div
            className="relative flex items-center justify-center lg:justify-end"
            aria-label="Illustration of Acadesk's study planner interface showing today's tasks, upcoming deadlines, and a progress indicator"
          >
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-[var(--radius-xl)] opacity-30 blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, var(--color-secondary) 0%, var(--color-accent-pink) 60%, transparent 85%)",
              }}
              aria-hidden="true"
            />

            {/* ── CENTRAL CARD: Today's Study Plan ── */}
            <div className="relative w-full max-w-sm lg:max-w-md z-10">
              <div
                className="rounded-[var(--radius-xl)] border p-6 shadow-[var(--shadow-lg)]"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border)",
                }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)]"
                      style={{ backgroundColor: "var(--color-accent-lavender)" }}
                      aria-hidden="true"
                    >
                      <BookOpen
                        className="h-4.5 w-4.5"
                        style={{ color: "var(--color-primary)" }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--color-text)" }}
                      >
                        Today&apos;s Plan
                      </p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        Saturday, Oct 10
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    On Track
                  </Badge>
                </div>

                {/* Task list */}
                <div className="space-y-3">
                  {[
                    {
                      task: "Review lecture notes",
                      subject: "Operating Systems",
                      done: true,
                      duration: "45 min",
                    },
                    {
                      task: "Complete assignment draft",
                      subject: "Linear Algebra",
                      done: true,
                      duration: "1 hr",
                    },
                    {
                      task: "Exam prep — Chapter 4",
                      subject: "Data Structures",
                      done: false,
                      duration: "1.5 hr",
                    },
                  ].map((item) => (
                    <div
                      key={item.task}
                      className="flex items-center gap-3 rounded-[var(--radius-lg)] p-3 transition-colors"
                      style={{
                        backgroundColor: item.done
                          ? "var(--color-success-light)"
                          : "var(--color-background)",
                      }}
                    >
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                        style={{
                          borderColor: item.done
                            ? "var(--color-success)"
                            : "var(--color-border-strong)",
                          backgroundColor: item.done
                            ? "var(--color-success)"
                            : "transparent",
                        }}
                        aria-hidden="true"
                      >
                        {item.done && (
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{
                            color: item.done
                              ? "var(--color-text-muted)"
                              : "var(--color-text)",
                            textDecoration: item.done ? "line-through" : "none",
                          }}
                        >
                          {item.task}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {item.subject}
                        </p>
                      </div>
                      <span
                        className="text-xs shrink-0 font-medium"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {item.duration}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Daily progress
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      2 / 3 complete
                    </span>
                  </div>
                  <div
                    className="h-2 w-full rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--color-accent-lavender)" }}
                    role="progressbar"
                    aria-valuenow={67}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Daily progress: 2 of 3 tasks complete"
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "67%",
                        background:
                          "linear-gradient(90deg, var(--color-primary), var(--color-primary-light))",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ── FLOATING CARD: Upcoming deadline ── */}
              <div
                className="absolute -top-8 -right-6 sm:-right-10 w-48 rounded-[var(--radius-lg)] border p-3.5 shadow-[var(--shadow-md)]"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border)",
                }}
                aria-label="Upcoming deadline indicator"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <CalendarClock
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--color-warning)" }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--color-text)" }}
                  >
                    Upcoming
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  OS Project Report
                </p>
                <div className="mt-1.5 flex items-center gap-1">
                  <span
                    className="inline-flex rounded-[var(--radius-full)] px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: "var(--color-warning-light)",
                      color: "#a36800",
                    }}
                  >
                    Due in 3 days
                  </span>
                </div>
              </div>

              {/* ── FLOATING CARD: Adaptive planning badge ── */}
              <div
                className="absolute -bottom-8 -left-6 sm:-left-10 flex items-center gap-2.5 rounded-[var(--radius-lg)] border p-3 shadow-[var(--shadow-md)]"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border)",
                }}
                aria-label="Adaptive planning indicator"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
                  style={{ backgroundColor: "var(--color-accent-lavender)" }}
                  aria-hidden="true"
                >
                  <Brain
                    className="h-4 w-4"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--color-text)" }}
                  >
                    Adaptive Planning
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                    Plan updated · just now
                  </p>
                </div>
              </div>
            </div>

            {/* ── FLOATING FEATURE INDICATORS ── */}
            {/* Top-left: Smart Breakdown */}
            <div
              className="absolute top-6 left-2 sm:left-0 lg:-left-8 flex items-center gap-2 rounded-[var(--radius-full)] border px-3 py-2 shadow-[var(--shadow-sm)]"
              style={{
                backgroundColor: "rgba(255,255,255,0.90)",
                borderColor: "var(--color-border)",
              }}
              aria-hidden="true"
            >
              <Zap
                className="h-3.5 w-3.5"
                style={{ color: "var(--color-primary)" }}
              />
              <span
                className="text-[11px] font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                Smart Breakdown
              </span>
            </div>

            {/* Bottom-right: Progress Tracking */}
            <div
              className="absolute bottom-4 right-2 sm:right-0 lg:-right-4 flex items-center gap-2 rounded-[var(--radius-full)] border px-3 py-2 shadow-[var(--shadow-sm)]"
              style={{
                backgroundColor: "rgba(255,255,255,0.90)",
                borderColor: "var(--color-border)",
              }}
              aria-hidden="true"
            >
              <TrendingUp
                className="h-3.5 w-3.5"
                style={{ color: "var(--color-success)" }}
              />
              <span
                className="text-[11px] font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                Progress Tracking
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
