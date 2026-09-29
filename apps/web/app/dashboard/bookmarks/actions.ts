"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  createBookmark, deleteBookmark, ensureProfile, restoreBookmark, updateBookmark,
} from "@/lib/library";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseBookmark(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const collectionId = String(formData.get("collectionId") ?? "").trim();
  let parsed: URL;
  try { parsed = new URL(url); } catch { return { error: "Enter a valid URL." } as const; }
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password || url.length > 4096) {
    return { error: "Enter a valid web URL of up to 4096 characters." } as const;
  }
  if (!title || title.length > 500 || description.length > 2000) {
    return { error: "Enter a title of up to 500 characters and a description of up to 2000 characters." } as const;
  }
  if (collectionId && !uuid.test(collectionId)) return { error: "Choose a valid collection." } as const;
  return { title, url: parsed.href, description: description || null, collectionId: collectionId || null };
}

async function signedInUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Sign in to manage bookmarks.");
  return userId;
}

function refreshLibrary() {
  revalidatePath("/dashboard/bookmarks");
  revalidatePath("/dashboard/collections");
  revalidatePath("/dashboard/trash");
}

export async function createBookmarkAction(formData: FormData) {
  const input = parseBookmark(formData);
  if ("error" in input) return { ok: false, error: input.error };
  const userId = await signedInUser();
  const user = await currentUser();
  await ensureProfile({
    clerkUserId: userId,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    displayName: user?.fullName ?? user?.username ?? null,
  });
  await createBookmark(userId, input);
  refreshLibrary();
  return { ok: true };
}

export async function updateBookmarkAction(id: string, formData: FormData) {
  if (!uuid.test(id)) return { ok: false, error: "Invalid bookmark." };
  const input = parseBookmark(formData);
  if ("error" in input) return { ok: false, error: input.error };
  const userId = await signedInUser();
  await updateBookmark(userId, id, input);
  refreshLibrary();
  return { ok: true };
}

export async function deleteBookmarkAction(id: string) {
  if (!uuid.test(id)) return { ok: false, error: "Invalid bookmark." };
  const userId = await signedInUser();
  await deleteBookmark(userId, id);
  refreshLibrary();
  return { ok: true };
}

export async function restoreBookmarkAction(id: string) {
  if (!uuid.test(id)) return { ok: false, error: "Invalid bookmark." };
  const userId = await signedInUser();
  await restoreBookmark(userId, id);
  refreshLibrary();
  return { ok: true };
}
