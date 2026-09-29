"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { restoreBookmarkAction } from "@/app/dashboard/bookmarks/actions";

export function RestoreButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);
  return <div className="shrink-0 text-right">
    <button type="button" disabled={pending} onClick={() => startTransition(async () => {
      try {
        const result = await restoreBookmarkAction(id);
        if (!result.ok) throw new Error(result.error);
        router.refresh();
      } catch { setError(true); }
    })} className="min-h-10 border border-ctp-surface1 px-3 text-sm text-ctp-mauve hover:bg-ctp-surface0 disabled:opacity-50">{pending ? "Restoring…" : "Restore"}</button>
    {error && <p role="alert" className="mt-1 text-xs text-ctp-red">Could not restore</p>}
  </div>;
}
