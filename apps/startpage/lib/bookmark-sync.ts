import { extensionApi } from "./browser";

const downloadedIdsKey = "bookmarkSyncDownloadedIds";

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
  downloadedIds: ReadonlySet<string> = new Set(),
): SyncBookmark[] {
  const bookmarks: SyncBookmark[] = [];
  const visit = (
    nodes: chrome.bookmarks.BookmarkTreeNode[],
    folder: { sourceId: string; name: string } | null,
  ) => {
    for (const node of nodes) {
      if (
        node.url &&
        !downloadedIds.has(node.id) &&
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
  const [tree, installationId, downloadedIds] = await Promise.all([
    readBookmarkTree(),
    getInstallationId(),
    readDownloadedIds(),
  ]);
  return collectSyncBookmarks(tree, installationId, downloadedIds);
}

async function readDownloadedIds(): Promise<Set<string>> {
  const stored = await extensionApi?.storage?.local?.get(downloadedIdsKey);
  const ids = stored?.[downloadedIdsKey];
  return new Set(Array.isArray(ids) ? ids : []);
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
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 401)
    throw new Error("Sync authentication failed. Sign out and sign in again.");
  const result = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(typeof result?.error === "string" ? result.error : "Could not download bookmarks.");
  if (!Array.isArray(result?.bookmarks) || result.bookmarks.some((bookmark: unknown) => {
    if (typeof bookmark !== "object" || bookmark === null) return true;
    const { url, title, collectionName } = bookmark as Partial<ServerBookmark>;
    return typeof url !== "string" || typeof title !== "string" ||
      (collectionName !== null && typeof collectionName !== "string");
  })) {
    throw new Error(`Unexpected sync response from ${target}. Use the public dashboard URL.`);
  }
  return result.bookmarks;
}

function normalizeSyncUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : null;
  } catch {
    return null;
  }
}

export async function mergeServerBookmarks(
  bookmarks: ServerBookmark[],
): Promise<number> {
  if (!extensionApi?.bookmarks?.getTree || !extensionApi.bookmarks.create)
    throw new Error("This browser does not support bookmark writes.");

  const tree = await extensionApi.bookmarks.getTree();
  const existingUrls = new Set<string>();
  const folders = new Map<string, string>();
  const normalizeFolderName = (name: string) => name.trim().replace(/\s+/g, " ").toLowerCase();
  const downloadedIds = await readDownloadedIds();
  const storedIds = new Set(downloadedIds);
  downloadedIds.clear();

  const visit = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
    for (const node of nodes) {
      if (node.url) {
        const url = normalizeSyncUrl(node.url);
        if (url) existingUrls.add(url);
        if (storedIds.has(node.id)) downloadedIds.add(node.id);
      } else if (node.title) {
        const name = normalizeFolderName(node.title);
        if (!folders.has(name)) folders.set(name, node.id);
      }
      if (node.children) visit(node.children);
    }
  };
  visit(tree);

  const root = tree[0];
  const bar = root?.children?.find((node) => node.id === "1" || node.id === "toolbar_____")
    ?? root?.children?.find((node) => /bar|toolbar/i.test(node.title));
  const defaultParentId = bar?.id ?? root?.children?.[0]?.id ?? root?.id;
  if (!defaultParentId) return 0;

  const storage = extensionApi.storage?.local;
  if (!storage) throw new Error("Extension storage is unavailable.");
  const saveDownloadedIds = () => storage.set({ [downloadedIdsKey]: [...downloadedIds] });
  if (storedIds.size !== downloadedIds.size) await saveDownloadedIds();

  let added = 0;
  for (const bookmark of bookmarks) {
    const url = normalizeSyncUrl(bookmark.url);
    if (!url || existingUrls.has(url)) continue;

    let parentId = defaultParentId;
    const folderName = bookmark.collectionName?.trim();
    if (folderName) {
      const normalizedName = normalizeFolderName(folderName);
      const existingFolderId = folders.get(normalizedName);
      if (existingFolderId) {
        parentId = existingFolderId;
      } else {
        const folder = await extensionApi.bookmarks.create({
          parentId: defaultParentId,
          title: folderName,
        });
        folders.set(normalizedName, folder.id);
        parentId = folder.id;
      }
    }

    const localBookmark = await extensionApi.bookmarks.create({
      parentId,
      title: bookmark.title || url,
      url,
    });
    downloadedIds.add(localBookmark.id);
    await saveDownloadedIds();
    existingUrls.add(url);
    added++;
  }
  return added;
}
