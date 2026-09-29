"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createCollection, ensureProfile } from "@/lib/library";
import { COLLECTION_COLORS, validCollectionColor } from "@/lib/collection-colors";

export async function createCollectionAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("You must be signed in to create a collection.");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const color = String(formData.get("color") ?? COLLECTION_COLORS[0].value);
  if (!name || name.length > 120 || description.length > 500) {
    throw new Error("Enter a collection name of up to 120 characters and a description of up to 500 characters.");
  }
  if (!validCollectionColor(color)) throw new Error("Choose a valid collection color.");

  const user = await currentUser();
  await ensureProfile({
    clerkUserId: userId,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    displayName: user?.fullName ?? user?.username ?? null,
  });
  await createCollection(userId, name, description || null, color);
  revalidatePath("/dashboard/collections");
  return { ok: true };
}
