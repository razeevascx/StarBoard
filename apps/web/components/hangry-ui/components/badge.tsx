import type { ComponentProps } from "react";

interface BadgeProps extends ComponentProps<"span"> {
  variant?:
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "blue"
    | "purple"
    | "pink"
    | "teal"
    | "orange";
}

export function Badge({
  children = "New release",
  variant = "success",
  className = "",
  ...props
}: BadgeProps = {}) {
  const styles = {
    neutral: "border-ctp-surface1 bg-ctp-surface0/70 text-ctp-subtext1",
    info: "border-ctp-blue/40 bg-ctp-blue/10 text-ctp-blue",
    success: "border-ctp-green/40 bg-ctp-green/10 text-ctp-green",
    warning: "border-ctp-yellow/40 bg-ctp-yellow/10 text-ctp-yellow",
    error: "border-ctp-red/40 bg-ctp-red/10 text-ctp-red",
    blue: "border-ctp-blue/40 bg-ctp-blue/10 text-ctp-blue",
    purple: "border-ctp-mauve/40 bg-ctp-mauve/10 text-ctp-mauve",
    pink: "border-ctp-pink/40 bg-ctp-pink/10 text-ctp-pink",
    teal: "border-ctp-teal/40 bg-ctp-teal/10 text-ctp-teal",
    orange: "border-ctp-peach/40 bg-ctp-peach/10 text-ctp-peach",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${styles[variant] ?? styles.success} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
