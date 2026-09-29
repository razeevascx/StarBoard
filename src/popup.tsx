import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider, useAuth, useUser } from '@clerk/chrome-extension';
import { ExternalLink, UserRound } from 'lucide-react';
import './index.css';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const extensionUrl = typeof chrome !== 'undefined' && chrome.runtime?.id ? chrome.runtime.getURL('index.html') : undefined;

function PopupAccount() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return <p className="mt-4 text-xs text-ctp-subtext0">Loading account…</p>;
  if (!isSignedIn || !user) return <a href="index.html?settings=account&sign-in=1" target="_blank" rel="noreferrer" className="mt-3 flex w-full items-center justify-center gap-2 border border-ctp-surface1 px-4 py-3 text-xs font-bold text-ctp-text transition-colors hover:bg-ctp-surface0">
    <UserRound className="size-4" aria-hidden="true" /> Sign in / Account
  </a>;

  const name = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Starboard user';
  const email = user.primaryEmailAddress?.emailAddress;
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  return <a href="index.html?settings=account" target="_blank" rel="noreferrer" className="mt-4 flex min-w-0 items-center gap-3 border border-ctp-surface1 p-3 transition-colors hover:bg-ctp-surface0">
    {user.imageUrl ? <img src={user.imageUrl} alt="" className="size-10 shrink-0 rounded-full object-cover" /> : <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ctp-mauve/20 text-xs font-bold text-ctp-mauve">{initials || <UserRound className="size-5" aria-hidden="true" />}</span>}
    <span className="min-w-0 text-left"><span className="block truncate text-sm font-bold">{name}</span><span className="block truncate text-xs text-ctp-subtext0">{email || 'Signed in · Manage account'}</span></span>
    <ExternalLink className="ml-auto size-4 shrink-0 text-ctp-overlay0" aria-hidden="true" />
  </a>;
}

export function ExtensionPopup() {
  return (
    <main className="w-80 overflow-hidden bg-ctp-base text-ctp-text">
      <div className="border-b border-ctp-surface1/30 bg-ctp-mantle/70 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <img src="favicon.svg" alt="Starboard" className="size-10" />
          <div>
            <h1 className="text-base font-black tracking-tight">Starboard</h1>
            <p className="text-xs text-ctp-subtext0">Your calm command center</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <a
          href="index.html"
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 bg-ctp-mauve px-4 py-3 text-xs font-black tracking-wide text-ctp-base transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-ctp-mauve/30"
        >
          Open Starboard
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
        {publishableKey && extensionUrl ? <PopupAccount /> : <a href="index.html?settings=account" target="_blank" rel="noreferrer" className="mt-3 flex w-full items-center justify-center gap-2 border border-ctp-surface1 px-4 py-3 text-xs font-bold text-ctp-text transition-colors hover:bg-ctp-surface0"><UserRound className="size-4" aria-hidden="true" /> Account</a>}
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {publishableKey && extensionUrl ? <ClerkProvider publishableKey={publishableKey} allowedRedirectProtocols={['chrome-extension:']} signInFallbackRedirectUrl={extensionUrl} signUpFallbackRedirectUrl={extensionUrl}><ExtensionPopup /></ClerkProvider> : <ExtensionPopup />}
  </StrictMode>,
);
