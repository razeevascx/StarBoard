"use client";

import { Show } from "@clerk/nextjs";
import { UserMenu } from "@/components/UserMenu";
import Link from "next/link";

export function AuthControls({ onNavigate }: { onNavigate?: () => void } = {}) {
  return (
    <div className="flex min-h-9 items-center gap-2">
      <Show when="signed-out">
        <Link
          href="/sign-in"
          onClick={onNavigate}
          className="inline-flex min-h-9 items-center justify-center rounded-md bg-ctp-mauve px-3 text-sm font-semibold text-ctp-base transition-colors hover:bg-ctp-lavender"
        >
          Get started
        </Link>
      </Show>
      <Show when="signed-in">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="inline-flex min-h-9 items-center rounded-md px-3 text-sm font-medium text-ctp-subtext1 transition-colors hover:text-ctp-mauve"
        >
          Dashboard
        </Link>
        <UserMenu />
      </Show>
    </div>
  );
}
