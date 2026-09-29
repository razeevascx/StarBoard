"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBookmarkAction, updateBookmarkAction } from "@/app/dashboard/bookmarks/actions";
import type { Collection, SavedBookmark } from "@/lib/library";

const inputClass = "min-h-11 w-full border border-ctp-surface1 bg-ctp-base px-3 text-sm text-ctp-text outline-none placeholder:text-ctp-overlay0 focus:border-ctp-mauve";

export function BookmarkForm({ collections, bookmark, defaultCollectionId, onSaved }: {
  collections: Collection[];
  bookmark?: SavedBookmark;
  defaultCollectionId?: string;
  onSaved: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    startTransition(async () => {
      try {
        const result = bookmark
          ? await updateBookmarkAction(bookmark.id, formData)
          : await createBookmarkAction(formData);
        if (!result.ok) {
          setError(result.error ?? "Unable to save bookmark.");
          return;
        }
        router.refresh();
        onSaved();
      } catch {
        setError("Unable to save bookmark. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1.5 text-sm font-medium text-ctp-subtext1">
        <span>URL</span>
        <input className={inputClass} name="url" type="url" required maxLength={4096} placeholder="https://example.com" defaultValue={bookmark?.url} />
      </label>
      <label className="block space-y-1.5 text-sm font-medium text-ctp-subtext1">
        <span>Title</span>
        <input className={inputClass} name="title" required maxLength={500} placeholder="A name you will recognize" defaultValue={bookmark?.title} />
      </label>
      <label className="block space-y-1.5 text-sm font-medium text-ctp-subtext1">
        <span>Description <span className="font-normal text-ctp-overlay0">(optional)</span></span>
        <textarea className={`${inputClass} min-h-24 py-3`} name="description" maxLength={2000} placeholder="Why did you save this?" defaultValue={bookmark?.description ?? ""} />
      </label>
      <label className="block space-y-1.5 text-sm font-medium text-ctp-subtext1">
        <span>Collection</span>
        <select className={inputClass} name="collectionId" defaultValue={bookmark?.collectionId ?? defaultCollectionId ?? ""}>
          <option value="">No collection</option>
          {collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}
        </select>
      </label>
      {error && <p role="alert" className="text-sm text-ctp-red">{error}</p>}
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={pending} className="min-h-11 bg-ctp-mauve px-5 text-sm font-semibold text-ctp-base hover:bg-ctp-lavender disabled:opacity-60">
          {pending ? "Saving…" : bookmark ? "Save changes" : "Add bookmark"}
        </button>
      </div>
    </form>
  );
}
