import { SectionHeading } from "@/components/SectionHeading";

const features = [
  {
    number: "01",
    title: "Your essentials, together",
    description: "See the time, date, and your favorite links whenever you open a new tab.",
  },
  {
    number: "02",
    title: "Make it yours",
    description: "Arrange the shortcuts and details you use most. Keep your browser feeling like yours.",
  },
  {
    number: "03",
    title: "Get straight to it",
    description: "No account to create and no extra clutter. Just a useful page to start from.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" aria-labelledby="features-title" className="border-y border-ctp-surface1/40 bg-ctp-mantle/50">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
        <SectionHeading id="features-title" eyebrow="Why Starboard" title="Less clutter. More room to focus." description="Keep the things you reach for close, and give everything else a little space." />
        <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          {features.map((feature) => (
            <article key={feature.number} className="border-t border-ctp-surface1/60 pt-6">
              <p className="text-xs font-bold tracking-widest text-ctp-mauve">{feature.number}</p>
              <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ctp-subtext1">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
