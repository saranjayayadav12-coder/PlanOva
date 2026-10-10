"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  CheckSquare,
  Brain,
  Calendar,
  TrendingUp,
  RotateCcw,
  Heart,
  Settings,
  ArrowLeft,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  active?: boolean;
  upcoming?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/app/dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    id: "tasks",
    label: "My Tasks",
    href: "/app/tasks",
    icon: CheckSquare,
  },
  {
    id: "planner",
    label: "AI Study Planner",
    href: "/app/planner",
    icon: Brain,
  },
  {
    id: "calendar",
    label: "Calendar",
    href: "#",
    icon: Calendar,
    upcoming: true,
  },
  {
    id: "insights",
    label: "Workload Insights",
    href: "/app/workload",
    icon: TrendingUp,
  },
  {
    id: "recovery",
    label: "Academic Recovery",
    href: "/app/recovery",
    icon: RotateCcw,
  },
  {
    id: "wellbeing",
    label: "Well-being Check-in",
    href: "#",
    icon: Heart,
    upcoming: true,
  },
  {
    id: "settings",
    label: "Settings",
    href: "#",
    icon: Settings,
    upcoming: true,
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  className?: string;
}

export function Sidebar({ mobileOpen = false, onCloseMobile, className }: SidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-[var(--color-surface)] border-r border-[var(--color-border)] p-4 sm:p-5">
      {/* ── Top Header / Brand ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            aria-label="Acadesk — Back to Homepage"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] shadow-[var(--shadow-xs)]"
              style={{ backgroundColor: "var(--color-primary)" }}
              aria-hidden="true"
            >
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[var(--color-text)]">
                Acadesk
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary-dark)]">
                Student Workspace
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden rounded-[var(--radius-md)] p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-accent-lavender)]/50 hover:text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              aria-label="Close sidebar menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* ── Navigation List ── */}
        <nav aria-label="Dashboard primary navigation" className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isCurrent = pathname === item.href;

            if (item.upcoming) {
              return (
                <div
                  key={item.id}
                  className="group flex items-center justify-between rounded-[var(--radius-lg)] px-3 py-2.5 text-xs sm:text-sm font-medium text-[var(--color-text-muted)] opacity-75 hover:opacity-100 hover:bg-[var(--color-background)] transition-all cursor-default select-none"
                  title={item.label}
                  aria-disabled="true"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="h-4.5 w-4.5 shrink-0 text-[var(--color-text-muted)]" />
                    <span className="truncate">{item.label}</span>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center justify-between rounded-[var(--radius-lg)] px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                  isCurrent
                    ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)]"
                    : "text-[var(--color-text)] hover:bg-[var(--color-accent-lavender)]/40"
                )}
                aria-current={isCurrent ? "page" : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={cn(
                      "h-4.5 w-4.5 shrink-0",
                      isCurrent ? "text-white" : "text-[var(--color-primary)]"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {isCurrent && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Bottom Section: Status & Homepage Exit ── */}
      <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
        {/* Prototype preview pill */}
        <div className="rounded-[var(--radius-md)] bg-[var(--color-background)] p-3 border border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary-dark)] mb-1">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Interactive Demo</span>
          </div>
          <p className="text-[11px] leading-tight text-[var(--color-text-muted)]">
            Client-side state preview with dynamic task updates.
          </p>
        </div>

        {/* Back to public website */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Landing Page</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Permanent Sidebar ── */}
      <aside
        className={cn(
          "hidden lg:block w-64 xl:w-72 shrink-0 h-screen sticky top-0 z-30",
          className
        )}
        aria-label="Student workspace sidebar"
      >
        {navContent}
      </aside>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
