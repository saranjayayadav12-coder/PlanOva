"use client";

import { useState } from "react";
import {
  Heart,
  Sparkles,
  Check,
} from "lucide-react";
import { Button, Textarea } from "@/components/ui";
import {
  WellbeingCheckin,
  WellbeingFormData,
  WellbeingRating,
  RatingOptionMeta,
} from "@/types/wellbeing";
import {
  STRESS_OPTIONS,
  ENERGY_OPTIONS,
  SLEEP_OPTIONS,
  WORKLOAD_OPTIONS,
} from "@/lib/wellbeing-service";

interface CheckinFormProps {
  existingCheckin?: WellbeingCheckin | null;
  onSave: (data: WellbeingFormData) => void;
  dateStr: string;
}

export function CheckinForm({
  existingCheckin,
  onSave,
  dateStr,
}: CheckinFormProps) {
  const [stress, setStress] = useState<WellbeingRating>(
    existingCheckin ? existingCheckin.stress : 3
  );
  const [energy, setEnergy] = useState<WellbeingRating>(
    existingCheckin ? existingCheckin.energy : 3
  );
  const [sleep, setSleep] = useState<WellbeingRating>(
    existingCheckin ? existingCheckin.sleep : 3
  );
  const [workloadManageability, setWorkloadManageability] = useState<WellbeingRating>(
    existingCheckin ? existingCheckin.workloadManageability : 3
  );
  const [note, setNote] = useState<string>(
    existingCheckin?.note || ""
  );

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync state during render if existingCheckin changes (e.g. after storage load or date change)
  const checkinKey = existingCheckin
    ? `${existingCheckin.id}-${existingCheckin.updatedAt}`
    : null;
  const [prevCheckinKey, setPrevCheckinKey] = useState<string | null>(checkinKey);

  if (checkinKey !== prevCheckinKey) {
    setPrevCheckinKey(checkinKey);
    setStress(existingCheckin ? existingCheckin.stress : 3);
    setEnergy(existingCheckin ? existingCheckin.energy : 3);
    setSleep(existingCheckin ? existingCheckin.sleep : 3);
    setWorkloadManageability(
      existingCheckin ? existingCheckin.workloadManageability : 3
    );
    setNote(existingCheckin?.note || "");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      stress,
      energy,
      sleep,
      workloadManageability,
      note,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const renderRatingGroup = (
    title: string,
    question: string,
    value: WellbeingRating,
    onChange: (val: WellbeingRating) => void,
    options: RatingOptionMeta[]
  ) => {
    return (
      <div className="space-y-2">
        <div>
          <label className="text-xs font-bold text-[var(--color-text)] block">
            {title}
          </label>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            {question}
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label={title}
          className="grid grid-cols-2 sm:grid-cols-5 gap-2"
        >
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChange(opt.value)}
                className={`p-2.5 rounded-[var(--radius-md)] border text-left transition-all flex flex-col justify-between gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                  isSelected
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-[var(--shadow-xs)]"
                    : "bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-accent-lavender)]/20"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? "text-white" : "text-[var(--color-primary-dark)]"
                    }`}
                  >
                    Level {opt.value}
                  </span>
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
                <span
                  className={`text-[10px] leading-tight ${
                    isSelected ? "text-white/90" : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {opt.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-[var(--shadow-sm)] space-y-6"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-700">
              <Heart className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)]">
              Daily Well-being Check-in
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Check in for <strong className="text-[var(--color-text)]">{dateStr}</strong>. Completely optional and 100% private.
          </p>
        </div>

        {existingCheckin && (
          <span className="self-start sm:self-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Recorded for Today
          </span>
        )}
      </div>

      {/* ── Success confirmation toast ── */}
      {savedSuccess && (
        <div className="p-3 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            Check-in saved successfully for {dateStr}! Your supportive recommendations have been updated.
          </span>
        </div>
      )}

      {/* ── Questions ── */}
      <div className="space-y-5">
        {renderRatingGroup(
          "Stress Level",
          "How stressed do you feel today?",
          stress,
          setStress,
          STRESS_OPTIONS
        )}

        {renderRatingGroup(
          "Energy Level",
          "How is your energy today?",
          energy,
          setEnergy,
          ENERGY_OPTIONS
        )}

        {renderRatingGroup(
          "Sleep Quality",
          "How would you describe your sleep?",
          sleep,
          setSleep,
          SLEEP_OPTIONS
        )}

        {renderRatingGroup(
          "Workload Manageability",
          "How manageable does your current workload feel?",
          workloadManageability,
          setWorkloadManageability,
          WORKLOAD_OPTIONS
        )}

        {/* ── Optional Note ── */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="checkin-note"
              className="text-xs font-bold text-[var(--color-text)]"
            >
              Optional Personal Reflection
            </label>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              Optional • Stored locally only
            </span>
          </div>
          <Textarea
            id="checkin-note"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any context you'd like to remember? (e.g. 'Midterm prep week', 'slept late studying', 'ready for lab demo')..."
            className="text-xs"
          />
          <p className="text-[10px] text-[var(--color-text-muted)] leading-tight">
            Please do not disclose medical, health diagnosis, or sensitive personal data. This note is for your own reflection.
          </p>
        </div>
      </div>

      {/* ── Submit Action ── */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
        <p className="text-[11px] text-[var(--color-text-muted)]">
          {existingCheckin
            ? "Submitting will update today's existing check-in."
            : "Only 1 check-in per day is stored."}
        </p>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="text-xs sm:text-sm gap-1.5 shadow-[var(--shadow-xs)]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{existingCheckin ? "Update Check-in" : "Save Check-in"}</span>
        </Button>
      </div>
    </form>
  );
}
