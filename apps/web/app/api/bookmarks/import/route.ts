import { auth, currentUser } from "@clerk/nextjs/server";
import { ensureProfile, importBookmarks, type ImportedBookmark } from "@/lib/library";

const developmentOrigin = "chrome-extension://nffmgglgjaeedmehgkcphjhpmdnepjbm";

function corsHeaders(request: Request) {
  const configured = process.env.BOOKMARK_SYNC_ALLOWED_ORIGINS ??
    (process.env.NODE_ENV === "development" ? developmentOrigin : "");
  const allowedOrigins = configured.split(",").map((origin) => origin.trim()).filter(Boolean);
  const origin = request.headers.get("origin");

  if (!origin || !allowedOrigins.includes(origin)) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin",
  };
}

export function OPTIONS(request: Request) {
  const headers = corsHeaders(request);
  if (!headers) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(request);
  if (origin && !headers) return Response.json({ error: "Origin not allowed." }, { status: 403 });

  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Sign in required." }, { status: 401, headers: headers ?? {} });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400, headers: headers ?? {} });
  }

  const items = (body as { bookmarks?: unknown } | null)?.bookmarks;
  if (!Array.isArray(items) || items.length > 500 || items.some((item) => {
    if (!item || typeof item !== "object") return true;
    const folderSourceId = item.folderSourceId ?? null;
    const folderName = item.folderName ?? null;
    const validFolder = (folderSourceId === null && folderName === null) ||
      (typeof folderSourceId === "string" && folderSourceId.length > 0 && folderSourceId.length <= 200 &&
        typeof folderName === "string" && folderName.length > 0 && folderName.length <= 120);
    return !validFolder ||
      typeof item.sourceId !== "string" || !item.sourceId || item.sourceId.length > 200 ||
      typeof item.title !== "string" || item.title.length > 500 ||
      typeof item.url !== "string" || item.url.length > 4096 ||
      !/^https?:\/\//i.test(item.url);
  })) {
    return Response.json({ error: "Invalid bookmark batch." }, { status: 400, headers: headers ?? {} });
  }

  const user = await currentUser();
  await ensureProfile({
    clerkUserId: userId,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    displayName: user?.fullName ?? user?.username ?? null,
  });
  await importBookmarks(userId, (items as ImportedBookmark[]).map((item) => ({
    ...item,
    folderSourceId: item.folderSourceId ?? null,
    folderName: item.folderName ?? null,
  })));
  return Response.json({ imported: items.length }, { headers: headers ?? {} });
}
