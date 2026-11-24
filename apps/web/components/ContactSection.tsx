import { XDark } from "@ridemountainpig/svgl-react";
import { ArrowUpRight, Bug, MessageSquare } from "lucide-react";
import { Card } from "@/components/hangry-ui/components/card";
import { contactUrl } from "@/lib/site";

const contactLinks = [
  {
    title: "Share an idea",
    description:
      "Have a suggestion for your new tab? Tell us what would make Starboard more useful for you.",
    href: `${contactUrl}?title=Feedback%20for%20Starboard`,
    action: "Share feedback on GitHub",
    icon: MessageSquare,
  },
  {
    title: "Report a bug",
    description:
      "Something not working? Include your browser, what happened, and the steps to reproduce it.",
    href: `${contactUrl}?title=Bug%20report%20for%20Starboard`,
    action: "Open a GitHub issue",
    icon: Bug,
  },
  {
    title: "Say hello",
    description:
      "Connect with Razeev on X for a conversation about Starboard, or to see what’s being built next.",
    href: "https://x.com/razeevascx",
    action: "Visit @razeevascx",
    icon: XDark,
  },
];

export function ContactSection() {
  return (
    <section
      aria-labelledby="contact-title"
      className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-24"
    >
      <div className="max-w-2xl">
        <h1
          id="contact-title"
          className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
        >
          Let’s make Starboard better.
        </h1>
        <p className="mt-4 max-w-xl leading-7 text-ctp-subtext1">
          A question, a small improvement, or a new idea. We’d love to hear how
          Starboard fits into your day.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {contactLinks.map(
          ({ title, description, href, action, icon: Icon }) => (
            <Card
              key={title}
              as="a"
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="group max-w-none gap-0 sm:p-8"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-ctp-mauve/10 text-ctp-mauve">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h2 className="mt-6 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-ctp-subtext1">
                {description}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-medium text-ctp-mauve">
                {action}
                <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
              </span>
            </Card>
          ),
        )}
      </div>
    </section>
  );
}
