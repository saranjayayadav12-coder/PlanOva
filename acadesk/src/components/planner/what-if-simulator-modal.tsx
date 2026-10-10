"use client";

import { useState } from "react";
import {
  X,
  Sparkles,
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { Task } from "@/types/task";
import { TaskBreakdown } from "@/types/subtask";
import {
  StudyPlan,
  AvailabilityPreferences,
  WhatIfScenarioType,
  WhatIfParameters,
  SimulationResult,
} from "@/types/planner";
import { runWhatIfSimulation, addDays, formatDateISO, parseDateISO } from "@/lib/study-planner-service";

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: StudyPlan;
  tasks: Task[];
  breakdowns: Record<string, TaskBreakdown>;
  availability: AvailabilityPreferences;
  onApplySimulatedPlan: (simulatedPlan: StudyPlan) => void;
}

export function WhatIfSimulatorModal({
  isOpen,
  onClose,
  currentPlan,
  tasks,
  breakdowns,
  availability,
  onApplySimulatedPlan,
}: WhatIfSimulatorModalProps) {
  const [scenario, setScenario] = useState<WhatIfScenarioType>("reduce_availability");

  // Scenario 1: Reduce availability
  const [targetDate, setTargetDate] = useState<string>(
    formatDateISO(addDays(new Date(), 1))
  );
  const [reducedMinutes, setReducedMinutes] = useState<number>(60);

  // Scenario 2: Add hypothetical assignment
  const [simTaskTitle, setSimTaskTitle] = useState("Operating Systems Lab 3");
  const [simTaskSubject, setSimTaskSubject] = useState("Operating Systems");
  const [simTaskDuration, setSimTaskDuration] = useState<number>(90);
  const [simTaskDeadline, setSimTaskDeadline] = useState<string>(
    formatDateISO(addDays(new Date(), 3))
  );

  // Scenario 3 & 4: Existing task modifications
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    tasks[0]?.id || ""
  );
  const [newDeadline, setNewDeadline] = useState<string>(
    tasks[0]?.deadline ? formatDateISO(addDays(parseDateISO(tasks[0].deadline), -1)) : ""
  );
  const [durationMultiplier, setDurationMultiplier] = useState<number>(1.5);

  // Simulation execution state
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);

  if (!isOpen) return null;

  const handleRunSimulation = () => {
    const params: WhatIfParameters = {
      scenario,
      targetDate,
      reducedMinutes,
      simulatedTaskTitle: simTaskTitle,
      simulatedTaskSubject: simTaskSubject,
      simulatedTaskDurationMinutes: simTaskDuration,
      simulatedTaskDeadline: simTaskDeadline,
      simulatedTaskPriority: "high",
      selectedTaskId,
      newDeadline,
      durationMultiplier,
    };

    const result = runWhatIfSimulation({
      currentPlan,
      tasks,
      breakdowns,
      availability,
      parameters: params,
    });

    setSimulationResult(result);
    setShowApplyConfirm(false);
  };

  const handleApply = () => {
    if (simulationResult) {
      onApplySimulatedPlan(simulationResult.simulatedPlan);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="what-if-title"
    >
      <div
        className="w-full max-w-4xl rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 sm:p-7 shadow-2xl my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)]"
              style={{ backgroundColor: "var(--color-accent-pink)" }}
            >
              <Sparkles className="h-5 w-5 text-[var(--color-primary-dark)]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="what-if-title"
                  className="text-lg sm:text-xl font-bold text-[var(--color-text)]"
                >
                  What-If Schedule Simulator
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Simulation Sandbox • Safe Preview
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Test hypothetical changes safely without altering your actual tasks, accepted schedule, or preferences.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-md)] p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          {/* Scenario Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">
              Select What-If Experiment
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setScenario("reduce_availability");
                  setSimulationResult(null);
                }}
                className={`p-2.5 rounded-[var(--radius-lg)] border text-left text-xs transition-all ${
                  scenario === "reduce_availability"
                    ? "border-[var(--color-primary)] bg-[var(--color-accent-lavender)]/50 font-bold text-[var(--color-primary-dark)] shadow-xs"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                <Clock className="h-3.5 w-3.5 mb-1 text-[var(--color-primary)]" />
                <span>Reduced Time</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setScenario("add_task");
                  setSimulationResult(null);
                }}
                className={`p-2.5 rounded-[var(--radius-lg)] border text-left text-xs transition-all ${
                  scenario === "add_task"
                    ? "border-[var(--color-primary)] bg-[var(--color-accent-lavender)]/50 font-bold text-[var(--color-primary-dark)] shadow-xs"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                <Plus className="h-3.5 w-3.5 mb-1 text-[var(--color-primary)]" />
                <span>Add Assignment</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setScenario("change_deadline");
                  setSimulationResult(null);
                }}
                className={`p-2.5 rounded-[var(--radius-lg)] border text-left text-xs transition-all ${
                  scenario === "change_deadline"
                    ? "border-[var(--color-primary)] bg-[var(--color-accent-lavender)]/50 font-bold text-[var(--color-primary-dark)] shadow-xs"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                <Calendar className="h-3.5 w-3.5 mb-1 text-[var(--color-primary)]" />
                <span>Shift Deadline</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setScenario("task_duration_increase");
                  setSimulationResult(null);
                }}
                className={`p-2.5 rounded-[var(--radius-lg)] border text-left text-xs transition-all ${
                  scenario === "task_duration_increase"
                    ? "border-[var(--color-primary)] bg-[var(--color-accent-lavender)]/50 font-bold text-[var(--color-primary-dark)] shadow-xs"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5 mb-1 text-[var(--color-primary)]" />
                <span>Task Takes Longer</span>
              </button>
            </div>
          </div>

          {/* Scenario Configuration Controls */}
          <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--color-background)] border border-[var(--color-border)] space-y-3">
            {scenario === "reduce_availability" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-[var(--color-text)] block mb-1">
                    Select Target Date
                  </label>
                  <Input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text)] block mb-1">
                    Lost Study Time (minutes)
                  </label>
                  <Input
                    type="number"
                    min={15}
                    max={240}
                    step={15}
                    value={reducedMinutes}
                    onChange={(e) => setReducedMinutes(parseInt(e.target.value) || 60)}
                  />
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    e.g. 60 or 90 minutes for personal errands
                  </span>
                </div>
              </div>
            )}

            {scenario === "add_task" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-[var(--color-text)] block mb-1">
                    Hypothetical Deliverable Title
                  </label>
                  <Input
                    type="text"
                    value={simTaskTitle}
                    onChange={(e) => setSimTaskTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text)] block mb-1">
                    Course / Subject
                  </label>
                  <Input
                    type="text"
                    value={simTaskSubject}
                    onChange={(e) => setSimTaskSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text)] block mb-1">
                    Estimated Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    min={15}
                    max={360}
                    step={15}
                    value={simTaskDuration}
                    onChange={(e) => setSimTaskDuration(parseInt(e.target.value) || 60)}
                  />
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text)] block mb-1">
                    Due Date
                  </label>
                  <Input
                    type="date"
                    value={simTaskDeadline}
                    onChange={(e) => setSimTaskDeadline(e.target.value)}
                  />
                </div>
              </div>
            )}

            {scenario === "change_deadline" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-[var(--color-text)] block mb-1">
                    Select Assignment
                  </label>
                  <select
                    value={selectedTaskId}
                    onChange={(e) => {
                      setSelectedTaskId(e.target.value);
                      const t = tasks.find((item) => item.id === e.target.value);
                      if (t && t.deadline) {
                        setNewDeadline(formatDateISO(addDays(parseDateISO(t.deadline), -1)));
                      }
                    }}
                    className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)]"
                  >
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} (Due: {t.deadline})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text)] block mb-1">
                    New Simulated Deadline
                  </label>
                  <Input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                  />
                </div>
              </div>
            )}

            {scenario === "task_duration_increase" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-[var(--color-text)] block mb-1">
                    Select Assignment
                  </label>
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)]"
                  >
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.estimatedDurationMinutes}m)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text)] block mb-1">
                    Duration Multiplier
                  </label>
                  <select
                    value={durationMultiplier}
                    onChange={(e) => setDurationMultiplier(parseFloat(e.target.value) || 1.5)}
                    className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)]"
                  >
                    <option value={1.25}>+25% Longer (1.25x)</option>
                    <option value={1.5}>+50% Longer (1.5x)</option>
                    <option value={2.0}>Double Time (2.0x)</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleRunSimulation}
                className="gap-1.5 shadow-[var(--shadow-xs)]"
              >
                <Sparkles className="h-4 w-4" />
                <span>Simulate Impact</span>
              </Button>
            </div>
          </div>

          {/* ── Simulation Results Display ── */}
          {simulationResult && (
            <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-primary-light)] space-y-4 animate-in fade-in duration-150">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-dark)]">
                      Simulation Outcome
                    </span>
                    {simulationResult.feasibility === "feasible" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        Feasible Schedule
                      </span>
                    )}
                    {simulationResult.feasibility === "tight" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        Tight Load (&gt;85% Capacity)
                      </span>
                    )}
                    {simulationResult.feasibility === "overloaded" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                        Capacity Overloaded
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-text)] font-semibold">
                    {simulationResult.impactSummary}
                  </p>
                </div>

                <div className="text-right text-xs">
                  <span className="text-[var(--color-text-muted)] block">Net Time Impact</span>
                  <span
                    className={`font-bold font-mono ${
                      simulationResult.netMinuteDifference > 0
                        ? "text-[var(--color-primary-dark)]"
                        : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {simulationResult.netMinuteDifference > 0 ? `+${simulationResult.netMinuteDifference}m` : `${simulationResult.netMinuteDifference}m`}
                  </span>
                </div>
              </div>

              {/* Deadline warnings in simulation */}
              {simulationResult.newDeadlineRisks.length > 0 && (
                <div className="p-3 rounded-[var(--radius-lg)] bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    <span>Projected Deadline Conflict</span>
                  </div>
                  {simulationResult.newDeadlineRisks.map((risk, idx) => (
                    <p key={idx}>• {risk}</p>
                  ))}
                </div>
              )}

              {/* Simulated session count & duration */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block">
                    Simulated Sessions
                  </span>
                  <span className="font-bold text-[var(--color-text)]">
                    {simulationResult.simulatedPlan.sessions.length} sessions
                  </span>
                </div>

                <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block">
                    Total Study Load
                  </span>
                  <span className="font-bold text-[var(--color-text)]">
                    {(simulationResult.simulatedPlan.totalPlannedMinutes / 60).toFixed(1)} hrs
                  </span>
                </div>

                <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)] col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[var(--color-text-muted)] block">
                    Unscheduled Work
                  </span>
                  <span className="font-bold text-[var(--color-text)]">
                    {simulationResult.simulatedPlan.unscheduledTasks.length} tasks
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Exit Simulation
          </Button>

          {simulationResult && (
            <div className="flex items-center gap-2">
              {showApplyConfirm ? (
                <div className="flex items-center gap-2 p-1 bg-amber-50 rounded-[var(--radius-md)] border border-amber-200">
                  <span className="text-[11px] text-amber-900 font-semibold px-2">
                    Adopt simulated schedule as active plan?
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleApply}
                    className="h-7 text-xs"
                  >
                    Confirm Apply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApplyConfirm(false)}
                    className="h-7 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApplyConfirm(true)}
                  className="gap-1.5 text-xs text-[var(--color-primary-dark)] hover:bg-[var(--color-accent-lavender)]/40"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Adopt as Active Plan</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
