"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { PlanAdjustmentTrigger } from "@/types/planner";

interface PlanAdjustmentBannerProps {
  trigger: PlanAdjustmentTrigger | null;
  onReviewAdjustment: () => void;
  onDismiss: () => void;
}

export function PlanAdjustmentBanner({
  trigger,
  onReviewAdjustment,
  onDismiss,
}: PlanAdjustmentBannerProps) {
  if (!trigger) return null;

  return (
    <div className="rounded-[var(--radius-xl)] bg-[var(--color-accent-lavender)]/60 border border-[var(--color-primary-light)] p-4 shadow-[var(--shadow-sm)] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full shrink-0 mt-0.5"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Your study plan may need an update
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                Adaptive Prompt
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
              {trigger.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            Dismiss
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onReviewAdjustment}
            className="gap-1.5 shadow-[var(--shadow-xs)] text-xs font-semibold"
          >
            <span>Review Proposed Adjustment</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
