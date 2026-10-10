"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui";
import { Task } from "@/types/task";

interface DeleteTaskDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function DeleteTaskDialog({
  task,
  isOpen,
  onClose,
  onConfirm,
}: DeleteTaskDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <div
        className="w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[#fdeeee] text-[var(--color-error)]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3
                id="delete-dialog-title"
                className="text-base font-bold text-[var(--color-text)]"
              >
                Delete Academic Task?
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-md)] p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--color-background)] p-3 border border-[var(--color-border)]">
          <p className="text-xs font-semibold text-[var(--color-primary-dark)]">
            {task.subject}
          </p>
          <p className="text-sm font-bold text-[var(--color-text)] mt-0.5">
            &ldquo;{task.title}&rdquo;
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
            Due {task.deadline} · {task.estimatedDurationMinutes} mins estimated
          </p>
        </div>

        <p
          id="delete-dialog-description"
          className="mt-4 text-xs text-[var(--color-text-muted)] leading-relaxed"
        >
          Deleting this task will permanently remove it from your workload, schedule, and dashboard priorities.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border)]">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="md"
            onClick={() => {
              onConfirm(task.id);
              onClose();
            }}
          >
            Delete Task
          </Button>
        </div>
      </div>
    </div>
  );
}
