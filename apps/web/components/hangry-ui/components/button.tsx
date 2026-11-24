import type { ComponentProps } from "react";
import { cn } from "cn";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
}

export function Button({
  children = "Get started",
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps = {}) {
  const styles = {
    primary: "bg-ctp-mauve text-ctp-base hover:bg-ctp-lavender",
    secondary: "bg-ctp-surface0 text-ctp-text hover:bg-ctp-surface1",
    ghost: "bg-transparent text-ctp-text hover:bg-ctp-surface0/50",
    destructive: "bg-ctp-red text-ctp-base hover:bg-ctp-red/90",
    outline: "border border-ctp-surface1 text-ctp-text hover:bg-ctp-surface0",
  };
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ctp-mauve disabled:pointer-events-none disabled:opacity-50",
        styles[variant] ?? styles.primary,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
