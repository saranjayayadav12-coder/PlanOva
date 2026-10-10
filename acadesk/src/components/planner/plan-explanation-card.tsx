"use client";

import { Sparkles, CheckCircle2, ShieldCheck, Clock, Calendar, Split } from "lucide-react";
import { PlanExplanation } from "@/types/planner";

interface PlanExplanationCardProps {
  explanations: PlanExplanation[];
}

export function PlanExplanationCard({ explanations }: PlanExplanationCardProps) {
  if (explanations.length === 0) return null;

  const getCategoryIcon = (category: PlanExplanation["category"]) => {
    switch (category) {
      case "deadline":
        return <Calendar className="h-4 w-4 text-[var(--color-primary)]" />;
      case "priority":
        return <ShieldCheck className="h-4 w-4 text-[var(--color-success)]" />;
      case "split":
        return <Split className="h-4 w-4 text-[var(--color-primary-dark)]" />;
      case "workload":
        return <Clock className="h-4 w-4 text-[var(--color-warning)]" />;
      case "dependency":
        return <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" />;
      default:
        return <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />;
    }
  };

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 sm:p-5 shadow-[var(--shadow-xs)] space-y-4">
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]"
          style={{ backgroundColor: "var(--color-accent-pink)" }}
        >
          <Sparkles className="h-4.5 w-4.5 text-[var(--color-primary-dark)]" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[var(--color-text)]">
            Why this plan?
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            Transparent scheduling rationale based on your deadlines, limits, and priorities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {explanations.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--color-background)] border border-[var(--color-border)] flex items-start gap-3 text-xs"
          >
            <div className="mt-0.5 shrink-0">
              {getCategoryIcon(item.category)}
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-[var(--color-text)]">{item.title}</h4>
              <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
