import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  Clock,
  Folder,
  LayoutGrid,
  Palette,
  RefreshCw,
  Search,
} from "lucide-react";
import { Badge } from "@/components/hangry-ui/components/badge";
import { Card } from "@/components/hangry-ui/components/card";
import { SectionHeading } from "@/components/SectionHeading";

const folders = [
  { name: "Design", count: 14, color: "text-ctp-mauve" },
  { name: "Reading", count: 9, color: "text-ctp-blue" },
  { name: "Dev Tools", count: 22, color: "text-ctp-green" },
] as const;

const savedLinks = [
  { title: "Design Systems Kit", host: "figma.com", folder: "Design", dot: "bg-ctp-mauve" },
  { title: "Linear Method", host: "linear.app", folder: "Reading", dot: "bg-ctp-blue" },
  { title: "Starboard Repository", host: "github.com", folder: "Dev Tools", dot: "bg-ctp-green" },
] as const;

const quickLinks = [
  { label: "Work", host: "workspace", tone: "border-ctp-blue/30 bg-ctp-blue/10 text-ctp-blue" },
  { label: "Read", host: "articles", tone: "border-ctp-peach/30 bg-ctp-peach/10 text-ctp-peach" },
  { label: "Notes", host: "journal", tone: "border-ctp-mauve/30 bg-ctp-mauve/10 text-ctp-mauve" },
  { label: "Code", host: "repos", tone: "border-ctp-green/30 bg-ctp-green/10 text-ctp-green" },
] as const;

const themes = [
  {
    name: "Mocha Dusk",
    swatch: "bg-linear-to-br from-ctp-mauve via-ctp-blue to-ctp-base",
    active: true,
  },
  {
    name: "Minimal Slate",
    swatch: "bg-ctp-surface0",
    active: false,
  },
  {
    name: "Warm Horizon",
    swatch: "bg-linear-to-br from-ctp-peach via-ctp-maroon to-ctp-mantle",
    active: false,
  },
] as const;

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="border-y border-ctp-surface1/40 bg-ctp-mantle/50"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <SectionHeading
          id="features-title"
          title="A new tab that feels like yours."
          description="Your clock, shortcuts, and saved links. Everything you need to start browsing, in one familiar place."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <Card className="max-w-none gap-0 sm:p-8 lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-lg border border-ctp-mauve/30 bg-ctp-mauve/10 text-ctp-mauve">
                <Bookmark aria-hidden="true" className="size-4.5" />
              </span>
              <h3 className="text-lg font-semibold text-ctp-text">Your bookmarks, organized</h3>
            </div>
            <p className="mt-3 max-w-lg text-sm leading-6 text-ctp-subtext1">
              Browse your browser bookmarks by folder. Switch between cards or a clean list with
              sidebar or bottom navigation.
            </p>
            <div
              aria-hidden="true"
              className="mt-7 grid overflow-hidden rounded-lg border border-ctp-surface1/60 bg-ctp-base/80 sm:grid-cols-[150px_1fr]"
            >
              <div className="space-y-1 border-b border-ctp-surface1/50 bg-ctp-mantle/60 p-3 sm:border-r sm:border-b-0">
                {folders.map(({ name, count, color }, idx) => (
                  <div
                    key={name}
                    className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs ${
                      idx === 0
                        ? "bg-ctp-surface0/80 font-medium text-ctp-text"
                        : "text-ctp-subtext0"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2 truncate">
                      <Folder className={`size-3.5 shrink-0 ${color}`} />
                      <span className="truncate">{name}</span>
                    </span>
                    <span className="text-[11px] text-ctp-overlay0 tabular-nums">{count}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 p-3">
                <div className="flex items-center gap-2 rounded-md border border-ctp-surface1/60 bg-ctp-mantle/70 px-2.5 py-1.5 text-xs text-ctp-overlay0">
                  <Search className="size-3.5" />
                  <span>Filter bookmarks…</span>
                </div>
                {savedLinks.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-3 rounded-md border border-ctp-surface1/40 bg-ctp-mantle/40 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-ctp-text">{item.title}</p>
                      <p className="truncate text-[11px] text-ctp-subtext0">{item.host}</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ctp-surface1/60 bg-ctp-base px-2 py-0.5 text-[11px] text-ctp-subtext1">
                      <span className={`size-1.5 rounded-full ${item.dot}`} />
                      {item.folder}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="max-w-none gap-0 sm:p-8 lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-lg border border-ctp-peach/30 bg-ctp-peach/10 text-ctp-peach">
                <Clock aria-hidden="true" className="size-4.5" />
              </span>
              <h3 className="text-lg font-semibold text-ctp-text">Start at your own pace</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-ctp-subtext1">
              A live clock, the date, and an optional greeting. Show only the details you want.
            </p>
            <div
              aria-hidden="true"
              className="mt-7 flex flex-1 flex-col items-center justify-between rounded-lg border border-ctp-surface1/60 bg-ctp-base/80 px-5 py-6 text-center"
            >
              <span className="text-xs text-ctp-subtext0">Good morning</span>
              <span className="my-2 text-5xl font-semibold tracking-tight text-ctp-text tabular-nums">
                09:41
              </span>
              <span className="text-xs tracking-widest text-ctp-mauve uppercase">
                Monday, October 12
              </span>
              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                {["Clock", "Date", "Greeting"].map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-ctp-surface1/60 bg-ctp-mantle px-2.5 py-0.5 text-[11px] text-ctp-subtext1"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          <Card className="max-w-none gap-0 sm:p-8 lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-lg border border-ctp-blue/30 bg-ctp-blue/10 text-ctp-blue">
                <LayoutGrid aria-hidden="true" className="size-4.5" />
              </span>
              <h3 className="text-lg font-semibold text-ctp-text">A shortcut to favorites</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-ctp-subtext1">
              Add and edit quick links to the sites you visit every day, complete with crisp favicons.
            </p>
            <div aria-hidden="true" className="mt-auto grid grid-cols-2 gap-2.5 pt-7">
              {quickLinks.map(({ label, host, tone }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border border-ctp-surface1/60 bg-ctp-base/80 p-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`inline-flex size-8 items-center justify-center rounded-md border ${tone}`}>
                      <ArrowUpRight className="size-4" />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-ctp-text">{label}</p>
                      <p className="text-[11px] text-ctp-overlay0">{host}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="max-w-none gap-0 sm:p-8 lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-lg border border-ctp-lavender/30 bg-ctp-lavender/10 text-ctp-lavender">
                <Palette aria-hidden="true" className="size-4.5" />
              </span>
              <h3 className="text-lg font-semibold text-ctp-text">Set the mood</h3>
            </div>
            <p className="mt-3 max-w-lg text-sm leading-6 text-ctp-subtext1">
              Pick a gradient, a solid color, or your own background image. Your theme stays saved
              locally on your device.
            </p>
            <div aria-hidden="true" className="mt-auto grid grid-cols-3 gap-3 pt-7">
              {themes.map((theme) => (
                <div
                  key={theme.name}
                  className={`overflow-hidden rounded-lg border bg-ctp-base/80 p-2 ${
                    theme.active ? "border-ctp-mauve" : "border-ctp-surface1/60"
                  }`}
                >
                  <div className={`relative h-20 rounded-md ${theme.swatch}`}>
                    {theme.active && (
                      <span className="absolute right-2 top-2 inline-flex size-5 items-center justify-center rounded-full bg-ctp-mauve text-ctp-base">
                        <Check className="size-3" />
                      </span>
                    )}
                  </div>
                  <p className="mt-2 truncate px-1 text-xs font-medium text-ctp-subtext1">
                    {theme.name}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="max-w-none flex-col gap-5 sm:flex-row sm:items-center sm:p-8 lg:col-span-12">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-ctp-green/30 bg-ctp-green/10">
              <RefreshCw aria-hidden="true" className="size-5 text-ctp-green" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-ctp-text">
                Keep your bookmarks close, beyond the new tab
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ctp-subtext1">
                Optionally sign in to sync browser bookmarks from Chrome or Firefox to your
                Starboard dashboard. Your folders become collections.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-flex items-center gap-2 rounded-md border border-ctp-surface1/60 bg-ctp-base px-3 py-1.5 text-xs text-ctp-subtext1"
              >
                <Folder className="size-3.5 text-ctp-blue" />
                <span>Browser folders</span>
                <ArrowRight className="size-3.5 text-ctp-overlay0" />
                <Bookmark className="size-3.5 text-ctp-mauve" />
                <span>Collections</span>
              </span>
              <Badge variant="purple" className="w-fit shrink-0">
                Account optional
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
