import { extensionApi } from "./browser";

export type SyncBookmark = {
  sourceId: string;
  title: string;
  url: string;
  folderSourceId: string | null;
  folderName: string | null;
};

async function readBookmarkTree(): Promise<
  chrome.bookmarks.BookmarkTreeNode[]
> {
  if (!extensionApi?.bookmarks?.getTree)
    throw new Error("This browser does not support bookmark access.");
  return extensionApi.bookmarks.getTree();
}

async function getInstallationId(): Promise<string> {
  if (!extensionApi?.storage?.local)
    throw new Error("Extension storage is unavailable.");
  const stored = await extensionApi.storage.local.get(
    "bookmarkSyncInstallationId",
  );
  if (typeof stored.bookmarkSyncInstallationId === "string")
    return stored.bookmarkSyncInstallationId;
  const id = crypto.randomUUID();
  await extensionApi.storage.local.set({ bookmarkSyncInstallationId: id });
  return id;
}

export function collectSyncBookmarks(
  tree: chrome.bookmarks.BookmarkTreeNode[],
  installationId: string,
): SyncBookmark[] {
  const bookmarks: SyncBookmark[] = [];
  const visit = (
    nodes: chrome.bookmarks.BookmarkTreeNode[],
    folder: { sourceId: string; name: string } | null,
  ) => {
    for (const node of nodes) {
      if (
        node.url &&
        node.url.length <= 4096 &&
        /^https?:\/\//i.test(node.url)
      ) {
        bookmarks.push({
          sourceId: `${installationId}:${node.id}`,
          title: (node.title || node.url).slice(0, 500),
          url: node.url,
          folderSourceId: folder?.sourceId ?? null,
          folderName: folder?.name.slice(0, 120) ?? null,
        });
      }
      if (node.children) {
        const nextFolder = node.title
          ? { sourceId: `${installationId}:${node.id}`, name: node.title }
          : folder;
        visit(node.children, nextFolder);
      }
    }
  };
  visit(tree, null);
  return bookmarks;
}

export async function readSyncBookmarks(): Promise<SyncBookmark[]> {
  const [tree, installationId] = await Promise.all([
    readBookmarkTree(),
    getInstallationId(),
  ]);
  return collectSyncBookmarks(tree, installationId);
}

export async function uploadBookmarks(
  bookmarks: SyncBookmark[],
  token: string,
  webUrl: string,
) {
  for (let offset = 0; offset < bookmarks.length; offset += 500) {
    const response = await fetch(`${webUrl}/api/bookmarks/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookmarks: bookmarks.slice(offset, offset + 500),
      }),
    });
    if (!response.ok)
      throw new Error(`Bookmark upload failed (${response.status}).`);
  }
}
