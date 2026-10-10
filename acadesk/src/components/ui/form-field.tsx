import { type HTMLAttributes, forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * FormField, FormHelperText, FormErrorMessage
 *
 * Small composable helpers to structure accessible form elements
 * with predictable vertical rhythm and error feedback.
 * ────────────────────────────────────────────────────────────── */

export type FormFieldProps = HTMLAttributes<HTMLDivElement>;

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col space-y-1.5", className)} {...rest}>
        {children}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export type FormHelperTextProps = HTMLAttributes<HTMLParagraphElement>;

const FormHelperText = forwardRef<HTMLParagraphElement, FormHelperTextProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-xs text-[var(--color-text-muted)]", className)}
        {...rest}
      >
        {children}
      </p>
    );
  }
);
FormHelperText.displayName = "FormHelperText";

export type FormErrorMessageProps = HTMLAttributes<HTMLParagraphElement>;

const FormErrorMessage = forwardRef<
  HTMLParagraphElement,
  FormErrorMessageProps
>(({ className, children, ...rest }, ref) => {
  return (
    <p
      ref={ref}
      role="alert"
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium text-[var(--color-error)]",
        className
      )}
      {...rest}
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
});
FormErrorMessage.displayName = "FormErrorMessage";

export { FormField, FormHelperText, FormErrorMessage };
