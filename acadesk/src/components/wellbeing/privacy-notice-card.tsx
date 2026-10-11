"use client";

import { ShieldCheck, Lock, EyeOff, HardDrive } from "lucide-react";

export function PrivacyNoticeCard() {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-[var(--shadow-sm)] space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--color-text)]">
            Privacy & Student Data Protection
          </h3>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            How your well-being check-ins are handled in Acadesk.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-background)]/60 border border-[var(--color-border)] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text)]">
            <EyeOff className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>100% Optional</span>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
            All academic features (Tasks, Planner, Calendar, Insights) function completely without check-ins.
          </p>
        </div>

        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-background)]/60 border border-[var(--color-border)] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text)]">
            <HardDrive className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Local Browser Storage</span>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
            Your check-in ratings and notes stay strictly in your local browser storage (<code className="text-[9px]">localStorage</code>) and are never sent to external servers or AI APIs.
          </p>
        </div>

        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-background)]/60 border border-[var(--color-border)] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text)]">
            <Lock className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Full Control</span>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
            You can review, edit today&apos;s responses, delete single check-ins, or erase all history anytime with one click.
          </p>
        </div>
      </div>
    </div>
  );
}
