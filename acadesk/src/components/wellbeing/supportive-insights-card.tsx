"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  BookOpen,
  CheckSquare,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { WellbeingInsight } from "@/types/wellbeing";

interface SupportiveInsightsCardProps {
  insights: WellbeingInsight[];
  hasCheckin: boolean;
}

export function SupportiveInsightsCard({
  insights,
  hasCheckin,
}: SupportiveInsightsCardProps) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-[var(--shadow-sm)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--color-text)]">
              Supportive Academic Insights
            </h3>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Transparent reflections based on your self-reported check-in and current workload.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-semibold text-[var(--color-primary-dark)] bg-[var(--color-accent-lavender)]/50 px-2 py-0.5 rounded-full">
          Non-Clinical Guidance
        </span>
      </div>

      {/* Content */}
      {!hasCheckin ? (
        <div className="text-center py-6 px-4 space-y-2 rounded-[var(--radius-lg)] bg-[var(--color-background)]/50 border border-dashed border-[var(--color-border)]">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent-lavender)]/50 text-[var(--color-primary)] mb-1">
            <Heart className="h-4.5 w-4.5" />
          </div>
          <h4 className="text-xs font-bold text-[var(--color-text)]">
            No Check-in Recorded for Today Yet
          </h4>
          <p className="text-[11px] text-[var(--color-text-muted)] max-w-sm mx-auto leading-relaxed">
            Completing an optional check-in above lets Acadesk synthesize your energy and stress with upcoming deadlines for personalized pacing recommendations.
          </p>
        </div>
      ) : insights.length === 0 ? (
        <div className="text-center py-5 px-4 text-xs text-[var(--color-text-muted)] italic">
          Your check-in indicates a balanced baseline. You can continue studying at your chosen pace.
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => {
            let containerStyle = "";
            if (insight.severity === "positive") {
              containerStyle = "bg-emerald-50/80 border-emerald-200 text-emerald-950";
            } else if (insight.severity === "attention") {
              containerStyle = "bg-purple-50/70 border-purple-200 text-purple-950";
            } else {
              containerStyle = "bg-slate-50 border-slate-200 text-slate-900";
            }

            return (
              <div
                key={insight.id}
                className={`p-3.5 rounded-[var(--radius-lg)] border ${containerStyle} space-y-2 transition-all hover:shadow-xs`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold leading-snug">
                    {insight.title}
                  </h4>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-white/70 text-[var(--color-text)] shrink-0">
                    {insight.category === "workload_synthesis"
                      ? "Workload Synthesis"
                      : "Check-in Signal"}
                  </span>
                </div>

                <p className="text-xs leading-relaxed opacity-90">
                  {insight.message}
                </p>

                {insight.actionLink && insight.actionLabel && (
                  <div className="pt-1 flex justify-end">
                    <Link
                      href={insight.actionLink}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary-dark)] hover:underline"
                    >
                      <span>{insight.actionLabel}</span>
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
