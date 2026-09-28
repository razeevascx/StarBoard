import { SectionHeading } from "@/components/SectionHeading";
import { installUrl } from "@/lib/site";

const questions = [
  {
    question: "What is Starboard?",
    answer: "Starboard is a customizable browser start page that puts your time and favorite links in one calm place.",
  },
  {
    question: "How do I install it?",
    answer: <span>Follow the <a href={installUrl} target="_blank" rel="noreferrer noopener" className="text-ctp-mauve underline underline-offset-4 hover:text-ctp-lavender">setup instructions on GitHub</a> to add Starboard to your browser.</span>,
  },
  {
    question: "Do I need an account?",
    answer: "No. Starboard is free to use and does not require an account.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <SectionHeading id="faq-title" eyebrow="FAQ" title="Good to know." description="The basics before you make yourself at home." />
      <div className="min-w-0 divide-y divide-ctp-surface1/60 border-y border-ctp-surface1/60">
        {questions.map((item) => (
          <details key={item.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 font-medium transition-colors marker:content-none hover:text-ctp-mauve">
              {item.question}<span aria-hidden className="text-xl text-ctp-mauve shrink-0 motion-safe:transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="max-w-2xl pb-6 pr-8 text-sm leading-6 text-ctp-subtext1">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
