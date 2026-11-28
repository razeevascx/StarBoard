import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/chrome-extension';
import { ArrowUpRight, CloudUpload, LogOut, RefreshCw, UserRound } from 'lucide-react';
import { extensionApi, extensionUrl, supportsBookmarkAccess } from '../lib/browser';
import { Card, CardTitle } from './hangry-ui/components/card';
import McpSettingsPanel from './settings/McpSettingsPanel';

const accountCardClass = "max-w-none gap-0 text-sm";
const webUrl = (import.meta.env.VITE_WEB_URL || 'https://starboard.razeev.com').replace(/\/$/, '');

export default function AccountSync() {
  const { isLoaded, isSignedIn, userId, sessionId } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [status, setStatus] = useState('');
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const syncing = useRef(false);
  const autoSyncedForUser = useRef<string | null>(null);

  const canSyncBookmarks = supportsBookmarkAccess();

  async function signInWithGoogle() {
    if (!extensionUrl || signingIn) return;
    setSigningIn(true);
    setSignInError('');
    try {
      const signInUrl = new URL(`${webUrl}/sign-in`);
      signInUrl.searchParams.set('redirect_url', `${webUrl}/dashboard/bookmarks`);
      await extensionApi?.tabs?.create({ url: signInUrl.toString() });
    } catch {
      setSignInError('Unable to open Starboard sign-in. Please try again.');
      setSigningIn(false);
    }
  }

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    setSignOutError('');
    try {
      await clerk.signOut({
        ...(sessionId ? { sessionId } : {}),
        redirectUrl: `${extensionUrl}?settings=account`,
      });
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Unable to sign out. Please try again.');
      setSigningOut(false);
    }
  }

  const sync = useCallback(async () => {
    if (!userId || syncing.current) return;
    syncing.current = true;
    setStatus('Syncing bookmarks…');
    setSyncState('syncing');
    try {
      const result = await extensionApi?.runtime.sendMessage({ type: 'STARBOARD_SYNC_BOOKMARKS', userId });
      if (!result?.ok) throw new Error(result?.error || 'Unable to reach bookmark sync. Reload the extension and retry.');
      const { downloadedCount, syncedCount } = result;
      setStatus(`${syncedCount} bookmarks synced${downloadedCount ? ` · ${downloadedCount} added locally` : ''}`);
      setSyncState('success');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Bookmark sync failed.');
      setSyncState('error');
    } finally {
      syncing.current = false;
    }
  }, [userId]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      autoSyncedForUser.current = null;
      return;
    }
    if (!canSyncBookmarks || !extensionApi?.permissions) return;
    void extensionApi.permissions.contains({ permissions: ['bookmarks'] }).then((granted) => {
      setHasPermission(granted);
      if (granted && autoSyncedForUser.current !== userId) {
        autoSyncedForUser.current = userId;
        void sync();
      }
    }).catch(() => setHasPermission(false));
  }, [canSyncBookmarks, isLoaded, isSignedIn, sync, userId]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !hasPermission || !userId) return;
    const onFocus = () => void sync();
    const onStorageChange = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area !== 'local') return;
      const value = changes[`bookmarkSyncStatus:${userId}`]?.newValue;
      if (!value || typeof value !== 'object') return;
      const status = value as Record<string, unknown>;
      if ((status.state !== 'syncing' && status.state !== 'success' && status.state !== 'error') || typeof status.message !== 'string') return;
      setSyncState(status.state);
      setStatus(status.message);
    };
    extensionApi?.storage.onChanged.addListener(onStorageChange);
    window.addEventListener('focus', onFocus);
    window.addEventListener('online', onFocus);
    return () => {
      extensionApi?.storage.onChanged.removeListener(onStorageChange);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('online', onFocus);
    };
  }, [hasPermission, isLoaded, isSignedIn, sync, userId]);

  const enableSync = () => {
    if (!canSyncBookmarks || !extensionApi?.permissions) return;
    void extensionApi.permissions.request({ permissions: ['bookmarks'] }).then((granted) => {
      setHasPermission(granted);
      if (granted) void sync();
      else {
        setStatus('Bookmark access is needed to sync.');
        setSyncState('error');
      }
    }).catch((error: unknown) => {
      setStatus(error instanceof Error ? error.message : 'Unable to request bookmark access.');
      setSyncState('error');
    });
  };

  const name = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Starboard user';
  const email = user?.primaryEmailAddress?.emailAddress;
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  return (
    <section aria-label="Account settings" className="space-y-4 text-sm text-ctp-text">
      {!isLoaded ? (
        <Card className={accountCardClass} role="status">Loading your account…</Card>
      ) : isSignedIn ? (
        <>
          <Card className={accountCardClass}>
            <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ctp-overlay1">Your account</p>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button type="button" disabled={!canSyncBookmarks || syncState === 'syncing'} onClick={hasPermission ? () => void sync() : enableSync} className="rounded-md inline-flex min-h-10 items-center gap-2 bg-ctp-mauve px-4 text-xs font-bold text-ctp-base transition-colors hover:bg-ctp-lavender disabled:cursor-not-allowed disabled:opacity-60">
                <RefreshCw className={syncState === 'syncing' ? 'size-4 animate-spin' : 'size-4'} aria-hidden="true" />
                {!canSyncBookmarks ? 'Bookmark sync unavailable' : syncState === 'syncing' ? 'Syncing…' : hasPermission ? 'Sync bookmarks' : 'Enable sync'}
              </button>
            </div>
            </header>
            <div className="flex min-w-0 flex-wrap items-center gap-4">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={`${name}'s avatar`} className="size-18 shrink-0 rounded-full border-2 border-ctp-mauve/50 object-cover" />
              ) : (
                <div className="flex size-18 shrink-0 items-center justify-center rounded-full border-2 border-ctp-mauve/50 bg-ctp-mauve/15 text-xl font-bold text-ctp-mauve" aria-label={name + "'s avatar"}>
                  {initials || <UserRound className="size-7" aria-hidden="true" />}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <CardTitle className="truncate">{name}</CardTitle>
                {email && <p className="mt-1 truncate text-xs text-ctp-subtext0" title={email}>{email}</p>}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-ctp-surface1/40 pt-5">
              <button type="button" onClick={() => clerk.openUserProfile()} className="rounded-md min-h-10 border border-ctp-surface1 bg-ctp-base/40 px-4 text-xs font-bold text-ctp-text transition-colors hover:border-ctp-mauve hover:text-ctp-mauve">Manage profile</button>
              <button type="button" onClick={() => void signOut()} disabled={signingOut} className="rounded-md inline-flex min-h-10 items-center gap-2 px-3 text-xs font-semibold text-ctp-subtext0 transition-colors hover:text-ctp-red disabled:cursor-wait disabled:opacity-60"><LogOut className="size-4" aria-hidden="true" /> {signingOut ? 'Signing out…' : 'Sign out'}</button>
            </div>
            {signOutError && <p role="alert" className="mt-3 text-xs text-ctp-red">{signOutError}</p>}
            <div className="mt-6 border-t border-ctp-surface1/40 pt-5">
            <div className="flex items-start gap-3">
              <div className="rounded-md flex size-10 shrink-0 items-center justify-center bg-ctp-mauve/15 text-ctp-mauve"><CloudUpload className="size-5" aria-hidden="true" /></div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold">Bookmark sync</h3>
                <p className="mt-1 text-xs leading-5 text-ctp-subtext0">{canSyncBookmarks ? 'New browser bookmarks upload immediately. Your dashboard controls synced bookmarks and deletions.' : 'This browser does not provide access to bookmarks. You can still manage bookmarks in your web dashboard.'}</p>
              </div>
            </div>
            {status && syncState !== 'success' && <p role="status" className={syncState === 'error' ? 'mt-4 flex items-center gap-2 text-xs text-ctp-red' : 'mt-4 flex items-center gap-2 text-xs text-ctp-subtext0'}>
              {status}
            </p>}
            </div>
          </Card>

          <Card as="a" size="sm" href={webUrl + '/dashboard/bookmarks'} target="_blank" rel="noopener noreferrer" className="max-w-none flex-row items-center justify-between gap-3 text-xs font-bold text-ctp-mauve">
            View bookmarks dashboard <ArrowUpRight className="size-4" aria-hidden="true" />
          </Card>
        </>
      ) : (
        <Card className={accountCardClass}>
          <div className="rounded-md mb-5 flex size-14 items-center justify-center bg-ctp-mauve/15 text-ctp-mauve"><UserRound className="size-7" aria-hidden="true" /></div>
          <CardTitle>Bring your bookmarks with you</CardTitle>
          <p className="mt-2 max-w-md text-sm leading-6 text-ctp-subtext0">Sign in to keep this browser aligned with your dashboard bookmarks. Sync starts after you grant bookmark access.</p>
          <button type="button" onClick={() => void signInWithGoogle()} disabled={signingIn} className="mt-6 inline-flex min-h-11 items-center self-start gap-2 rounded-md bg-ctp-mauve px-5 text-xs font-bold text-ctp-base transition-colors hover:bg-ctp-lavender focus-visible:outline-2 focus-visible:outline-ctp-mauve disabled:opacity-60">
            <UserRound className="size-4" aria-hidden="true" />
            {signingIn ? 'Opening Starboard…' : 'Continue with Google'}
          </button>
          {signInError && <p role="alert" className="mt-3 text-xs text-ctp-red">{signInError}</p>}
        </Card>
      )}
      <Card className={accountCardClass}>
        <McpSettingsPanel />
      </Card>
      <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-4 text-xs text-ctp-subtext0">
        <a href={`${webUrl}/privacy`} target="_blank" rel="noopener noreferrer" className="rounded-sm hover:text-ctp-text hover:underline focus-visible:outline-2 focus-visible:outline-ctp-mauve">Privacy Policy</a>
        <a href={`${webUrl}/terms`} target="_blank" rel="noopener noreferrer" className="rounded-sm hover:text-ctp-text hover:underline focus-visible:outline-2 focus-visible:outline-ctp-mauve">Terms</a>
      </nav>
    </section>
  );
}
