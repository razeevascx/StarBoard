"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PanelLeftOpen } from "lucide-react";
import { CreateButton } from "@/components/dashboard/CreateButton";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import type { Collection } from "@/lib/library";

const STORAGE_KEY = "starboard:sidebar";
const CHANGE_EVENT = "starboard:sidebar-change";
const DESKTOP_QUERY = "(min-width: 48rem)";

function subscribeViewport(callback: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function getSnapshot(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "closed";
  } catch {
    return true;
  }
}

function getServerSnapshot(): boolean {
  return true;
}

function subscribe(callback: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function setSidebarOpen(next: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "open" : "closed");
  } catch {
    // Ignore storage errors (e.g. private mode quota)
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function DashboardShell({
  collections,
  children,
}: {
  collections: Collection[];
  children: ReactNode;
}) {
  const open = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const desktop = useSyncExternalStore(subscribeViewport, getDesktopSnapshot, getServerSnapshot);
  const [mobilePath, setMobilePath] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const sidebarId = useId();
  const pathname = usePathname();
  const mobileOpen = !desktop && mobilePath === pathname;
  const mobileSidebarId = `${sidebarId}-mobile`;
  const showCreateButton = pathname !== "/dashboard/trash" && pathname !== "/dashboard/mcp";

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    if (mobileOpen && !drawer.open) drawer.showModal();
    if (!mobileOpen && drawer.open) drawer.close();
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "b") {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      if (desktop) setSidebarOpen(!getSnapshot());
      else setMobilePath((current) => current === pathname ? null : pathname);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [desktop, pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-ctp-base text-ctp-text">
      <div className="flex w-full flex-1 flex-col md:flex-row">
        {open && (
          <div className="hidden md:contents">
          <DashboardSidebar
            id={sidebarId}
            collections={collections}
            onClose={() => setSidebarOpen(false)}
          />
          </div>
        )}
        <dialog
          ref={drawerRef}
          id={mobileSidebarId}
          aria-label="Dashboard navigation"
          onClose={() => setMobilePath(null)}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
              event.currentTarget.close();
            }
          }}
          className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overscroll-contain border-0 bg-ctp-mantle p-0 text-ctp-text backdrop:overflow-hidden backdrop:bg-ctp-crust/70 backdrop:overscroll-contain"
        >
          <DashboardSidebar collections={collections} onClose={() => drawerRef.current?.close()} mobile />
        </dialog>
        <main className="relative min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-8 sm:pb-12 sm:pt-24 md:py-12">
          {(!desktop || !open) && (
            <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-3 border-b border-ctp-surface1/40 bg-ctp-base px-4 py-3 md:inset-auto md:left-4 md:top-3 md:justify-start md:border-0 md:bg-transparent md:p-0">
            <Link href="/" aria-label="StartBoard home" className="inline-flex size-9 items-center justify-center text-2xl text-ctp-mauve">
              <span aria-hidden="true">✦</span>
            </Link>
            <button
              type="button"
              onClick={() => desktop ? setSidebarOpen(true) : setMobilePath(pathname)}
              aria-label="Open sidebar"
              aria-expanded={mobileOpen}
              aria-controls={desktop ? sidebarId : mobileSidebarId}
              title="Open sidebar (⌘B)"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-ctp-surface1/70 bg-ctp-mantle/90 text-ctp-subtext1 shadow-sm backdrop-blur-sm transition-colors hover:border-ctp-mauve/60 hover:bg-ctp-surface0 hover:text-ctp-text"
            >
              <PanelLeftOpen className="size-4.5" aria-hidden="true" />
            </button>
            </div>
          )}
          <div className="relative mx-auto w-full max-w-6xl">
            {showCreateButton && <div className="absolute right-0 top-0">
              <CreateButton collections={collections} />
            </div>}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
