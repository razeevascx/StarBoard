import { memo, type ComponentProps, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "cn";
import { GitHubDark } from "@ridemountainpig/svgl-react";
import { Badge } from "@/components/hangry-ui/components/badge";
import { Card } from "@/components/hangry-ui/components/card";
import { sampleFooterGroups } from "@/components/hangry-ui/lib/navigation.shared";

interface FooterProps extends ComponentProps<"footer"> {
  brand?: string;
  brandSlot?: ReactNode;
  homeHref?: string;
  description?: string;
  badgeLabel?: string;
  groups?: readonly {
    title: string;
    links: readonly {
      label: string;
      href: string;
    }[];
  }[];
  githubHref?: string;
  copyright?: string;
  callout?: {
    title: string;
    description: string;
    label: string;
    href: string;
  };
  action?: ReactNode;
  bottomRight?: ReactNode;
}

export const Footer = memo(function Footer({
  brand = "Hangry UI",
  brandSlot,
  homeHref = "#home",
  description = "Thoughtful components. Less setup. More time to build.",
  badgeLabel = "Open source",
  groups = sampleFooterGroups,
  githubHref = "#github",
  copyright = `© ${new Date().getFullYear()} Hangry UI`,
  callout,
  action,
  bottomRight,
  className,
  children,
  ...props
}: FooterProps = {}) {
  return (
    <footer
      {...props}
      data-slot="footer"
      data-layout="columns"
      className={cn(
        "w-full border border-ctp-surface1/60 bg-ctp-mantle/50 text-ctp-text",
        className,
      )}
    >
      {callout && (
        <div className="border-b border-ctp-surface1/60 p-6 sm:p-8">
          <Card
            title={callout.title}
            description={callout.description}
            className="max-w-none!"
            footer={
              action ?? (
                <a
                  href={callout.href}
                  className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-ctp-mauve hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {callout.label}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )
            }
          />
        </div>
      )}
      <div className={cn("gap-10 p-6 sm:p-8", "grid md:grid-cols-[1.5fr_2fr]")}>
        <div>
          {brandSlot ?? (
            <a
              href={homeHref}
              className="text-xl font-semibold focus-visible:outline-2 focus-visible:outline-ring"
            >
              {brand}
            </a>
          )}
          <p className="mt-3 max-w-sm text-sm leading-6 text-ctp-subtext1">{description}</p>
          {badgeLabel && (
            <div className="mt-4">
              <Badge variant="purple">{badgeLabel}</Badge>
            </div>
          )}
          {children}
        </div>
        <div className={cn("grid grid-cols-2 gap-8", groups.length > 2 && "lg:grid-cols-3")}>
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="mb-4 typography-subsection-title">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => {
                  const external = /^https?:\/\//i.test(link.href);
                  return (
                    <li key={link.label}>
                      {external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-sm text-ctp-subtext0 transition-colors hover:text-ctp-text focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-ctp-subtext0 transition-colors hover:text-ctp-text focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ctp-surface1/60 px-6 py-4 text-xs text-ctp-subtext0 sm:px-8">
        <span>{copyright}</span>
        {bottomRight ??
          (githubHref && (
            <a
              href={githubHref}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-9 items-center gap-2 transition-colors hover:text-ctp-text focus-visible:outline-2 focus-visible:outline-ring"
            >
              <GitHubDark width={16} height={16} aria-hidden="true" />
              GitHub
            </a>
          ))}
      </div>
    </footer>
  );
});
