import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { SectionHeading } from "@/components/SectionHeading";
import { listTrash } from "@/lib/library";
import { BracketCard } from "@/components/hangry-ui/components/bracket-card";
import { Card } from "@/components/hangry-ui/components/card";
import { TrashActions } from "@/components/dashboard/TrashActions";

export const metadata: Metadata = { title: "Trash | Starboard" };

export default async function TrashPage() {
  const { userId } = await auth();
  if (!userId) return null;
  const bookmarks = await listTrash(userId);
  return <>
    <SectionHeading id="trash-title" title="Trash" description="Restore removed bookmarks or delete them permanently." />
    {bookmarks.length ? <ul className="mt-5 space-y-3">{bookmarks.map((bookmark) => <li key={bookmark.id}>
      <Card size="sm" className="max-w-none flex-row items-center justify-between gap-4">
        <div className="min-w-0"><p className="truncate font-medium">{bookmark.title}</p><p className="truncate text-xs text-ctp-subtext0">{bookmark.url}</p></div>
        <TrashActions bookmark={bookmark} />
      </Card>
    </li>)}</ul> : <BracketCard variant="brackets" className="mt-5"><p className="py-6 text-center text-sm text-muted-foreground">No removed bookmarks.</p></BracketCard>}
  </>;
}
