import {
  Sparkles,
  HeartHandshake,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Badge, Container } from "@/components/ui";

/**
 * RecoverySection — Section 7
 *
 * Highlights Acadesk's compassionate Academic Recovery Mode.
 * Features an illustrative side-by-side comparison of an overloaded schedule
 * versus an AI-calibrated sustainable recovery plan.
 */
export function RecoverySection() {
  return (
    <section
      id="academic-recovery"
      className="py-16 sm:py-24 relative overflow-hidden"
      aria-labelledby="recovery-heading"
    >
      {/* Background ambient gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, var(--color-accent-pink), var(--color-accent-lavender) 50%, transparent 80%)",
        }}
      />

      <Container size="lg" className="relative z-10">
        <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 sm:p-10 lg:p-12 shadow-[var(--shadow-md)]">
          {/* Header */}
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-dark)] bg-[var(--color-accent-lavender)] border border-[var(--color-border)] mb-4">
              <HeartHandshake className="h-3.5 w-3.5" />
              Academic Recovery Mode
            </div>
            <h2
              id="recovery-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-text)] mb-4 leading-tight"
            >
              Falling Behind Doesn&apos;t Mean Starting Over.
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--color-text-muted)]">
              When life happens and deadlines pile up, traditional planners turn into walls of red notifications.
              Acadesk helps you hit reset without guilt—rebalancing overdue tasks into a calm, realistic catch-up plan.
            </p>
          </div>

          {/* Side-by-side comparison visual */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* OVERLOADED SCHEDULE */}
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 flex flex-col justify-between opacity-90">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-[var(--color-warning-dark)]" />
                    <span className="text-sm font-bold text-[var(--color-text)]">
                      Overloaded Backlog
                    </span>
                  </div>
                  <Badge variant="warning" size="sm">
                    High Stress
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-warning)]/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--color-text)]">
                        Tuesday: 7 Tasks Jammed
                      </span>
                      <span className="text-[var(--color-warning-dark)] font-medium">
                        9.5 hrs required
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                      3 overdue assignments stacked on top of upcoming midterm study session.
                    </p>
                  </div>

                  <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-warning)]/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--color-text)]">
                        No Energy Buffers
                      </span>
                      <span className="text-[var(--color-warning-dark)] font-medium">
                        0 break time
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                      Back-to-back study blocks leading to mental fatigue and abandonment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-muted)] flex items-center justify-between">
                <span>Result: Decision paralysis & avoidance</span>
                <span className="font-semibold text-[var(--color-text-muted)]">Unrealistic</span>
              </div>
            </div>

            {/* RECOVERED SCHEDULE */}
            <div className="rounded-[var(--radius-xl)] border-2 border-[var(--color-primary-light)] bg-[var(--color-surface)] p-5 flex flex-col justify-between shadow-[var(--shadow-sm)]">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
                    <span className="text-sm font-bold text-[var(--color-primary-dark)]">
                      Acadesk Calibrated Recovery
                    </span>
                  </div>
                  <Badge variant="success" size="sm">
                    Guilt-Free Plan
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-success-light)] border border-[var(--color-success)]/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--color-text)]">
                        Targeted Prioritization
                      </span>
                      <span className="text-[var(--color-success-dark)] font-semibold">
                        3.5 hrs / day
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                      High-impact deliverables sequenced first; lower-weighted tasks gently repaced.
                    </p>
                  </div>

                  <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--color-text)]">
                        Strategic Rest Buffers
                      </span>
                      <span className="text-[var(--color-primary)] font-semibold">
                        45 min pauses
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                      Built-in breathing room so unexpected interruptions don&apos;t derail the week.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[var(--color-border)] text-[11px] text-[var(--color-primary-dark)] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <RotateCcw className="h-3 w-3" />
                  Regain momentum in 48 hours
                </span>
                <span className="font-bold text-[var(--color-success-dark)]">Achievable</span>
              </div>
            </div>
          </div>

          {/* Subtext info bar */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
            <p>
              * Academic Recovery is designed to assist personal workflow pacing and does not make clinical diagnoses.
            </p>
            <span className="font-medium text-[var(--color-primary-dark)]">
              Interactive demo preview
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
