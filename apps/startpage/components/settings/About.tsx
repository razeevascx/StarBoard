import {
  LayoutDashboard,
  Search,
  Link2,
  Bookmark,
  Palette,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Focused daily view",
    description:
      "Keep the page useful at a glance with an optional greeting, live clock, and monthly calendar.",
  },
  {
    icon: Search,
    title: "Fast search switching",
    description:
      "Search through Google, DuckDuckGo, or Bing from the same command bar.",
  },
  {
    icon: Link2,
    title: "Editable quick links",
    description:
      "Add, update, and remove shortcuts for the sites you use most, with favicon-based cards.",
  },
  {
    icon: Bookmark,
    title: "Browser-integrated access",
    description:
      "Surface bookmark folders after granting permissions in Settings.",
  },
  {
    icon: Palette,
    title: "Personalized appearance",
    description:
      "Switch between gradient, solid color, or image backgrounds and keep the choice saved locally.",
  },
  {
    icon: ShieldCheck,
    title: "Permission-aware behavior",
    description:
      "Enable only the browser capabilities you need, then revoke them later from the settings panel.",
  },
];

export default function About() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <section>
        <h2 className="text-3xl md:text-4xl font-extrabold text-ctp-text tracking-tight font-sans">
          Starboard
        </h2>

        <p className="text-xs text-ctp-subtext0 leading-relaxed mt-2">
          A calm, customizable command center for your browser.
        </p>
      </section>

      <section className="space-y-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex items-start gap-3 p-3  bg-ctp-surface0/40  transition-colors hover:bg-ctp-surface0/70"
          >
            <div className="shrink-0 flex items-center justify-center size-8 bg-ctp-surface1/60 text-ctp-mauve">
              <Icon className="w-4 h-4" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-ctp-text">{title}</h4>
              <p className="text-[11px] text-ctp-subtext0 leading-relaxed mt-0.5">
                {description}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
