/**
 * components/ui/index.ts
 *
 * Barrel export for Acadesk reusable UI primitives.
 * Import from "@/components/ui" across the application.
 */

// Button
export { Button } from "./button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./button";

// Card Family
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "./card";

// Form Primitives
export { Label } from "./label";
export type { LabelProps } from "./label";

export { Input } from "./input";
export type { InputProps } from "./input";

export { Textarea } from "./textarea";
export type { TextareaProps } from "./textarea";

export { Select } from "./select";
export type { SelectProps } from "./select";

export {
  FormField,
  FormHelperText,
  FormErrorMessage,
} from "./form-field";
export type {
  FormFieldProps,
  FormHelperTextProps,
  FormErrorMessageProps,
} from "./form-field";

// Supporting UI Primitives
export { Badge } from "./badge";
export type { BadgeProps, BadgeVariant, BadgeSize } from "./badge";

export { Divider } from "./divider";
export type { DividerProps } from "./divider";

export { Container } from "./container";
export type { ContainerProps, ContainerSize } from "./container";

export { SectionHeading } from "./section-heading";
export type { SectionHeadingProps } from "./section-heading";
