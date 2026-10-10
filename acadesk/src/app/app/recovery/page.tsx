"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Brain,
  ArrowRight,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard";
import { Button } from "@/components/ui";
import { useTasks } from "@/contexts/task-context";
import {
  loadAvailabilityFromStorage,
  loadPlansFromStorage,
  savePlansToStorage,
  recordHistoryEvent,
  DEFAULT_AVAILABILITY,
} from "@/lib/planner-storage";
import { StudyPlan, AvailabilityPreferences } from "@/types/planner";
import { ProposedRecoveryPlan } from "@/types/recovery";
import { formatDateISO } from "@/lib/study-planner-service";
import { DEFAULT_ANCHOR_DATE } from "@/lib/workload-service";
import {
  diagnoseRecoveryNeeds,
  generateRecoveryProposal,
} from "@/lib/recovery-service";
import {
  RecoveryTriggersCard,
  RecoveryComparisonView,
} from "@/components/recovery";

export default function AcademicRecoveryPage() {
  const { tasks, breakdowns } = useTasks();
  const [todayStr, setTodayStr] = useState<string>(DEFAULT_ANCHOR_DATE);
  const [availability, setAvailability] =
    useState<AvailabilityPreferences>(DEFAULT_AVAILABILITY);
  const [acceptedPlan, setAcceptedPlan] = useState<StudyPlan | null>(null);

  // Recovery proposal state
  const [recoveryProposal, setRecoveryProposal] =
    useState<ProposedRecoveryPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptSuccessMessage, setAcceptSuccessMessage] = useState<string | null>(
    null
  );

  // Load planner, availability, and live date safely on client
  useEffect(() => {
    const timer = setTimeout(() => {
      setTodayStr(formatDateISO(new Date()));
      const avail = loadAvailabilityFromStorage();
      const stored = loadPlansFromStorage();
      setAvailability(avail);
      setAcceptedPlan(stored.acceptedPlan);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Compute diagnosis from active state
  const diagnosis = useMemo(
    () => diagnoseRecoveryNeeds(tasks, acceptedPlan, availability, todayStr),
    [tasks, acceptedPlan, availability, todayStr]
  );

  // Handler: Generate Recovery Proposal
  const handleGenerateProposal = useCallback(() => {
    setIsGenerating(true);
    try {
      const proposal = generateRecoveryProposal({
        tasks,
        breakdowns,
        acceptedPlan,
        availability,
        todayStr,
      });
      setRecoveryProposal(proposal);
      setAcceptSuccessMessage(null);
    } finally {
      setIsGenerating(false);
    }
  }, [tasks, breakdowns, acceptedPlan, availability, todayStr]);

  // Handler: Accept Recovery Plan
  const handleAcceptRecoveryPlan = useCallback(() => {
    if (!recoveryProposal) return;
    setIsAccepting(true);

    try {
      const updatedAcceptedPlan: StudyPlan = {
        ...recoveryProposal.plan,
        status: "accepted",
        updatedAt: new Date().toISOString(),
      };

      // Persist to localStorage
      savePlansToStorage({
        acceptedPlan: updatedAcceptedPlan,
        draftPlan: null,
      });

      // Record adaptation in history
      recordHistoryEvent({
        type: "recovery_plan_accepted",
        title: "Academic Recovery Plan Activated",
        summary: `Re-balanced schedule: ${recoveryProposal.comparison.movedSessionCount} sessions re-slotted, overloaded days eliminated.`,
      });

      // Update local state
      setAcceptedPlan(updatedAcceptedPlan);
      setRecoveryProposal(null);
      setAcceptSuccessMessage(
        "Academic Recovery Plan Activated! Your study schedule has been updated across your Study Planner and Dashboard."
      );
    } finally {
      setIsAccepting(false);
    }
  }, [recoveryProposal]);

  // Handler: Reject Proposal
  const handleRejectProposal = useCallback(() => {
    if (recoveryProposal) {
      recordHistoryEvent({
        type: "recovery_plan_rejected",
        title: "Recovery Proposal Dismissed",
        summary: "Retained current active schedule without applying recovery modifications.",
      });
    }
    setRecoveryProposal(null);
  }, [recoveryProposal]);

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] shadow-[var(--shadow-xs)]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <RotateCcw className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
                Academic Recovery
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Pacing & Balance
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
              Let&apos;s make your study plan manageable again, one step at a time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-center">
            <Link href="/app/workload">
              <Button variant="outline" size="md" className="text-xs gap-1.5">
                <TrendingUp className="h-4 w-4 text-[var(--color-primary)]" />
                <span>Workload Insights</span>
              </Button>
            </Link>

            <Link href="/app/planner">
              <Button variant="outline" size="md" className="text-xs gap-1.5">
                <Brain className="h-4 w-4 text-[var(--color-primary)]" />
                <span>Study Planner</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Success Banner ── */}
        {acceptSuccessMessage && (
          <div className="p-4 rounded-[var(--radius-xl)] bg-emerald-50 border border-emerald-200 shadow-[var(--shadow-xs)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">
                  Recovery Plan Successfully Applied
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  {acceptSuccessMessage}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <Link href="/app/planner">
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white gap-1"
                >
                  <span>View in Study Planner</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* ── Section 1: Diagnostic Triggers & Summary ── */}
        <section aria-label="Recovery triggers and diagnostic summary">
          <RecoveryTriggersCard
            diagnosis={diagnosis}
            onGenerateProposal={handleGenerateProposal}
            isGenerating={isGenerating}
          />
        </section>

        {/* ── Section 2: Proposal Comparison View (when generated) ── */}
        {recoveryProposal && (
          <section aria-label="Recovery plan comparison">
            <RecoveryComparisonView
              recoveryProposal={recoveryProposal}
              onAcceptRecoveryPlan={handleAcceptRecoveryPlan}
              onRejectProposal={handleRejectProposal}
              isAccepting={isAccepting}
            />
          </section>
        )}
      </div>
    </DashboardShell>
  );
}
