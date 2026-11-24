import {
  ArrowUpRight,
  Bookmark,
  Clock,
  Folder,
  LayoutGrid,
  Palette,
  RefreshCw,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const features = [
  {
    icon: Bookmark,
    title: "Your bookmarks, in view",
    description:
      "Browse your browser bookmarks by folder. Choose cards or a list, with sidebar or bottom navigation.",
    preview: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-ctp-mauve">
          <Folder className="size-4" /> Design inspiration
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Reading", "Tools", "Ideas"].map((label) => (
            <div
              key={label}
              className="rounded-lg border border-ctp-surface1/60 bg-ctp-base p-3 text-xs text-ctp-subtext1"
            >
              <Bookmark className="mb-3 size-4 text-ctp-lavender" />
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: LayoutGrid,
    title: "A shortcut to your favorites",
    description:
      "Add and edit quick links to the sites you use every day. Their favicons make them easy to spot.",
    preview: (
      <div className="flex justify-center gap-5">
        {[
          { label: "Work", color: "bg-ctp-blue/15 text-ctp-blue" },
          { label: "Read", color: "bg-ctp-peach/15 text-ctp-peach" },
          { label: "Create", color: "bg-ctp-green/15 text-ctp-green" },
        ].map(({ label, color }) => (
          <div key={label} className="text-center">
            <div
              className={`mx-auto mb-2 flex size-12 items-center justify-center rounded-xl ${color}`}
            >
              <ArrowUpRight className="size-5" />
            </div>
            <span className="text-xs text-ctp-subtext1">{label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Palette,
    title: "Set the mood",
    description:
      "Pick a gradient, a solid color, or your own background image. Your preferences stay saved on this device.",
    preview: (
      <div className="grid grid-cols-3 gap-3">
        <div className="h-24 rounded-xl bg-linear-to-br from-ctp-mauve via-ctp-blue to-ctp-base" />
        <div className="h-24 rounded-xl bg-ctp-surface0" />
        <div className="h-24 rounded-xl bg-linear-to-br from-ctp-peach via-ctp-maroon to-ctp-mantle" />
      </div>
    ),
  },
];

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
          eyebrow="Inside the extension"
          title="A new tab that feels like yours."
          description="Your clock, shortcuts, and saved links. Everything you need to start browsing, in one familiar place."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="flex flex-col rounded-md border border-ctp-surface1/60 bg-ctp-base p-6 sm:p-8">
            <Clock aria-hidden="true" className="size-5 text-ctp-peach" />
            <h3 className="mt-5 text-xl font-semibold">
              Start at your own pace
            </h3>
            <p className="mt-2 text-sm leading-6 text-ctp-subtext1">
              A live clock, the date, and an optional greeting. Show the details
              you want and hide the rest.
            </p>
            <div
              aria-hidden="true"
              className="mt-8 flex flex-1 flex-col items-center justify-center rounded-xl bg-ctp-mantle px-4 py-5"
            >
              <span className="text-xs text-ctp-subtext0">Good morning</span>
              <span className="mt-2 text-5xl font-semibold tracking-tight text-ctp-text tabular-nums">
                09:41
              </span>
              <span className="mt-3 text-xs tracking-widest text-ctp-mauve uppercase">
                Monday, October 12
              </span>
            </div>
          </article>
          {features.map(({ icon: Icon, title, description, preview }) => (
            <article
              key={title}
              className="flex flex-col rounded-md border border-ctp-surface1/60 bg-ctp-base p-6 sm:p-8"
            >
              <Icon aria-hidden="true" className="size-5 text-ctp-lavender" />
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ctp-subtext1">
                {description}
              </p>
              <div aria-hidden="true" className="mt-auto pt-7">
                {preview}
              </div>
            </article>
          ))}
          <article className="flex flex-col gap-5 rounded-md border border-ctp-surface1/60 bg-ctp-base p-6 sm:flex-row sm:items-center sm:p-8 md:col-span-2">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-ctp-green/10">
              <RefreshCw aria-hidden="true" className="size-5 text-ctp-green" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                Keep your bookmarks close, beyond the new tab
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ctp-subtext1">
                Optionally sign in to sync browser bookmarks from Chrome or
                Firefox to your Starboard dashboard. Your folders become
                collections.
              </p>
            </div>
            <span className="w-fit shrink-0 rounded-full border border-ctp-surface1 px-3 py-1 text-xs text-ctp-subtext0">
              Account optional
            </span>
          </article>
        </div>
      </div>
    </section>
  );
}
