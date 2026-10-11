/**
 * Acadesk — Shared Type Definitions
 *
 * Central place for types that are used across multiple files.
 * Feature-specific types should live closer to the feature code;
 * only broadly shared types belong here.
 */

/**
 * Navigation route definition used by layout components
 * (header, sidebar) to render links.
 */
export interface NavRoute {
  /** Display label shown to the user. */
  label: string;
  /** Next.js route path, e.g. "/app/dashboard". */
  href: string;
  /** Optional lucide-react icon name for sidebar rendering. */
  icon?: string;
}

/**
 * A standard "children only" prop type for layout wrappers.
 */
export interface LayoutProps {
  children: React.ReactNode;
}

export * from "./task";
export * from "./subtask";
export * from "./planner";
export * from "./calendar";
export * from "./wellbeing";
export * from "./settings";
