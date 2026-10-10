"use client";

import Link from "next/link";
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui";
import { ActionableInsight } from "@/types/workload";

interface ActionableInsightsCardProps {
  insights: ActionableInsight[];
}

export function ActionableInsightsCard({ insights }: ActionableInsightsCardProps) {
  if (insights.length === 0) {
    return (
      <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-xs)] text-center">
        <div
          className="mx-auto flex h-10 w-10 items-center justify-center rounded-full mb-3"
          style={{ backgroundColor: "var(--color-accent-lavender)" }}
        >
          <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
        </div>
        <h3 className="text-sm font-bold text-[var(--color-text)]">
          All Clear on Actionable Insights
        </h3>
        <p className="mt-1 text-xs text-[var(--color-text-muted)] max-w-md mx-auto">
          Your current deadlines, daily study allocation, and course tasks are aligned without detected pressure points or scheduling gaps.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 sm:p-6 shadow-[var(--shadow-xs)] space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] shrink-0"
            style={{ backgroundColor: "var(--color-accent-lavender)" }}
          >
            <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--color-text)]">
              Actionable Workload Insights
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Specific, supportive observations generated from your real study data.
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-accent-lavender)] text-[var(--color-primary-dark)]">
          {insights.length} insight{insights.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Insights List ── */}
      <div className="space-y-3">
        {insights.map((insight) => {
          let icon = <Lightbulb className="h-4 w-4 text-[var(--color-primary)]" />;
          let cardBg = "bg-[var(--color-surface)] border-[var(--color-border)]";
          let badgeColor = "bg-[var(--color-accent-lavender)] text-[var(--color-primary-dark)]";

          if (insight.severity === "warning") {
            icon = <AlertTriangle className="h-4 w-4 text-amber-600" />;
            cardBg = "bg-amber-50/40 border-amber-200/80";
            badgeColor = "bg-amber-100 text-amber-900 border border-amber-300";
          } else if (insight.severity === "positive") {
            icon = <CheckCircle className="h-4 w-4 text-emerald-600" />;
            cardBg = "bg-emerald-50/40 border-emerald-200/80";
            badgeColor = "bg-emerald-100 text-emerald-900 border border-emerald-300";
          } else if (insight.severity === "opportunity") {
            icon = <Clock className="h-4 w-4 text-indigo-600" />;
            cardBg = "bg-indigo-50/40 border-indigo-200/80";
            badgeColor = "bg-indigo-100 text-indigo-900 border border-indigo-300";
          }

          return (
            <div
              key={insight.id}
              className={`p-4 rounded-[var(--radius-xl)] border transition-all ${cardBg} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{icon}</div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text)]">
                      {insight.title}
                    </h3>
                    <span
                      className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}
                    >
                      {insight.category}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
                    {insight.description}
                  </p>
                </div>
              </div>

              {insight.actionLabel && insight.actionHref && (
                <div className="shrink-0 self-end sm:self-center">
                  <Link href={insight.actionHref}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5 font-semibold shadow-[var(--shadow-xs)]"
                    >
                      <span>{insight.actionLabel}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
