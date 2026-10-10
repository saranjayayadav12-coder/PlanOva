import { type HTMLAttributes, forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * Divider — Visual separator line for Acadesk.
 *
 * Supports horizontal (default) and vertical orientations,
 * as well as an optional central text label (e.g. "or").
 * ────────────────────────────────────────────────────────────── */

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: ReactNode;
}

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", label, className, ...rest }, ref) => {
    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn(
            "inline-block w-px self-stretch bg-[var(--color-border)] min-h-[1.25rem]",
            className
          )}
          {...rest}
        />
      );
    }

    if (label) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          className={cn("relative my-4 flex items-center justify-center", className)}
          {...rest}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <span className="relative bg-[var(--color-surface)] px-3 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            {label}
          </span>
        </div>
      );
    }

    return (
      <hr
        ref={ref as unknown as React.Ref<HTMLHRElement>}
        className={cn(
          "my-4 border-0 border-t border-[var(--color-border)] w-full",
          className
        )}
        {...rest}
      />
    );
  }
);

Divider.displayName = "Divider";
export { Divider };
