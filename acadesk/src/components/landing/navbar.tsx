"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Menu, X } from "lucide-react";

/* ──────────────────────────────────────────────────────────────
 * Navbar — Responsive public navigation for Acadesk.
 *
 * Desktop: transparent/blurred bar with links + CTAs.
 * Mobile:  hamburger button that opens a full-width slide-down menu.
 *
 * Uses "client" because the mobile menu needs useState.
 * ────────────────────────────────────────────────────────────── */

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Why Acadesk", href: "#why-acadesk" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] backdrop-blur-md"
      style={{ backgroundColor: "rgba(255, 240, 246, 0.85)" }}
    >
      <div className="mx-auto flex h-16 max-w-[var(--content-max-width)] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Brand ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]"
          aria-label="Acadesk — Home"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)]"
            style={{ backgroundColor: "var(--color-primary)" }}
            aria-hidden="true"
          >
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--color-text)" }}
          >
            Acadesk
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors duration-[var(--transition-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-xs)] px-1"
              style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-muted)")
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/app/dashboard"
            className="text-sm font-medium px-4 py-2 rounded-[var(--radius-full)] transition-colors duration-[var(--transition-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-text)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text-muted)")
            }
          >
            Dashboard
          </Link>
          <Link
            href="/app/dashboard"
            className="inline-flex items-center justify-center font-semibold select-none rounded-[var(--radius-full)] px-3.5 py-1.5 text-xs text-white transition-all duration-[var(--transition-fast)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            style={{ backgroundColor: "var(--color-primary)", boxShadow: "var(--shadow-md)" }}
          >
            Get Started
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-[var(--radius-md)] p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          style={{ color: "var(--color-text)" }}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-[var(--color-border)] px-4 py-4 space-y-1"
          style={{ backgroundColor: "rgba(255, 249, 252, 0.97)" }}
        >
          <nav aria-label="Mobile navigation" className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                style={{ color: "var(--color-text-muted)" }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-[var(--color-border)] flex flex-col gap-2">
            <Link
              href="/app/dashboard"
              className="block text-center rounded-[var(--radius-full)] border border-[var(--color-border-strong)] px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              style={{ color: "var(--color-primary-dark)" }}
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/app/dashboard"
              className="block text-center rounded-[var(--radius-full)] px-4 py-2.5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              style={{ backgroundColor: "var(--color-primary)" }}
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
