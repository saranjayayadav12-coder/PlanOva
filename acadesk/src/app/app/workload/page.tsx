"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard";
import { Button } from "@/components/ui";
import { useTasks } from "@/contexts/task-context";
import {
  loadAvailabilityFromStorage,
  loadPlansFromStorage,
  DEFAULT_AVAILABILITY,
} from "@/lib/planner-storage";
import { StudyPlan, AvailabilityPreferences } from "@/types/planner";
import { formatDateISO } from "@/lib/study-planner-service";
import {
  DEFAULT_ANCHOR_DATE,
  computeWorkloadSummary,
  analyzeDeadlinePressure,
  analyzeDailyWorkloadDistribution,
  computeCompletionTrends,
  generateWorkloadInsights,
} from "@/lib/workload-service";
import { diagnoseRecoveryNeeds } from "@/lib/recovery-service";
import {
  WorkloadSummaryCards,
  DeadlinePressureCard,
  DailyDistributionChart,
  CompletionTrendsCard,
  ActionableInsightsCard,
} from "@/components/workload";

export default function WorkloadInsightsPage() {
  const { tasks } = useTasks();
  const [todayStr, setTodayStr] = useState<string>(DEFAULT_ANCHOR_DATE);
  const [availability, setAvailability] = useState<AvailabilityPreferences>(DEFAULT_AVAILABILITY);
  const [acceptedPlan, setAcceptedPlan] = useState<StudyPlan | null>(null);

  // Load planner, availability, and live date safely on client
  useEffect(() => {
    const timer = setTimeout(() => {
      setTodayStr(formatDateISO(new Date()));
      const avail = loadAvailabilityFromStorage();
      const storedPlans = loadPlansFromStorage();
      setAvailability(avail);
      setAcceptedPlan(storedPlans.acceptedPlan);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Compute metrics from actual state
  const summaryMetrics = useMemo(
    () => computeWorkloadSummary(tasks, acceptedPlan, todayStr),
    [tasks, acceptedPlan, todayStr]
  );

  const deadlineAnalysis = useMemo(
    () => analyzeDeadlinePressure(tasks, todayStr),
    [tasks, todayStr]
  );

  const dailyDistribution = useMemo(
    () => analyzeDailyWorkloadDistribution(acceptedPlan, availability, 7, todayStr),
    [acceptedPlan, availability, todayStr]
  );

  const completionTrends = useMemo(
    () => computeCompletionTrends(tasks, acceptedPlan),
    [tasks, acceptedPlan]
  );

  const actionableInsights = useMemo(
    () => generateWorkloadInsights(tasks, acceptedPlan, availability, todayStr),
    [tasks, acceptedPlan, availability, todayStr]
  );

  const recoveryDiagnosis = useMemo(
    () => diagnoseRecoveryNeeds(tasks, acceptedPlan, availability, todayStr),
    [tasks, acceptedPlan, availability, todayStr]
  );

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
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
                Workload Insights
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--color-accent-lavender)] text-[var(--color-primary-dark)]">
                Adaptive Analytics
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
              Understand your academic workload and find a more manageable way to move forward.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            {recoveryDiagnosis.isRecoveryNeeded ? (
              <Link href="/app/recovery">
                <Button
                  variant="primary"
                  size="md"
                  className="gap-2 shadow-[var(--shadow-md)] text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Academic Recovery Mode</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            ) : (
              <Link href="/app/recovery">
                <Button
                  variant="outline"
                  size="md"
                  className="gap-2 shadow-[var(--shadow-xs)] text-xs sm:text-sm"
                >
                  <RotateCcw className="h-4 w-4 text-[var(--color-primary)]" />
                  <span>Academic Recovery</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* ── Recovery Alert Banner (if recovery opportunity identified) ── */}
        {recoveryDiagnosis.isRecoveryNeeded && (
          <div className="p-4 rounded-[var(--radius-xl)] bg-rose-50/80 border border-rose-200 shadow-[var(--shadow-xs)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-950">
                  Recovery Opportunity Identified
                </h3>
                <p className="text-xs text-rose-800 leading-relaxed mt-0.5 max-w-2xl">
                  {recoveryDiagnosis.summary}
                </p>
              </div>
            </div>

            <div className="shrink-0 self-end sm:self-center">
              <Link href="/app/recovery">
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-[var(--shadow-xs)]"
                >
                  <span>Open Recovery Mode</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* ── Workload Summary Cards ── */}
        <section aria-label="Workload metrics summary">
          <WorkloadSummaryCards metrics={summaryMetrics} />
        </section>

        {/* ── Actionable Insights Engine ── */}
        <section aria-label="Actionable Insights">
          <ActionableInsightsCard insights={actionableInsights} />
        </section>

        {/* ── Dual Columns: Daily Distribution + Deadline Pressure ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6" aria-label="Daily workload distribution">
            <DailyDistributionChart distribution={dailyDistribution} />
          </section>

          <section className="lg:col-span-1 space-y-6" aria-label="Deadline pressure analysis">
            <DeadlinePressureCard analysis={deadlineAnalysis} />
          </section>
        </div>

        {/* ── Completion Trends & Momentum ── */}
        <section aria-label="Completion trends">
          <CompletionTrendsCard trends={completionTrends} />
        </section>
      </div>
    </DashboardShell>
  );
}
