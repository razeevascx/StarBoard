import Image from "next/image";
import { GitHubDark, XDark } from "@ridemountainpig/svgl-react";
import { Brand } from "@/components/Brand";
import { Footer as HangryFooter } from "@/components/hangry-ui/blocks/footer";
import { Button } from "@/components/ui/button";
import { githubUrl, installUrl } from "@/lib/site";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "FAQ", href: "/#faq" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "MCP", href: "/dashboard/mcp" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Install extension", href: installUrl },
      { label: "Contact", href: "/contact" },
      { label: "GitHub", href: githubUrl },
      { label: "X (@razeevascx)", href: "https://x.com/razeevascx" },
    ],
  },
] as const;

export function Footer() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-8 md:px-6">
      <HangryFooter
        brandSlot={<Brand />}
        description="A calm, customizable browser start page for bookmarks, quick links, and everything you need in a new tab."
        groups={footerGroups}
        copyright={`© ${new Date().getFullYear()} Starboard`}
        className="rounded-lg border-ctp-surface1/60 bg-ctp-mantle/60"
        bottomRight={
          <div className="flex flex-wrap items-center gap-3">
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
            <div className="flex items-center">
              <Button asChild size="icon" variant="ghost" className="size-9">
                <a
                  aria-label="Razeev on X"
                  href="https://x.com/razeevascx"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <XDark width={16} height={16} aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" className="size-9">
                <a
                  aria-label="Starboard on GitHub"
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <GitHubDark width={16} height={16} aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}
