import { Brand } from "@/components/Brand";
import { githubUrl } from "@/lib/site";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ctp-surface1/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <Brand />
          <p className="mt-2 text-sm text-ctp-subtext0">A little more focus, every new tab.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 text-sm text-ctp-subtext1">
          <a href="/#features" className="inline-flex min-h-11 items-center hover:text-ctp-mauve">Features</a>
          <a href="/#faq" className="inline-flex min-h-11 items-center hover:text-ctp-mauve">FAQ</a>
          <a href="/contact" className="inline-flex min-h-11 items-center hover:text-ctp-mauve">Contact</a>
          <a href={githubUrl} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 items-center gap-2 hover:text-ctp-mauve">GitHub <ExternalLink aria-hidden="true" className="size-3.5" /></a>
        </nav>
      </div>
    </footer>
  );
}
