import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * Card — Composable surface container for Acadesk.
 *
 * Provides the rounded, softly-shadowed, light-surface card style
 * inspired by the Acadesk design reference.
 *
 * Subcomponents:
 *   - Card: Root container (supports hoverable)
 *   - CardHeader: Container for title, description, or action
 *   - CardTitle: Heading element (h3 by default)
 *   - CardDescription: Subdued supporting copy
 *   - CardContent: Primary content area
 *   - CardFooter: Bottom container for actions or metadata
 * ────────────────────────────────────────────────────────────── */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** When true, adds a subtle hover shadow lift effect. */
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[var(--radius-xl)]",
          "border border-[var(--color-border)]",
          "bg-[var(--color-surface)]",
          "shadow-[var(--shadow-sm)]",
          "p-6",
          hoverable &&
            "transition-all duration-[var(--transition-base)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 pb-4", className)}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = "h3", className, children, ...rest }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "text-lg font-semibold tracking-tight text-[var(--color-text)]",
          className
        )}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);
CardTitle.displayName = "CardTitle";

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-[var(--color-text-muted)] leading-relaxed", className)}
        {...rest}
      >
        {children}
      </p>
    );
  }
);
CardDescription.displayName = "CardDescription";

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("text-sm", className)} {...rest}>
        {children}
      </div>
    );
  }
);
CardContent.displayName = "CardContent";

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center pt-4 border-t border-[var(--color-border)] mt-4", className)}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
