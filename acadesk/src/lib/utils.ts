/**
 * Utility: Conditional class-name joiner
 *
 * A lightweight alternative to `clsx` — filters falsy values
 * and joins truthy class names with spaces.
 *
 * Usage:
 *   cn("base", isActive && "active", undefined, "always")
 *   → "base active always"
 */
export function cn(...inputs: (string | boolean | number | null | undefined)[]): string {
  return inputs.filter(Boolean).join(" ");
}
