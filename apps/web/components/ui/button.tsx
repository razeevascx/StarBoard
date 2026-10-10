import type { ComponentProps } from "react";
import { cn } from "cn";
import { Slot } from "radix-ui";

const variants = {
  default: "bg-ctp-mauve text-ctp-base hover:bg-ctp-lavender",
  outline:
    "border border-ctp-surface1 bg-ctp-base text-ctp-text hover:bg-ctp-surface0",
  ghost: "text-ctp-text hover:bg-ctp-surface0/50",
};
const sizes = {
  default: "h-9 px-4 py-2",
  sm: "h-8 px-3",
  icon: "size-9",
};

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asChild?: boolean;
};

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      {...(!asChild ? { type } : {})}
      data-slot="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
