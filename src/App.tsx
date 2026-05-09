import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import Greeting from '../components/Greeting';
import Navbar from '../components/Navbar';
import Clock from '../components/Clock';
import Calendar from '../components/Calendar';
import SearchBar from '../components/SearchBar';
import QuickLinks from '../components/QuickLinks';

import Box from '../components/Box';
import { cn } from '../lib/cn';
import { checkPermissions, fetchTopSites, requestPermission, removePermission, type PermissionState } from '../lib/browser';
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
  type LinkItem,
} from '../lib/quicklinks';
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
  const [topSites, setTopSites] = useState<LinkItem[]>([]);
  const [quickLinks, setQuickLinks] = useState<LinkItem[]>(() => {
    return loadQuickLinks();
  });
  const [hasPermission, setHasPermission] = useState<PermissionState>({
    bookmarks: false,
    topSites: false,
  });

  const [config, setConfig] = useState<AppConfig>(() => {
    return loadConfig();
  });

  const handlePermissionStateChange = useCallback((perm: 'bookmarks' | 'topSites') => {
    setHasPermission((prev) => ({ ...prev, [perm]: true }));
  }, []);

  const handlePermissionRevoked = useCallback((perm: 'bookmarks' | 'topSites') => {
    setHasPermission((prev) => ({ ...prev, [perm]: false }));
    if (perm === 'bookmarks') {
      setTopLevelFolders([]);
      setActiveFolderId(null);
      setBrowserBookmarks([]);
    }
    if (perm === 'topSites') {
      setTopSites([]);
    }
  }, []);

  const handleFolderSelect = useCallback((id: string) => {
    selectBookmarkFolder(id, setActiveFolderId, setBrowserBookmarks);
  }, []);

  const handlePermissionToggle = useCallback((perm: 'bookmarks' | 'topSites', enabled: boolean) => {
    if (enabled) {
      requestPermission(
        perm,
        () => {
          if (perm === 'bookmarks') {
            fetchInitialBookmarks(setTopLevelFolders, setActiveFolderId, setBrowserBookmarks);
          }
          if (perm === 'topSites') {
            fetchTopSites(setTopSites);
          }
        },
        handlePermissionStateChange,
      );
      return;
    }

    removePermission(
      perm,
      () => {},
      handlePermissionRevoked,
    );
  }, [handlePermissionRevoked, handlePermissionStateChange]);

  const handleTopSitesRefresh = useCallback(() => {
    fetchTopSites(setTopSites);
  }, []);

  useEffect(() => {
    checkPermissions(setHasPermission);
  }, []);

  useEffect(() => {
    if (hasPermission.bookmarks && config.showBookmarks && supportsBookmarks()) {
      fetchInitialBookmarks(setTopLevelFolders, setActiveFolderId, setBrowserBookmarks);
    }
    if (hasPermission.topSites) {
      handleTopSitesRefresh();
    }
  }, [hasPermission, config.showBookmarks, handleTopSitesRefresh]);

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
    setConfig((prev) => updateConfigValue(prev, key, value));
  }, []);

  const backgroundStyle = useMemo(() => getBackgroundStyle(config), [config]);
  const bookmarkSupportError = hasPermission.bookmarks && config.showBookmarks && !supportsBookmarks()
    ? 'Bookmarks are not supported in this browser.'
    : null;

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
        showBookmarks={config.showBookmarks}
        folders={topLevelFolders}
        activeFolderId={activeFolderId}
        onFolderSelect={handleFolderSelect}
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


      <Box className="min-h-screen flex flex-col items-center justify-center p-8 relative z-10 space-y-10">
        {config.showGreeting && <Greeting />}

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full">
          {config.showClock && <Clock />}
          {config.showCalendar && <Calendar />}
        </div>

        <SearchBar />

        <div className="w-full max-w-6xl mx-auto space-y-20 pb-24">
          <div className="space-y-4">
            <QuickLinks
              links={hasPermission.topSites ? topSites : quickLinks}
            />
            {bookmarkSupportError ? (
              <div className="mx-auto max-w-3xl  border border-ctp-red/30 bg-ctp-red/10 px-6 py-4 text-center text-sm font-medium text-ctp-red">
                {bookmarkSupportError}
              </div>
            ) : (
              config.showBookmarks &&
              hasPermission.bookmarks &&
              bookmarkLinks.length > 0 && (
                <div className="space-y-4 animate-in fade-in duration-700">
                  <QuickLinks links={bookmarkLinks} />
                </div>
              )
            )}
          </div>
        </div>
      </Box>
    </main>
  );
}
