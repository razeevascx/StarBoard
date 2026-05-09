export interface FolderItem {
  id: string;
  title: string;
}

export interface BookmarkLink {
  id: string;
  name: string;
  url: string;
}

export function supportsBookmarks() {
  return typeof chrome !== "undefined" && !!chrome.bookmarks;
}

export function getBookmarksBar(tree: chrome.bookmarks.BookmarkTreeNode[]) {
  return tree[0]?.children?.find((child) =>
    child.title.toLowerCase().includes("bar") ||
    child.id === "1" ||
    child.title.toLowerCase().includes("bookmarks"),
  );
}

export function getTopLevelFolders(bookmarksBar?: chrome.bookmarks.BookmarkTreeNode) {
  return bookmarksBar?.children?.filter((bm) => !bm.url).map((bm) => ({ id: bm.id, title: bm.title })) ?? [];
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
) {
  if (!supportsBookmarks()) return;

  chrome.bookmarks.getChildren(folderId, (children) => {
    setBrowserBookmarks(children);
  });
}

export function selectBookmarkFolder(
  folderId: string,
  setActiveFolderId: (folderId: string) => void,
  setBrowserBookmarks: (bookmarks: chrome.bookmarks.BookmarkTreeNode[]) => void,
) {
  setActiveFolderId(folderId);
  fetchFolderContents(folderId, setBrowserBookmarks);
}

export function fetchInitialBookmarks(
  setTopLevelFolders: (folders: FolderItem[]) => void,
  setActiveFolderId: (folderId: string) => void,
  setBrowserBookmarks: (bookmarks: chrome.bookmarks.BookmarkTreeNode[]) => void,
) {
  if (!supportsBookmarks()) return;

  chrome.bookmarks.getTree((tree) => {
    const bookmarksBar = getBookmarksBar(tree);
    const folders = getTopLevelFolders(bookmarksBar);
    setTopLevelFolders(folders);

    const initialFolder = getInitialFolderId(folders, bookmarksBar);
    setActiveFolderId(initialFolder);
    fetchFolderContents(initialFolder, setBrowserBookmarks);
  });
}
