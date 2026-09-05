import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import Greeting from '../components/Greeting';
import Navbar from '../components/Navbar';
import Clock from '../components/Clock';
<<<<<<< HEAD
import Calendar from '../components/Calendar';
import QuickLinks from '../components/QuickLinks';
=======
>>>>>>> master
import BookmarkManager from '../components/BookmarkManager';

import Box from '../components/Box';
import { cn } from '../lib/cn';
import { checkPermissions, requestPermission, removePermission, type PermissionState } from '../lib/browser';
import {
  fetchInitialBookmarks,
  toBookmarkLinks,
  supportsBookmarks,
  selectBookmarkFolder,
  type BookmarkLink,
  type FolderItem,
} from '../lib/bookmark';
import {
  addQuickLink as createQuickLink,
  loadQuickLinks,
  removeQuickLink as deleteQuickLink,
  saveQuickLinks,
  updateQuickLink as modifyQuickLink,
<<<<<<< HEAD
  type LinkItem,
} from '../lib/quicklinks';
=======
} from '../lib/quicklinks';
  import type { LinkItem } from '../lib/quicklinks';
>>>>>>> master
import {
  getBackgroundStyle,
  loadConfig,
  saveConfig,
  updateConfigValue,
} from '../lib/settings';
import type { AppConfig } from './types';

const Settings = lazy(() => import('../components/Settings'));

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [browserBookmarks, setBrowserBookmarks] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
  const [topLevelFolders, setTopLevelFolders] = useState<FolderItem[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [quickLinks, setQuickLinks] = useState<LinkItem[]>(() => {
    return loadQuickLinks();
  });
<<<<<<< HEAD
=======
  const SAMPLE_BOOKMARK_NODES = [
    { id: 's1', title: 'MDN', url: 'https://developer.mozilla.org' },
    { id: 's2', title: 'Stack Overflow', url: 'https://stackoverflow.com' },
    { id: 's3', title: 'GitHub', url: 'https://github.com' },
    { id: 's4', title: 'News', url: 'https://news.ycombinator.com' },
  ] as unknown as chrome.bookmarks.BookmarkTreeNode[];
>>>>>>> master
  const [hasPermission, setHasPermission] = useState<PermissionState>({
    bookmarks: false,
  });

<<<<<<< HEAD
  const [config, setConfig] = useState<AppConfig>(() => {
    return loadConfig();
  });
=======
  const [config, setConfig] = useState<AppConfig>(() => loadConfig());
>>>>>>> master

  const handlePermissionStateChange = useCallback((perm: 'bookmarks') => {
    setHasPermission((prev) => ({ ...prev, [perm]: true }));
  }, []);

  const handlePermissionRevoked = useCallback((perm: 'bookmarks') => {
    setHasPermission((prev) => ({ ...prev, [perm]: false }));
    if (perm === 'bookmarks') {
      setTopLevelFolders([]);
      setActiveFolderId(null);
      setBrowserBookmarks([]);
    }
  }, []);

  const handleFolderSelect = useCallback((id: string) => {
    selectBookmarkFolder(id, setActiveFolderId, setBrowserBookmarks, () => {});
  }, []);

  const handlePermissionToggle = useCallback((perm: 'bookmarks', enabled: boolean) => {
    if (enabled) {
      requestPermission(
        perm,
        () => {
          if (perm === 'bookmarks') {
            fetchInitialBookmarks(setTopLevelFolders, setActiveFolderId, setBrowserBookmarks, () => {});
          }
        },
        handlePermissionStateChange,
        () => {
          // If permission is denied, we should also ensure the component is hidden if it was just being enabled
          if (perm === 'bookmarks') {
             setConfig(prev => ({ ...prev, showBookmarks: false }));
          }
        }
      );
      return;
    }

    removePermission(
      perm,
      () => {},
      handlePermissionRevoked,
    );
  }, [handlePermissionRevoked, handlePermissionStateChange]);

  useEffect(() => {
    checkPermissions(setHasPermission);
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    if (hasPermission.bookmarks && config.showBookmarks && supportsBookmarks()) {
      fetchInitialBookmarks(setTopLevelFolders, setActiveFolderId, setBrowserBookmarks, () => {});
=======
    if (config.showBookmarks) {
      if (hasPermission.bookmarks && supportsBookmarks()) {
        fetchInitialBookmarks(setTopLevelFolders, setActiveFolderId, setBrowserBookmarks, () => {});
        return;
      }

      // Bookmarks not available or permission missing — use sample data
      const sampleFolder = { id: 'sample', title: 'Sample Bookmarks', count: SAMPLE_BOOKMARK_NODES.length };
      setTopLevelFolders([sampleFolder]);
      setActiveFolderId(sampleFolder.id);
      setBrowserBookmarks(SAMPLE_BOOKMARK_NODES);
>>>>>>> master
    }
  }, [hasPermission, config.showBookmarks]);

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  useEffect(() => {
    saveQuickLinks(quickLinks);
  }, [quickLinks]);

  const handleAddQuickLink = useCallback((name: string, url: string) => {
    setQuickLinks((prev) => createQuickLink(prev, name, url));
  }, []);

  const handleRemoveQuickLink = useCallback((id: string) => {
    setQuickLinks((prev) => deleteQuickLink(prev, id));
  }, []);

  const handleUpdateQuickLink = useCallback((id: string, name: string, url: string) => {
    setQuickLinks((prev) => modifyQuickLink(prev, id, name, url));
  }, []);

  const bookmarkLinks = useMemo<BookmarkLink[]>(
    () => toBookmarkLinks(browserBookmarks),
    [browserBookmarks],
  );

  const updateConfig = useCallback((key: keyof AppConfig, value: AppConfig[keyof AppConfig]) => {
    if (key === 'showBookmarks' && value === true) {
<<<<<<< HEAD
      if (!supportsBookmarks()) {
        return;
      }
      if (!hasPermission.bookmarks) {
        handlePermissionToggle('bookmarks', true);
      }
=======
      // If browser bookmark API exists, request permission when enabling.
      if (supportsBookmarks() && !hasPermission.bookmarks) {
        handlePermissionToggle('bookmarks', true);
      }
      // If bookmarks API not available, still allow enabling to show sample bookmarks.
>>>>>>> master
    }
    setConfig((prev) => updateConfigValue(prev, key, value));
  }, [hasPermission.bookmarks, handlePermissionToggle]);

  const backgroundStyle = useMemo(() => getBackgroundStyle(config), [config]);


  const handleSettingsOpen = useCallback(() => setIsSettingsOpen(true), []);
  const handleSettingsClose = useCallback(() => setIsSettingsOpen(false), []);
  const handleHomeClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main
      className={cn(
        "min-h-screen text-ctp-text selection:bg-ctp-mauve/30 overflow-x-hidden pt-16 transition-all duration-700",
        config.bgType === "gradient" &&
          "from-ctp-mantle via-ctp-base to-ctp-base",
      )}
      style={backgroundStyle}
    >
      <Navbar
        onSettingsClick={handleSettingsOpen}
        onHomeClick={handleHomeClick}
<<<<<<< HEAD
=======
        quickLinks={quickLinks}
>>>>>>> master
      />

      <Suspense fallback={null}>
        <Settings
          isOpen={isSettingsOpen}
          onClose={handleSettingsClose}
          config={config}
          updateConfig={updateConfig}
          hasPermission={hasPermission}
          onTogglePermission={handlePermissionToggle}
          quickLinks={quickLinks}
          onAddQuickLink={handleAddQuickLink}
          onRemoveQuickLink={handleRemoveQuickLink}
          onUpdateQuickLink={handleUpdateQuickLink}
        />
      </Suspense>

      <Box className="flex flex-col items-center justify-center p-8 relative z-10 space-y-10">
        {config.showGreeting && <Greeting />}

<<<<<<< HEAD
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full">
          {config.showClock && <Clock />}
          {config.showCalendar && <Calendar />}
        </div>
        <QuickLinks links={quickLinks} />

        {config.showBookmarks && hasPermission.bookmarks && (
=======
        {config.showClock && <Clock />}

        {config.showBookmarks && (hasPermission.bookmarks || topLevelFolders.length > 0) && (
>>>>>>> master
          <BookmarkManager
            bookmarkLinks={bookmarkLinks}
            folders={topLevelFolders}
            activeFolderId={activeFolderId}
            onFolderSelect={handleFolderSelect}
          />
        )}
      </Box>
    </main>
  );
}
