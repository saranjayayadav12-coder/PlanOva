"use client";

import { useState } from "react";
import {
  Calendar,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui";
import { WellbeingCheckin } from "@/types/wellbeing";

interface WellbeingHistoryCardProps {
  checkins: WellbeingCheckin[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export function WellbeingHistoryCard({
  checkins,
  onDeleteRecord,
  onClearAll,
}: WellbeingHistoryCardProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const renderMeter = (label: string, value: number, colorClass: string) => {
    const percent = (value / 5) * 100;
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-[var(--color-text-muted)] font-medium">{label}</span>
          <span className="font-bold text-[var(--color-text)]">{value}/5</span>
        </div>
        <div className="w-full bg-[var(--color-border)] h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${colorClass}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-[var(--shadow-sm)] space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[var(--color-text)] flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[var(--color-primary)]" />
            <span>Recent Check-in History ({checkins.length})</span>
          </h3>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            Your self-reported signals over time. Saved locally in your browser.
          </p>
        </div>

        {checkins.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClearConfirm(true)}
            className="text-xs h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 gap-1 self-start sm:self-center"
            aria-label="Clear all well-being history"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear History</span>
          </Button>
        )}
      </div>

      {/* ── Clear All Confirmation Modal ── */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-history-title"
        >
          <div className="w-full max-w-sm rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-5 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              <h4 id="clear-history-title" className="text-sm font-bold text-[var(--color-text)]">
                Clear Well-being History?
              </h4>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              This will permanently delete all your saved check-in records from this browser. Your academic tasks, calendar events, and study plans will remain completely untouched.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearConfirm(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="text-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                Yes, Clear All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      {checkins.length === 0 ? (
        <div className="text-center py-6 px-4 rounded-[var(--radius-lg)] bg-[var(--color-background)]/50 border border-dashed border-[var(--color-border)] space-y-1.5">
          <p className="text-xs font-semibold text-[var(--color-text)]">
            No check-in history recorded yet
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] max-w-xs mx-auto">
            Your recent check-in signals will appear here after you save your first daily check-in.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {checkins.map((rec) => {
            const isExpanded = expandedId === rec.id;

            return (
              <div
                key={rec.id}
                className="p-3.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] space-y-3 transition-all hover:border-[var(--color-primary-light)]"
              >
                {/* Date and Delete action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--color-text)]">
                      {rec.date}
                    </span>
                    {rec.note && (
                      <span className="text-[10px] text-purple-700 font-semibold bg-purple-100 px-1.5 py-0.2 rounded">
                        Note attached
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                      className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                      aria-label={isExpanded ? "Collapse details" : "Expand details"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteRecord(rec.id)}
                      className="p-1 text-[var(--color-text-muted)] hover:text-rose-600 transition-colors"
                      title="Delete this check-in"
                      aria-label={`Delete check-in for ${rec.date}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Meter Bars Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {renderMeter("Stress", rec.stress, "bg-rose-500")}
                  {renderMeter("Energy", rec.energy, "bg-amber-500")}
                  {renderMeter("Sleep", rec.sleep, "bg-indigo-500")}
                  {renderMeter("Workload", rec.workloadManageability, "bg-emerald-500")}
                </div>

                {/* Optional Note preview */}
                {rec.note && isExpanded && (
                  <div className="pt-2 border-t border-[var(--color-border)]">
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase block">
                      Reflection Note
                    </span>
                    <p className="text-xs text-[var(--color-text)] italic mt-0.5 leading-relaxed">
                      &ldquo;{rec.note}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
