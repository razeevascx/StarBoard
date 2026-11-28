import type { ReactNode } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div id="top" className="flex min-h-dvh flex-col bg-ctp-base text-ctp-text">
      <a href="#main" className="sr-only focus:not-sr-only focus:p-4 focus:text-ctp-mauve">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-8 sm:py-24">
        <nav aria-label="Legal pages" className="mb-10 flex flex-wrap gap-5 text-sm text-ctp-mauve">
          <Link href="/privacy" className="underline underline-offset-4">Privacy policy</Link>
          <Link href="/terms" className="underline underline-offset-4">Terms and conditions</Link>
        </nav>
        <article className="[&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:tracking-tight sm:[&_h1]:text-5xl [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:leading-7 [&_p]:text-ctp-subtext1 [&_section]:mt-10 [&_a]:text-ctp-mauve [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </article>
      </main>
      <Footer />
    </div>
  );
}
