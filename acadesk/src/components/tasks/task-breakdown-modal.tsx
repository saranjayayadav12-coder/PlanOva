"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  X,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  AlertTriangle,
  RotateCcw,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Button, Input, Badge } from "@/components/ui";
import { Task } from "@/types/task";
import { Subtask, TaskBreakdown } from "@/types/subtask";
import { requestTaskBreakdown } from "@/lib/ai-breakdown-service";
import { cn } from "@/lib/utils";

interface TaskBreakdownModalProps {
  isOpen: boolean;
  task: Task | null;
  existingBreakdown?: TaskBreakdown | null;
  onClose: () => void;
  onSave: (taskId: string, subtasks: Subtask[]) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

interface TaskBreakdownModalContentProps {
  task: Task;
  existingBreakdown?: TaskBreakdown | null;
  onClose: () => void;
  onSave: (taskId: string, subtasks: Subtask[]) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

function TaskBreakdownModalContent({
  task,
  existingBreakdown,
  onClose,
  onSave,
  onToggleSubtask,
}: TaskBreakdownModalContentProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>(
    existingBreakdown?.subtasks || []
  );
  const [isGenerating, setIsGenerating] = useState(
    !existingBreakdown || existingBreakdown.subtasks.length === 0
  );
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);

  // New manual subtask inline inputs
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState<number>(20);
  const [newDescription, setNewDescription] = useState("");

  // Confirmation dialogs
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await requestTaskBreakdown(task);
      setSubtasks(response.suggestions);
    } catch {
      setGenerationError("Failed to generate breakdown suggestions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [task]);

  // Initial generation if no breakdown exists yet
  useEffect(() => {
    let isCancelled = false;
    if (!existingBreakdown || existingBreakdown.subtasks.length === 0) {
      requestTaskBreakdown(task)
        .then((response) => {
          if (!isCancelled) {
            setSubtasks(response.suggestions);
            setIsGenerating(false);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setGenerationError("Failed to generate breakdown suggestions. Please try again.");
            setIsGenerating(false);
          }
        });
    }
    return () => {
      isCancelled = true;
    };
  }, [task, existingBreakdown]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showRegenerateConfirm) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showRegenerateConfirm, onClose]);

  // Re-sequence order numbers and update dependencies
  const resequenceSubtasks = (items: Subtask[]): Subtask[] => {
    return items.map((item, idx) => ({
      ...item,
      order: idx + 1,
      dependencyIds: idx > 0 && items[idx - 1] ? [items[idx - 1].id] : [],
      updatedAt: new Date().toISOString(),
    }));
  };

  // Move Subtask Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...subtasks];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setSubtasks(resequenceSubtasks(updated));
  };

  // Move Subtask Down
  const handleMoveDown = (index: number) => {
    if (index === subtasks.length - 1) return;
    const updated = [...subtasks];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setSubtasks(resequenceSubtasks(updated));
  };

  // Remove Subtask
  const handleRemoveSubtask = (id: string) => {
    const filtered = subtasks.filter((s) => s.id !== id);
    setSubtasks(resequenceSubtasks(filtered));
  };

  // Toggle Subtask Completion in local state & context
  const handleToggleSubtaskLocal = (subtaskId: string) => {
    setSubtasks((prev) =>
      prev.map((s) => {
        if (s.id !== subtaskId) return s;
        return {
          ...s,
          status: s.status === "completed" ? "pending" : ("completed" as const),
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (task && onToggleSubtask && existingBreakdown) {
      onToggleSubtask(task.id, subtaskId);
    }
  };

  // Add Manual Subtask
  const handleAddManualSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newSub: Subtask = {
      id: `manual-sub-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      estimatedDurationMinutes: Number(newDuration) || 15,
      order: subtasks.length + 1,
      status: "pending",
      dependencyIds: subtasks.length > 0 ? [subtasks[subtasks.length - 1].id] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSubtasks(resequenceSubtasks([...subtasks, newSub]));
    setNewTitle("");
    setNewDescription("");
    setNewDuration(20);
    setShowAddForm(false);
  };

  // Save full breakdown
  const handleSave = () => {
    if (!task) return;
    onSave(task.id, subtasks);
    onClose();
  };

  // Calculations
  const totalSubtaskMinutes = useMemo(
    () => subtasks.reduce((sum, s) => sum + s.estimatedDurationMinutes, 0),
    [subtasks]
  );

  const completedCount = useMemo(
    () => subtasks.filter((s) => s.status === "completed").length,
    [subtasks]
  );

  const completionPercent =
    subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  const durationDifference = totalSubtaskMinutes - task.estimatedDurationMinutes;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="breakdown-modal-title"
    >
      <div
        className="w-full max-w-2xl rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 sm:p-7 shadow-2xl my-8 relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-xl)] shadow-[var(--shadow-xs)]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="breakdown-modal-title"
                  className="text-lg sm:text-xl font-bold text-[var(--color-text)]"
                >
                  AI Task Breakdown
                </h2>
                <Badge variant="primary" size="sm">
                  Smart Decomposition
                </Badge>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Review, adjust, and sequence actionable steps for this assignment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-md)] p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            aria-label="Close breakdown dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Parent Assignment Context Card ── */}
        <div className="mt-4 p-4 rounded-[var(--radius-xl)] bg-[var(--color-background)] border border-[var(--color-border)] shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[var(--color-primary)]" />
              <span className="text-xs font-bold text-[var(--color-primary-dark)]">
                {task.subject}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                Due {task.deadline}
              </span>
              <span className="flex items-center gap-1 font-semibold text-[var(--color-text)]">
                <Clock className="h-3.5 w-3.5" />
                Target: {task.estimatedDurationMinutes} mins
              </span>
            </div>
          </div>

          <h3 className="text-base font-bold text-[var(--color-text)] mt-1.5">
            {task.title}
          </h3>

          {task.description && (
            <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Progress bar if subtasks exist */}
          {subtasks.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text)] mb-1.5">
                <span className="text-[var(--color-text-muted)]">
                  Subtask Progress: {completedCount} of {subtasks.length} completed
                </span>
                <span className="text-[var(--color-primary-dark)]">
                  {completionPercent}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white overflow-hidden border border-[var(--color-border)]">
                <div
                  className="h-full rounded-full bg-[var(--color-success)] transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Demo Adapter Notification Banner ── */}
        <div className="mt-3 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-accent-lavender)]/30 border border-[var(--color-border)] flex items-center justify-between gap-2 text-[11px] text-[var(--color-text-muted)] shrink-0">
          <div className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-[var(--color-primary)] shrink-0" />
            <span>
              Suggestions are generated using the <strong>academic heuristic adapter</strong>. Review and customize before saving.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowRegenerateConfirm(true)}
            disabled={isGenerating}
            className="font-semibold text-[var(--color-primary-dark)] hover:underline shrink-0 inline-flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Regenerate</span>
          </button>
        </div>

        {/* ── Total Duration Summary & Warnings ── */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--color-text)]">
              Total Subtask Time:
            </span>
            <span className="font-bold text-[var(--color-primary-dark)]">
              {totalSubtaskMinutes} mins
            </span>
            <span className="text-[var(--color-text-muted)]">
              ({subtasks.length} subtasks)
            </span>
          </div>

          {durationDifference > 15 && (
            <div className="flex items-center gap-1 text-[var(--color-warning-dark)] font-medium">
              <AlertTriangle className="h-3.5 w-3.5 text-[var(--color-warning)]" />
              <span>+{durationDifference}m over target duration</span>
            </div>
          )}
        </div>

        {/* ── Scrollable Subtask List Area ── */}
        <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-1">
          {isGenerating ? (
            <div className="py-16 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-lavender)] animate-pulse">
                <Sparkles className="h-6 w-6 text-[var(--color-primary)] animate-spin" />
              </div>
              <p className="text-sm font-semibold text-[var(--color-text)]">
                Decomposing assignment into actionable steps...
              </p>
              <p className="text-xs text-[var(--color-text-muted)] max-w-xs mx-auto">
                Analyzing difficulty, subject requirements, and estimating practical time blocks.
              </p>
            </div>
          ) : generationError ? (
            <div className="py-10 text-center space-y-3">
              <AlertTriangle className="h-8 w-8 text-[var(--color-error)] mx-auto" />
              <p className="text-sm font-semibold text-[var(--color-error)]">
                {generationError}
              </p>
              <Button variant="outline" size="sm" onClick={handleGenerate}>
                Retry Generation
              </Button>
            </div>
          ) : subtasks.length === 0 ? (
            <div className="py-12 text-center rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] p-6">
              <Sparkles className="h-8 w-8 text-[var(--color-primary)] mx-auto mb-2 opacity-60" />
              <p className="text-sm font-semibold text-[var(--color-text)]">
                No subtasks generated yet
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 mb-4">
                Click below to generate suggestions based on your assignment parameters.
              </p>
              <Button variant="primary" size="md" onClick={handleGenerate}>
                <Sparkles className="h-4 w-4" />
                <span>Generate Breakdown</span>
              </Button>
            </div>
          ) : (
            subtasks.map((sub, idx) => {
              const isEditing = editingSubtaskId === sub.id;
              const isCompleted = sub.status === "completed";

              return (
                <div
                  key={sub.id}
                  className={cn(
                    "rounded-[var(--radius-lg)] border p-3.5 transition-all bg-[var(--color-surface)]",
                    isCompleted
                      ? "border-[var(--color-border)] opacity-75"
                      : "border-[var(--color-border)] hover:border-[var(--color-primary-light)]"
                  )}
                >
                  {isEditing ? (
                    // Inline Edit Form for this Subtask
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--color-primary-dark)]">
                          Step {sub.order}:
                        </span>
                        <Input
                          value={sub.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSubtasks((prev) =>
                              prev.map((s) => (s.id === sub.id ? { ...s, title: val } : s))
                            );
                          }}
                          placeholder="Subtask title"
                          className="flex-1"
                        />
                        <div className="w-28 shrink-0 flex items-center gap-1">
                          <Input
                            type="number"
                            min={5}
                            max={600}
                            step={5}
                            value={sub.estimatedDurationMinutes}
                            onChange={(e) => {
                              const mins = parseInt(e.target.value, 10) || 5;
                              setSubtasks((prev) =>
                                prev.map((s) =>
                                  s.id === sub.id ? { ...s, estimatedDurationMinutes: mins } : s
                                )
                              );
                            }}
                            className="text-right"
                          />
                          <span className="text-xs text-[var(--color-text-muted)]">m</span>
                        </div>
                      </div>

                      <Input
                        value={sub.description || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSubtasks((prev) =>
                            prev.map((s) => (s.id === sub.id ? { ...s, description: val } : s))
                          );
                        }}
                        placeholder="Optional description / instructions"
                        className="text-xs"
                      />

                      <div className="flex justify-end gap-2 pt-1">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setEditingSubtaskId(null)}
                        >
                          Done Editing
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Standard Subtask View Card
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Checkbox */}
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isCompleted}
                          onClick={() => handleToggleSubtaskLocal(sub.id)}
                          aria-label={`Mark step ${sub.order} as ${isCompleted ? "pending" : "completed"}`}
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                            isCompleted
                              ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                              : "border-[var(--color-border-strong)] bg-white hover:border-[var(--color-primary)]"
                          )}
                        >
                          {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-[var(--color-primary-dark)]">
                              Step {sub.order}
                            </span>
                            <span
                              className={cn(
                                "text-sm font-semibold transition-colors",
                                isCompleted
                                  ? "text-[var(--color-text-muted)] line-through"
                                  : "text-[var(--color-text)]"
                              )}
                            >
                              {sub.title}
                            </span>
                          </div>

                          {sub.description && (
                            <p className="mt-0.5 text-xs text-[var(--color-text-muted)] leading-relaxed">
                              {sub.description}
                            </p>
                          )}

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-muted)]">
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="h-3 w-3" />
                              {sub.estimatedDurationMinutes} mins
                            </span>
                            {sub.dependencyIds.length > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-[var(--radius-full)] bg-[var(--color-background)] px-2 py-0.5 text-[10px] border border-[var(--color-border)]">
                                Follows Step {idx}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setEditingSubtaskId(sub.id)}
                              className="text-[var(--color-primary)] hover:underline font-medium text-[11px]"
                            >
                              Edit Details
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right controls: Up, Down, Delete */}
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          className="rounded p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:hover:text-[var(--color-text-muted)] focus-visible:outline-none"
                          aria-label={`Move step ${sub.order} up`}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === subtasks.length - 1}
                          className="rounded p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:hover:text-[var(--color-text-muted)] focus-visible:outline-none"
                          aria-label={`Move step ${sub.order} down`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(sub.id)}
                          className="rounded p-1 text-[var(--color-text-muted)] hover:text-[var(--color-error)] focus-visible:outline-none"
                          aria-label={`Remove step ${sub.order}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* ── Add Manual Subtask Section ── */}
          {!isGenerating && !generationError && subtasks.length > 0 && (
            <div className="pt-1">
              {showAddForm ? (
                <form
                  onSubmit={handleAddManualSubtask}
                  className="rounded-[var(--radius-lg)] border border-[var(--color-primary-light)] bg-white p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-primary-dark)]">
                      Add Custom Step {subtasks.length + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="e.g. Discuss draft outline with study partner"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <div className="w-24 shrink-0 flex items-center gap-1">
                      <Input
                        type="number"
                        min={5}
                        max={300}
                        step={5}
                        value={newDuration}
                        onChange={(e) => setNewDuration(parseInt(e.target.value, 10) || 15)}
                        className="text-right"
                      />
                      <span className="text-xs text-[var(--color-text-muted)]">m</span>
                    </div>
                  </div>

                  <Input
                    placeholder="Optional notes or deliverables..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="text-xs"
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Add Step
                    </Button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-2.5 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] hover:border-[var(--color-primary)] text-xs font-semibold text-[var(--color-primary-dark)] hover:bg-[var(--color-accent-lavender)]/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Custom Subtask</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Modal Footer Actions ── */}
        <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3 shrink-0">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={isGenerating || subtasks.length === 0}
              className="gap-1.5 shadow-[var(--shadow-sm)]"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Save Breakdown ({subtasks.length} Steps)</span>
            </Button>
          </div>
        </div>

        {/* ── Confirmation Sub-Dialog for Regeneration ── */}
        {showRegenerateConfirm && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-sm rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-[var(--color-warning-dark)] font-bold">
                <AlertTriangle className="h-5 w-5" />
                <span>Replace Current Subtasks?</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Regenerating will replace all current subtasks and custom modifications with freshly generated suggestions.
              </p>
              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRegenerateConfirm(false)}
                >
                  Keep Current
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setShowRegenerateConfirm(false);
                    handleGenerate();
                  }}
                >
                  Yes, Regenerate
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TaskBreakdownModal({
  isOpen,
  task,
  existingBreakdown,
  onClose,
  onSave,
  onToggleSubtask,
}: TaskBreakdownModalProps) {
  if (!isOpen || !task) return null;

  return (
    <TaskBreakdownModalContent
      key={`${task.id}-${existingBreakdown ? existingBreakdown.updatedAt : "initial"}`}
      task={task}
      existingBreakdown={existingBreakdown}
      onClose={onClose}
      onSave={onSave}
      onToggleSubtask={onToggleSubtask}
    />
  );
}
