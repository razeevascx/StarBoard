import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { SectionHeading } from "@/components/SectionHeading";
import { listTrash } from "@/lib/library";
import { RestoreButton } from "@/components/dashboard/RestoreButton";

export const metadata: Metadata = { title: "Trash | Starboard" };

export default async function TrashPage() {
  const { userId } = await auth();
  if (!userId) return null;
  const bookmarks = await listTrash(userId);
  return <>
    <SectionHeading id="trash-title" title="Trash" description="Removed bookmarks can be restored here." />
    {bookmarks.length ? <ul className="mt-5 space-y-3">{bookmarks.map((bookmark) => <li key={bookmark.id} className="flex items-center justify-between gap-4 border border-ctp-surface1 bg-ctp-mantle/30 p-4">
      <div className="min-w-0"><p className="truncate font-medium">{bookmark.title}</p><p className="truncate text-xs text-ctp-subtext0">{bookmark.url}</p></div>
      <RestoreButton id={bookmark.id} />
    </li>)}</ul> : <p className="mt-5 border border-dashed border-ctp-surface1 p-10 text-center text-sm text-ctp-subtext0">No removed bookmarks.</p>}
  </>;
}
