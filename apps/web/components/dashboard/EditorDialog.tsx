"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export function EditorDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close dialog" className="absolute inset-0 bg-ctp-crust/75 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto border border-ctp-surface1 bg-ctp-mantle p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-ctp-text">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="p-2 text-ctp-subtext0 hover:bg-ctp-surface0 hover:text-ctp-text">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
