"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/hangry-ui/components/card";

export function EditorDialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();

    const handleClose = () => {
      if (dialog.open) return;
      dialog.returnValue = "";
      onCloseRef.current();
    };
    dialog.addEventListener("close", handleClose);

    let cleanupFallback: (() => void) | undefined;
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const outside = (e: PointerEvent) => {
        const r = dialog.getBoundingClientRect();
        return (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        );
      };
      let pressedOutside = false;
      const onPointerDown = (e: PointerEvent) => {
        pressedOutside = outside(e);
      };
      const onPointerUp = (e: PointerEvent) => {
        if (pressedOutside && outside(e)) dialog.close();
      };
      dialog.addEventListener("pointerdown", onPointerDown);
      dialog.addEventListener("pointerup", onPointerUp);
      cleanupFallback = () => {
        dialog.removeEventListener("pointerdown", onPointerDown);
        dialog.removeEventListener("pointerup", onPointerUp);
      };
    }

    return () => {
      dialog.removeEventListener("close", handleClose);
      cleanupFallback?.();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: "any" } as Record<string, string>)}
      aria-labelledby={titleId}
      className="m-auto w-full max-w-lg overscroll-contain bg-transparent p-4 text-foreground backdrop:overflow-hidden backdrop:bg-ctp-crust/75 backdrop:overscroll-contain backdrop:backdrop-blur-sm"
    >
      <Card className="max-h-[90dvh] w-full max-w-none overflow-y-auto shadow-2xl">
        <CardHeader className="items-center">
          <CardTitle id={titleId} className="text-xl">
            {title}
          </CardTitle>
          <CardAction>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close dialog"
              className="inline-flex size-9 items-center justify-center rounded-md text-ctp-subtext0 transition-colors hover:bg-ctp-surface0 hover:text-ctp-text"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </CardAction>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </dialog>
  );
}
