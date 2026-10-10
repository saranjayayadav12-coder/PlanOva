"use client";

import { useState } from "react";
import {
  History,
  CheckCircle2,
  Calendar,
  Sparkles,
  RotateCcw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AdaptationHistoryEvent } from "@/types/planner";

interface AdaptationHistoryCardProps {
  events: AdaptationHistoryEvent[];
}

export function AdaptationHistoryCard({ events }: AdaptationHistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (events.length === 0) return null;

  const displayEvents = isExpanded ? events : events.slice(0, 3);

  const getEventIcon = (type: AdaptationHistoryEvent["type"]) => {
    switch (type) {
      case "session_completed":
        return <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />;
      case "session_marked_incomplete":
        return <AlertCircle className="h-4 w-4 text-[var(--color-warning)]" />;
      case "plan_accepted":
      case "plan_revised_accepted":
        return <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />;
      case "plan_revised_rejected":
        return <RotateCcw className="h-4 w-4 text-[var(--color-text-muted)]" />;
      default:
        return <Calendar className="h-4 w-4 text-[var(--color-primary-dark)]" />;
    }
  };

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 sm:p-5 shadow-[var(--shadow-xs)] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]"
            style={{ backgroundColor: "var(--color-accent-lavender)" }}
          >
            <History className="h-4.5 w-4.5 text-[var(--color-primary)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text)]">
              Adaptation History & Log
            </h3>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Timeline of plan formations, adjustments, and session outcomes.
            </p>
          </div>
        </div>

        {events.length > 3 && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline"
          >
            <span>{isExpanded ? "Show Less" : `View All (${events.length})`}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      <div className="space-y-2 pt-1">
        {displayEvents.map((evt) => {
          const date = new Date(evt.timestamp);
          const timeFormatted = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={evt.id}
              className="p-3 rounded-[var(--radius-lg)] bg-[var(--color-background)] border border-[var(--color-border)] flex items-start gap-3 text-xs"
            >
              <div className="mt-0.5 shrink-0">{getEventIcon(evt.type)}</div>
              <div className="flex-1 space-y-0.5 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-bold text-[var(--color-text)] truncate">
                    {evt.title}
                  </h4>
                  <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                    {timeFormatted}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                  {evt.summary}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
