import {
  CalendarRange,
  RefreshCw,
  ListTree,
  ShieldAlert,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Container,
  SectionHeading,
} from "@/components/ui";

interface FeatureItem {
  icon: React.ElementType;
  badge: string;
  title: string;
  description: string;
  highlight: string;
}

const features: FeatureItem[] = [
  {
    icon: CalendarRange,
    badge: "Core Engine",
    title: "AI Study Planner",
    description:
      "Create realistic study schedules around your actual deadlines, estimated task durations, and genuine free hours each week.",
    highlight: "Schedules respect your limits instead of overloading your evenings.",
  },
  {
    icon: RefreshCw,
    badge: "Dynamic Recalibration",
    title: "Adaptive Planning",
    description:
      "Review proposed schedule adjustments when tasks are missed, assignments take longer, or personal circumstances shift.",
    highlight: "Clear options presented for your review—you remain in total control.",
  },
  {
    icon: ListTree,
    badge: "Cognitive Relief",
    title: "Smart Task Breakdown",
    description:
      "Turn daunting term papers, capstone projects, and exam syllabi into bite-sized, sequential milestones that are easy to start.",
    highlight: "Eliminates blank-page paralysis with actionable starter steps.",
  },
  {
    icon: ShieldAlert,
    badge: "Stress Reduction",
    title: "Academic Recovery",
    description:
      "Reorganize overdue work and backlog build-ups into a sustainable, guilt-free catch-up roadmap that restores momentum.",
    highlight: "No scolding or red warning alarms—just a calm way forward.",
  },
];

/**
 * FeaturesSection — Section 5
 *
 * Details the 4 pillar capabilities of Acadesk using reusable Card components.
 */
export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-16 sm:py-24 relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Decorative ambient accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-20 blur-[140px]"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-accent-lavender), var(--color-secondary) 50%, transparent 80%)",
        }}
      />

      <Container size="lg" className="relative z-10">
        <SectionHeading
          id="features-heading"
          eyebrow="Core Capabilities"
          title="Engineered for How Students Actually Learn"
          description="Traditional to-do apps assume rigid perfection. Acadesk was architected to handle academic reality, shifting priorities, and fluctuating energy."
          align="center"
          className="mb-12 sm:mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={idx}
                hoverable
                className="group relative border border-[var(--color-border)] p-2 sm:p-4 hover:border-[var(--color-primary-light)] transition-all duration-[var(--transition-base)] flex flex-col justify-between"
              >
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] transition-transform duration-[var(--transition-fast)] group-hover:scale-105"
                        style={{
                          backgroundColor: "var(--color-surface)",
                          boxShadow: "var(--shadow-xs)",
                        }}
                      >
                        <IconComponent
                          className="h-6 w-6 text-[var(--color-primary)]"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-[var(--color-primary-dark)] px-2.5 py-1 rounded-[var(--radius-full)] bg-[var(--color-background)] border border-[var(--color-border)]">
                        {feature.badge}
                      </span>
                    </div>

                    <CardTitle as="h3" className="text-xl sm:text-2xl text-[var(--color-text)]">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="text-sm sm:text-base leading-relaxed text-[var(--color-text-muted)]">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </div>

                <div className="px-6 pb-4 pt-3 border-t border-[var(--color-border)] mt-4">
                  <p className="text-xs font-medium text-[var(--color-primary-dark)] flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-pink)]" />
                    {feature.highlight}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
