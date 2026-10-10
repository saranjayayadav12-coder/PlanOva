import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Label,
  Input,
  Textarea,
  Select,
  FormField,
  FormHelperText,
  FormErrorMessage,
  Badge,
  Divider,
  Container,
  SectionHeading,
} from "@/components/ui";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Info,
} from "lucide-react";

export const metadata = {
  title: "Acadesk Design System — Component Preview",
  description: "Internal development showcase of Acadesk design tokens and UI components.",
};

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] py-10">
      {/* ── Internal Development Environment Notice ── */}
      <div className="bg-[var(--color-primary-dark)] text-white px-4 py-2.5 text-center text-xs sm:text-sm font-medium">
        <span className="inline-flex items-center gap-1.5">
          <Info className="h-4 w-4 shrink-0 text-[var(--color-secondary)]" />
          <strong>Development Environment Preview:</strong> Acadesk Design System &amp; UI Components Showcase (/design-system). Not a production end-user page.
        </span>
      </div>

      <Container size="lg" className="mt-8 space-y-16">
        {/* ── Header ── */}
        <div className="space-y-3">
          <Badge variant="primary" size="md">
            Phase 2 Architecture
          </Badge>
          <h1 className="text-display text-[var(--color-text)]">
            Design System &amp; Primitives
          </h1>
          <p className="max-w-3xl text-body-muted text-base sm:text-lg">
            Standardized, accessible UI primitives styled strictly using Acadesk&apos;s
            pastel pink, lavender, and purple design tokens. These components serve as
            the foundation for all upcoming pages.
          </p>
        </div>

        {/* ── 1. Color Palette Tokens ── */}
        <section className="space-y-6">
          <SectionHeading
            eyebrow={<Badge variant="outline">Step 1</Badge>}
            title="1. Centralized Color Tokens"
            description="Harmonious pastel pink, lavender, and purple palette derived from the visual reference."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Background */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 bg-white shadow-[var(--shadow-sm)]">
              <div
                className="h-16 w-full rounded-[var(--radius-md)] border border-black/5"
                style={{ backgroundColor: "var(--color-background)" }}
              />
              <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
                Background
              </p>
              <code className="text-[10px] text-[var(--color-text-muted)]">
                #FFF0F6
              </code>
            </div>

            {/* Surface */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 bg-white shadow-[var(--shadow-sm)]">
              <div
                className="h-16 w-full rounded-[var(--radius-md)] border border-black/5"
                style={{ backgroundColor: "var(--color-surface)" }}
              />
              <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
                Surface
              </p>
              <code className="text-[10px] text-[var(--color-text-muted)]">
                #FFF9FC
              </code>
            </div>

            {/* Primary */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 bg-white shadow-[var(--shadow-sm)]">
              <div
                className="h-16 w-full rounded-[var(--radius-md)]"
                style={{ backgroundColor: "var(--color-primary)" }}
              />
              <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
                Primary
              </p>
              <code className="text-[10px] text-[var(--color-text-muted)]">
                #7850C8
              </code>
            </div>

            {/* Primary Dark */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 bg-white shadow-[var(--shadow-sm)]">
              <div
                className="h-16 w-full rounded-[var(--radius-md)]"
                style={{ backgroundColor: "var(--color-primary-dark)" }}
              />
              <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
                Primary Dark
              </p>
              <code className="text-[10px] text-[var(--color-text-muted)]">
                #59369D
              </code>
            </div>

            {/* Secondary Lavender */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 bg-white shadow-[var(--shadow-sm)]">
              <div
                className="h-16 w-full rounded-[var(--radius-md)]"
                style={{ backgroundColor: "var(--color-secondary)" }}
              />
              <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
                Secondary
              </p>
              <code className="text-[10px] text-[var(--color-text-muted)]">
                #D8B8F5
              </code>
            </div>

            {/* Accent Pink */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 bg-white shadow-[var(--shadow-sm)]">
              <div
                className="h-16 w-full rounded-[var(--radius-md)]"
                style={{ backgroundColor: "var(--color-accent-pink)" }}
              />
              <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
                Accent Pink
              </p>
              <code className="text-[10px] text-[var(--color-text-muted)]">
                #F4B8D0
              </code>
            </div>

            {/* Text Plum */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 bg-white shadow-[var(--shadow-sm)]">
              <div
                className="h-16 w-full rounded-[var(--radius-md)]"
                style={{ backgroundColor: "var(--color-text)" }}
              />
              <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
                Text Plum
              </p>
              <code className="text-[10px] text-[var(--color-text-muted)]">
                #292235
              </code>
            </div>

            {/* Text Muted */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 bg-white shadow-[var(--shadow-sm)]">
              <div
                className="h-16 w-full rounded-[var(--radius-md)]"
                style={{ backgroundColor: "var(--color-text-muted)" }}
              />
              <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
                Text Muted
              </p>
              <code className="text-[10px] text-[var(--color-text-muted)]">
                #766A80
              </code>
            </div>

            {/* Success */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 bg-white shadow-[var(--shadow-sm)]">
              <div
                className="h-16 w-full rounded-[var(--radius-md)]"
                style={{ backgroundColor: "var(--color-success)" }}
              />
              <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
                Success
              </p>
              <code className="text-[10px] text-[var(--color-text-muted)]">
                #4CAF82
              </code>
            </div>

            {/* Warning */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 bg-white shadow-[var(--shadow-sm)]">
              <div
                className="h-16 w-full rounded-[var(--radius-md)]"
                style={{ backgroundColor: "var(--color-warning)" }}
              />
              <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
                Warning
              </p>
              <code className="text-[10px] text-[var(--color-text-muted)]">
                #F0A840
              </code>
            </div>

            {/* Error */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 bg-white shadow-[var(--shadow-sm)]">
              <div
                className="h-16 w-full rounded-[var(--radius-md)]"
                style={{ backgroundColor: "var(--color-error)" }}
              />
              <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
                Error
              </p>
              <code className="text-[10px] text-[var(--color-text-muted)]">
                #E05252
              </code>
            </div>

            {/* Info */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 bg-white shadow-[var(--shadow-sm)]">
              <div
                className="h-16 w-full rounded-[var(--radius-md)]"
                style={{ backgroundColor: "var(--color-info)" }}
              />
              <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
                Info
              </p>
              <code className="text-[10px] text-[var(--color-text-muted)]">
                #5C9CE6
              </code>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── 2. Typography Hierarchy ── */}
        <section className="space-y-6">
          <SectionHeading
            eyebrow={<Badge variant="outline">Step 2</Badge>}
            title="2. Typography Hierarchy"
            description="Consistent sans-serif type scale configured with clear weights, line heights, and letter-spacing."
          />

          <Card className="space-y-6">
            <div className="border-b border-[var(--color-border)] pb-4">
              <span className="text-metadata uppercase tracking-wider block mb-1">
                Display Heading (.text-display)
              </span>
              <p className="text-display">Your Study Plan Adapts</p>
            </div>

            <div className="border-b border-[var(--color-border)] pb-4">
              <span className="text-metadata uppercase tracking-wider block mb-1">
                Page Title (.text-page-title)
              </span>
              <p className="text-page-title">Weekly Schedule Overview</p>
            </div>

            <div className="border-b border-[var(--color-border)] pb-4">
              <span className="text-metadata uppercase tracking-wider block mb-1">
                Section Title (.text-section-title)
              </span>
              <p className="text-section-title">Active Academic Courses</p>
            </div>

            <div className="border-b border-[var(--color-border)] pb-4">
              <span className="text-metadata uppercase tracking-wider block mb-1">
                Card Title (.text-card-title)
              </span>
              <p className="text-card-title">Computer Systems Architecture</p>
            </div>

            <div className="border-b border-[var(--color-border)] pb-4">
              <span className="text-metadata uppercase tracking-wider block mb-1">
                Body Regular (.text-body)
              </span>
              <p className="text-body max-w-2xl">
                Acadesk recalibrates your workload when unexpected events occur,
                redistributing tasks into achievable study blocks rather than piling up overdue items.
              </p>
            </div>

            <div className="border-b border-[var(--color-border)] pb-4">
              <span className="text-metadata uppercase tracking-wider block mb-1">
                Body Muted (.text-body-muted)
              </span>
              <p className="text-body-muted max-w-2xl">
                Supporting contextual explanation, guidance notes, and secondary details.
              </p>
            </div>

            <div>
              <span className="text-metadata uppercase tracking-wider block mb-1">
                Small Metadata (.text-metadata)
              </span>
              <p className="text-metadata">
                LAST UPDATED TODAY AT 14:30 • 3 TASKS COMPLETED
              </p>
            </div>
          </Card>
        </section>

        <Divider />

        {/* ── 3. Button Component ── */}
        <section className="space-y-6">
          <SectionHeading
            eyebrow={<Badge variant="outline">Step 3</Badge>}
            title="3. Button Component"
            description="Accessible interactive button with 5 variants, 3 sizes, icon slots, disabled state, and loading spinner."
          />

          <Card className="space-y-8">
            {/* Variants */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                Variants (Medium Size)
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                Sizes (Primary Variant)
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">
                  Small (sm)
                </Button>
                <Button variant="primary" size="md">
                  Medium (md)
                </Button>
                <Button variant="primary" size="lg">
                  Large (lg)
                </Button>
              </div>
            </div>

            {/* States & Icons */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                Interactive States &amp; Icon Slots
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  leftIcon={<Sparkles className="h-4 w-4" />}
                >
                  With Left Icon
                </Button>
                <Button
                  variant="secondary"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  With Right Icon
                </Button>
                <Button variant="primary" isLoading>
                  Loading State
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="outline" disabled>
                  Disabled Outline
                </Button>
              </div>
            </div>
          </Card>
        </section>

        <Divider />

        {/* ── 4. Card Component Family ── */}
        <section className="space-y-6">
          <SectionHeading
            eyebrow={<Badge variant="outline">Step 4</Badge>}
            title="4. Composable Card Component Family"
            description="Rounded, softly shadowed surfaces suitable for feature cards, statistics, and course modules."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Card */}
            <Card>
              <CardTitle>Basic Card</CardTitle>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Standard container without header or footer subcomponents, suitable for lightweight content.
              </p>
            </Card>

            {/* Hoverable Card */}
            <Card hoverable>
              <CardTitle>Hoverable Card</CardTitle>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Equipped with hoverable prop that gently lifts the card on hover with soft shadow expansion.
              </p>
              <div className="mt-4">
                <Badge variant="secondary">Interactive</Badge>
              </div>
            </Card>

            {/* Full Composable Card */}
            <Card hoverable className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Course Module</CardTitle>
                    <Badge variant="success">On Track</Badge>
                  </div>
                  <CardDescription>
                    Structured composite card with header, content, and footer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--color-text)]">
                    Next milestone: Linear Algebra Midterm Review (3 tasks remaining).
                  </p>
                </CardContent>
              </div>
              <CardFooter className="flex justify-between items-center">
                <span className="text-xs text-[var(--color-text-muted)]">
                  Due in 4 days
                </span>
                <Button variant="secondary" size="sm">
                  View Plan
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <Divider />

        {/* ── 5. Form Components ── */}
        <section className="space-y-6">
          <SectionHeading
            eyebrow={<Badge variant="outline">Step 5</Badge>}
            title="5. Reusable Form Components"
            description="Accessible input, textarea, and select primitives with label associations, helper text, and error states."
          />

          <Card className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Standard Input */}
              <FormField>
                <Label htmlFor="demo-title" required>
                  Assignment Title
                </Label>
                <Input
                  id="demo-title"
                  placeholder="e.g. Distributed Systems Lab 2"
                  defaultValue="Operating Systems Project"
                />
                <FormHelperText>
                  Provide a clear descriptive title for this milestone.
                </FormHelperText>
              </FormField>

              {/* Input with Icon */}
              <FormField>
                <Label htmlFor="demo-date">Target Due Date</Label>
                <Input
                  id="demo-date"
                  type="date"
                  leftIcon={<Calendar className="h-4 w-4" />}
                  defaultValue="2026-10-15"
                />
                <FormHelperText>
                  When do you need to submit this assignment?
                </FormHelperText>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Select */}
              <FormField>
                <Label htmlFor="demo-course" required>
                  Associated Course
                </Label>
                <Select id="demo-course" defaultValue="cs301">
                  <option value="cs301">CS 301 — Operating Systems</option>
                  <option value="math204">MATH 204 — Linear Algebra</option>
                  <option value="phys101">PHYS 101 — Mechanics</option>
                </Select>
                <FormHelperText>
                  Native select wrapper with custom styling.
                </FormHelperText>
              </FormField>

              {/* Error State Input */}
              <FormField>
                <Label htmlFor="demo-est-hours">Estimated Hours</Label>
                <Input
                  id="demo-est-hours"
                  defaultValue="invalid-input"
                  error
                />
                <FormErrorMessage>
                  Please enter a valid positive number of study hours.
                </FormErrorMessage>
              </FormField>
            </div>

            {/* Textarea */}
            <FormField>
              <Label htmlFor="demo-notes">Study Notes &amp; Objectives</Label>
              <Textarea
                id="demo-notes"
                placeholder="List topics or key deliverables for this study session..."
                rows={3}
              />
              <FormHelperText>
                Optional study notes to guide session planning.
              </FormHelperText>
            </FormField>

            {/* Disabled State Input */}
            <FormField>
              <Label htmlFor="demo-disabled">Locked Course ID</Label>
              <Input
                id="demo-disabled"
                disabled
                defaultValue="UNIV-2026-FALL-LOCKED"
              />
              <FormHelperText>
                This field is read-only and cannot be edited.
              </FormHelperText>
            </FormField>
          </Card>
        </section>

        <Divider />

        {/* ── 6. Supporting UI Primitives ── */}
        <section className="space-y-6">
          <SectionHeading
            eyebrow={<Badge variant="outline">Step 6</Badge>}
            title="6. Supporting UI Primitives"
            description="General-purpose Badges, Dividers, Containers, and Section Heading groups."
          />

          <Card className="space-y-8">
            {/* Badges */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                Badges &amp; Status Chips
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">Primary Badge</Badge>
                <Badge variant="secondary">Secondary Accent</Badge>
                <Badge variant="success">Completed</Badge>
                <Badge variant="warning">Behind Schedule</Badge>
                <Badge variant="error">Critical Deadline</Badge>
                <Badge variant="outline">Outline Tag</Badge>
                <Badge variant="primary" size="sm">
                  Small Chip
                </Badge>
              </div>
            </div>

            {/* Dividers */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                Divider Orientations
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] mb-2">
                Plain horizontal divider:
              </p>
              <Divider />

              <p className="text-xs text-[var(--color-text-muted)] mt-4 mb-2">
                Horizontal divider with labeled separator:
              </p>
              <Divider label="OR CHOOSE AN OPTION" />

              <div className="mt-4 flex items-center gap-4 text-xs text-[var(--color-text)]">
                <span>Task Category</span>
                <Divider orientation="vertical" />
                <span>Priority: High</span>
                <Divider orientation="vertical" />
                <span>Estimated: 2 hrs</span>
              </div>
            </div>
          </Card>
        </section>

        {/* ── Footer ── */}
        <div className="pt-8 pb-12 border-t border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center text-xs text-[var(--color-text-muted)] gap-4">
          <p>Acadesk Design System • Phase 2 Foundation</p>
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-[var(--color-primary)] font-medium">
              ← Return to Landing Page
            </Link>
            <span>•</span>
            <Link
              href="/app/dashboard"
              className="hover:text-[var(--color-primary)] font-medium"
            >
              Dashboard Placeholder →
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
