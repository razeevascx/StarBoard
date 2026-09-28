import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { SectionHeading } from "@/components/SectionHeading";
import { ensureProfile, listCollections } from "@/lib/library";
import { createCollectionAction } from "./actions";

export const metadata: Metadata = { title: "Collections | Starboard" };

export default async function CollectionsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  await ensureProfile({
    clerkUserId: userId,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    displayName: user?.fullName ?? user?.username ?? null,
  });
  const collections = await listCollections(userId);

  return (
    <>
      <SectionHeading id="collections-title" eyebrow="Your library" title="Collections" description="Keep related bookmarks together." />
      <form action={createCollectionAction} className="mt-8 grid gap-3 rounded-2xl border border-ctp-surface1 bg-ctp-mantle/30 p-5 sm:grid-cols-[1fr_1fr_auto]">
        <label className="sr-only" htmlFor="collection-name">Collection name</label>
        <input id="collection-name" name="name" required maxLength={120} placeholder="Collection name" className="min-h-11 rounded-lg border border-ctp-surface1 bg-ctp-base px-3 text-sm outline-none placeholder:text-ctp-overlay0 focus:border-ctp-mauve" />
        <label className="sr-only" htmlFor="collection-description">Description</label>
        <input id="collection-description" name="description" maxLength={500} placeholder="Description (optional)" className="min-h-11 rounded-lg border border-ctp-surface1 bg-ctp-base px-3 text-sm outline-none placeholder:text-ctp-overlay0 focus:border-ctp-mauve" />
        <button type="submit" className="min-h-11 rounded-lg bg-ctp-mauve px-4 text-sm font-semibold text-ctp-base transition-colors hover:bg-ctp-lavender">Create collection</button>
      </form>
      {collections.length ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <li key={collection.id} className="rounded-2xl border border-ctp-surface1 bg-ctp-mantle/30 p-5">
              <h2 className="font-medium text-ctp-text">{collection.name}</h2>
              {collection.description ? <p className="mt-1 text-sm text-ctp-subtext0">{collection.description}</p> : null}
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-ctp-overlay0">{collection.bookmarkCount} {collection.bookmarkCount === 1 ? "bookmark" : "bookmarks"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-ctp-surface1 bg-ctp-mantle/30 px-6 py-16 text-center">
          <h2 className="text-lg font-medium">No collections yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ctp-subtext0">Create one for a project, an interest, or the links you want handy every day.</p>
        </div>
      )}
    </>
  );
}
