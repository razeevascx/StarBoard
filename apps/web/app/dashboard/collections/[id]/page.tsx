import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SectionHeading } from "@/components/SectionHeading";
import { BookmarkCard } from "@/components/dashboard/BookmarkCard";
import { BracketCard } from "@/components/hangry-ui/components/bracket-card";
import { getCollectionWithBookmarks, listCollections } from "@/lib/library";

export const metadata: Metadata = { title: "Collection | Starboard" };

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return null;
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
  const [data, collections] = await Promise.all([getCollectionWithBookmarks(userId, id), listCollections(userId)]);
  if (!data) notFound();

  return (
    <>
      <SectionHeading id="collection-title" title={data.collection.name} description={data.collection.description || "Bookmarks in this folder."} />
      {data.bookmarks.length ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.bookmarks.map((bookmark) => <BookmarkCard key={bookmark.id} bookmark={bookmark} collections={collections} />)}
        </ul>
      ) : (
        <BracketCard variant="brackets" className="mt-5">
          <p className="py-8 text-center text-sm text-muted-foreground">
            No bookmarks in this collection yet.
          </p>
        </BracketCard>
      )}
    </>
  );
}
