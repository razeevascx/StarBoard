import { InstallButton } from "@/components/InstallButton";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28 lg:px-12 lg:pt-40">
      <div className="px-1 sm:px-2">
        <h1 id="hero-title" className="max-w-4xl text-6xl font-semibold leading-[1.04] tracking-tight text-balance sm:text-7xl lg:text-8xl">Save every link worth keeping.</h1>
        <div className="mb-14 mt-8 flex flex-col gap-7 sm:mb-20 sm:mt-10">
        <p className="max-w-xl text-base leading-relaxed text-ctp-subtext0 sm:text-lg">
          StartBoard gives your bookmarks a home. Save what matters, organize it your way, and find it when you need it.
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ctp-mauve px-5 py-3 text-sm font-semibold text-ctp-base transition-colors hover:bg-ctp-lavender">
            Get started
          </Link>
          <InstallButton variant="secondary">Install for Chrome</InstallButton>
        </div>
        </div>
      </div>
      <div className="relative w-full overflow-hidden rounded-xl border border-ctp-surface1/60 bg-ctp-mantle p-1.5 shadow-2xl shadow-ctp-crust/40 sm:rounded-2xl sm:p-2">
        <Image
          src="/Preview.png"
          alt="StartBoard displayed as a browser new tab with time and bookmarked links"
          width={1920}
          height={1080}
          priority
          sizes="(min-width: 1152px) 1056px, (min-width: 1024px) calc(100vw - 96px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 48px)"
          className="block h-auto w-full rounded-lg sm:rounded-xl"
        />
      </div>
    </section>
  );
}
