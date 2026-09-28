import { Brand } from "@/components/Brand";
import { AuthControls } from "@/components/AuthControls";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-ctp-surface1/40">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-lg focus:bg-ctp-mauve focus:p-3 focus:text-ctp-base">Skip to content</a>
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 px-6 py-4 sm:px-8">
        <Brand />
        <div className="order-3 mt-3 flex w-full items-center justify-center gap-8 border-t border-ctp-surface1/40 pt-2 text-sm text-ctp-subtext1 sm:order-0 sm:mt-0 sm:w-auto sm:border-0 sm:pt-0">
          <Link className="inline-flex min-h-11 items-center transition-colors hover:text-ctp-mauve" href="/#features">Why StarboarL</Link>
          <Link className="inline-flex min-h-11 items-center transition-colors hover:text-ctp-mauve" href="/#faq">FAQ</Link>
          <Link className="inline-flex min-h-11 items-center transition-colors hover:text-ctp-mauve" href="/contact">Contact</Link>
        </div>
        <AuthControls />
      </nav>
    </header>
  );
}
