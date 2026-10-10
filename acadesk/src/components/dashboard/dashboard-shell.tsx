"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashboardShellProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  headerBadge?: string;
  headerAction?: React.ReactNode;
}

export function DashboardShell({
  children,
  headerTitle,
  headerSubtitle,
  headerBadge,
  headerAction,
}: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--color-background)] text-[var(--color-text)]">
      {/* ── Left Sidebar (Permanent on desktop, drawer on mobile) ── */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* ── Right Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          title={headerTitle}
          subtitle={headerSubtitle}
          badgeText={headerBadge}
          action={headerAction}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[var(--content-max-width)] w-full mx-auto space-y-6 sm:space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
