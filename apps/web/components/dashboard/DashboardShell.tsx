"use client";

import { useEffect, useId, useSyncExternalStore, type ReactNode } from "react";
import { PanelLeftOpen } from "lucide-react";
import { CreateButton } from "@/components/dashboard/CreateButton";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import type { Collection } from "@/lib/library";

const STORAGE_KEY = "starboard:sidebar";
const CHANGE_EVENT = "starboard:sidebar-change";

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
  const sidebarId = useId();

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
      setSidebarOpen(!getSnapshot());
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-ctp-base text-ctp-text">
      <div className="flex w-full flex-1 flex-col md:flex-row">
        {open && (
          <DashboardSidebar
            id={sidebarId}
            collections={collections}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        <main className="relative min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-12">
          <div className="absolute right-4 top-6 sm:right-8 sm:top-12">
            <CreateButton collections={collections} />
          </div>
          {!open && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              aria-expanded={false}
              aria-controls={sidebarId}
              title="Open sidebar (⌘B)"
              className="fixed left-4 top-3 z-30 inline-flex size-9 items-center justify-center rounded-md border border-ctp-surface1/70 bg-ctp-mantle/90 text-ctp-subtext1 shadow-sm backdrop-blur-sm transition-colors hover:border-ctp-mauve/60 hover:bg-ctp-surface0 hover:text-ctp-text"
            >
              <PanelLeftOpen className="size-4.5" aria-hidden="true" />
            </button>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
