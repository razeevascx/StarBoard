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
  const target = new URL(webUrl).origin;
  const extensionPage = extensionApi?.runtime?.id
    ? new URL(extensionApi.runtime.getURL('index.html'))
    : null;
  const origin = extensionPage ? `${extensionPage.protocol}//${extensionPage.host}` : 'your extension origin';
  for (let offset = 0; offset < bookmarks.length; offset += 500) {
    const batch = bookmarks.slice(offset, offset + 500);
    let response: Response;
    try {
      response = await fetch(`${target}/api/bookmarks/import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookmarks: batch }),
      });
    } catch {
      throw new Error(`Cannot reach ${target}. Check your connection, reload the extension, and allow ${origin} in the web app's BOOKMARK_SYNC_ALLOWED_ORIGINS setting.`);
    }
    if (response.status === 401)
      throw new Error('Sync authentication failed. Sign out and sign in again. The extension and dashboard must use the same Clerk instance.');
    if (response.status === 403)
      throw new Error(`Sync access denied. Add ${origin} to BOOKMARK_SYNC_ALLOWED_ORIGINS on ${target} and redeploy the web app. Use the public production domain if deployment protection is enabled.`);
    const result = await response.json().catch(() => null);
    if (!response.ok)
      throw new Error(typeof result?.error === 'string' ? `Bookmark upload failed (${response.status}): ${result.error}` : `Bookmark upload failed (${response.status}) at ${target}.`);
    if (result?.imported !== batch.length)
      throw new Error(`Unexpected sync response from ${target}. Use the public dashboard URL, not a protected preview or sign-in page.`);
  }
}

export type ServerBookmark = {
  id: string;
  title: string;
  url: string;
  collectionId: string | null;
  collectionName: string | null;
};

export async function downloadBookmarks(
  token: string,
  webUrl: string,
): Promise<ServerBookmark[]> {
  const target = new URL(webUrl).origin;
  const response = await fetch(`${target}/api/bookmarks/import`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 401)
    throw new Error("Sync authentication failed. Sign out and sign in again.");
  const result = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(typeof result?.error === "string" ? result.error : "Could not download bookmarks.");
  return Array.isArray(result?.bookmarks) ? result.bookmarks : [];
}

export async function mergeServerBookmarks(
  bookmarks: ServerBookmark[],
): Promise<number> {
  if (!extensionApi?.bookmarks?.getTree || !extensionApi.bookmarks.create)
    throw new Error("This browser does not support bookmark writes.");

  const tree = await extensionApi.bookmarks.getTree();
  const existingUrls = new Set<string>();
  const folders = new Map<string, string>();

  const visit = (
    nodes: chrome.bookmarks.BookmarkTreeNode[],
    parentTitle: string | null = null,
  ) => {
    for (const node of nodes) {
      if (node.url) existingUrls.add(node.url);
      if (!node.url && node.title) folders.set(node.title, node.id);
      if (node.children) visit(node.children, node.title || parentTitle);
    }
  };
  visit(tree);

  const root = tree[0];
  const bar = root?.children?.find((node) => node.id === "1" || node.id === "toolbar_____")
    ?? root?.children?.find((node) => /bar|toolbar/i.test(node.title));
  const defaultParentId = bar?.id ?? root?.children?.[0]?.id ?? root?.id;
  if (!defaultParentId) return 0;

  let added = 0;
  for (const bookmark of bookmarks) {
    if (!bookmark.url || existingUrls.has(bookmark.url)) continue;

    let parentId = defaultParentId;
    const folderName = bookmark.collectionName?.trim();
    if (folderName) {
      const existingFolderId = folders.get(folderName);
      if (existingFolderId) {
        parentId = existingFolderId;
      } else {
        const folder = await extensionApi.bookmarks.create({
          parentId: defaultParentId,
          title: folderName,
        });
        folders.set(folderName, folder.id);
        parentId = folder.id;
      }
    }

    await extensionApi.bookmarks.create({
      parentId,
      title: bookmark.title || bookmark.url,
      url: bookmark.url,
    });
    existingUrls.add(bookmark.url);
    added++;
  }
  return added;
}
