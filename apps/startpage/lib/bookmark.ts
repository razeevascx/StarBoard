import { extensionApi, supportsBookmarkAccess } from "./browser";

const ACTIVE_FOLDER_KEY = "startpage-active-bookmark-folder";

export interface FolderItem {
  id: string;
  title: string;
  count?: number;
}

export interface BookmarkLink {
  id: string;
  name: string;
  url: string;
}

function countBookmarkLinks(node?: chrome.bookmarks.BookmarkTreeNode): number {
  if (!node) {
    return 0;
  }

  if (node.url) {
    return 1;
  }

  return (
    node.children?.reduce(
      (total, child) => total + countBookmarkLinks(child),
      0,
    ) ?? 0
  );
}

export function supportsBookmarks() {
  return supportsBookmarkAccess();
}

export function getBookmarksBar(tree: chrome.bookmarks.BookmarkTreeNode[]) {
  const folders = tree[0]?.children ?? [];
  return (
    folders.find((child) => child.id === "1" || child.id === "toolbar_____") ??
    folders.find((child) => /bar|toolbar/i.test(child.title))
  );
}

export function getBookmarkFolders(tree: chrome.bookmarks.BookmarkTreeNode[]): FolderItem[] {
  const folders: FolderItem[] = [];
  function visit(nodes: chrome.bookmarks.BookmarkTreeNode[]) {
    for (const node of nodes) {
      if (node.url || node.unmodifiable) continue;
      folders.push({ id: node.id, title: node.title });
      visit(node.children ?? []);
    }
  }
  visit(tree[0]?.children ?? []);
  return folders;
}

export function getOtherBookmarks(tree: chrome.bookmarks.BookmarkTreeNode[]) {
  const folders = tree[0]?.children ?? [];
  return (
    folders.find((child) => child.id === "2" || child.id === "unfiled_____") ??
    folders.find((child) => /other|unfiled/i.test(child.title))
  );
}

export function getTopLevelFolders(
  bookmarksBar?: chrome.bookmarks.BookmarkTreeNode,
  otherBookmarks?: chrome.bookmarks.BookmarkTreeNode,
  rootFolders: chrome.bookmarks.BookmarkTreeNode[] = [],
) {
  const categories: FolderItem[] = [];

  const bookmarksBarCount = countBookmarkLinks(bookmarksBar);
  if (bookmarksBarCount > 0) {
    categories.push({
      id: bookmarksBar!.id,
      title: bookmarksBar!.title || "Bookmarks Bar",
      count: bookmarksBarCount,
    });
  }

  const otherBookmarksCount = countBookmarkLinks(otherBookmarks);
  if (otherBookmarksCount > 0) {
    categories.push({
      id: otherBookmarks!.id,
      title: otherBookmarks!.title || "Other Bookmarks",
      count: otherBookmarksCount,
    });
  }

  for (const folder of rootFolders) {
    const count = countBookmarkLinks(folder);
    if (
      !folder.url &&
      folder.id !== bookmarksBar?.id &&
      folder.id !== otherBookmarks?.id &&
      count > 0
    ) {
      categories.push({ id: folder.id, title: folder.title, count });
    }
  }

  const subfolders =
    bookmarksBar?.children
      ?.filter((bm) => !bm.url)
      .map((bm) => ({
        id: bm.id,
        title: bm.title,
        count: countBookmarkLinks(bm),
      }))
      .filter((folder) => folder.count > 0) ?? [];

  return [...categories, ...subfolders];
}

export function getInitialFolderId(
  folders: FolderItem[],
  bookmarksBar?: chrome.bookmarks.BookmarkTreeNode,
) {
  try {
    const saved = globalThis.localStorage?.getItem(ACTIVE_FOLDER_KEY);
    if (saved && folders.some((folder) => folder.id === saved && (folder.count ?? 0) > 0)) return saved;
  } catch {
    // Browsing still works when persistent storage is unavailable.
  }
  return folders.length > 0 ? folders[0].id : bookmarksBar?.id || "1";
}

export function toBookmarkLinks(
  bookmarks: chrome.bookmarks.BookmarkTreeNode[],
): BookmarkLink[] {
  return bookmarks
    .filter((bookmark) => bookmark.url)
    .map((bookmark) => ({
      id: bookmark.id,
      name: bookmark.title,
      url: bookmark.url as string,
    }));
}

export function fetchFolderContents(
  folderId: string,
  setBrowserBookmarks: (bookmarks: chrome.bookmarks.BookmarkTreeNode[]) => void,
  onError?: (error: string) => void,
) {
  if (!extensionApi?.bookmarks?.getChildren) {
    onError?.("Bookmarks are not supported.");
    return;
  }

  void extensionApi!.bookmarks
    .getChildren(folderId)
    .then((children) => {
      setBrowserBookmarks(children);
    })
    .catch((error: unknown) =>
      onError?.(
        error instanceof Error ? error.message : "Failed to fetch bookmarks.",
      ),
    );
}

export function selectBookmarkFolder(
  folderId: string,
  setActiveFolderId: (folderId: string) => void,
  setBrowserBookmarks: (bookmarks: chrome.bookmarks.BookmarkTreeNode[]) => void,
  onError?: (error: string) => void,
) {
  try {
    globalThis.localStorage?.setItem(ACTIVE_FOLDER_KEY, folderId);
  } catch {
    // Storage failures must not prevent switching folders.
  }
  setActiveFolderId(folderId);
  fetchFolderContents(folderId, setBrowserBookmarks, onError);
}

export function fetchInitialBookmarks(
  setTopLevelFolders: (folders: FolderItem[]) => void,
  setActiveFolderId: (folderId: string) => void,
  setBrowserBookmarks: (bookmarks: chrome.bookmarks.BookmarkTreeNode[]) => void,
  onError?: (error: string) => void,
) {
  if (!extensionApi?.bookmarks?.getTree) {
    onError?.("Bookmarks are not supported.");
    return;
  }

  void extensionApi!.bookmarks
    .getTree()
    .then((tree) => {
      const bookmarksBar = getBookmarksBar(tree);
      const otherBookmarks = getOtherBookmarks(tree);
      const folders = getTopLevelFolders(
        bookmarksBar,
        otherBookmarks,
        tree[0]?.children,
      );
      setTopLevelFolders(folders);

      const initialFolder = getInitialFolderId(folders, bookmarksBar);
      setActiveFolderId(initialFolder);
      if (folders.length === 0 && !bookmarksBar) {
        setBrowserBookmarks([]);
        return;
      }
      fetchFolderContents(initialFolder, setBrowserBookmarks, onError);
    })
    .catch((error: unknown) =>
      onError?.(
        error instanceof Error ? error.message : "Failed to fetch bookmarks.",
      ),
    );
}
