"use client";

import { Menu, Calendar, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  action?: React.ReactNode;
}

export function Header({
  onOpenMobileMenu,
  title = "Overview",
  subtitle = "Welcome back. Here is your adaptive academic pace for today.",
  badgeText = "Fall Semester '26",
  action,
}: HeaderProps) {
  // Stable formatted date for the academic environment
  const formattedDate = "Saturday, October 10, 2026";

  return (
    <header className="sticky top-0 z-20 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Hamburger (mobile) + Page Title & Subtitle */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden inline-flex items-center justify-center rounded-[var(--radius-md)] p-2 text-[var(--color-text)] hover:bg-[var(--color-accent-lavender)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text)]">
                {title}
              </h1>
              {badgeText && (
                <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
                  {badgeText}
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions, Date Pill & Demo Profile Placeholder */}
        <div className="flex items-center gap-3 sm:gap-4">
          {action && <div className="shrink-0">{action}</div>}
          {/* Formatted Date Pill */}
          <div className="hidden md:flex items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-background)] px-3.5 py-1.5 border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-muted)]">
            <Calendar className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>{formattedDate}</span>
          </div>

          {/* Honest Demo Profile Placeholder */}
          <div
            className="flex items-center gap-2.5 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-1.5 sm:px-3 sm:py-1.5 shadow-[var(--shadow-xs)]"
            title="Demonstration Profile — No real user account required in Phase 4"
            aria-label="Demo student account profile"
          >
            <div
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-white text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
              }}
              aria-hidden="true"
            >
              DS
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-[var(--color-text)] leading-none">
                Demo Student
              </span>
              <span className="text-[10px] text-[var(--color-text-muted)] leading-tight flex items-center gap-1 mt-0.5">
                <UserCheck className="h-2.5 w-2.5 text-[var(--color-success)]" />
                Preview Mode
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
