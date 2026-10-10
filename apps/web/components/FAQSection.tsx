import { SectionHeading } from "@/components/SectionHeading";
import { contactUrl, githubUrl, installUrl } from "@/lib/site";

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
    answer: "No account is needed for the start page. Sign in only if you want to sync bookmarks with the web dashboard.",
  },
  {
    question: "Can I use my existing browser bookmarks?",
    answer: "Yes. Grant bookmark access when you want Starboard to show your browser’s saved links and folders.",
  },
  {
    question: "How does bookmark sync work?",
    answer: "Sign in through Settings → Account in the extension and grant bookmark access. Your browser bookmarks sync to the web dashboard, with folders organized into collections.",
  },

  {
    question: "Where are my settings stored?",
    answer: "Your start-page settings are saved locally in your browser. If you enable account sync, your synced bookmarks are also stored for use in the web dashboard.",
  },
  {
    question: "Is Starboard open source?",
    answer: <span>Yes. Explore the code and contribute on <a href={githubUrl} target="_blank" rel="noreferrer noopener" className="text-ctp-mauve underline underline-offset-4 hover:text-ctp-lavender">GitHub</a>.</span>,
  },
  {
    question: "How can I report a bug or suggest a feature?",
    answer: <span>Open an <a href={contactUrl} target="_blank" rel="noreferrer noopener" className="text-ctp-mauve underline underline-offset-4 hover:text-ctp-lavender">issue on GitHub</a> with the details of your bug or idea.</span>,
  },
];

export function FAQSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:px-8 sm:py-20">
      <SectionHeading id="faq-title" eyebrow="FAQ" title="Good to know." description="The basics before you make yourself at home." />
      <div className="min-w-0 divide-y divide-ctp-surface1/60 border-y border-ctp-surface1/60">
        {questions.map((item, index) => (
          <details key={item.question} name="starboard-faq" open={index === 0} className="group">
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
