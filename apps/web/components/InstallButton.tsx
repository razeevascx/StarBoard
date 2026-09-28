import type { ReactNode } from "react";
import { installUrl } from "@/lib/site";
import { ExternalLink } from "lucide-react";

type InstallButtonProps = {
  children?: ReactNode;
  variant?: "primary" | "secondary";
};

export function InstallButton({ children = "Get started", variant = "primary" }: InstallButtonProps) {
  const className = variant === "primary"
    ? "bg-ctp-mauve text-ctp-base hover:bg-ctp-lavender"
    : "border border-ctp-surface1 text-ctp-subtext1 hover:border-ctp-mauve hover:text-ctp-mauve";

  return (
    <a
      className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-3 rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${className}`}
      href={installUrl}
      target="_blank"
      rel="noreferrer noopener"
    >
      {children}<ExternalLink aria-hidden="true" className="size-4" />
    </a>
  );
}
