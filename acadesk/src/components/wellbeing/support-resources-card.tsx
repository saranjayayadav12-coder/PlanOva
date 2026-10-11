"use client";

import {
  Compass,
  CheckCircle2,
  BookOpen,
  Coffee,
  Users,
  ShieldAlert,
} from "lucide-react";

export function SupportResourcesCard() {
  const suggestions = [
    {
      icon: BookOpen,
      title: "Break Large Deliverables Down",
      description:
        "When an assignment feels daunting, use Acadesk's Subtask Breakdown to turn it into small, 30-minute actionable steps.",
    },
    {
      icon: Coffee,
      title: "Protect Planned Wellness Breaks",
      description:
        "Consistent 15-minute breaks between study blocks restore focus much more reliably than long, uninterrupted study marathons.",
    },
    {
      icon: Users,
      title: "Reach Out to Your Network",
      description:
        "Studying with classmates, talking with a course TA, or chatting with a friend can help ground your academic perspective.",
    },
  ];

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-[var(--shadow-sm)] space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-border)]">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent-lavender)] text-[var(--color-primary-dark)]">
          <Compass className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[var(--color-text)]">
            Healthy Academic Strategies
          </h3>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            Practical routines to support sustainable learning and balance.
          </p>
        </div>
      </div>

      {/* Strategies List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {suggestions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] space-y-1.5"
            >
              <div className="flex items-center gap-2 text-[var(--color-primary-dark)] font-bold text-xs">
                <Icon className="h-4 w-4 text-[var(--color-primary)]" />
                <span>{item.title}</span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Non-clinical disclaimer */}
      <div className="p-3 rounded-[var(--radius-md)] bg-slate-50 border border-slate-200 text-slate-800 text-[11px] flex items-start gap-2 leading-relaxed">
        <ShieldAlert className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-slate-900 block mb-0.5">
            Academic Scope & Well-being Disclaimer
          </strong>
          Acadesk is designed exclusively as an academic planning and organizational tool. Check-in reflections do not constitute medical, clinical, or psychological diagnosis, assessment, or therapy. If you are experiencing persistent distress, please connect with a qualified health professional or campus support counselor.
        </div>
      </div>
    </div>
  );
}
