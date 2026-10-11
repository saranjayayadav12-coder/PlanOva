"use client";

import Link from "next/link";
import {
  AlertTriangle,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AcademicWarning, WarningType } from "@/types/calendar";
import { useState } from "react";

interface CalendarWarningsBannerProps {
  warnings: AcademicWarning[];
  onClose: () => void;
}

export function CalendarWarningsBanner({
  warnings,
  onClose,
}: CalendarWarningsBannerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (warnings.length === 0) return null;

  const getWarningIcon = (type: WarningType) => {
    switch (type) {
      case "deadline_clustering":
        return Layers;
      case "overloaded_day":
        return Clock;
      case "planning_gap":
        return AlertCircle;
      case "schedule_conflict":
        return AlertTriangle;
    }
  };

  const getSeverityStyle = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "high":
        return "bg-rose-50 border-rose-200 text-rose-900";
      case "medium":
        return "bg-amber-50 border-amber-200 text-amber-900";
      case "low":
        return "bg-purple-50 border-purple-200 text-purple-900";
    }
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-amber-300 bg-amber-50/70 p-4 shadow-[var(--shadow-xs)] animate-in fade-in duration-200 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-200/80 text-amber-900">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-950">
              Academic Scheduling Notices ({warnings.length})
            </h3>
            <p className="text-[11px] text-amber-800">
              Proactive workload diagnostics to help keep your semester manageable and calm.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-[var(--radius-sm)] text-amber-800 hover:bg-amber-200/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label={isExpanded ? "Collapse warnings list" : "Expand warnings list"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[var(--radius-sm)] text-amber-800 hover:bg-amber-200/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Dismiss warnings banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Warning Items */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
          {warnings.map((warn) => {
            const Icon = getWarningIcon(warn.type);
            const style = getSeverityStyle(warn.severity);

            return (
              <div
                key={warn.id}
                className={`flex flex-col justify-between p-3 rounded-[var(--radius-md)] border ${style} transition-all`}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold leading-tight">
                      {warn.title}
                    </h4>
                    <p className="text-[11px] leading-relaxed opacity-90">
                      {warn.message}
                    </p>
                  </div>
                </div>

                {warn.actionLink && warn.actionLabel && (
                  <div className="pt-2 flex justify-end">
                    <Link
                      href={warn.actionLink}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary-dark)] hover:underline"
                    >
                      <span>{warn.actionLabel}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
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
