import {
  FilePlus2,
  CalendarCheck2,
  CheckCircle,
  SlidersHorizontal,
} from "lucide-react";
import { Container, SectionHeading } from "@/components/ui";

interface StepItem {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
  detail: string;
}

const steps: StepItem[] = [
  {
    number: "01",
    icon: FilePlus2,
    title: "Add Your Tasks",
    description:
      "Enter assignments, syllabus milestones, and exam dates with estimated time demands.",
    detail: "Import or type deliverables with course tags.",
  },
  {
    number: "02",
    icon: CalendarCheck2,
    title: "Build Your Plan",
    description:
      "Acadesk distributes tasks across your open hours into balanced daily study sessions.",
    detail: "No impossible 14-hour study blocks.",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Track Your Progress",
    description:
      "Check off completed milestones as you work and log sessions effortlessly.",
    detail: "Real-time updates on what remains.",
  },
  {
    number: "04",
    icon: SlidersHorizontal,
    title: "Adapt When Needed",
    description:
      "Missed a day or need extra time? Acadesk suggests smart reschedule options you approve.",
    detail: "You stay in full control with one-click adjustments.",
  },
];

/**
 * HowItWorks — Section 6
 *
 * Visual 4-step workflow explaining the cycle of adding, scheduling, tracking, and adapting.
 */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-24 relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      <Container size="lg">
        <SectionHeading
          id="how-it-works-heading"
          eyebrow="Workflow"
          title="How Acadesk Keeps You Ahead"
          description="A continuous, realistic feedback loop designed to support your semester without burnout."
          align="center"
          className="mb-12 sm:mb-16"
        />

        {/* Steps container */}
        <div className="relative">
          {/* Connecting line for desktop */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 -translate-y-6 z-0"
            style={{
              background:
                "linear-gradient(90deg, var(--color-border) 0%, var(--color-primary-light) 50%, var(--color-border) 100%)",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div
                  key={idx}
                  className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)] flex flex-col justify-between"
                >
                  <div>
                    {/* Top step badge & icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-accent-lavender)] border border-[var(--color-border)]">
                        <IconComp className="h-6 w-6 text-[var(--color-primary)]" />
                      </div>
                      <span className="text-2xl font-black tracking-tight text-[var(--color-primary-light)]">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted)] mb-4">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border)]">
                    <p className="text-[11px] font-semibold text-[var(--color-primary-dark)]">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
