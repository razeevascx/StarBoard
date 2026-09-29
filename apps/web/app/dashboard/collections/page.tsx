import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FolderClosed } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { SectionHeading } from "@/components/SectionHeading";
import { listCollections } from "@/lib/library";
import { collectionColor } from "@/lib/collection-colors";

export const metadata: Metadata = { title: "Collections | Starboard" };

export default async function CollectionsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const collections = await listCollections(userId);

  return (
    <>
      <SectionHeading id="collections-title" title="Collections" description="Keep related bookmarks together." />
      {collections.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <li key={collection.id}>
              <Link href={`/dashboard/collections/${collection.id}`} className="group flex h-full min-h-44 flex-col bg-ctp-mantle/40 p-5 transition-colors hover:bg-ctp-surface0/40" style={{ boxShadow: `inset 3px 0 ${collectionColor(collection.id, collection.color)}` }}>
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center" style={{ color: collectionColor(collection.id, collection.color), backgroundColor: `${collectionColor(collection.id, collection.color)}22` }}>
                    <FolderClosed className="size-6" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <ArrowUpRight className="size-4 text-ctp-overlay0 transition-colors group-hover:text-ctp-mauve" aria-hidden="true" />
                </div>
                <h2 className="mt-4 break-words font-semibold text-ctp-text group-hover:text-ctp-mauve">{collection.name}</h2>
                {collection.description && <p className="mt-1 line-clamp-2 text-sm text-ctp-subtext0">{collection.description}</p>}
                <p className="mt-auto pt-4 text-xs font-medium text-ctp-overlay0">{collection.bookmarkCount} {collection.bookmarkCount === 1 ? "bookmark" : "bookmarks"}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 border border-dashed border-ctp-surface1 bg-ctp-mantle/30 px-6 py-16 text-center">
          <h2 className="text-lg font-medium">No collections yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ctp-subtext0">Use the plus button to create a folder for a project, an interest, or links you want handy.</p>
        </div>
      )}
    </>
  );
}
