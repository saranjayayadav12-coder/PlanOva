import { type HTMLAttributes, forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * SectionHeading — Standard heading group for Acadesk sections.
 *
 * Supports an optional eyebrow badge/label, responsive title,
 * supporting description, and left or center alignment.
 * ────────────────────────────────────────────────────────────── */

export interface SectionHeadingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}

const SectionHeading = forwardRef<HTMLDivElement, SectionHeadingProps>(
  (
    {
      eyebrow,
      title,
      description,
      align = "left",
      as: HeadingTag = "h2",
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-2",
          align === "center" ? "items-center text-center" : "items-start text-left",
          className
        )}
        {...rest}
      >
        {eyebrow && (
          <div className="mb-1 inline-flex items-center">{eyebrow}</div>
        )}
        <HeadingTag className="text-section-title font-bold text-[var(--color-text)]">
          {title}
        </HeadingTag>
        {description && (
          <p className="max-w-2xl text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
            {description}
          </p>
        )}
      </div>
    );
  }
);

SectionHeading.displayName = "SectionHeading";
export { SectionHeading };
