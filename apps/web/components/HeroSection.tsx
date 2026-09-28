import { InstallButton } from "@/components/InstallButton";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto min-h-[90dvh] max-w-7xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="relative z-10 max-w-4xl">
        <h1 id="hero-title" className="text-5xl font-semibold leading-[1.04] tracking-tight text-balance sm:text-6xl lg:text-7xl">Save every link worth keeping.</h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-ctp-subtext1 sm:text-lg">
          Starboard gives your bookmarks a home. Save what matters, organize it your way, and find it when you need it.
        </p>
        <div className="mb-10 mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ctp-mauve px-5 py-3 text-sm font-semibold text-ctp-base transition-colors hover:bg-ctp-lavender">
            Get started
          </Link>
          <InstallButton variant="secondary">Install for Chrome</InstallButton>
        </div>
      </div>
      <div className="relative mx-auto w-full overflow-hidden rounded-2xl border border-ctp-surface1/70 bg-ctp-mantle shadow-2xl shadow-ctp-crust/50">
        <Image
          src="/Preview.png"
          alt="Starboard displayed as a browser new tab with time and bookmarked links"
          width={1920}
          height={1080}
          priority
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
