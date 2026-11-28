"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Globe2, Pencil, Trash2 } from "lucide-react";
import { deleteBookmarkAction } from "@/app/dashboard/bookmarks/actions";
import { Button } from "@/components/hangry-ui/components/button";
import { Card, CardContent, CardFooter } from "@/components/hangry-ui/components/card";
import { toast } from "@/components/hangry-ui/components/toast";
import { collectionColor } from "@/lib/collection-colors";
import type { Collection, SavedBookmark } from "@/lib/library";
import { BookmarkForm } from "./BookmarkForm";
import { EditorDialog } from "./EditorDialog";

export function BookmarkCard({ bookmark, collections }: { bookmark: SavedBookmark; collections: Collection[] }) {
  const router = useRouter();
  const cardRef = useRef<HTMLLIElement>(null);
  const requestedPreview = useRef(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [faviconFailed, setFaviconFailed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const host = new URL(bookmark.url).hostname;
  const favicon = faviconUrl || `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
  const largeFavicon = faviconUrl || `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`;
  const color = bookmark.collectionId ? collectionColor(bookmark.collectionId, bookmark.collectionColor) : null;

  useEffect(() => {
    if (requestedPreview.current || !cardRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting || requestedPreview.current) return;
      requestedPreview.current = true;
      observer.disconnect();
      void fetch(`/api/bookmarks/${bookmark.id}/preview`, { credentials: "same-origin" })
        .then((response) => response.ok ? response.json() as Promise<{ ogImageUrl: string | null; faviconUrl: string | null }> : null)
        .then((preview) => {
          if (!preview) return;
          setImageUrl(preview.ogImageUrl);
          setFaviconUrl(preview.faviconUrl);
          setFaviconFailed(false);
        }).catch(() => {});
    }, { rootMargin: "250px" });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [bookmark.id]);

  const confirmRemove = () => {
    setError("");
    startTransition(async () => {
      try {
        const result = await deleteBookmarkAction(bookmark.id);
        if (!result.ok) throw new Error(result.error);
        setConfirmingDelete(false);
        toast.success("Moved to Trash", { description: bookmark.title });
        router.refresh();
      } catch {
        setError("Could not delete this bookmark.");
        toast.error("Could not delete bookmark", { description: "Please try again." });
      }
    });
  };

  return (
    <li ref={cardRef} className="group">
      <Card className="h-full max-w-none gap-0 overflow-hidden p-0 transition-colors hover:[--surface-stroke-top:color-mix(in_srgb,var(--accent)_65%,var(--border))]">
        <div className="relative aspect-[16/9] overflow-hidden bg-ctp-surface0/50">
          {imageUrl && !imageFailed ? (
            <Image src={imageUrl} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" unoptimized className="object-cover" onError={() => setImageFailed(true)} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-ctp-surface0 to-ctp-mantle text-ctp-subtext0">
              {!faviconFailed ? <Image src={largeFavicon} alt="" width={64} height={64} unoptimized className="size-16 object-contain" onError={() => setFaviconFailed(true)} /> : <Globe2 className="size-12 text-ctp-overlay0" aria-hidden="true" />}
              <span className="max-w-[85%] truncate text-xs font-medium">{host}</span>
            </div>
          )}
        </div>
        <CardContent className="flex flex-1 flex-col p-4">
          <div className="mb-3 flex min-w-0 items-center gap-2 text-xs text-ctp-subtext0">
            {!faviconFailed ? (
              <Image src={favicon} alt="" width={20} height={20} unoptimized className="size-5 object-contain" onError={() => setFaviconFailed(true)} />
            ) : <Globe2 className="size-5" aria-hidden="true" />}
            <span className="truncate">{host}</span>
          </div>
          <h2 className="text-base font-semibold leading-snug"><a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-start gap-1.5 text-ctp-text hover:text-ctp-mauve">
            <span className="line-clamp-2 break-words">{bookmark.title}</span>
            <ExternalLink className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
          </a></h2>
          {bookmark.description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ctp-subtext0">{bookmark.description}</p>}
          {error && <p role="alert" className="mt-2 text-xs text-ctp-red">{error}</p>}
        </CardContent>
        <CardFooter className="mt-auto justify-between gap-2 border-border/60 px-4 py-3">
          {bookmark.collectionId && bookmark.collectionName && color ? (
            <Link href={`/dashboard/collections/${bookmark.collectionId}`} className="max-w-[70%] truncate rounded-md border px-2.5 py-1 text-xs font-medium hover:opacity-80" style={{ color, backgroundColor: `${color}1f`, borderColor: `${color}55` }}>
              {bookmark.collectionName}
            </Link>
          ) : <span className="text-xs text-ctp-overlay0">Unfiled</span>}
          <div className="flex items-center gap-1">
            <button type="button" aria-label={`Edit ${bookmark.title}`} title="Edit bookmark" onClick={() => setEditing(true)} className="rounded p-2 text-ctp-subtext0 hover:bg-ctp-surface0 hover:text-ctp-text">
              <Pencil className="size-4" aria-hidden="true" />
            </button>
            <button type="button" aria-label={`Delete ${bookmark.title}`} title="Move to Trash" disabled={pending} onClick={() => setConfirmingDelete(true)} className="rounded p-2 text-ctp-subtext0 hover:bg-ctp-red/10 hover:text-ctp-red disabled:opacity-50">
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        </CardFooter>
      </Card>
      {editing && (
        <EditorDialog title="Edit bookmark" onClose={() => setEditing(false)}>
          <BookmarkForm bookmark={bookmark} collections={collections} onSaved={() => setEditing(false)} />
        </EditorDialog>
      )}
      {confirmingDelete && (
        <EditorDialog title="Move bookmark to Trash?" onClose={() => setConfirmingDelete(false)}>
          <div className="space-y-4">
            <div className="rounded-md border border-ctp-surface1/60 bg-ctp-base/70 p-3">
              <p className="truncate text-sm font-medium text-ctp-text">{bookmark.title}</p>
              <p className="mt-0.5 truncate text-xs text-ctp-subtext0">{bookmark.url}</p>
            </div>
            <p className="text-sm text-ctp-subtext1">
              You can restore this bookmark later from Trash.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" autoFocus disabled={pending} onClick={() => setConfirmingDelete(false)}>
                Cancel
              </Button>
              <Button variant="destructive" disabled={pending} onClick={confirmRemove}>
                {pending ? "Moving…" : "Move to Trash"}
              </Button>
            </div>
          </div>
        </EditorDialog>
      )}
    </li>
  );
}
