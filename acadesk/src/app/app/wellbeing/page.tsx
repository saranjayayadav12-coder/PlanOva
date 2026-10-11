"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Calendar,
  ShieldCheck,
  Check,
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
  WellbeingCheckin,
  WellbeingFormData,
} from "@/types/wellbeing";
import {
  loadCheckinsFromStorage,
  saveOrUpdateCheckin,
  deleteCheckinFromStorage,
  clearAllCheckinsFromStorage,
  getCheckinForDate,
} from "@/lib/wellbeing-storage";
import {
  generateWellbeingInsights,
  getRecentCheckins,
} from "@/lib/wellbeing-service";
import {
  CheckinForm,
  SupportiveInsightsCard,
  WellbeingHistoryCard,
  SupportResourcesCard,
  PrivacyNoticeCard,
} from "@/components/wellbeing";

export default function WellbeingPage() {
  const { tasks } = useTasks();

  // ── Date and System State ──
  const [todayStr, setTodayStr] = useState<string>("2026-10-11");
  const [availability, setAvailability] = useState<AvailabilityPreferences>(DEFAULT_AVAILABILITY);
  const [acceptedPlan, setAcceptedPlan] = useState<StudyPlan | null>(null);

  // ── Well-being State ──
  const [checkins, setCheckins] = useState<WellbeingCheckin[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load state safely on client mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date();
      const currentIso = formatDateISO(now);
      setTodayStr(currentIso);

      const avail = loadAvailabilityFromStorage();
      const storedPlans = loadPlansFromStorage();
      const storedCheckins = loadCheckinsFromStorage();

      setAvailability(avail);
      setAcceptedPlan(storedPlans.acceptedPlan);
      setCheckins(storedCheckins);
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Today's check-in (if already recorded)
  const todayCheckin = useMemo(() => {
    return getCheckinForDate(checkins, todayStr) || null;
  }, [checkins, todayStr]);

  // Supportive insights computed from today's check-in + academic state
  const supportiveInsights = useMemo(() => {
    return generateWellbeingInsights({
      checkin: todayCheckin,
      tasks,
      acceptedPlan,
      availability,
      todayStr,
    });
  }, [todayCheckin, tasks, acceptedPlan, availability, todayStr]);

  // Recent check-in history (last 7)
  const recentHistory = useMemo(() => {
    return getRecentCheckins(checkins, 7);
  }, [checkins]);

  // Handle saving or updating check-in
  const handleSaveCheckin = useCallback(
    (formData: WellbeingFormData) => {
      const { checkins: updatedList } = saveOrUpdateCheckin(formData, todayStr);
      setCheckins(updatedList);
    },
    [todayStr]
  );

  // Handle deleting single record
  const handleDeleteRecord = useCallback((id: string) => {
    const updated = deleteCheckinFromStorage(id);
    setCheckins(updated);
  }, []);

  // Handle clearing all history
  const handleClearAll = useCallback(() => {
    clearAllCheckinsFromStorage();
    setCheckins([]);
  }, []);

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
                <Heart className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
                Well-being
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--color-accent-lavender)] text-[var(--color-primary-dark)]">
                Phase 11 • Optional Check-ins
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
              Check in with yourself and build a study routine that works for you.
            </p>
          </div>

          {/* Quick Context Links */}
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
            <Link href="/app/workload">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Workload Insights</span>
              </Button>
            </Link>
            <Link href="/app/recovery">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs text-rose-700 hover:text-rose-800">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Recovery Mode</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Welcoming Intro Note ── */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-xs text-[var(--color-text-muted)] leading-relaxed space-y-1">
          <div className="flex items-center gap-2 text-[var(--color-text)] font-bold">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span>Optional, Calibrating Check-ins</span>
          </div>
          <p>
            Your academic workload shouldn&apos;t run you down. Daily check-ins are 100% voluntary and stored locally in this browser. Acadesk pairs your self-reported energy with your study schedule to give you compassionate, realistic pacing suggestions.
          </p>
        </div>

        {/* ── Main Layout: Check-in Form + Supportive Insights ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Daily Check-in Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <CheckinForm
              existingCheckin={todayCheckin}
              onSave={handleSaveCheckin}
              dateStr={todayStr}
            />

            {/* Support Resources */}
            <SupportResourcesCard />
          </div>

          {/* Right Column: Supportive Insights + Recent History + Privacy (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Supportive Insights synthesized with workload */}
            <SupportiveInsightsCard
              insights={supportiveInsights}
              hasCheckin={Boolean(todayCheckin)}
            />

            {/* Recent History Card */}
            <WellbeingHistoryCard
              checkins={recentHistory}
              onDeleteRecord={handleDeleteRecord}
              onClearAll={handleClearAll}
            />

            {/* Privacy Protection Notice */}
            <PrivacyNoticeCard />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
