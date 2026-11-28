"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Trash2 } from "lucide-react";
import {
  permanentlyDeleteBookmarkAction,
  permanentlyDeleteAllTrashedBookmarksAction,
  restoreAllTrashedBookmarksAction,
  restoreBookmarkAction,
} from "@/app/dashboard/bookmarks/actions";
import { EditorDialog } from "@/components/dashboard/EditorDialog";
import { Button } from "@/components/hangry-ui/components/button";
import { toast } from "@/components/hangry-ui/components/toast";

type TrashedBookmark = {
  id: string;
  title: string;
  url: string;
};

export function TrashActions({ bookmark }: { bookmark?: TrashedBookmark }) {
  const router = useRouter();
  const [restoring, startRestore] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const restore = () => {
    startRestore(async () => {
      try {
        const result = bookmark
          ? await restoreBookmarkAction(bookmark.id)
          : await restoreAllTrashedBookmarksAction();
        if (!result.ok) throw new Error(result.error);
        toast.success(bookmark ? "Bookmark restored" : "All bookmarks restored", { description: bookmark?.title });
        router.refresh();
      } catch {
        toast.error(bookmark ? "Could not restore bookmark" : "Could not restore all bookmarks", { description: "Please try again." });
      }
    });
  };

  const confirmDelete = () => {
    startDelete(async () => {
      try {
        const result = bookmark
          ? await permanentlyDeleteBookmarkAction(bookmark.id)
          : await permanentlyDeleteAllTrashedBookmarksAction();
        if (!result.ok) throw new Error(result.error);
        setConfirmingDelete(false);
        toast.success(bookmark ? "Bookmark deleted permanently" : "All trashed bookmarks deleted permanently", { description: bookmark?.title });
        router.refresh();
      } catch {
        toast.error(bookmark ? "Could not delete bookmark" : "Could not delete all bookmarks", { description: "Please try again." });
      }
    });
  };

  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button
          variant="outline"
          disabled={restoring || deleting}
          onClick={restore}
          className="min-h-9 border-ctp-mauve/40 bg-ctp-mauve/10 px-3 py-1.5 text-xs text-ctp-mauve hover:border-ctp-mauve/60 hover:bg-ctp-mauve/20"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          <span>{restoring ? "Restoring…" : bookmark ? "Restore" : "Restore all"}</span>
        </Button>
        <Button
          variant="outline"
          aria-label={bookmark ? `Delete ${bookmark.title} permanently` : "Delete all trashed bookmarks permanently"}
          disabled={restoring || deleting}
          onClick={() => setConfirmingDelete(true)}
          className="min-h-9 border-ctp-red/40 bg-ctp-red/10 px-3 py-1.5 text-xs text-ctp-red hover:border-ctp-red/60 hover:bg-ctp-red/20"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          <span>{bookmark ? "Delete" : "Delete all"}</span>
        </Button>
      </div>
      {confirmingDelete && (
        <EditorDialog title={bookmark ? "Delete bookmark permanently?" : "Delete all trashed bookmarks permanently?"} onClose={() => setConfirmingDelete(false)}>
          <div className="space-y-4">
            {bookmark && <div className="rounded-md border border-ctp-surface1/60 bg-ctp-base/70 p-3">
              <p className="truncate text-sm font-medium text-ctp-text">{bookmark.title}</p>
              <p className="mt-0.5 truncate text-xs text-ctp-subtext0">{bookmark.url}</p>
            </div>}
            <p className="text-sm text-ctp-subtext1">
              {bookmark ? "This permanently deletes the bookmark and cannot be undone." : "This permanently deletes every bookmark in your trash and cannot be undone."}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                autoFocus
                disabled={deleting}
                onClick={() => setConfirmingDelete(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" disabled={deleting} onClick={confirmDelete}>
                {deleting ? "Deleting…" : "Delete permanently"}
              </Button>
            </div>
          </div>
        </EditorDialog>
      )}
    </>
  );
}
