"use client";

import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { UserMenu } from "@/components/UserMenu";
import Link from "next/link";

export function AuthControls() {
  return (
    <div className="flex min-h-11 items-center gap-2 sm:gap-3">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button type="button" className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-3 text-sm font-medium text-ctp-subtext1 transition-colors hover:text-ctp-mauve">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button type="button" className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-ctp-mauve px-4 text-sm font-semibold text-ctp-base transition-colors hover:bg-ctp-lavender">
            Sign up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <Link href="/dashboard" className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ctp-subtext1 transition-colors hover:text-ctp-mauve">
          Dashboard
        </Link>
        <UserMenu />
      </Show>
    </div>
  );
}
