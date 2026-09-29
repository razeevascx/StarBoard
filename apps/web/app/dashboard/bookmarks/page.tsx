import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { SectionHeading } from "@/components/SectionHeading";
import { BookmarkCard } from "@/components/dashboard/BookmarkCard";
import { listBookmarks, listCollections } from "@/lib/library";

export const metadata: Metadata = { title: "Bookmarks | Starboard" };

export default async function BookmarksPage() {
  const { userId } = await auth();
  if (!userId) return null;
  const [bookmarks, collections] = await Promise.all([listBookmarks(userId), listCollections(userId)]);

  return (
    <>
      <SectionHeading id="bookmarks-title" title="Bookmarks" description="Your saved links, all in one place." />
      {bookmarks.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {bookmarks.map((bookmark) => <BookmarkCard key={bookmark.id} bookmark={bookmark} collections={collections} />)}
        </ul>
      ) : (
        <div className="mt-5 border border-dashed border-ctp-surface1 bg-ctp-mantle/30 px-6 py-16 text-center">
          <h2 className="text-lg font-medium">No bookmarks yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ctp-subtext0">Use the plus button to add a bookmark, or sign in to the extension to import your links.</p>
        </div>
      )}
    </>
  );
}
