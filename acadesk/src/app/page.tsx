import {
  Navbar,
  HeroSection,
  ProductPreview,
  FeaturesSection,
  HowItWorks,
  RecoverySection,
  FinalCTA,
  Footer,
} from "@/components/landing";

/**
 * Acadesk — Complete Public Landing Page (Phase 3)
 *
 * Full responsive landing page featuring:
 * - Responsive sticky navigation with mobile sheet menu
 * - Two-column hero with HTML/CSS layered planner illustration & floating indicators
 * - 3-card product preview section (Today's Plan, Deadlines, Weekly Progress)
 * - 4 core features grid built with reusable UI components
 * - 4-step workflow explaining the adaptive planning loop
 * - Academic Recovery section comparing overloaded vs balanced schedules
 * - Final call-to-action
 * - Clean semantic footer
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)] selection:bg-[var(--color-accent-lavender)] selection:text-[var(--color-primary-dark)]">
      {/* ── Navigation Bar ── */}
      <Navbar />

      {/* ── Main Content Landmark ── */}
      <main id="main-content" className="flex-1">
        {/* Section 2 & 3: Hero & Floating Indicators */}
        <HeroSection />

        {/* Section 4: Product Preview Cards */}
        <ProductPreview />

        {/* Section 5: Four Core Features */}
        <FeaturesSection />

        {/* Section 6: Four-Step Workflow */}
        <HowItWorks />

        {/* Section 7: Academic Recovery Mode */}
        <RecoverySection />

        {/* Section 8: Closing Call to Action */}
        <FinalCTA />
      </main>

      {/* ── Section 9: Footer ── */}
      <Footer />
    </div>
  );
}
