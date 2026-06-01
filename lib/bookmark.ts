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

  return node.children?.reduce((total, child) => total + countBookmarkLinks(child), 0) ?? 0;
}

export function supportsBookmarks() {
  if (typeof chrome === "undefined") {
    return false;
  }
  return !!chrome.bookmarks || !!chrome.permissions;
}

export function getBookmarksBar(tree: chrome.bookmarks.BookmarkTreeNode[]) {
  return tree[0]?.children?.find((child) =>
    child.id === "1" ||
    child.title.toLowerCase().includes("bar") ||
    child.title.toLowerCase().includes("bookmarks"),
  );
}

export function getOtherBookmarks(tree: chrome.bookmarks.BookmarkTreeNode[]) {
  return tree[0]?.children?.find((child) =>
    child.id === "2" ||
    child.title.toLowerCase().includes("other")
  );
}

export function getTopLevelFolders(
  bookmarksBar?: chrome.bookmarks.BookmarkTreeNode,
  otherBookmarks?: chrome.bookmarks.BookmarkTreeNode
) {
  const categories: FolderItem[] = [];

  const bookmarksBarCount = countBookmarkLinks(bookmarksBar);
  if (bookmarksBarCount > 0) {
    categories.push({ id: bookmarksBar!.id, title: "Bookmarks Bar", count: bookmarksBarCount });
  }

  const otherBookmarksCount = countBookmarkLinks(otherBookmarks);
  if (otherBookmarksCount > 0) {
    categories.push({ id: otherBookmarks!.id, title: "Other Bookmarks", count: otherBookmarksCount });
  }

  const subfolders = bookmarksBar?.children
    ?.filter((bm) => !bm.url)
    .map((bm) => ({ id: bm.id, title: bm.title, count: countBookmarkLinks(bm) }))
    .filter((folder) => folder.count > 0) ?? [];

  return [...categories, ...subfolders];
}

export function getInitialFolderId(folders: FolderItem[], bookmarksBar?: chrome.bookmarks.BookmarkTreeNode) {
  return folders.length > 0 ? folders[0].id : (bookmarksBar?.id || "1");
}

export function toBookmarkLinks(bookmarks: chrome.bookmarks.BookmarkTreeNode[]): BookmarkLink[] {
  return bookmarks
    .filter((bookmark) => bookmark.url)
    .map((bookmark) => ({ id: bookmark.id, name: bookmark.title, url: bookmark.url as string }));
}

export function fetchFolderContents(
  folderId: string,
  setBrowserBookmarks: (bookmarks: chrome.bookmarks.BookmarkTreeNode[]) => void,
  onError?: (error: string) => void,
) {
  if (!supportsBookmarks()) {
    onError?.("Bookmarks are not supported.");
    return;
  }

  chrome.bookmarks.getChildren(folderId, (children) => {
    if (chrome.runtime.lastError) {
      onError?.(chrome.runtime.lastError.message || "Failed to fetch bookmarks.");
      return;
    }
    setBrowserBookmarks(children);
  });
}

export function selectBookmarkFolder(
  folderId: string,
  setActiveFolderId: (folderId: string) => void,
  setBrowserBookmarks: (bookmarks: chrome.bookmarks.BookmarkTreeNode[]) => void,
  onError?: (error: string) => void,
) {
  setActiveFolderId(folderId);
  fetchFolderContents(folderId, setBrowserBookmarks, onError);
}

export function fetchInitialBookmarks(
  setTopLevelFolders: (folders: FolderItem[]) => void,
  setActiveFolderId: (folderId: string) => void,
  setBrowserBookmarks: (bookmarks: chrome.bookmarks.BookmarkTreeNode[]) => void,
  onError?: (error: string) => void,
) {
  if (!supportsBookmarks()) {
    onError?.("Bookmarks are not supported.");
    return;
  }

  chrome.bookmarks.getTree((tree) => {
    if (chrome.runtime.lastError) {
      onError?.(chrome.runtime.lastError.message || "Failed to fetch bookmarks.");
      return;
    }

    const bookmarksBar = getBookmarksBar(tree);
    const otherBookmarks = getOtherBookmarks(tree);
    const folders = getTopLevelFolders(bookmarksBar, otherBookmarks);
    setTopLevelFolders(folders);

    const initialFolder = getInitialFolderId(folders, bookmarksBar);
    setActiveFolderId(initialFolder);
    fetchFolderContents(initialFolder, setBrowserBookmarks, onError);
  });
}
