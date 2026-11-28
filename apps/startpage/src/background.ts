import { createClerkClient } from '@clerk/chrome-extension/client';
import { extensionApi } from '../lib/browser';
import { downloadBookmarks, isServerBookmarkCreation, mergeServerBookmarks, readSyncBookmarks, uploadBookmarks, type SyncBookmark } from '../lib/bookmark-sync';

const webUrl = import.meta.env.VITE_WEB_URL || 'https://starboard.razeev.com';
const pendingPrefix = 'bookmarkSyncPending:';
const accountKey = 'bookmarkSyncAccountId';
const pendingLocalIds = new Set<string>();
let work: Promise<unknown> = Promise.resolve();
let applyingServer = false;

async function authenticate() {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!key) throw new Error('Bookmark sync requires a configured Clerk key.');
  const clerk = await createClerkClient({
    publishableKey: key,
    syncHost: import.meta.env.VITE_CLERK_SYNC_HOST,
    background: true,
  });
  const userId = clerk.session?.user.id;
  const token = await clerk.session?.getToken();
  if (!userId || !token) throw new Error('Sign in to sync bookmarks.');
  return { userId, token };
}

async function runSync(expectedUserId?: string) {
  const { userId, token } = await authenticate();
  if (expectedUserId && expectedUserId !== userId) throw new Error('Your account changed. Please retry sync.');
  if (!await extensionApi!.permissions.contains({ permissions: ['bookmarks'] })) {
    throw new Error('Bookmark access is needed to sync.');
  }
  const storage = extensionApi!.storage.local;
  await storage.set({ [accountKey]: userId });
  const statusKey = `bookmarkSyncStatus:${userId}`;
  await storage.set({ [statusKey]: { state: 'syncing', message: 'Syncing bookmarks…' } });
  try {
    const stored = await storage.get(null);
    const entries = Object.entries(stored).filter(([key]) => key.startsWith(`${pendingPrefix}${userId}:`));
    for (const [key] of entries) pendingLocalIds.add(key.slice(key.lastIndexOf(':') + 1));
    if (entries.length > 0) {
      await uploadBookmarks(entries.map(([, bookmark]) => bookmark as SyncBookmark), token, webUrl);
      await storage.remove(entries.map(([key]) => key));
      for (const [key] of entries) pendingLocalIds.delete(key.slice(key.lastIndexOf(':') + 1));
    }
    // Fetch AFTER uploading new creations; an older snapshot would delete them.
    const bookmarks = await downloadBookmarks(token, webUrl);
    applyingServer = true;
    let added: number;
    try {
      added = await mergeServerBookmarks(bookmarks, pendingLocalIds);
    } finally {
      applyingServer = false;
    }
    const result = { syncedCount: bookmarks.length, downloadedCount: added };
    await storage.set({ [statusKey]: { state: 'success', message: `${bookmarks.length} bookmarks synced`, ...result } });
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Bookmark sync failed.';
    await storage.set({ [statusKey]: { state: 'error', message } });
    throw error;
  }
}

function enqueueSync(expectedUserId?: string) {
  const next = work.then(() => runSync(expectedUserId));
  work = next.catch(() => undefined);
  return next;
}

let listening = false;
function registerBookmarkListeners() {
  const bookmarks = extensionApi?.bookmarks;
  if (listening || !bookmarks) return;
  listening = true;
  bookmarks.onCreated.addListener((id, node) => {
    if (!node.url || !/^https?:\/\//i.test(node.url) || isServerBookmarkCreation(node)) return;
    pendingLocalIds.add(id);
    void (async () => {
      // Bind creations to the account present at the event, before queuing work.
      let userId: string;
      try {
        userId = (await authenticate()).userId;
      } catch (error) {
        // Retain offline creations for this account without uploading to another one.
        const stored = await extensionApi!.storage.local.get(accountKey);
        if (typeof stored[accountKey] !== 'string') throw error;
        userId = stored[accountKey] as string;
      }
      const local = await readSyncBookmarks();
      const bookmark = local.find((item) => item.sourceId.endsWith(`:${id}`));
      if (!bookmark) {
        pendingLocalIds.delete(id);
        return;
      }
      await extensionApi!.storage.local.set({ [`${pendingPrefix}${userId}:${id}`]: bookmark });
      await enqueueSync(userId);
    })().catch(() => undefined);
  });

  const refreshFromServer = () => {
    if (!applyingServer) void enqueueSync().catch(() => undefined);
  };
  bookmarks.onChanged.addListener(refreshFromServer);
  bookmarks.onMoved.addListener(refreshFromServer);
  bookmarks.onRemoved.addListener(refreshFromServer);
}

// Register synchronously at startup and retry when optional access is granted.
registerBookmarkListeners();
extensionApi?.permissions.onAdded.addListener((permissions) => {
  if (permissions.permissions?.includes('bookmarks')) registerBookmarkListeners();
});

extensionApi?.runtime.onMessage.addListener((message, sender, respond) => {
  if (message?.type !== 'STARBOARD_SYNC_BOOKMARKS' || sender.id !== extensionApi?.runtime.id) return;
  if (typeof message.userId !== 'string' || !message.userId) return;
  void enqueueSync(message.userId).then(
    (result) => respond({ ok: true, ...result }),
    (error: unknown) => respond({ ok: false, error: error instanceof Error ? error.message : 'Bookmark sync failed.' }),
  );
  return true;
});
