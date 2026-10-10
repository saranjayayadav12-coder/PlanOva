import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * Button — The foundational interactive element for Acadesk.
 *
 * Variants:
 *   "primary"     — Filled purple background (main CTA).
 *   "secondary"   — Elevated surface with purple border & accent text.
 *   "outline"     — Transparent surface with distinct border.
 *   "ghost"       — Transparent background with soft surface hover.
 *   "destructive" — Error accent for critical/destructive actions.
 *
 * Sizes:
 *   "sm"  — Compact controls & inline actions.
 *   "md"  — Default controls.
 *   "lg"  — Hero & prominent primary actions.
 *
 * All variants inherit focus-visible, reduced-motion, and
 * color tokens from globals.css.
 * ────────────────────────────────────────────────────────────── */

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] active:bg-[var(--color-primary-dark)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]",
  secondary:
    "bg-[var(--color-surface-elevated)] text-[var(--color-primary-dark)] border border-[var(--color-border-strong)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface)]",
  outline:
    "bg-transparent text-[var(--color-text)] border border-[var(--color-border-strong)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-surface)]",
  ghost:
    "bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] active:bg-[var(--color-accent-lavender)]/30",
  destructive:
    "bg-[var(--color-error)] text-white hover:opacity-90 active:opacity-100 shadow-[var(--shadow-sm)] focus-visible:ring-[var(--color-error)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      type = "button",
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(
          "inline-flex items-center justify-center font-semibold select-none",
          "rounded-[var(--radius-full)]",
          "transition-all duration-[var(--transition-fast)]",
          "focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...rest}
      >
        {isLoading ? (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            role="status"
            aria-label="Loading"
          />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
