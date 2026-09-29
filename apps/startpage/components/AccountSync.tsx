import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/chrome-extension';
import { ArrowUpRight, Check, CloudUpload, LogOut, RefreshCw, ShieldCheck, UserRound } from 'lucide-react';
import { readSyncBookmarks, uploadBookmarks } from '../lib/bookmark-sync';

const webUrl = (import.meta.env.VITE_WEB_URL || 'http://localhost:3000').replace(/\/$/, '');

export default function AccountSync() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();
  const [hasPermission, setHasPermission] = useState(false);
  const [status, setStatus] = useState('');
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncedCount, setSyncedCount] = useState<number | null>(null);
  const syncing = useRef(false);
  const autoSyncedForUser = useRef<string | null>(null);
  const signInRequested = useRef(false);

  useEffect(() => {
    if (!isLoaded || isSignedIn || signInRequested.current || new URLSearchParams(window.location.search).get('sign-in') !== '1') return;
    signInRequested.current = true;
    window.history.replaceState(null, '', window.location.pathname + '?settings=account');
    clerk.openSignIn();
  }, [clerk, isLoaded, isSignedIn]);

  const sync = useCallback(async () => {
    if (!userId || syncing.current) return;
    syncing.current = true;
    setStatus('Syncing bookmarks…');
    setSyncState('syncing');
    try {
      const token = await getToken();
      if (!token) throw new Error('Your session expired. Please sign in again.');
      const bookmarks = await readSyncBookmarks();
      await uploadBookmarks(bookmarks, token, webUrl);
      setSyncedCount(bookmarks.length);
      setStatus(`${bookmarks.length} bookmarks synced`);
      setSyncState('success');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Bookmark sync failed.');
      setSyncState('error');
    } finally {
      syncing.current = false;
    }
  }, [getToken, userId]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      autoSyncedForUser.current = null;
      return;
    }
    if (!chrome?.permissions) return;
    chrome.permissions.contains({ permissions: ['bookmarks'] }, (granted) => {
      setHasPermission(granted);
      if (granted && autoSyncedForUser.current !== userId) {
        autoSyncedForUser.current = userId;
        void sync();
      }
    });
  }, [isLoaded, isSignedIn, sync, userId]);

  const enableSync = () => {
    chrome.permissions.request({ permissions: ['bookmarks'] }, (granted) => {
      setHasPermission(granted);
      if (granted) void sync();
      else {
        setStatus('Bookmark access is needed to sync.');
        setSyncState('error');
      }
    });
  };

  const name = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Starboard user';
  const email = user?.primaryEmailAddress?.emailAddress;
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  return (
    <section aria-label="Account settings" className="space-y-4 text-sm text-ctp-text">
      {!isLoaded ? (
        <div className="border border-ctp-surface1/50 bg-ctp-surface0/30 p-6" role="status">Loading your account…</div>
      ) : isSignedIn ? (
        <>
          <div className="border border-ctp-surface1/50 bg-gradient-to-br from-ctp-surface0/70 to-ctp-mantle p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ctp-overlay1">Your account</p>
              <span className="inline-flex items-center gap-1.5 border border-ctp-green/30 bg-ctp-green/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ctp-green"><Check className="size-3" aria-hidden="true" /> Connected</span>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-4">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={`${name}'s avatar`} className="size-18 shrink-0 rounded-full border-2 border-ctp-mauve/50 object-cover" />
              ) : (
                <div className="flex size-18 shrink-0 items-center justify-center rounded-full border-2 border-ctp-mauve/50 bg-ctp-mauve/15 text-xl font-bold text-ctp-mauve" aria-label={name + "'s avatar"}>
                  {initials || <UserRound className="size-7" aria-hidden="true" />}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-xl font-bold tracking-tight">{name}</h3>
                {email && <p className="mt-1 truncate text-xs text-ctp-subtext0" title={email}>{email}</p>}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-ctp-surface1/40 pt-5">
              <button type="button" onClick={() => clerk.openUserProfile()} className="min-h-10 border border-ctp-surface1 bg-ctp-base/40 px-4 text-xs font-bold text-ctp-text transition-colors hover:border-ctp-mauve hover:text-ctp-mauve">Manage profile</button>
              <button type="button" onClick={() => void clerk.signOut()} className="inline-flex min-h-10 items-center gap-2 px-3 text-xs font-semibold text-ctp-subtext0 transition-colors hover:text-ctp-red"><LogOut className="size-4" aria-hidden="true" /> Sign out</button>
            </div>
          </div>

          <div className="border border-ctp-surface1/50 bg-ctp-surface0/20 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center bg-ctp-mauve/15 text-ctp-mauve"><CloudUpload className="size-5" aria-hidden="true" /></div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-bold">Bookmark sync</h4>
                <p className="mt-1 text-xs leading-5 text-ctp-subtext0">Keep your browser bookmarks available in your Starboard dashboard.</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 border-y border-ctp-surface1/30 py-3 text-xs">
              <ShieldCheck className={hasPermission ? 'size-4 shrink-0 text-ctp-green' : 'size-4 shrink-0 text-ctp-yellow'} aria-hidden="true" />
              <span className="flex-1 text-ctp-subtext1">Browser bookmark access</span>
              <span className={hasPermission ? 'font-bold text-ctp-green' : 'font-bold text-ctp-yellow'}>{hasPermission ? 'Enabled' : 'Needed'}</span>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <button type="button" disabled={syncState === 'syncing'} onClick={hasPermission ? () => void sync() : enableSync} className="inline-flex min-h-10 items-center gap-2 bg-ctp-mauve px-4 text-xs font-bold text-ctp-base transition-colors hover:bg-ctp-lavender disabled:cursor-wait disabled:opacity-60">
                <RefreshCw className={syncState === 'syncing' ? 'size-4 animate-spin' : 'size-4'} aria-hidden="true" />
                {syncState === 'syncing' ? 'Syncing…' : hasPermission ? 'Sync bookmarks' : 'Enable sync'}
              </button>
              {syncedCount !== null && <span className="text-xs text-ctp-subtext0">{syncedCount} {syncedCount === 1 ? 'bookmark' : 'bookmarks'} synced</span>}
            </div>
            {status && <p role="status" className={syncState === 'error' ? 'mt-4 flex items-center gap-2 text-xs text-ctp-red' : syncState === 'success' ? 'mt-4 flex items-center gap-2 text-xs text-ctp-green' : 'mt-4 flex items-center gap-2 text-xs text-ctp-subtext0'}>
              {syncState === 'success' && <Check className="size-4" aria-hidden="true" />}{status}
            </p>}
          </div>

          <a href={webUrl + '/dashboard/bookmarks'} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-between gap-3 border border-ctp-surface1/50 bg-ctp-surface0/20 px-5 text-xs font-bold text-ctp-mauve transition-colors hover:border-ctp-mauve/50 hover:bg-ctp-surface0/40">
            View bookmarks dashboard <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </>
      ) : (
        <div className="border border-ctp-surface1/50 bg-gradient-to-br from-ctp-surface0/70 to-ctp-mantle p-6">
          <div className="mb-5 flex size-14 items-center justify-center bg-ctp-mauve/15 text-ctp-mauve"><UserRound className="size-7" aria-hidden="true" /></div>
          <h3 className="text-xl font-bold tracking-tight">Bring your bookmarks with you</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-ctp-subtext0">Sign in to back up browser bookmarks and find them in your web dashboard. Sync starts after you grant bookmark access.</p>
          <button type="button" onClick={() => clerk.openSignIn()} className="mt-6 min-h-11 bg-ctp-mauve px-5 text-xs font-bold text-ctp-base transition-colors hover:bg-ctp-lavender">Sign in to Starboard</button>
        </div>
      )}
    </section>
  );
}
