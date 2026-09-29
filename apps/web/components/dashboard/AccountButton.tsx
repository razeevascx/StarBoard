"use client";

import { useClerk } from "@clerk/nextjs";

export function AccountButton() {
  const { openUserProfile } = useClerk();

  return (
    <button
      type="button"
      onClick={() => openUserProfile()}
      className="inline-flex min-h-11 cursor-pointer items-center justify-center border border-ctp-surface1 px-5 py-3 text-sm font-medium transition-colors hover:border-ctp-mauve hover:text-ctp-mauve"
    >
      Manage account
    </button>
  );
}
