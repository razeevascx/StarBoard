import "server-only";

import { sql } from "@/db";

export type Collection = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  bookmarkCount: number;
};

export type SavedBookmark = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  collectionId: string | null;
  collectionName: string | null;
  collectionColor: string | null;
};
export type ImportedBookmark = {
  sourceId: string;
  title: string;
  url: string;
  folderSourceId: string | null;
  folderName: string | null;
};

type Profile = {
  clerkUserId: string;
  email: string | null;
  displayName: string | null;
};

export async function ensureProfile(profile: Profile) {
  const results = await sql.transaction((tx) => [
    tx`SET LOCAL ROLE starboard_app`,
    tx`SELECT set_config('app.user_id', ${profile.clerkUserId}, true)`,
    tx`INSERT INTO app_users (clerk_user_id, email, display_name)
       VALUES (${profile.clerkUserId}, ${profile.email}, ${profile.displayName})
       ON CONFLICT (clerk_user_id) DO UPDATE
         SET email = EXCLUDED.email, display_name = EXCLUDED.display_name, updated_at = now()
       RETURNING id`,
  ]);
  const row = results[2]?.[0] as { id: string } | undefined;
  if (!row) throw new Error("Unable to create the user profile.");
  return row.id;
}

export async function listCollections(clerkUserId: string): Promise<Collection[]> {
  const results = await sql.transaction((tx) => [
    tx`SET LOCAL ROLE starboard_app`,
    tx`SELECT set_config('app.user_id', ${clerkUserId}, true)`,
    tx`SELECT collections.id, collections.name, collections.description, collections.color,
          count(bookmarks.id)::int AS "bookmarkCount"
       FROM collections LEFT JOIN bookmarks ON bookmarks.collection_id = collections.id
         AND bookmarks.deleted_at IS NULL
       GROUP BY collections.id ORDER BY collections.created_at DESC`,
  ]);
  return (results[2] ?? []) as Collection[];
}

export async function createCollection(clerkUserId: string, name: string, description: string | null, color: string) {
  await sql.transaction((tx) => [
    tx`SET LOCAL ROLE starboard_app`,
    tx`SELECT set_config('app.user_id', ${clerkUserId}, true)`,
    tx`INSERT INTO collections (owner_id, name, description, color)
       SELECT id, ${name}, ${description}, ${color} FROM app_users
       WHERE clerk_user_id = ${clerkUserId}`,
  ]);
}

export async function importBookmarks(clerkUserId: string, items: ImportedBookmark[]) {
  const payload = JSON.stringify(items);
  await sql.transaction((tx) => [
    tx`SET LOCAL ROLE starboard_app`,
    tx`SELECT set_config('app.user_id', ${clerkUserId}, true)`,
    tx`INSERT INTO collections (owner_id, source_id, name)
       SELECT DISTINCT users.id, incoming."folderSourceId", incoming."folderName"
       FROM app_users users
       CROSS JOIN jsonb_to_recordset(${payload}::jsonb)
         AS incoming("folderSourceId" text, "folderName" text)
       WHERE users.clerk_user_id = ${clerkUserId}
         AND incoming."folderSourceId" IS NOT NULL
       ON CONFLICT (owner_id, source_id) DO UPDATE
         SET name = EXCLUDED.name, updated_at = now()`,
    tx`INSERT INTO bookmarks (owner_id, source_id, collection_id, title, url)
       SELECT users.id, incoming."sourceId", collections.id, incoming.title, incoming.url
       FROM app_users users
       CROSS JOIN jsonb_to_recordset(${payload}::jsonb)
         AS incoming("sourceId" text, "folderSourceId" text, title text, url text)
       LEFT JOIN collections ON collections.owner_id = users.id
         AND collections.source_id = incoming."folderSourceId"
       WHERE users.clerk_user_id = ${clerkUserId}
       ON CONFLICT (owner_id, source_id) DO UPDATE
         SET title = CASE WHEN bookmarks.is_user_edited THEN bookmarks.title ELSE EXCLUDED.title END,
             url = CASE WHEN bookmarks.is_user_edited THEN bookmarks.url ELSE EXCLUDED.url END,
             collection_id = CASE WHEN bookmarks.is_user_edited THEN bookmarks.collection_id ELSE EXCLUDED.collection_id END,
             updated_at = now()`,
  ]);
}

export async function listBookmarks(clerkUserId: string): Promise<SavedBookmark[]> {
  const results = await sql.transaction((tx) => [
    tx`SET LOCAL ROLE starboard_app`,
    tx`SELECT set_config('app.user_id', ${clerkUserId}, true)`,
    tx`SELECT bookmarks.id, bookmarks.title, bookmarks.url, bookmarks.description,
         collections.id AS "collectionId", collections.name AS "collectionName",
         collections.color AS "collectionColor"
       FROM bookmarks LEFT JOIN collections ON collections.id = bookmarks.collection_id
       WHERE bookmarks.deleted_at IS NULL
       ORDER BY bookmarks.created_at DESC, bookmarks.id DESC`,
  ]);
  return (results[2] ?? []) as SavedBookmark[];
}

export async function getCollectionWithBookmarks(clerkUserId: string, collectionId: string) {
  const results = await sql.transaction((tx) => [
    tx`SET LOCAL ROLE starboard_app`,
    tx`SELECT set_config('app.user_id', ${clerkUserId}, true)`,
    tx`SELECT id, name, description FROM collections WHERE id = ${collectionId}`,
    tx`SELECT bookmarks.id, bookmarks.title, bookmarks.url, bookmarks.description,
         collections.id AS "collectionId", collections.name AS "collectionName",
         collections.color AS "collectionColor"
       FROM bookmarks JOIN collections ON collections.id = bookmarks.collection_id
       WHERE bookmarks.collection_id = ${collectionId} AND bookmarks.deleted_at IS NULL
       ORDER BY bookmarks.created_at DESC, bookmarks.id DESC`,
  ]);
  const collection = results[2]?.[0] as Pick<Collection, "id" | "name" | "description"> | undefined;
  if (!collection) return null;
  return { collection, bookmarks: (results[3] ?? []) as SavedBookmark[] };
}

export type BookmarkInput = {
  title: string;
  url: string;
  description: string | null;
  collectionId: string | null;
};

export async function createBookmark(clerkUserId: string, input: BookmarkInput) {
  const results = await sql.transaction((tx) => [
    tx`SET LOCAL ROLE starboard_app`,
    tx`SELECT set_config('app.user_id', ${clerkUserId}, true)`,
    tx`INSERT INTO bookmarks (owner_id, collection_id, title, url, description)
       SELECT users.id, collections.id, ${input.title}, ${input.url}, ${input.description}
       FROM app_users users
       LEFT JOIN collections ON collections.id = ${input.collectionId}::uuid AND collections.owner_id = users.id
       WHERE users.clerk_user_id = ${clerkUserId}
         AND (${input.collectionId}::uuid IS NULL OR collections.id IS NOT NULL)
       RETURNING id`,
  ]);
  if (!results[2]?.length) throw new Error("Collection not found.");
}

export async function updateBookmark(clerkUserId: string, id: string, input: BookmarkInput) {
  const results = await sql.transaction((tx) => [
    tx`SET LOCAL ROLE starboard_app`,
    tx`SELECT set_config('app.user_id', ${clerkUserId}, true)`,
    tx`UPDATE bookmarks SET title = ${input.title}, url = ${input.url},
         description = ${input.description}, collection_id = (
           SELECT id FROM collections WHERE id = ${input.collectionId}::uuid
         ), is_user_edited = true, updated_at = now()
       WHERE id = ${id}
         AND (${input.collectionId}::uuid IS NULL OR EXISTS (
           SELECT 1 FROM collections WHERE id = ${input.collectionId}::uuid
         ))
       RETURNING id`,
  ]);
  if (!results[2]?.length) throw new Error("Bookmark or collection not found.");
}

export async function deleteBookmark(clerkUserId: string, id: string) {
  const results = await sql.transaction((tx) => [
    tx`SET LOCAL ROLE starboard_app`,
    tx`SELECT set_config('app.user_id', ${clerkUserId}, true)`,
    tx`UPDATE bookmarks SET deleted_at = now(), updated_at = now()
       WHERE id = ${id} AND deleted_at IS NULL RETURNING id`,
  ]);
  if (!results[2]?.length) throw new Error("Bookmark not found.");
}

export async function listTrash(clerkUserId: string): Promise<Pick<SavedBookmark, "id" | "title" | "url">[]> {
  const results = await sql.transaction((tx) => [
    tx`SET LOCAL ROLE starboard_app`,
    tx`SELECT set_config('app.user_id', ${clerkUserId}, true)`,
    tx`SELECT id, title, url FROM bookmarks WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC`,
  ]);
  return (results[2] ?? []) as Pick<SavedBookmark, "id" | "title" | "url">[];
}

export async function restoreBookmark(clerkUserId: string, id: string) {
  await sql.transaction((tx) => [
    tx`SET LOCAL ROLE starboard_app`,
    tx`SELECT set_config('app.user_id', ${clerkUserId}, true)`,
    tx`UPDATE bookmarks SET deleted_at = NULL, updated_at = now() WHERE id = ${id}`,
  ]);
}

export async function getBookmarkPreviewTarget(clerkUserId: string, id: string) {
  const results = await sql.transaction((tx) => [
    tx`SET LOCAL ROLE starboard_app`,
    tx`SELECT set_config('app.user_id', ${clerkUserId}, true)`,
    tx`SELECT url FROM bookmarks WHERE id = ${id} AND deleted_at IS NULL`,
  ]);
  return results[2]?.[0] as { url: string } | undefined;
}
