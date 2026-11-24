"use client";

import { cn } from "cn";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { AuthControls } from "@/components/AuthControls";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "MCP", href: "/#mcp" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        "sticky top-1 z-50 mx-auto w-full max-w-6xl border-b border-transparent bg-ctp-base md:rounded-md md:border motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out p-2",
        scrolled &&
          "border-ctp-surface1/70 bg-ctp-mantle/85 backdrop-blur-md supports-backdrop-filter:bg-ctp-mantle/80 md:top-2 md:max-w-5xl md:shadow-lg md:shadow-ctp-crust/30",
      )}
    >
      <nav
        aria-label="Main navigation"
        className={cn(
          "grid h-14 w-full grid-cols-[1fr_auto_1fr] items-center px-4 md:h-12 motion-safe:transition-all motion-safe:duration-200",
          scrolled && "md:px-2",
        )}
      >
        <div className="col-start-1 row-start-1 justify-self-start rounded-md p-2 hover:bg-ctp-surface0/50">
          <Brand />
        </div>
        <div className="col-start-2 row-start-1 hidden items-center justify-self-center md:flex">
          {navLinks.map((link) => (
            <Button
              asChild
              key={link.label}
              size="sm"
              variant="ghost"
              className="text-ctp-subtext1 hover:text-ctp-mauve"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
        <div className="col-start-3 row-start-1 justify-self-end">
          <div className="hidden md:block">
            <AuthControls />
          </div>
          <MobileNav links={navLinks} />
        </div>
      </nav>
    </header>
  );
}
