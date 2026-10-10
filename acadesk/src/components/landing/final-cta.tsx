import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui";

/**
 * FinalCTA — Section 8
 *
 * Closing call to action inviting students to try the platform.
 * Honestly links to the active dashboard prototype (/app/dashboard)
 * since user registration backend is part of future phases.
 */
export function FinalCTA() {
  return (
    <section
      id="get-started"
      className="py-16 sm:py-24 relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      <Container size="md">
        <div
          className="relative rounded-[var(--radius-2xl)] border border-[var(--color-border)] p-8 sm:p-12 lg:p-16 text-center shadow-[var(--shadow-lg)] overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--color-surface-elevated) 0%, var(--color-accent-lavender) 100%)",
          }}
        >
          {/* Decorative ambient elements */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-50 blur-3xl"
            style={{
              background: "radial-gradient(circle, var(--color-accent-pink), transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
            style={{
              background: "radial-gradient(circle, var(--color-secondary), transparent 70%)",
            }}
          />

          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-3.5 py-1 text-xs font-semibold text-[var(--color-primary-dark)] bg-[var(--color-surface)] border border-[var(--color-border)] mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Start Planning Smarter
            </span>

            <h2
              id="cta-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-text)] mb-4 leading-tight"
            >
              Make Your Next Study Session Count.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[var(--color-text-muted)] mb-8 max-w-md">
              Start building a more manageable approach to your academic workload.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link
                href="/app/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[var(--radius-full)] px-8 py-3.5 text-base font-semibold text-white transition-all duration-[var(--transition-fast)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                style={{
                  backgroundColor: "var(--color-primary)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/design-system"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border-strong)] px-6 py-3.5 text-base font-medium text-[var(--color-primary-dark)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] transition-colors duration-[var(--transition-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                Design System Preview
              </Link>
            </div>

            <p className="text-xs text-[var(--color-text-muted)] mt-6">
              Immediate prototype preview · No account creation required
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
