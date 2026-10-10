import { type SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * Select — Practical native select dropdown for Acadesk.
 *
 * Uses native HTML <select> for optimal accessibility and mobile
 * ergonomics, wrapped with custom Acadesk design tokens and chevron.
 * ────────────────────────────────────────────────────────────── */

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error = false, className, disabled, children, ...rest }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          aria-invalid={error}
          className={cn(
            "w-full appearance-none rounded-[var(--radius-md)] border bg-[var(--color-surface-elevated)] pl-3.5 pr-10 py-2.5 text-sm text-[var(--color-text)]",
            "transition-colors duration-[var(--transition-fast)] cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            error
              ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)] bg-[var(--color-error-light)]/20"
              : "border-[var(--color-border-strong)] hover:border-[var(--color-primary-light)] focus-visible:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)]",
            disabled &&
              "cursor-not-allowed opacity-50 bg-[var(--color-background)] hover:border-[var(--color-border-strong)]",
            className
          )}
          {...rest}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-text-muted)]">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";
export { Select };
