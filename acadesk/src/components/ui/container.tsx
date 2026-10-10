import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * Container — Standard responsive layout wrapper for Acadesk.
 *
 * Constrains content width to ensure comfortable line lengths
 * and consistent horizontal gutters across screen breakpoints.
 * ────────────────────────────────────────────────────────────── */

export type ContainerSize = "sm" | "md" | "lg" | "full";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-[var(--content-max-width)]",
  full: "max-w-full",
};

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "lg", className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full mx-auto px-4 sm:px-6 lg:px-8",
          sizeClasses[size],
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";
export { Container };
