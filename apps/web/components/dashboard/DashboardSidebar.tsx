"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/Brand";
import { UserMenu } from "@/components/UserMenu";

const menuSections = [
  {
    label: "Main Menu",
    items: [
      { label: "Bookmarks", href: "/dashboard/bookmarks", icon: "M6 4h12v17l-6-4-6 4V4Z" },
    ],
  },
  {
    label: "Folders",
    items: [
      { label: "Collections", href: "/dashboard/collections", icon: "M3 7V4h6l2 3h10v13H3V7Z" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Trash", href: "/dashboard/trash", icon: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col border-b border-ctp-surface1/40 bg-ctp-mantle/50 md:sticky md:top-0 md:h-dvh md:w-64 md:shrink-0 md:self-start md:border-r md:border-b-0">
      <div className="px-5 py-6">
        <Brand />
      </div>
      <nav aria-label="Dashboard sections" className="flex flex-col gap-6 overflow-y-auto p-4 md:min-h-0 md:flex-1">
        {menuSections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-ctp-overlay0">{section.label}</p>
            <div className="space-y-1">
              {section.items.map(({ label, href, icon }) => {
                const isActive = pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex min-h-11 min-w-0 items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${isActive ? "bg-ctp-mauve/15 text-ctp-mauve" : "text-ctp-subtext1 hover:bg-ctp-surface0/50 hover:text-ctp-text"}`}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d={icon} />
                    </svg>
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-auto shrink-0 px-4 pb-3">
        <Link href="/#faq" className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-ctp-subtext1 transition-colors hover:bg-ctp-surface0/50 hover:text-ctp-text">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5M12 16h.01" />
          </svg>
          Help
        </Link>
      </div>
      <div className="shrink-0 border-t border-ctp-surface1/40 p-2">
        <UserMenu expanded />
      </div>
    </aside>
  );
}
