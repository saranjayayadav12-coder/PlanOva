"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Check,
  X,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui";
import { ProposedRecoveryPlan } from "@/types/recovery";

interface RecoveryComparisonViewProps {
  recoveryProposal: ProposedRecoveryPlan;
  onAcceptRecoveryPlan: () => void;
  onRejectProposal: () => void;
  isAccepting?: boolean;
}

export function RecoveryComparisonView({
  recoveryProposal,
  onAcceptRecoveryPlan,
  onRejectProposal,
  isAccepting = false,
}: RecoveryComparisonViewProps) {
  const [showConfirmAccept, setShowConfirmAccept] = useState(false);
  const { plan: proposedPlan, comparison } = recoveryProposal;

  const originalHours = (comparison.originalPlannedMinutes / 60).toFixed(1);
  const proposedHours = (comparison.proposedPlannedMinutes / 60).toFixed(1);

  // Group proposed sessions by date
  const sessionsByDate: Record<string, typeof proposedPlan.sessions> = {};
  for (const s of proposedPlan.sessions) {
    if (!sessionsByDate[s.date]) sessionsByDate[s.date] = [];
    sessionsByDate[s.date].push(s);
  }

  return (
    <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 sm:p-7 shadow-[var(--shadow-md)] space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)]"
            style={{ backgroundColor: "var(--color-accent-lavender)" }}
          >
            <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text)]">
                Proposed Academic Recovery Plan
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Pacing Recalibrated
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Review how this proposal re-balances study hours across your week. Your current plan remains unchanged until you accept.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onRejectProposal}
            disabled={isAccepting}
            className="text-xs text-rose-700 hover:text-rose-800 hover:bg-rose-50"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            <span>Reject Proposal</span>
          </Button>

          {showConfirmAccept ? (
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-[var(--radius-md)] border border-emerald-300 shadow-[var(--shadow-xs)]">
              <span className="text-xs text-emerald-900 font-semibold px-1">
                Confirm Update?
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={onAcceptRecoveryPlan}
                disabled={isAccepting}
                className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                <span>Yes, Activate</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmAccept(false)}
                className="h-7 px-1.5 text-xs text-gray-600"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowConfirmAccept(true)}
              disabled={isAccepting}
              className="gap-1.5 shadow-[var(--shadow-sm)] text-xs font-semibold"
            >
              <Check className="h-4 w-4" />
              <span>Accept Recovery Plan</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Key Impact Metrics (Before vs After) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)]">
          <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block">
            Total Study Hours
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm line-through text-gray-400">{originalHours}h</span>
            <ArrowRight className="h-3 w-3 text-[var(--color-primary)]" />
            <span className="text-lg font-black text-[var(--color-text)]">{proposedHours}h</span>
          </div>
          <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5 block">
            Re-spaced over 7 days
          </span>
        </div>

        <div className="p-3.5 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)]">
          <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block">
            Overloaded Days
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm text-rose-600 font-bold">{comparison.originalOverloadedDays} days</span>
            <ArrowRight className="h-3 w-3 text-[var(--color-primary)]" />
            <span className="text-lg font-black text-emerald-700">{comparison.proposedOverloadedDays} days</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
            Overload eliminated
          </span>
        </div>

        <div className="p-3.5 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)]">
          <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block">
            Sessions Moved
          </span>
          <div className="text-lg font-black text-[var(--color-primary-dark)] mt-1">
            {comparison.movedSessionCount}
          </div>
          <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5 block">
            Re-scheduled into open slots
          </span>
        </div>

        <div className="p-3.5 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)]">
          <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block">
            Unscheduled Tasks
          </span>
          <div className="text-lg font-black text-gray-800 mt-1">
            {comparison.unscheduledTaskCount}
          </div>
          <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5 block">
            {comparison.unscheduledTaskCount === 0 ? "All tasks fit smoothly" : "Needs extended window"}
          </span>
        </div>
      </div>

      {/* ── Strategic Trade-Offs & Principles ── */}
      <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--color-accent-lavender)]/40 border border-[var(--color-primary-light)]/60 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4.5 w-4.5 text-[var(--color-primary)]" />
          <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text)]">
            How This Recovery Proposal Protects Your Well-Being
          </h3>
        </div>
        <ul className="text-xs text-[var(--color-text)] space-y-1 list-disc list-inside">
          {comparison.tradeOffs.map((tradeOff, idx) => (
            <li key={idx} className="leading-relaxed">
              {tradeOff}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Remaining Risks / Transparent Feasibility Disclosures ── */}
      {comparison.remainingRisks.length > 0 && (
        <div className="p-3.5 rounded-[var(--radius-xl)] bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Feasibility Note</span>
          </div>
          {comparison.remainingRisks.map((risk, idx) => (
            <p key={idx} className="leading-relaxed">
              {risk}
            </p>
          ))}
        </div>
      )}

      {/* ── Proposed Schedule Sessions List ── */}
      <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
            Re-Balanced Schedule Overview ({proposedPlan.sessions.length} sessions)
          </h3>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Unchanged
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-purple-500" /> Moved / Re-balanced
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> Added
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(sessionsByDate).map(([date, sessionList]) => {
            const dayMinutes = sessionList.reduce((sum, s) => sum + s.durationMinutes, 0);

            return (
              <div
                key={date}
                className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text)]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                    <span>{date}</span>
                  </div>
                  <span className="text-[11px] text-[var(--color-text-muted)] font-mono">
                    {(dayMinutes / 60).toFixed(1)} hrs total
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {sessionList.map((s) => {
                    let diffBadge = (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-100 text-purple-900 font-semibold">
                        Moved
                      </span>
                    );
                    if (s.diffTag === "unchanged") {
                      diffBadge = (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-900 font-semibold">
                          Unchanged
                        </span>
                      );
                    } else if (s.diffTag === "added") {
                      diffBadge = (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-100 text-blue-900 font-semibold">
                          Added
                        </span>
                      );
                    }

                    return (
                      <div
                        key={s.id}
                        className="p-2.5 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)] text-xs flex flex-col justify-between space-y-1"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-semibold text-[var(--color-text)] truncate block">
                            {s.title}
                          </span>
                          {diffBadge}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                          <span>{s.subject}</span>
                          <span className="font-mono">
                            {s.startTime} ({s.durationMinutes}m)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[var(--color-border)]">
        <Link href="/app/planner">
          <Button variant="ghost" size="sm" className="text-xs text-[var(--color-text-muted)]">
            Cancel & Return to Study Planner
          </Button>
        </Link>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onRejectProposal}
            disabled={isAccepting}
            className="text-xs text-rose-700 hover:text-rose-800 hover:bg-rose-50"
          >
            Reject Proposal
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowConfirmAccept(true)}
            disabled={isAccepting}
            className="gap-1.5 text-xs font-semibold"
          >
            <Check className="h-4 w-4" />
            <span>Accept Recovery Plan</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
