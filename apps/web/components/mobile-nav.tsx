"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { XIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthControls } from "@/components/AuthControls";

type MobileNavProps = {
  links: { label: string; href: string }[];
};

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button
            type="button"
            aria-label="Open navigation menu"
            size="icon"
            variant="outline"
            className="size-11 md:hidden"
          >
            <MenuIcon className="size-4.5" aria-hidden="true" />
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ctp-base/95 backdrop-blur-sm md:hidden" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto p-4 text-ctp-text md:hidden"
          >
            <div className="flex min-h-10 items-center justify-between gap-4">
              <Dialog.Title className="text-sm font-semibold">
                Navigation
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button
                  type="button"
                  aria-label="Close navigation menu"
                  size="icon"
                  variant="outline"
                  className="size-11"
                >
                  <XIcon className="size-4.5" aria-hidden="true" />
                </Button>
              </Dialog.Close>
            </div>
            <nav aria-label="Mobile navigation" className="mt-6 grid gap-y-2">
              {links.map((link) => (
                <Dialog.Close asChild key={link.label}>
                  <Button
                    asChild
                    variant="ghost"
                    className="min-h-11 justify-start text-ctp-subtext1 hover:text-ctp-mauve"
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                </Dialog.Close>
              ))}
            </nav>
            <div className="mt-12 border-t border-ctp-surface1/40 pt-6">
              <AuthControls onNavigate={() => setOpen(false)} />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
