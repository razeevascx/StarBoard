import { StrictMode, useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Check, ChevronDown, CircleHelp, Folder, LayoutDashboard, Settings, UserRound } from 'lucide-react';
import './index.css';
import { extensionApi, supportsBookmarkAccess } from '../lib/browser';

import { getBookmarkFolders, getBookmarksBar, type FolderItem } from '../lib/bookmark';

const webUrl = (import.meta.env.VITE_WEB_URL || 'https://starboard.razeev.com').replace(/\/$/, '');

function useDropdownDismiss() {
  const dropdown = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !dropdown.current?.contains(event.target)) {
        dropdown.current?.removeAttribute('open');
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dropdown.current?.open) {
        dropdown.current.open = false;
        dropdown.current.querySelector('summary')?.focus();
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return dropdown;
}

function ProfileDropdown() {
  const dropdown = useDropdownDismiss();
  return <details ref={dropdown} className="group/profile relative ml-auto shrink-0">
    <summary aria-label="Profile options" className="flex min-h-10 cursor-pointer list-none items-center gap-1 rounded-md border border-ctp-surface1 px-2 text-ctp-subtext0 hover:bg-ctp-surface0 hover:text-ctp-mauve focus-visible:outline-2 focus-visible:outline-ctp-mauve group-open/profile:bg-ctp-surface0 [&::-webkit-details-marker]:hidden">
      <UserRound className="size-5" aria-hidden="true" />
      <ChevronDown className="size-3 group-open/profile:rotate-180" aria-hidden="true" />
    </summary>
    <nav aria-label="Profile navigation" className="absolute top-full right-0 z-10 mt-2 w-48 rounded-md border border-ctp-surface1 bg-ctp-mantle p-1 shadow-xl">
      <a href="index.html?settings=account" target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-2 rounded-md px-3 text-xs font-bold hover:bg-ctp-surface0 focus-visible:outline-2 focus-visible:outline-ctp-mauve"><Settings className="size-4" aria-hidden="true" /> Settings</a>
      <a href={`${webUrl}/dashboard`} target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-2 rounded-md px-3 text-xs font-bold hover:bg-ctp-surface0 focus-visible:outline-2 focus-visible:outline-ctp-mauve"><LayoutDashboard className="size-4" aria-hidden="true" /> Dashboard</a>
      <a href={`${webUrl}/#faq`} target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-2 rounded-md px-3 text-xs font-bold hover:bg-ctp-surface0 focus-visible:outline-2 focus-visible:outline-ctp-mauve"><CircleHelp className="size-4" aria-hidden="true" /> Help</a>
    </nav>
  </details>;
}

function FolderDropdown({ folders, value, onChange, disabled }: {
  folders: FolderItem[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const dropdown = useDropdownDismiss();
  const selected = folders.find((folder) => folder.id === value);
  return <details ref={dropdown} className="group/folder relative">
    <summary
      id="bookmark-folder"
      aria-labelledby="bookmark-folder-label bookmark-folder-value"
      aria-haspopup="listbox"
      aria-controls="bookmark-folder-options"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={(event) => { if (disabled) event.preventDefault(); }}
      onKeyDown={(event) => {
        if (!disabled && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
          event.preventDefault();
          dropdown.current?.setAttribute('open', '');
          dropdown.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();
        }
      }}
      className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md border border-ctp-surface1 bg-ctp-mantle px-3 text-sm hover:border-ctp-mauve focus-visible:outline-2 focus-visible:outline-ctp-mauve aria-disabled:cursor-default aria-disabled:opacity-50 [&::-webkit-details-marker]:hidden"
    >
      <Folder className="size-4 shrink-0 text-ctp-mauve" aria-hidden="true" />
      <span id="bookmark-folder-value" className="min-w-0 flex-1 truncate">{selected?.title || 'Bookmarks bar'}</span>
      <ChevronDown className="size-4 shrink-0 group-open/folder:rotate-180" aria-hidden="true" />
    </summary>
    <div id="bookmark-folder-options" role="listbox" aria-labelledby="bookmark-folder-label" className="absolute inset-x-0 bottom-full z-20 mb-2 max-h-48 overflow-y-auto rounded-md border border-ctp-surface1 bg-ctp-mantle p-1 shadow-xl">
      {folders.map((folder, index) => <button
        key={folder.id} type="button" role="option" aria-selected={folder.id === value} tabIndex={folder.id === value ? 0 : -1}
        onClick={() => {
          onChange(folder.id);
          dropdown.current?.removeAttribute('open');
          dropdown.current?.querySelector('summary')?.focus();
        }}
        onKeyDown={(event) => {
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? folders.length - 1 : event.key === 'ArrowDown' ? (index + 1) % folders.length : event.key === 'ArrowUp' ? (index - 1 + folders.length) % folders.length : null;
          if (next !== null) {
            event.preventDefault();
            dropdown.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')[next]?.focus();
          }
        }}
        className="flex min-h-10 w-full items-center gap-2 rounded-md px-3 text-left text-sm hover:bg-ctp-surface0 focus-visible:bg-ctp-surface0 focus-visible:outline-2 focus-visible:outline-ctp-mauve aria-selected:text-ctp-mauve"
        title={folder.title}
      >
        <Folder className="size-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{folder.title}</span>
        {folder.id === value && <Check className="size-4 shrink-0" aria-hidden="true" />}
      </button>)}
    </div>
  </details>;
}

function PopupBookmark() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [folderId, setFolderId] = useState('');
  const [loadingFolders, setLoadingFolders] = useState(false);
  const pending = useRef(false);
  const supported = supportsBookmarkAccess();

  useEffect(() => {
    if (!supported || !extensionApi?.tabs) return;
    let cancelled = false;
    void extensionApi.tabs.query({ active: true, lastFocusedWindow: true }).then(([tab]) => {
      if (cancelled) return;
      const pageUrl = tab?.url || tab?.pendingUrl;
      if (!pageUrl) {
        setStatus('Unable to read this tab. Reload the extension, then open it from the toolbar on a website, or enter the URL below.');
        return;
      }
      if (!/^https?:\/\//i.test(pageUrl)) {
        setStatus('This page cannot be bookmarked here. Open a website or enter its URL below.');
        return;
      }
      setUrl(pageUrl);
      setTitle(tab?.title || pageUrl);
    }).catch(() => { if (!cancelled) setStatus('Unable to read the current page. Reopen the popup to try again.'); });
    return () => { cancelled = true; };
  }, [supported]);

  const loadFolders = useCallback(async () => {
    const tree = await extensionApi!.bookmarks.getTree();
    const bar = getBookmarksBar(tree);
    if (!bar) throw new Error('Bookmarks bar is unavailable in this browser.');
    setFolders(getBookmarkFolders(tree));
    setFolderId((current) => current || bar.id);
  }, []);

  useEffect(() => {
    if (!supported || !extensionApi?.permissions) return;
    let cancelled = false;
    void extensionApi.permissions.contains({ permissions: ['bookmarks'] }).then(async (granted) => {
      if (granted && !cancelled) await loadFolders();
    }).catch(() => { if (!cancelled) setStatus('Unable to load folders. You can try loading them below.'); });
    return () => { cancelled = true; };
  }, [loadFolders, supported]);

  async function chooseFolder() {
    setLoadingFolders(true);
    try {
      const granted = await extensionApi!.permissions.request({ permissions: ['bookmarks'] });
      if (!granted) throw new Error('Allow bookmark access to choose a folder.');
      await loadFolders();
      setStatus('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to load folders.');
    } finally {
      setLoadingFolders(false);
    }
  }

  async function save() {
    if (!url.trim() || !extensionApi?.permissions || pending.current || saved) return;
    pending.current = true;
    setSaving(true);
    setStatus('');
    try {
      const pageUrl = new URL(url.trim());
      if (!['http:', 'https:'].includes(pageUrl.protocol)) throw new Error('Enter a website URL starting with https:// or http://.');
      const granted = await extensionApi.permissions.request({ permissions: ['bookmarks'] });
      if (!granted) throw new Error('Allow bookmark access to save this page.');
      const parentId = folderId || getBookmarksBar(await extensionApi.bookmarks.getTree())?.id;
      if (!parentId) throw new Error('Bookmarks bar is unavailable. Load folders and choose a destination.');
      await extensionApi.bookmarks.create({ parentId, title: title.trim() || pageUrl.hostname, url: pageUrl.href });
      setSaved(true);
      setStatus('Saved to your browser bookmarks.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save bookmark.');
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  if (!supported) return <p className="mt-4 text-sm text-ctp-subtext0">Browser bookmarks are unavailable in this browser.</p>;
  return <form className="mt-4 space-y-3" onSubmit={(event) => { event.preventDefault(); void save(); }}>
    <label className="block text-xs font-bold" htmlFor="bookmark-title">Bookmark title</label>
    <input id="bookmark-title" value={title} onChange={(event) => setTitle(event.target.value)} disabled={saving || saved} className="w-full rounded-md border border-ctp-surface1 bg-ctp-mantle p-3 text-sm focus-visible:outline-2 focus-visible:outline-ctp-mauve" />
    <label className="block text-xs font-bold" htmlFor="bookmark-url">Page URL</label>
    <input id="bookmark-url" type="url" required value={url} placeholder="https://example.com" onChange={(event) => setUrl(event.target.value)} disabled={saving || saved} className="w-full rounded-md border border-ctp-surface1 bg-ctp-mantle p-3 text-sm focus-visible:outline-2 focus-visible:outline-ctp-mauve" />
    <span id="bookmark-folder-label" className="block text-xs font-bold">Save to folder</span>
    <FolderDropdown folders={folders} value={folderId} onChange={setFolderId} disabled={saving || saved || loadingFolders || !folders.length} />
    {!folders.length && <button type="button" onClick={() => void chooseFolder()} disabled={loadingFolders || saving || saved} className="min-h-10 rounded-md border border-ctp-surface1 px-3 text-xs text-ctp-mauve disabled:opacity-50">{loadingFolders ? 'Loading folders…' : 'Choose another folder'}</button>}
    <button type="submit" disabled={!url.trim() || saving || saved || loadingFolders} className="min-h-11 w-full rounded-md bg-ctp-mauve px-4 text-xs font-bold text-ctp-base disabled:opacity-50">{saved ? 'Bookmarked' : saving ? 'Saving…' : 'Add current page to bookmarks'}</button>
    <p role="status" className="text-xs text-ctp-subtext0">{status}</p>
  </form>;
}

export function ExtensionPopup() {
  return (
    <main className="w-[400px] overflow-auto bg-ctp-base text-ctp-text">
      <div className="relative z-10 border-b border-ctp-surface1/30 bg-ctp-mantle/70 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <img src="favicon.svg" alt="Starboard" className="size-10" />
          <div>
            <h1 className="text-base font-black tracking-tight">Starboard</h1>
            <p className="text-xs text-ctp-subtext0">Your calm command center</p>
          </div>
          <ProfileDropdown />
        </div>
      </div>

      <div className="px-5 pb-5">
        <PopupBookmark />
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExtensionPopup />
  </StrictMode>,
);
