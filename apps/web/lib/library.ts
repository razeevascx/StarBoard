import "server-only";

import { sql } from "@/db";

export type Collection = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  bookmarkCount: number;
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

export async function createCollection(clerkUserId: string, name: string, description: string | null) {
  await sql.transaction((tx) => [
    tx`SET LOCAL ROLE starboard_app`,
    tx`SELECT set_config('app.user_id', ${clerkUserId}, true)`,
    tx`INSERT INTO collections (owner_id, name, description)
       SELECT id, ${name}, ${description} FROM app_users
       WHERE clerk_user_id = ${clerkUserId}`,
  ]);
}
