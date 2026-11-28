import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { SectionHeading } from "@/components/SectionHeading";
import { FolderCard } from "@/components/dashboard/FolderCard";
import { BracketCard } from "@/components/hangry-ui/components/bracket-card";
import { listCollections } from "@/lib/library";
import { collectionColor } from "@/lib/collection-colors";

export const metadata: Metadata = { title: "Collections | StartBoard" };

export default async function CollectionsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const collections = await listCollections(userId);

  return (
    <>
      <SectionHeading as="h1" id="collections-title" title="Collections" description="Organize your bookmarks into folders." />
      {collections.length ? (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <li key={collection.id}>
              <FolderCard
                href={`/dashboard/collections/${collection.id}`}
                name={collection.name}
                description={collection.description}
                bookmarkCount={collection.bookmarkCount}
                color={collectionColor(collection.id, collection.color)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <BracketCard variant="brackets" className="mt-5">
          <div className="py-8 text-center">
            <h2 className="text-base font-semibold leading-snug text-ctp-text">No collections yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Use the plus button to create a folder for a project, an interest, or links you want handy.</p>
          </div>
        </BracketCard>
      )}
    </>
  );
}
