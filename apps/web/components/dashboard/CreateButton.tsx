"use client";

import { useState, useTransition, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Palette, Plus } from "lucide-react";
import { createCollectionAction } from "@/app/dashboard/collections/actions";
import { COLLECTION_COLORS } from "@/lib/collection-colors";
import type { Collection } from "@/lib/library";
import { BookmarkForm } from "./BookmarkForm";
import { EditorDialog } from "./EditorDialog";

export function CreateButton({ collections }: { collections: Collection[] }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<"bookmark" | "collection">("bookmark");
  const [color, setColor] = useState<string>(COLLECTION_COLORS[0].value);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const selectedCollectionId = pathname.match(/^\/dashboard\/collections\/([0-9a-f-]+)$/i)?.[1];

  const submitCollection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    startTransition(async () => {
      try {
        await createCollectionAction(formData);
        router.refresh();
        setOpen(false);
      } catch {
        setError("Unable to create collection. Try another name.");
      }
    });
  };

  return (
    <>
      <button type="button" aria-label="Add bookmark or collection" title="Add bookmark or collection" onClick={() => setOpen(true)} className="inline-flex size-11 items-center justify-center bg-ctp-mauve text-ctp-base shadow-lg shadow-ctp-mauve/15 transition-colors hover:bg-ctp-lavender">
        <Plus className="size-5" aria-hidden="true" />
      </button>
      {open && (
        <EditorDialog title={kind === "bookmark" ? "Add bookmark" : "Add collection"} onClose={() => setOpen(false)}>
          <div className="mb-6 flex bg-ctp-base p-1">
            {(["bookmark", "collection"] as const).map((option) => (
              <button key={option} type="button" onClick={() => { setKind(option); setError(""); }} className={`min-h-10 flex-1 text-sm font-medium capitalize ${kind === option ? "bg-ctp-surface0 text-ctp-text" : "text-ctp-subtext0 hover:text-ctp-text"}`}>
                {option}
              </button>
            ))}
          </div>
          {kind === "bookmark" ? (
            <BookmarkForm collections={collections} defaultCollectionId={selectedCollectionId} onSaved={() => setOpen(false)} />
          ) : (
            <form onSubmit={submitCollection} className="space-y-4">
              <label className="block space-y-1.5 text-sm font-medium text-ctp-subtext1">
                <span>Name</span>
                <input name="name" required maxLength={120} placeholder="e.g. Inspo" className="min-h-11 w-full border border-ctp-surface1 bg-ctp-base px-3 text-ctp-text outline-none focus:border-ctp-mauve" />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-ctp-subtext1">
                <span>Description <span className="font-normal text-ctp-overlay0">(optional)</span></span>
                <input name="description" maxLength={500} className="min-h-11 w-full border border-ctp-surface1 bg-ctp-base px-3 text-ctp-text outline-none focus:border-ctp-mauve" />
              </label>
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-ctp-subtext1">Folder color</legend>
                <div className="flex flex-wrap gap-2">
                  {COLLECTION_COLORS.map((option) => (
                    <button key={option.value} type="button" aria-label={option.name} aria-pressed={color === option.value} title={option.name} onClick={() => setColor(option.value)} className={`size-9 rounded-full border-2 transition-transform hover:scale-110 ${color === option.value ? "border-ctp-text" : "border-transparent"}`} style={{ backgroundColor: option.value }} />
                  ))}
                  <label className={`relative flex size-9 cursor-pointer items-center justify-center rounded-full border-2 text-ctp-text transition-transform hover:scale-110 ${COLLECTION_COLORS.some((option) => option.value === color) ? "border-ctp-surface1" : "border-ctp-text"}`} style={{ backgroundColor: `${color}88` }} title="Custom color">
                    <Palette className="size-4" aria-hidden="true" />
                    <input type="color" aria-label="Custom folder color" value={color} onChange={(event) => setColor(event.target.value)} className="absolute inset-0 size-full cursor-pointer opacity-0" />
                  </label>
                </div>
                <input type="hidden" name="color" value={color} />
              </fieldset>
              {error && <p role="alert" className="text-sm text-ctp-red">{error}</p>}
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={pending} className="min-h-11 bg-ctp-mauve px-5 text-sm font-semibold text-ctp-base hover:bg-ctp-lavender disabled:opacity-60">{pending ? "Creating…" : "Create collection"}</button>
              </div>
            </form>
          )}
        </EditorDialog>
      )}
    </>
  );
}
