import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * Textarea — Accessible multiline input field for Acadesk.
 *
 * Supports custom rows, error styling with aria-invalid flag,
 * and disabled states.
 * ────────────────────────────────────────────────────────────── */

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, rows = 4, className, disabled, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        aria-invalid={error}
        className={cn(
          "w-full rounded-[var(--radius-md)] border bg-[var(--color-surface-elevated)] p-3.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]",
          "transition-colors duration-[var(--transition-fast)] resize-y",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          error
            ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)] bg-[var(--color-error-light)]/20"
            : "border-[var(--color-border-strong)] hover:border-[var(--color-primary-light)] focus-visible:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)]",
          disabled &&
            "cursor-not-allowed opacity-50 bg-[var(--color-background)] hover:border-[var(--color-border-strong)]",
          className
        )}
        {...rest}
      />
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
