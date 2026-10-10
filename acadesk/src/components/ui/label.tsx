import { type LabelHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * Label — Accessible form label for Acadesk.
 *
 * Supports an optional `required` indicator to clearly signal
 * mandatory fields without relying solely on color.
 * ────────────────────────────────────────────────────────────── */

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, className, children, ...rest }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-sm font-medium text-[var(--color-text)] select-none",
          className
        )}
        {...rest}
      >
        {children}
        {required && (
          <span
            className="ml-1 text-[var(--color-error)] font-bold"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";
export { Label };
