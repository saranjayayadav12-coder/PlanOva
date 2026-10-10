"use client";

import { useState } from "react";
import { X, Check, Trash2, AlertTriangle, AlertCircle } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { PlannedSession, SessionStatus } from "@/types/planner";

interface EditSessionModalProps {
  isOpen: boolean;
  session: PlannedSession | null;
  onClose: () => void;
  onSave: (updated: PlannedSession) => void;
  onDelete: (sessionId: string) => void;
}

export function EditSessionModal({
  isOpen,
  session,
  onClose,
  onSave,
  onDelete,
}: EditSessionModalProps) {
  const [date, setDate] = useState(session?.date || "");
  const [startTime, setStartTime] = useState(session?.startTime || "09:00");
  const [duration, setDuration] = useState<number>(session?.durationMinutes || 45);
  const [status, setStatus] = useState<SessionStatus>(session?.status || "scheduled");
  const [remainingMinutes, setRemainingMinutes] = useState<number>(
    session?.remainingMinutes || session?.durationMinutes || 30
  );
  const [outcomeNote, setOutcomeNote] = useState(session?.outcomeNote || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !session) return null;

  // Calculate end time
  const [startH, startM] = startTime.split(":").map(Number);
  const totalEndMins = (startH || 0) * 60 + (startM || 0) + duration;
  const endH = Math.floor(totalEndMins / 60) % 24;
  const endM = totalEndMins % 60;
  const computedEndTime = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;

  const handleSave = () => {
    onSave({
      ...session,
      date,
      startTime,
      endTime: computedEndTime,
      durationMinutes: duration,
      status,
      remainingMinutes: status === "incomplete" ? remainingMinutes : undefined,
      outcomeNote: outcomeNote.trim() || undefined,
      outcomeRecordedAt: status !== "scheduled" ? new Date().toISOString() : undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[var(--color-border)]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary-dark)]">
              {session.subject}
            </span>
            <h3 className="text-base font-bold text-[var(--color-text)]">
              Edit Session & Record Outcome
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-md)] p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-background)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-[var(--radius-md)] bg-[var(--color-background)] p-3 border border-[var(--color-border)] text-xs">
          <p className="font-semibold text-[var(--color-text)]">{session.title}</p>
          {session.parentTaskTitle && session.parentTaskTitle !== session.title && (
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
              Part of: {session.parentTaskTitle}
            </p>
          )}
        </div>

        {/* ── Outcome / Status Radio Controls ── */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[var(--color-text)]">
            Session Outcome
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setStatus("scheduled")}
              className={`p-2 rounded-[var(--radius-md)] border text-center text-xs font-semibold transition-all ${
                status === "scheduled"
                  ? "border-[var(--color-primary)] bg-[var(--color-accent-lavender)]/50 text-[var(--color-primary-dark)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]"
              }`}
            >
              Scheduled
            </button>
            <button
              type="button"
              onClick={() => setStatus("completed")}
              className={`p-2 rounded-[var(--radius-md)] border text-center text-xs font-semibold transition-all ${
                status === "completed"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]"
              }`}
            >
              Completed
            </button>
            <button
              type="button"
              onClick={() => setStatus("incomplete")}
              className={`p-2 rounded-[var(--radius-md)] border text-center text-xs font-semibold transition-all ${
                status === "incomplete"
                  ? "border-amber-400 bg-amber-50 text-amber-900"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]"
              }`}
            >
              Incomplete
            </button>
          </div>
        </div>

        {/* If marked Incomplete, ask for remaining minutes and optional context */}
        {status === "incomplete" && (
          <div className="p-3 rounded-[var(--radius-md)] bg-amber-50/70 border border-amber-200 text-xs space-y-2.5 animate-in fade-in">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span>Remaining Work to Reschedule</span>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-amber-900 block mb-1">
                Estimated minutes left to finish:
              </label>
              <Input
                type="number"
                min={15}
                max={240}
                step={15}
                value={remainingMinutes}
                onChange={(e) => setRemainingMinutes(Math.max(15, parseInt(e.target.value) || 30))}
                className="bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-amber-900 block mb-1">
                Reflection or note (optional):
              </label>
              <Input
                type="text"
                placeholder="e.g. Exercises 4-7 left to finish"
                value={outcomeNote}
                onChange={(e) => setOutcomeNote(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Start Time
              </label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Duration (mins)
              </label>
              <Input
                type="number"
                min={15}
                max={240}
                step={15}
                value={duration}
                onChange={(e) => setDuration(Math.max(15, parseInt(e.target.value) || 15))}
              />
            </div>
          </div>

          <p className="text-[11px] text-[var(--color-text-muted)]">
            Computed time slot: <strong className="text-[var(--color-text)]">{startTime} – {computedEndTime}</strong> ({duration} mins)
          </p>
        </div>

        {/* Delete Confirmation prompt */}
        {showDeleteConfirm ? (
          <div className="p-3 rounded-[var(--radius-md)] bg-rose-50 border border-rose-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-rose-800 font-bold">
              <AlertTriangle className="h-4 w-4" />
              <span>Remove this session?</span>
            </div>
            <p className="text-rose-700">
              This session will be removed from your active study plan.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDelete(session.id);
                  onClose();
                }}
              >
                Yes, Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5">
                <Check className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
