"use client";

import { useState } from "react";
import { Sparkles, Clock, CheckCircle2, ArrowRight, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@/components/ui";
import { DemoScheduleBlock, ScheduleStatus } from "./types";

interface StudyPlanPreviewProps {
  schedule: DemoScheduleBlock[];
}

function getStatusBadge(status: ScheduleStatus) {
  switch (status) {
    case "completed":
      return <Badge variant="success" size="sm">Completed</Badge>;
    case "in-progress":
      return <Badge variant="warning" size="sm">In Progress</Badge>;
    case "scheduled":
      return <Badge variant="outline" size="sm">Scheduled</Badge>;
  }
}

export function StudyPlanPreview({ schedule }: StudyPlanPreviewProps) {
  const [showPlannerInfo, setShowPlannerInfo] = useState(false);

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle as="h2" className="text-lg font-bold text-[var(--color-text)]">
              Your Study Plan
            </CardTitle>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Balanced daily timeline calibrated to your available energy.
            </p>
          </div>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)]"
            style={{ backgroundColor: "var(--color-accent-pink)" }}
            aria-hidden="true"
          >
            <Sparkles className="h-4 w-4 text-[var(--color-primary-dark)]" />
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-3 pt-2 flex flex-col justify-between">
          <div className="space-y-2.5">
            {schedule.map((block) => (
              <div
                key={block.id}
                className="flex items-center justify-between p-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-[var(--color-text)]">
                      {block.timeSlot}
                    </span>
                    <span className="text-[11px] text-[var(--color-primary-dark)] font-medium">
                      {block.course}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-[var(--color-border)] hidden sm:block" />
                  <div className="min-w-0 hidden sm:block">
                    <p className="text-xs text-[var(--color-text)] truncate font-medium">
                      {block.activity}
                    </p>
                    <p className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {block.duration}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {getStatusBadge(block.status)}
                </div>
              </div>
            ))}
          </div>

          {/* Action button with explicit upcoming feature feedback */}
          <div className="pt-3 border-t border-[var(--color-border)]">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center gap-2"
              onClick={() => setShowPlannerInfo(true)}
            >
              <Sparkles className="h-4 w-4" />
              <span>Explore Study Planner</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-[11px] text-center text-[var(--color-text-muted)] mt-1.5">
              Automated AI planner engine preview
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Accessible Feature Announcement Modal */}
      {showPlannerInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)]"
                  style={{ backgroundColor: "var(--color-accent-lavender)" }}
                >
                  <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 id="modal-title" className="text-base font-bold text-[var(--color-text)]">
                    AI Study Planner
                  </h3>
                  <Badge variant="primary" size="sm" className="mt-0.5">
                    Coming in Phase 5
                  </Badge>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPlannerInfo(false)}
                className="rounded-[var(--radius-md)] p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[var(--color-text-muted)]">
              The automated study planning engine will arrive in <strong>Phase 5</strong>.
              It will intelligently generate custom time blocks based on your syllabus,
              estimate task complexity, and dynamically recalibrate when tasks take longer than anticipated.
            </p>

            <div className="mt-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)]">
              <div className="flex items-center gap-2 font-semibold text-[var(--color-primary-dark)] mb-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)]" />
                Current Phase 4 Functionality:
              </div>
              <span>
                You can interactively check off tasks in <em>Today&apos;s Priorities</em> right now to watch your remaining workload recalculate in real time!
              </span>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowPlannerInfo(false)}
              >
                Got it, continue preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
