import { contactUrl } from "@/lib/site";
import { SectionHeading } from "@/components/SectionHeading";
import { ArrowRight, Bug, MessageSquare } from "lucide-react";

export function ContactSection() {
  return (
    <section aria-labelledby="contact-title" className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-7xl flex-col justify-center px-6 py-16 sm:px-8 sm:py-24">
      <SectionHeading
        id="contact-title"
        eyebrow="Contact"
        title="How can we help?"
        description="Send us feedback, report an issue, or share an idea for Starboard."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <a
          href={`${contactUrl}?title=Feedback%20for%20Starboard`}
          target="_blank"
          rel="noreferrer noopener"
          className="group rounded-2xl border border-ctp-surface1/60 bg-ctp-mantle p-7 transition-colors hover:border-ctp-mauve/70"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-ctp-mauve/15 text-ctp-mauve"><MessageSquare aria-hidden="true" className="size-5" /></span>
          <h2 className="mt-6 text-xl font-semibold">Share feedback</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-ctp-subtext1">Tell us what’s working, what could improve, or what you would like to see next.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ctp-mauve">Send feedback <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span>
        </a>
        <a
          href={`${contactUrl}?title=Bug%20report%20for%20Starboard`}
          target="_blank"
          rel="noreferrer noopener"
          className="group rounded-2xl border border-ctp-surface1/60 bg-ctp-mantle p-7 transition-colors hover:border-ctp-mauve/70"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-ctp-mauve/15 text-ctp-mauve"><Bug aria-hidden="true" className="size-5" /></span>
          <h2 className="mt-6 text-xl font-semibold">Report an issue</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-ctp-subtext1">Found something that isn’t behaving as expected? Let us know so we can investigate.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ctp-mauve">Report an issue <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span>
        </a>
      </div>
    </section>
  );
}
