"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { DashboardShell } from "@/components/dashboard";
import { useTasks } from "@/contexts/task-context";
import {
  AvailabilityPreferences,
  StudyPlan,
  PlannedSession,
  SessionStatus,
  ProposedRevisedPlan,
  AdaptationHistoryEvent,
} from "@/types/planner";
import {
  DEFAULT_AVAILABILITY,
  loadAvailabilityFromStorage,
  saveAvailabilityToStorage,
  loadPlansFromStorage,
  savePlansToStorage,
  loadHistoryFromStorage,
  recordHistoryEvent,
  loadDismissedTriggers,
  saveDismissedTrigger,
} from "@/lib/planner-storage";
import {
  generateStudyPlan,
  generateAdaptivePlan,
  detectPlanAdjustmentTriggers,
  formatDateISO,
  addDays,
} from "@/lib/study-planner-service";
import {
  PlanHeader,
  PlanSummaryMetrics,
  TimelineView,
  UnscheduledTasksCard,
  PlanExplanationCard,
  AvailabilitySettingsModal,
  EditSessionModal,
  PlanAdjustmentBanner,
  PlanComparisonModal,
  WhatIfSimulatorModal,
  AdaptationHistoryCard,
} from "@/components/planner";

export default function StudyPlannerPage() {
  const { tasks, breakdowns } = useTasks();

  // Planner States
  const [availability, setAvailability] = useState<AvailabilityPreferences>(DEFAULT_AVAILABILITY);
  const [acceptedPlan, setAcceptedPlan] = useState<StudyPlan | null>(null);
  const [draftPlan, setDraftPlan] = useState<StudyPlan | null>(null);
  const [isDraftView, setIsDraftView] = useState(false);
  const [selectedWindowDays, setSelectedWindowDays] = useState<number>(7);

  // Phase 8 Adaptive Replanning States
  const [dismissedTriggerIds, setDismissedTriggerIds] = useState<string[]>([]);
  const [proposedRevision, setProposedRevision] = useState<ProposedRevisedPlan | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyEvents, setHistoryEvents] = useState<AdaptationHistoryEvent[]>([]);

  // Dialog States
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<PlannedSession | null>(null);

  // Load from localStorage safely on mount (deferred to avoid cascading render)
  useEffect(() => {
    const timer = setTimeout(() => {
      const loadedAvail = loadAvailabilityFromStorage();
      const storedPlans = loadPlansFromStorage();
      const storedHistory = loadHistoryFromStorage();
      const storedDismissed = loadDismissedTriggers();

      setAvailability(loadedAvail);
      setAcceptedPlan(storedPlans.acceptedPlan);
      setDraftPlan(storedPlans.draftPlan);
      setHistoryEvents(storedHistory);
      setDismissedTriggerIds(storedDismissed);

      if (storedPlans.draftPlan) {
        setIsDraftView(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Currently displayed plan (draft if reviewing draft, otherwise accepted)
  const activePlan = useMemo(() => {
    if (isDraftView && draftPlan) return draftPlan;
    return acceptedPlan;
  }, [isDraftView, draftPlan, acceptedPlan]);

  // Phase 8: Evaluate adaptive replanning triggers
  const activeTrigger = useMemo(() => {
    if (!acceptedPlan || isDraftView) return null;
    return detectPlanAdjustmentTriggers({
      acceptedPlan,
      tasks,
      availability,
      dismissedTriggerIds,
    });
  }, [acceptedPlan, isDraftView, tasks, availability, dismissedTriggerIds]);

  // Generate a new draft study plan
  const handleGeneratePlan = useCallback(() => {
    const today = new Date();
    const startStr = formatDateISO(today);
    const endStr = formatDateISO(addDays(today, selectedWindowDays - 1));

    const newDraft = generateStudyPlan({
      tasks,
      breakdowns,
      availability,
      startDateStr: startStr,
      endDateStr: endStr,
    });

    setDraftPlan(newDraft);
    setIsDraftView(true);
    savePlansToStorage({ acceptedPlan, draftPlan: newDraft });

    const updatedHistory = recordHistoryEvent({
      type: "plan_created",
      title: "Generated New Plan Draft",
      summary: `Created ${newDraft.sessions.length} study sessions over a ${selectedWindowDays}-day period.`,
    });
    setHistoryEvents(updatedHistory);
  }, [tasks, breakdowns, availability, selectedWindowDays, acceptedPlan]);

  // Accept draft plan
  const handleAcceptPlan = useCallback(() => {
    if (!draftPlan) return;

    const activatedPlan: StudyPlan = {
      ...draftPlan,
      status: "accepted",
      updatedAt: new Date().toISOString(),
    };

    setAcceptedPlan(activatedPlan);
    setDraftPlan(null);
    setIsDraftView(false);
    savePlansToStorage({ acceptedPlan: activatedPlan, draftPlan: null });

    const updatedHistory = recordHistoryEvent({
      type: "plan_accepted",
      title: "Activated Study Schedule",
      summary: `Adopted ${activatedPlan.sessions.length} scheduled study blocks for your semester workflow.`,
    });
    setHistoryEvents(updatedHistory);
  }, [draftPlan]);

  // Discard draft plan
  const handleDiscardDraft = useCallback(() => {
    setDraftPlan(null);
    setIsDraftView(false);
    savePlansToStorage({ acceptedPlan, draftPlan: null });
  }, [acceptedPlan]);

  // Save updated availability preferences
  const handleSaveAvailability = useCallback((updated: AvailabilityPreferences) => {
    setAvailability(updated);
    saveAvailabilityToStorage(updated);
  }, []);

  // Save edits to a session
  const handleSaveSession = useCallback(
    (updatedSession: PlannedSession) => {
      const updatePlanSessions = (targetPlan: StudyPlan | null): StudyPlan | null => {
        if (!targetPlan) return null;
        const updatedList = targetPlan.sessions.map((s) =>
          s.id === updatedSession.id ? updatedSession : s
        );
        const totalPlanned = updatedList.reduce((acc, s) => acc + s.durationMinutes, 0);

        return {
          ...targetPlan,
          sessions: updatedList,
          totalPlannedMinutes: totalPlanned,
          updatedAt: new Date().toISOString(),
        };
      };

      if (isDraftView && draftPlan) {
        const next = updatePlanSessions(draftPlan);
        setDraftPlan(next);
        savePlansToStorage({ acceptedPlan, draftPlan: next });
      } else if (acceptedPlan) {
        const next = updatePlanSessions(acceptedPlan);
        setAcceptedPlan(next);
        savePlansToStorage({ acceptedPlan: next, draftPlan });

        if (updatedSession.status === "completed") {
          const updatedHistory = recordHistoryEvent({
            type: "session_completed",
            title: `Completed: ${updatedSession.title}`,
            summary: `Finished ${updatedSession.durationMinutes}m study session for ${updatedSession.subject}.`,
            sessionTitle: updatedSession.title,
            subject: updatedSession.subject,
          });
          setHistoryEvents(updatedHistory);
        } else if (updatedSession.status === "incomplete") {
          const updatedHistory = recordHistoryEvent({
            type: "session_marked_incomplete",
            title: `Session Incomplete: ${updatedSession.title}`,
            summary: `Noted ~${updatedSession.remainingMinutes || updatedSession.durationMinutes}m of work left to reschedule.`,
            sessionTitle: updatedSession.title,
            subject: updatedSession.subject,
          });
          setHistoryEvents(updatedHistory);
        }
      }
    },
    [isDraftView, draftPlan, acceptedPlan]
  );

  // Remove a session from active plan
  const handleRemoveSession = useCallback(
    (sessionId: string) => {
      const filterPlanSessions = (targetPlan: StudyPlan | null): StudyPlan | null => {
        if (!targetPlan) return null;
        const filtered = targetPlan.sessions.filter((s) => s.id !== sessionId);
        const totalPlanned = filtered.reduce((acc, s) => acc + s.durationMinutes, 0);

        return {
          ...targetPlan,
          sessions: filtered,
          totalPlannedMinutes: totalPlanned,
          updatedAt: new Date().toISOString(),
        };
      };

      if (isDraftView && draftPlan) {
        const next = filterPlanSessions(draftPlan);
        setDraftPlan(next);
        savePlansToStorage({ acceptedPlan, draftPlan: next });
      } else if (acceptedPlan) {
        const next = filterPlanSessions(acceptedPlan);
        setAcceptedPlan(next);
        savePlansToStorage({ acceptedPlan: next, draftPlan });
      }
    },
    [isDraftView, draftPlan, acceptedPlan]
  );

  // Toggle session status between scheduled and completed
  const handleToggleSessionStatus = useCallback(
    (sessionId: string) => {
      const toggleInPlan = (targetPlan: StudyPlan | null): StudyPlan | null => {
        if (!targetPlan) return null;
        const updatedSessions = targetPlan.sessions.map((s) => {
          if (s.id !== sessionId) return s;
          const nextStatus: SessionStatus = s.status === "completed" ? "scheduled" : "completed";
          return {
            ...s,
            status: nextStatus,
            outcomeRecordedAt: nextStatus === "completed" ? new Date().toISOString() : undefined,
          };
        });

        return {
          ...targetPlan,
          sessions: updatedSessions,
          updatedAt: new Date().toISOString(),
        };
      };

      if (isDraftView && draftPlan) {
        const next = toggleInPlan(draftPlan);
        setDraftPlan(next);
        savePlansToStorage({ acceptedPlan, draftPlan: next });
      } else if (acceptedPlan) {
        const targetSession = acceptedPlan.sessions.find((s) => s.id === sessionId);
        const next = toggleInPlan(acceptedPlan);
        setAcceptedPlan(next);
        savePlansToStorage({ acceptedPlan: next, draftPlan });

        if (targetSession && targetSession.status !== "completed") {
          const updatedHistory = recordHistoryEvent({
            type: "session_completed",
            title: `Completed Study Block: ${targetSession.title}`,
            summary: `Successfully completed ${targetSession.durationMinutes}m focus block for ${targetSession.subject}.`,
            sessionTitle: targetSession.title,
            subject: targetSession.subject,
          });
          setHistoryEvents(updatedHistory);
        }
      }
    },
    [isDraftView, draftPlan, acceptedPlan]
  );

  // Mark session incomplete with one click from timeline
  const handleMarkIncomplete = useCallback(
    (sessionId: string) => {
      if (!acceptedPlan) return;
      const targetSession = acceptedPlan.sessions.find((s) => s.id === sessionId);
      if (!targetSession) return;

      const remMinutes = targetSession.durationMinutes;
      const updatedSessions = acceptedPlan.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: "incomplete" as const,
              remainingMinutes: remMinutes,
              outcomeRecordedAt: new Date().toISOString(),
              outcomeNote: "Need more time to finish remaining exercises",
            }
          : s
      );

      const nextPlan: StudyPlan = {
        ...acceptedPlan,
        sessions: updatedSessions,
        updatedAt: new Date().toISOString(),
      };

      setAcceptedPlan(nextPlan);
      savePlansToStorage({ acceptedPlan: nextPlan, draftPlan });

      const updatedHistory = recordHistoryEvent({
        type: "session_marked_incomplete",
        title: `Session Incomplete: ${targetSession.title}`,
        summary: `Marked incomplete with ~${remMinutes}m of work remaining to reschedule.`,
        sessionTitle: targetSession.title,
        subject: targetSession.subject,
      });
      setHistoryEvents(updatedHistory);
    },
    [acceptedPlan, draftPlan]
  );

  // Phase 8: Trigger handling — Review proposed adjustment
  const handleReviewAdjustment = useCallback(() => {
    if (!acceptedPlan) return;

    const revision = generateAdaptivePlan({
      currentPlan: acceptedPlan,
      tasks,
      breakdowns,
      availability,
      trigger: activeTrigger,
    });

    setProposedRevision(revision);
    setIsComparisonOpen(true);

    const updatedHistory = recordHistoryEvent({
      type: "plan_revised_proposed",
      title: "Adaptive Plan Revision Proposed",
      summary: activeTrigger
        ? `${activeTrigger.title}: ${activeTrigger.description}`
        : "Re-calibrated schedule to accommodate remaining deliverables.",
    });
    setHistoryEvents(updatedHistory);
  }, [acceptedPlan, tasks, breakdowns, availability, activeTrigger]);

  // Phase 8: Dismiss trigger
  const handleDismissTrigger = useCallback(() => {
    if (activeTrigger) {
      saveDismissedTrigger(activeTrigger.id);
      setDismissedTriggerIds((prev) => [...prev, activeTrigger.id]);
    }
  }, [activeTrigger]);

  // Phase 8: Accept revised plan from comparison
  const handleAcceptRevised = useCallback(() => {
    if (!proposedRevision) return;

    const activatedPlan: StudyPlan = {
      ...proposedRevision.plan,
      status: "accepted",
      updatedAt: new Date().toISOString(),
    };

    setAcceptedPlan(activatedPlan);
    setIsComparisonOpen(false);
    setProposedRevision(null);
    savePlansToStorage({ acceptedPlan: activatedPlan, draftPlan: null });

    if (activeTrigger) {
      saveDismissedTrigger(activeTrigger.id);
      setDismissedTriggerIds((prev) => [...prev, activeTrigger.id]);
    }

    const updatedHistory = recordHistoryEvent({
      type: "plan_revised_accepted",
      title: "Accepted Adaptive Schedule",
      summary: `Re-balanced plan activated with ${activatedPlan.sessions.length} sessions, protecting daily limits.`,
    });
    setHistoryEvents(updatedHistory);
  }, [proposedRevision, activeTrigger]);

  // Phase 8: Reject revised plan from comparison
  const handleRejectChanges = useCallback(() => {
    setIsComparisonOpen(false);
    setProposedRevision(null);

    if (activeTrigger) {
      saveDismissedTrigger(activeTrigger.id);
      setDismissedTriggerIds((prev) => [...prev, activeTrigger.id]);
    }

    const updatedHistory = recordHistoryEvent({
      type: "plan_revised_rejected",
      title: "Rejected Schedule Revision",
      summary: "Preserved original accepted plan unchanged.",
    });
    setHistoryEvents(updatedHistory);
  }, [activeTrigger]);

  // Phase 8: Apply simulated plan from What-If Simulator
  const handleApplySimulatedPlan = useCallback(
    (simulatedPlan: StudyPlan) => {
      const activatedPlan: StudyPlan = {
        ...simulatedPlan,
        status: "accepted",
        updatedAt: new Date().toISOString(),
      };

      setAcceptedPlan(activatedPlan);
      setDraftPlan(null);
      setIsDraftView(false);
      setIsSimulatorOpen(false);
      savePlansToStorage({ acceptedPlan: activatedPlan, draftPlan: null });

      const updatedHistory = recordHistoryEvent({
        type: "plan_accepted",
        title: "Adopted Simulated Study Plan",
        summary: `Activated schedule with ${activatedPlan.sessions.length} sessions after testing what-if scenario.`,
      });
      setHistoryEvents(updatedHistory);
    },
    []
  );

  return (
    <DashboardShell
      headerTitle="AI Study Planner"
      headerSubtitle="Build a realistic study plan around your deadlines, available time, and academic priorities."
      headerBadge="Adaptive Planning"
    >
      <div className="space-y-6 sm:space-y-8">
        {/* ── Main Planner Header ── */}
        <PlanHeader
          plan={activePlan}
          hasDraft={Boolean(draftPlan)}
          isDraftView={isDraftView}
          selectedWindowDays={selectedWindowDays}
          onWindowChange={setSelectedWindowDays}
          onGeneratePlan={handleGeneratePlan}
          onAcceptPlan={handleAcceptPlan}
          onDiscardDraft={handleDiscardDraft}
          onOpenAvailability={() => setIsAvailabilityOpen(true)}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          onToggleHistory={() => setShowHistory(!showHistory)}
          showHistory={showHistory}
        />

        {/* ── Phase 8: Adaptive Notification Banner ── */}
        <PlanAdjustmentBanner
          trigger={activeTrigger}
          onReviewAdjustment={handleReviewAdjustment}
          onDismiss={handleDismissTrigger}
        />

        {/* ── Summary Metrics ── */}
        {activePlan && <PlanSummaryMetrics plan={activePlan} />}

        {/* ── Phase 8: Adaptation History Panel (Collapsible) ── */}
        {showHistory && <AdaptationHistoryCard events={historyEvents} />}

        {/* ── Unscheduled Tasks Warning ── */}
        {activePlan && activePlan.unscheduledTasks.length > 0 && (
          <UnscheduledTasksCard
            tasks={activePlan.unscheduledTasks}
            onOpenAvailability={() => setIsAvailabilityOpen(true)}
          />
        )}

        {/* ── Timeline Schedule ── */}
        <TimelineView
          plan={activePlan}
          onEditSession={(s) => setEditingSession(s)}
          onToggleSessionStatus={handleToggleSessionStatus}
          onMarkIncomplete={handleMarkIncomplete}
          onRemoveSession={handleRemoveSession}
        />

        {/* ── "Why this plan?" Explainability Section ── */}
        {activePlan && activePlan.explanations.length > 0 && (
          <PlanExplanationCard explanations={activePlan.explanations} />
        )}

        {/* ── Availability Settings Modal ── */}
        <AvailabilitySettingsModal
          isOpen={isAvailabilityOpen}
          onClose={() => setIsAvailabilityOpen(false)}
          availability={availability}
          onSave={handleSaveAvailability}
        />

        {/* ── Edit Session Modal ── */}
        <EditSessionModal
          isOpen={Boolean(editingSession)}
          session={editingSession}
          onClose={() => setEditingSession(null)}
          onSave={handleSaveSession}
          onDelete={handleRemoveSession}
        />

        {/* ── Phase 8: Plan Comparison Modal ── */}
        {acceptedPlan && (
          <PlanComparisonModal
            isOpen={isComparisonOpen}
            currentPlan={acceptedPlan}
            revisedProposal={proposedRevision}
            onClose={() => setIsComparisonOpen(false)}
            onAcceptRevised={handleAcceptRevised}
            onRejectChanges={handleRejectChanges}
          />
        )}

        {/* ── Phase 8: What-If Simulator Modal ── */}
        {acceptedPlan && (
          <WhatIfSimulatorModal
            isOpen={isSimulatorOpen}
            onClose={() => setIsSimulatorOpen(false)}
            currentPlan={acceptedPlan}
            tasks={tasks}
            breakdowns={breakdowns}
            availability={availability}
            onApplySimulatedPlan={handleApplySimulatedPlan}
          />
        )}
      </div>
    </DashboardShell>
  );
}
