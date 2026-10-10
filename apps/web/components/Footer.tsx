import Image from "next/image";
import Link from "next/link";
import { GitHubDark, XDark } from "@ridemountainpig/svgl-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { githubUrl, installUrl } from "@/lib/site";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: installUrl, label: "Install extension" },
];

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 text-ctp-text md:px-6">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <Brand />
          <div className="flex items-center">
            <Button asChild size="icon" variant="ghost" className="size-11">
              <a
                aria-label="Razeev on X"
                href="https://x.com/razeevpuree"
                target="_blank"
                rel="noreferrer noopener"
              >
                <XDark width={18} height={18} aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="icon" variant="ghost" className="size-11">
              <a
                aria-label="Starboard on GitHub"
                href={githubUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <GitHubDark width={18} height={18} aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-ctp-subtext0 md:gap-x-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  className="inline-flex min-h-11 items-center transition-colors hover:text-ctp-text"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ctp-surface1/60 py-4 text-sm text-ctp-subtext0">
        <p>&copy; {new Date().getFullYear()} Starboard</p>
        <p className="inline-flex items-center gap-1">
          <span>Built by</span>
          <a
            className="inline-flex items-center gap-1.5 text-ctp-text/80 transition-colors hover:text-ctp-text hover:underline"
            href="https://github.com/razeevascx"
            rel="noreferrer noopener"
            target="_blank"
          >
            <Image
              alt=""
              className="size-4 rounded-full"
              src="https://github.com/razeevascx.png"
              width={16}
              height={16}
              unoptimized
            />
            razeevascx
          </a>
        </p>
      </div>
    </footer>
  );
}
