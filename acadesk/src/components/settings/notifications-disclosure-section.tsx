"use client";

import { Bell, Info, ShieldCheck, CheckCircle2 } from "lucide-react";

export function NotificationsDisclosureSection() {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-[var(--shadow-sm)] space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-border)]">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Bell className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[var(--color-text)]">
            Notification & Reminder Architecture
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            How Acadesk alerts and prompts operate in your browser.
          </p>
        </div>
      </div>

      <div className="space-y-3 text-xs text-[var(--color-text-muted)] leading-relaxed">
        <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)] space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-[var(--color-text)]">
            <Info className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
            <span>Client-Side Local Operation</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Acadesk runs completely inside your browser without a background push daemon, remote worker, or automated email server. We do not offer nonfunctional toggles for external email or SMS reminders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--color-text)]">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>In-App Diagnostic Banners</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              When visiting the AI Study Planner, Calendar, or Recovery Mode, non-shaming banners automatically highlight schedule adjustments and overdue items.
            </p>
          </div>

          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--color-text)]">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Visual Pulse Indicators</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Calendar days containing overdue tasks and overloaded study time display prominent visual dots and badges directly in the schedule view.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
