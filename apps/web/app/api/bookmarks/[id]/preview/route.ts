import { auth } from "@clerk/nextjs/server";
import { getBookmarkPreviewTarget } from "@/lib/library";
import { fetchSitePreview } from "@/lib/preview";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!uuid.test(id)) return Response.json({ error: "Invalid bookmark" }, { status: 400 });
  const bookmark = await getBookmarkPreviewTarget(userId, id);
  if (!bookmark) return Response.json({ error: "Not found" }, { status: 404 });
  const preview = await fetchSitePreview(bookmark.url);
  return Response.json(preview, { headers: { "Cache-Control": "private, max-age=300" } });
}
