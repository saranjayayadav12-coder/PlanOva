"use client";

import Link from "next/link";
import { Sparkles, Clock, ArrowRight } from "lucide-react";
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

          {/* Action button leading directly to active Study Planner */}
          <div className="pt-3 border-t border-[var(--color-border)]">
            <Link href="/app/planner" className="block w-full">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Open Study Planner</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-[11px] text-center text-[var(--color-text-muted)] mt-1.5">
              Automated adaptive study schedule engine
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
