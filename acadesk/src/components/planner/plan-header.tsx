"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Sliders,
  Check,
  X,
  Calendar,
  FlaskConical,
  History,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui";
import { StudyPlan } from "@/types/planner";

interface PlanHeaderProps {
  plan: StudyPlan | null;
  hasDraft: boolean;
  isDraftView: boolean;
  selectedWindowDays: number;
  onWindowChange: (days: number) => void;
  onGeneratePlan: () => void;
  onAcceptPlan: () => void;
  onDiscardDraft: () => void;
  onOpenAvailability: () => void;
  onOpenSimulator?: () => void;
  onToggleHistory?: () => void;
  showHistory?: boolean;
}

export function PlanHeader({
  plan,
  hasDraft,
  isDraftView,
  selectedWindowDays,
  onWindowChange,
  onGeneratePlan,
  onAcceptPlan,
  onDiscardDraft,
  onOpenAvailability,
  onOpenSimulator,
  onToggleHistory,
  showHistory,
}: PlanHeaderProps) {
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Status */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
              AI Study Planner
            </h1>

            {/* Plan status badge */}
            {isDraftView && hasDraft ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                Draft Suggestion (Reviewing)
              </span>
            ) : plan ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                Active Accepted Plan
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
                No Active Plan
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Build a realistic study plan around your deadlines, available time, and academic priorities.
          </p>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Planning Window Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-xs)] text-xs font-medium">
            <Calendar className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span className="text-[var(--color-text-muted)]">Window:</span>
            <select
              value={selectedWindowDays}
              onChange={(e) => onWindowChange(parseInt(e.target.value) || 7)}
              className="bg-transparent font-semibold text-[var(--color-text)] focus:outline-none cursor-pointer"
            >
              <option value={3}>Next 3 Days</option>
              <option value={7}>Next 7 Days</option>
              <option value={14}>Next 14 Days</option>
            </select>
          </div>

          {/* Availability Settings Button */}
          <Button
            variant="outline"
            size="md"
            onClick={onOpenAvailability}
            className="gap-1.5 shadow-[var(--shadow-xs)] text-xs sm:text-sm"
          >
            <Sliders className="h-4 w-4" />
            <span>Availability</span>
          </Button>

          {/* What-If Simulator Button */}
          {onOpenSimulator && plan && (
            <Button
              variant="outline"
              size="md"
              onClick={onOpenSimulator}
              className="gap-1.5 shadow-[var(--shadow-xs)] text-xs sm:text-sm text-[var(--color-primary-dark)] hover:bg-[var(--color-accent-lavender)]/50"
            >
              <FlaskConical className="h-4 w-4 text-[var(--color-primary)]" />
              <span>What-If</span>
            </Button>
          )}

          {/* Workload Insights Link Button */}
          <Link href="/app/workload">
            <Button
              variant="outline"
              size="md"
              className="gap-1.5 shadow-[var(--shadow-xs)] text-xs sm:text-sm"
              title="View Workload Insights"
            >
              <TrendingUp className="h-4 w-4 text-[var(--color-primary)]" />
              <span>Insights</span>
            </Button>
          </Link>

          {/* Adaptation History Toggle Button */}
          {onToggleHistory && (
            <Button
              variant="outline"
              size="md"
              onClick={onToggleHistory}
              className={`gap-1.5 shadow-[var(--shadow-xs)] text-xs sm:text-sm ${
                showHistory ? "bg-[var(--color-accent-lavender)]/70 text-[var(--color-primary-dark)]" : ""
              }`}
            >
              <History className="h-4 w-4" />
              <span>Log</span>
            </Button>
          )}

          {/* Generate / Regenerate Button */}
          <Button
            variant="primary"
            size="md"
            onClick={onGeneratePlan}
            className="gap-1.5 shadow-[var(--shadow-md)] text-xs sm:text-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span>{plan ? "Regenerate Plan" : "Generate Study Plan"}</span>
          </Button>
        </div>
      </div>

      {/* ── Draft Mode Action Banner ── */}
      {isDraftView && hasDraft && (
        <div className="p-3.5 sm:p-4 rounded-[var(--radius-xl)] bg-[var(--color-accent-lavender)]/50 border border-[var(--color-primary-light)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[var(--shadow-xs)] animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-[var(--color-text)]">
                You are previewing a freshly generated study draft.
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                Review and modify session timings below, then accept to activate your schedule.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {showDiscardConfirm ? (
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-[var(--radius-md)] border border-rose-200">
                <span className="text-[11px] text-rose-800 px-1 font-semibold">Discard?</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setShowDiscardConfirm(false);
                    onDiscardDraft();
                  }}
                  className="h-7 px-2 text-xs"
                >
                  Yes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDiscardConfirm(false)}
                  className="h-7 px-2 text-xs"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDiscardConfirm(true)}
                className="gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                <X className="h-3.5 w-3.5" />
                <span>Discard Draft</span>
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={onAcceptPlan}
              className="gap-1.5 shadow-[var(--shadow-sm)]"
            >
              <Check className="h-4 w-4" />
              <span>Accept Study Plan</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
