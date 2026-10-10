import { type InputHTMLAttributes, forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * Input — Accessible text input field for Acadesk.
 *
 * Supports left and right icon slots, error styling with
 * accessible aria-invalid flags, and disabled states.
 * ────────────────────────────────────────────────────────────── */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, leftIcon, rightIcon, className, type = "text", disabled, ...rest }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3.5 flex items-center text-[var(--color-text-muted)]">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          aria-invalid={error}
          className={cn(
            "w-full rounded-[var(--radius-md)] border bg-[var(--color-surface-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]",
            "transition-colors duration-[var(--transition-fast)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            error
              ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)] bg-[var(--color-error-light)]/20"
              : "border-[var(--color-border-strong)] hover:border-[var(--color-primary-light)] focus-visible:border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)]",
            disabled &&
              "cursor-not-allowed opacity-50 bg-[var(--color-background)] hover:border-[var(--color-border-strong)]",
            leftIcon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
            className
          )}
          {...rest}
        />
        {rightIcon && (
          <div className="pointer-events-none absolute right-3.5 flex items-center text-[var(--color-text-muted)]">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
