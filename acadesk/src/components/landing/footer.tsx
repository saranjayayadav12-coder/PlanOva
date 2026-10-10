import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Container } from "@/components/ui";

/**
 * Footer — Section 9
 *
 * Clean, accessible footer with brand identity, product navigation links,
 * and transparent prototype notices. Only links to valid routes and in-page anchors.
 */
export function Footer() {
  const currentYear = 2026;

  return (
    <footer
      className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-12 sm:py-16 text-[var(--color-text)]"
      role="contentinfo"
      aria-label="Site footer"
    >
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[var(--color-border)]">
          {/* Brand column */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-sm)]"
              aria-label="Acadesk — Back to top"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]"
                style={{ backgroundColor: "var(--color-primary)" }}
                aria-hidden="true"
              >
                <GraduationCap className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[var(--color-text)]">
                Acadesk
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)] max-w-sm">
              An AI-powered academic companion helping students organize coursework,
              adapt to schedule disruptions, and cultivate sustainable study habits.
            </p>
          </div>

          {/* Navigation column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
              Product Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li>
                <Link
                  href="#features"
                  className="hover:text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-xs)]"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="hover:text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-xs)]"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#academic-recovery"
                  className="hover:text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-xs)]"
                >
                  Academic Recovery
                </Link>
              </li>
              <li>
                <Link
                  href="/app/dashboard"
                  className="hover:text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-xs)]"
                >
                  Prototype Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Resources column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
              Platform & System
            </h4>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li>
                <Link
                  href="/design-system"
                  className="hover:text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-xs)]"
                >
                  Design System Preview
                </Link>
              </li>
              <li>
                <span className="text-[var(--color-text-muted)] text-xs inline-block">
                  Support & Help (Coming in Phase 4)
                </span>
              </li>
              <li>
                <span className="text-[var(--color-text-muted)] text-xs inline-block">
                  Privacy & Data Ethics (Phase 4)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
          <p>© {currentYear} Acadesk. All rights reserved. Designed for student success.</p>
          <p className="text-center sm:text-right">
            Pre-production prototype · Phase 3 implementation
          </p>
        </div>
      </Container>
    </footer>
  );
}
