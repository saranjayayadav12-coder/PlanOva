import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * Badge — Status indicator & category chip for Acadesk.
 *
 * Variants:
 *   "primary"   — Lavender background with deep purple text.
 *   "secondary" — Soft pink background with dark plum text.
 *   "success"   — Subtle emerald background with dark green text.
 *   "warning"   — Subtle amber background with dark amber text.
 *   "error"     — Subtle red background with deep crimson text.
 *   "outline"   — Transparent background with border.
 * ────────────────────────────────────────────────────────────── */

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "outline";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary:
    "bg-[var(--color-accent-lavender)] text-[var(--color-primary-dark)] border border-transparent",
  secondary:
    "bg-[var(--color-accent-pink)]/40 text-[var(--color-text)] border border-transparent",
  success:
    "bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)]/20",
  warning:
    "bg-[var(--color-warning-light)] text-[#a36800] border border-[var(--color-warning)]/20",
  error:
    "bg-[var(--color-error-light)] text-[var(--color-error)] border border-[var(--color-error)]/20",
  outline:
    "bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border-strong)]",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs font-medium",
  md: "px-3 py-1 text-xs font-semibold",
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "primary", size = "md", className, children, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-full)] select-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...rest}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
export { Badge };
