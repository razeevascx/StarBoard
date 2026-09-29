import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SectionHeading } from "@/components/SectionHeading";
import { BookmarkCard } from "@/components/dashboard/BookmarkCard";
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
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.bookmarks.map((bookmark) => <BookmarkCard key={bookmark.id} bookmark={bookmark} collections={collections} />)}
        </ul>
      ) : (
        <div className="mt-5 border border-dashed border-ctp-surface1 bg-ctp-mantle/30 px-6 py-16 text-center text-sm text-ctp-subtext0">
          No bookmarks in this collection yet.
        </div>
      )}
    </>
  );
}
