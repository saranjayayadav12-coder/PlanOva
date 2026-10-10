"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  Layers,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui";
import { RecoveryDiagnosis } from "@/types/recovery";

interface RecoveryTriggersCardProps {
  diagnosis: RecoveryDiagnosis;
  onGenerateProposal: () => void;
  isGenerating?: boolean;
}

export function RecoveryTriggersCard({
  diagnosis,
  onGenerateProposal,
  isGenerating = false,
}: RecoveryTriggersCardProps) {
  const { isRecoveryNeeded, summary, triggers, contributingTasks, overloadedDays } =
    diagnosis;

  // Positive state if no recovery is needed
  if (!isRecoveryNeeded) {
    return (
      <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 sm:p-8 shadow-[var(--shadow-xs)] text-center space-y-4">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-accent-lavender)" }}
        >
          <CheckCircle2 className="h-7 w-7 text-[var(--color-primary)]" />
        </div>

        <div className="space-y-1.5 max-w-lg mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text)]">
            Your Schedule is Currently Balanced
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
            {summary}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/app/planner">
            <Button variant="outline" size="md" className="text-xs sm:text-sm">
              View Active Study Plan
            </Button>
          </Link>

          <Button
            variant="primary"
            size="md"
            onClick={onGenerateProposal}
            disabled={isGenerating}
            className="text-xs sm:text-sm gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Preventive Recalibration</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 sm:p-7 shadow-[var(--shadow-xs)] space-y-5">
      {/* ── Section Title ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-rose-100 text-rose-700 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)]">
              Workload Bottlenecks Identified
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Concrete scheduling factors contributing to current academic stress.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onGenerateProposal}
          disabled={isGenerating}
          className="gap-2 shadow-[var(--shadow-md)] text-xs sm:text-sm bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isGenerating ? "Analyzing..." : "Generate Recovery Plan"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* ── Summary Statement ── */}
      <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--color-accent-lavender)]/50 border border-[var(--color-primary-light)]/60 text-xs sm:text-sm text-[var(--color-text)] leading-relaxed">
        <strong>Diagnosis:</strong> {summary}
      </div>

      {/* ── Triggers Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {triggers.map((trigger) => {
          let badgeColor = "bg-purple-100 text-purple-900 border-purple-200";
          let icon = <Layers className="h-4 w-4 text-purple-700" />;

          if (trigger.severity === "high") {
            badgeColor = "bg-rose-100 text-rose-900 border-rose-300";
            icon = <AlertTriangle className="h-4 w-4 text-rose-600" />;
          } else if (trigger.severity === "medium") {
            badgeColor = "bg-amber-100 text-amber-900 border-amber-300";
            icon = <Clock className="h-4 w-4 text-amber-600" />;
          }

          return (
            <div
              key={trigger.id}
              className="p-3.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {icon}
                  <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text)]">
                    {trigger.title}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                  {trigger.itemCount} affected
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {trigger.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Contributing Tasks & Days ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
        {/* Contributing Tasks */}
        <div>
          <h4 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider mb-2">
            Contributing Tasks ({contributingTasks.length})
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {contributingTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-2 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)] text-xs"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-semibold text-[var(--color-text)] truncate block">
                    {t.title}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    {t.subject} • {t.estimatedDurationMinutes}m
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[var(--color-text-muted)] shrink-0">
                  {t.deadline ? `Due: ${t.deadline}` : "No deadline"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contributing Overloaded Days */}
        <div>
          <h4 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider mb-2">
            Overloaded Days ({overloadedDays.length})
          </h4>
          {overloadedDays.length === 0 ? (
            <p className="text-xs text-[var(--color-text-muted)] italic">
              No days currently exceed available capacity.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {overloadedDays.map((d) => (
                <div
                  key={d.date}
                  className="flex items-center justify-between p-2 rounded-[var(--radius-md)] bg-rose-50/60 border border-rose-200 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-rose-950 block">
                      {d.dayName} ({d.formattedDate})
                    </span>
                    <span className="text-[11px] text-rose-700">
                      {d.plannedMinutes}m planned / {d.availableMinutes}m capacity
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-rose-800 shrink-0">
                    +{d.plannedMinutes - d.availableMinutes}m over
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
